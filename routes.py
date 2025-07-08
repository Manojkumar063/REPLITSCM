from flask import render_template, request, redirect, url_for, flash, session, jsonify
from app import app, db
from models import User, Shipment, IoTDevice, Analytics
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random
import string

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            session['user_id'] = user.id
            session['username'] = user.username
            session['theme'] = user.theme_preference
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template('register.html')
        
        # Check if username or email already exists
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'error')
            return render_template('register.html')
        
        if User.query.filter_by(email=email).first():
            flash('Email already exists', 'error')
            return render_template('register.html')
        
        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    shipments = Shipment.query.filter_by(user_id=user.id).order_by(Shipment.created_at.desc()).limit(5).all()
    devices = IoTDevice.query.filter_by(user_id=user.id).all()
    
    # Calculate statistics
    total_shipments = Shipment.query.filter_by(user_id=user.id).count()
    in_transit = Shipment.query.filter_by(user_id=user.id, status='In Transit').count()
    delivered = Shipment.query.filter_by(user_id=user.id, status='Delivered').count()
    delayed = Shipment.query.filter_by(user_id=user.id, status='Delayed').count()
    
    stats = {
        'total_shipments': total_shipments,
        'in_transit': in_transit,
        'delivered': delivered,
        'delayed': delayed,
        'active_devices': len([d for d in devices if d.status == 'Active'])
    }
    
    return render_template('dashboard.html', user=user, shipments=shipments, devices=devices, stats=stats)

@app.route('/tracking')
def tracking():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    shipments = Shipment.query.filter_by(user_id=user.id).order_by(Shipment.created_at.desc()).all()
    
    return render_template('tracking.html', user=user, shipments=shipments)

@app.route('/analytics')
def analytics():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    
    # Get analytics data for charts
    shipments = Shipment.query.filter_by(user_id=user.id).all()
    
    # Monthly shipment data
    monthly_data = {}
    for shipment in shipments:
        month = shipment.created_at.strftime('%Y-%m')
        monthly_data[month] = monthly_data.get(month, 0) + 1
    
    # Status distribution
    status_data = {}
    for shipment in shipments:
        status_data[shipment.status] = status_data.get(shipment.status, 0) + 1
    
    # Cost analysis
    total_cost = sum(shipment.cost or 0 for shipment in shipments)
    avg_cost = total_cost / len(shipments) if shipments else 0
    
    analytics_data = {
        'monthly_shipments': monthly_data,
        'status_distribution': status_data,
        'total_cost': total_cost,
        'avg_cost': avg_cost,
        'total_shipments': len(shipments)
    }
    
    return render_template('analytics.html', user=user, analytics=analytics_data)

@app.route('/iot')
def iot():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    devices = IoTDevice.query.filter_by(user_id=user.id).all()
    
    return render_template('iot.html', user=user, devices=devices)

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

@app.route('/toggle_theme', methods=['POST'])
def toggle_theme():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    user = User.query.get(session['user_id'])
    user.theme_preference = 'dark' if user.theme_preference == 'light' else 'light'
    session['theme'] = user.theme_preference
    db.session.commit()
    
    return jsonify({'theme': user.theme_preference})

@app.route('/api/shipment_status/<tracking_number>')
def get_shipment_status(tracking_number):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    shipment = Shipment.query.filter_by(tracking_number=tracking_number, user_id=session['user_id']).first()
    if not shipment:
        return jsonify({'error': 'Shipment not found'}), 404
    
    return jsonify({
        'tracking_number': shipment.tracking_number,
        'status': shipment.status,
        'current_location': shipment.current_location,
        'temperature': shipment.temperature,
        'humidity': shipment.humidity,
        'estimated_delivery': shipment.estimated_delivery.isoformat() if shipment.estimated_delivery else None
    })

# Initialize some sample data
@app.route('/init_sample_data')
def init_sample_data():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    
    # Create sample shipments if none exist
    if not user.shipments:
        sample_shipments = [
            {
                'tracking_number': 'SCM' + ''.join(random.choices(string.digits, k=8)),
                'origin': 'New York, NY',
                'destination': 'Los Angeles, CA',
                'status': 'In Transit',
                'current_location': 'Chicago, IL',
                'temperature': 22.5,
                'humidity': 45.0,
                'cost': 299.99,
                'carrier': 'FedEx',
                'priority': 'Express'
            },
            {
                'tracking_number': 'SCM' + ''.join(random.choices(string.digits, k=8)),
                'origin': 'Miami, FL',
                'destination': 'Seattle, WA',
                'status': 'Delivered',
                'current_location': 'Seattle, WA',
                'temperature': 18.0,
                'humidity': 60.0,
                'cost': 189.50,
                'carrier': 'UPS',
                'priority': 'Standard'
            },
            {
                'tracking_number': 'SCM' + ''.join(random.choices(string.digits, k=8)),
                'origin': 'Dallas, TX',
                'destination': 'Boston, MA',
                'status': 'Delayed',
                'current_location': 'Memphis, TN',
                'temperature': 25.0,
                'humidity': 55.0,
                'cost': 245.75,
                'carrier': 'DHL',
                'priority': 'Express'
            }
        ]
        
        for shipment_data in sample_shipments:
            shipment = Shipment(
                user_id=user.id,
                tracking_number=shipment_data['tracking_number'],
                origin=shipment_data['origin'],
                destination=shipment_data['destination'],
                status=shipment_data['status'],
                current_location=shipment_data['current_location'],
                temperature=shipment_data['temperature'],
                humidity=shipment_data['humidity'],
                cost=shipment_data['cost'],
                carrier=shipment_data['carrier'],
                priority=shipment_data['priority'],
                estimated_delivery=datetime.now() + timedelta(days=random.randint(1, 7))
            )
            db.session.add(shipment)
    
    # Create sample IoT devices if none exist
    if not user.devices:
        sample_devices = [
            {
                'device_id': 'IOT' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
                'device_type': 'Temperature Sensor',
                'status': 'Active',
                'battery_level': 85,
                'location': 'Chicago, IL',
                'temperature': 22.5,
                'humidity': 45.0
            },
            {
                'device_id': 'IOT' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
                'device_type': 'GPS Tracker',
                'status': 'Active',
                'battery_level': 92,
                'location': 'Memphis, TN',
                'temperature': 25.0,
                'humidity': 55.0
            },
            {
                'device_id': 'IOT' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
                'device_type': 'Humidity Sensor',
                'status': 'Inactive',
                'battery_level': 15,
                'location': 'Seattle, WA',
                'temperature': 18.0,
                'humidity': 60.0
            }
        ]
        
        for device_data in sample_devices:
            device = IoTDevice(
                user_id=user.id,
                device_id=device_data['device_id'],
                device_type=device_data['device_type'],
                status=device_data['status'],
                battery_level=device_data['battery_level'],
                location=device_data['location'],
                temperature=device_data['temperature'],
                humidity=device_data['humidity']
            )
            db.session.add(device)
    
    db.session.commit()
    flash('Sample data initialized!', 'success')
    return redirect(url_for('dashboard'))

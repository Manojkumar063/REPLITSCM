from app import db
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    theme_preference = db.Column(db.String(20), default='light')
    
    # Relationships
    shipments = db.relationship('Shipment', backref='user', lazy=True)
    devices = db.relationship('IoTDevice', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Shipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tracking_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='In Transit')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    estimated_delivery = db.Column(db.DateTime)
    actual_delivery = db.Column(db.DateTime)
    current_location = db.Column(db.String(100))
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    cost = db.Column(db.Float)
    carrier = db.Column(db.String(50))
    priority = db.Column(db.String(20), default='Standard')

class IoTDevice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='Active')
    last_ping = db.Column(db.DateTime, default=datetime.utcnow)
    battery_level = db.Column(db.Integer)
    location = db.Column(db.String(100))
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Analytics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow)
    total_shipments = db.Column(db.Integer, default=0)
    delivered_shipments = db.Column(db.Integer, default=0)
    in_transit_shipments = db.Column(db.Integer, default=0)
    delayed_shipments = db.Column(db.Integer, default=0)
    total_cost = db.Column(db.Float, default=0.0)
    avg_delivery_time = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

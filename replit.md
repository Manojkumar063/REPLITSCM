# SCMXPertLite - Supply Chain Management System

## Overview

SCMXPertLite is a premium supply chain management web application built with Flask. The system provides real-time shipment tracking, IoT device monitoring, analytics dashboard, and comprehensive supply chain insights. It features a modern, responsive design with both light and dark themes, built for scalability and user experience.

## System Architecture

### Frontend Architecture
- **Framework**: HTML templates with Jinja2 templating engine
- **CSS Framework**: Bootstrap 5.1.3 with custom premium styling
- **JavaScript**: Vanilla JavaScript with modular structure
- **Icons**: Bootstrap Icons for consistent iconography
- **Charts**: Chart.js for data visualization
- **Responsive Design**: Mobile-first approach with Bootstrap grid system

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database ORM**: SQLAlchemy with Flask-SQLAlchemy extension
- **Authentication**: Custom session-based authentication using Werkzeug security
- **Database**: SQLite (default) with PostgreSQL support via DATABASE_URL
- **Session Management**: Flask sessions with secure secret key configuration

## Key Components

### Database Models
- **User Model**: Handles user authentication, profile management, and theme preferences
- **Shipment Model**: Tracks shipment details, status, location, and environmental data
- **IoTDevice Model**: Manages connected IoT devices and their status
- **Analytics Model**: Referenced but not fully implemented in current codebase

### Core Features
1. **User Management**: Registration, login, profile management
2. **Shipment Tracking**: Real-time tracking with status updates
3. **IoT Integration**: Device monitoring and management
4. **Analytics Dashboard**: Data visualization and insights
5. **Responsive Design**: Works across desktop and mobile devices

### Template Structure
- **base.html**: Master template with navigation and common elements
- **index.html**: Landing page with hero section and features
- **dashboard.html**: Main user dashboard with statistics
- **tracking.html**: Shipment tracking interface
- **analytics.html**: Analytics and reporting dashboard
- **iot.html**: IoT device management interface
- **login.html/register.html**: Authentication forms

## Data Flow

### Authentication Flow
1. User registration creates encrypted password hash
2. Login validates credentials and creates session
3. Session data persists user state across requests
4. Theme preferences stored in user profile and session

### Shipment Management Flow
1. Shipments created with tracking numbers and basic details
2. Status updates tracked with timestamps
3. Environmental data (temperature, humidity) collected
4. Real-time updates provided through JavaScript polling

### Analytics Flow
1. Data aggregated from shipments and IoT devices
2. Statistics calculated and cached for performance
3. Charts rendered client-side using Chart.js
4. Export functionality for reports

## External Dependencies

### Python Dependencies
- Flask: Web framework
- Flask-SQLAlchemy: Database ORM
- Werkzeug: Security utilities and WSGI tools
- Flask-Login: User session management (referenced but not fully implemented)

### Frontend Dependencies
- Bootstrap 5.1.3: CSS framework and components
- Bootstrap Icons: Icon library
- Chart.js: Data visualization library

### Database Support
- SQLite: Default development database
- PostgreSQL: Production database via DATABASE_URL environment variable

## Deployment Strategy

### Environment Configuration
- **Development**: SQLite database, debug mode enabled
- **Production**: PostgreSQL database, secure session keys
- **Environment Variables**:
  - `DATABASE_URL`: Database connection string
  - `SESSION_SECRET`: Session encryption key

### Application Structure
- **app.py**: Main application factory and configuration
- **main.py**: Application entry point
- **models.py**: Database models and relationships
- **routes.py**: Request handlers and business logic
- **static/**: CSS, JavaScript, and asset files
- **templates/**: HTML templates

### Security Features
- Password hashing using Werkzeug
- Session management with secure keys
- CSRF protection ready for implementation
- Proxy fix for deployment behind reverse proxy

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 08, 2025. Initial setup
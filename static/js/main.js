// Main JavaScript for SCMXPertLite
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize common functionality
    initializeCommon();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize form validation
    initializeFormValidation();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Send theme update to server if user is logged in
    if (document.querySelector('.dropdown-toggle')) {
        fetch('/toggle_theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ theme: newTheme })
        }).catch(error => {
            console.error('Error updating theme:', error);
        });
    }
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'bi bi-moon-fill theme-icon' : 'bi bi-sun-fill theme-icon';
    }
}

// Common Functionality
function initializeCommon() {
    // Auto-dismiss alerts
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.premium-card, .feature-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
    
    // Animate numbers on scroll
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.stat-number, .metric-number');
        numbers.forEach(number => {
            const rect = number.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateNumber(number);
            }
        });
    };
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                animateNumbers();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function animateNumber(element) {
    if (element.dataset.animated) return;
    
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const duration = 1000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateNumber = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = target.toLocaleString();
            element.dataset.animated = 'true';
        }
    };
    
    updateNumber();
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
    
    // Real-time validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.required;
    
    // Clear previous validation
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check required fields
    if (required && !value) {
        field.classList.add('is-invalid');
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Validate by type
    switch (type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                field.classList.add('is-invalid');
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'password':
            if (value && value.length < 8) {
                field.classList.add('is-invalid');
                showFieldError(field, 'Password must be at least 8 characters');
                return false;
            }
            break;
        case 'tel':
            if (value && !isValidPhone(value)) {
                field.classList.add('is-invalid');
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    // Check password confirmation
    if (field.name === 'confirm_password') {
        const password = document.querySelector('input[name="password"]');
        if (password && value !== password.value) {
            field.classList.add('is-invalid');
            showFieldError(field, 'Passwords do not match');
            return false;
        }
    }
    
    // Field is valid
    field.classList.add('is-valid');
    hideFieldError(field);
    return true;
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Password toggle functionality
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'bi bi-eye';
    }
}

// Utility Functions
function showLoading(element) {
    element.classList.add('loading');
    element.style.position = 'relative';
}

function hideLoading(element) {
    element.classList.remove('loading');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show premium-alert`;
    toast.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.flash-messages') || document.body;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Export functions for use in other modules
window.SCMXPert = {
    toggleTheme,
    showLoading,
    hideLoading,
    showToast,
    formatCurrency,
    formatDate,
    formatTime,
    validateField
};

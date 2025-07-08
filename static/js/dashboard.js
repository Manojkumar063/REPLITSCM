// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize real-time updates
    initializeRealTimeUpdates();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize dashboard charts
    initializeDashboardCharts();
    
    // Initialize dashboard widgets
    initializeDashboardWidgets();
}

// Real-time Updates
function initializeRealTimeUpdates() {
    // Update stats every 30 seconds
    setInterval(updateDashboardStats, 30000);
    
    // Update shipment status every 10 seconds
    setInterval(updateShipmentStatus, 10000);
    
    // Update alerts every 60 seconds
    setInterval(updateAlerts, 60000);
}

function updateDashboardStats() {
    const statsCards = document.querySelectorAll('.stat-card');
    
    statsCards.forEach(card => {
        const statNumber = card.querySelector('.stat-number');
        const statChange = card.querySelector('.stat-change');
        
        if (statNumber && statChange) {
            // Add pulse animation to indicate update
            statNumber.classList.add('pulse');
            setTimeout(() => {
                statNumber.classList.remove('pulse');
            }, 1000);
            
            // Simulate stat changes (in real implementation, this would fetch from API)
            const currentValue = parseInt(statNumber.textContent);
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            if (change !== 0) {
                statNumber.textContent = currentValue + change;
                
                // Update change indicator
                const changeSpan = statChange.querySelector('span');
                const changeIcon = statChange.querySelector('i');
                const newChange = Math.abs(change);
                
                changeSpan.textContent = `${newChange}% vs last update`;
                
                if (change > 0) {
                    statChange.className = 'stat-change positive';
                    changeIcon.className = 'bi bi-arrow-up';
                } else {
                    statChange.className = 'stat-change negative';
                    changeIcon.className = 'bi bi-arrow-down';
                }
            }
        }
    });
}

function updateShipmentStatus() {
    const shipmentRows = document.querySelectorAll('.premium-table tbody tr');
    
    shipmentRows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge) {
            // Add subtle animation to show update
            statusBadge.style.opacity = '0.7';
            setTimeout(() => {
                statusBadge.style.opacity = '1';
            }, 200);
        }
    });
}

function updateAlerts() {
    const alertsContainer = document.querySelector('.premium-card .card-body');
    const alertItems = alertsContainer?.querySelectorAll('.alert-item');
    
    if (alertItems && alertItems.length > 0) {
        // Simulate new alert (in real implementation, this would fetch from API)
        if (Math.random() > 0.7) {
            addNewAlert();
        }
    }
}

function addNewAlert() {
    const alertsContainer = document.querySelector('.premium-card .card-body');
    if (!alertsContainer) return;
    
    const alertTypes = [
        {
            icon: 'bi-exclamation-triangle',
            type: 'warning',
            title: 'Route Delay',
            message: 'Traffic detected on Route 95',
            time: 'Just now'
        },
        {
            icon: 'bi-info-circle',
            type: 'info',
            title: 'System Update',
            message: 'New features available',
            time: 'Just now'
        },
        {
            icon: 'bi-check-circle',
            type: 'success',
            title: 'Delivery Complete',
            message: 'Package delivered successfully',
            time: 'Just now'
        }
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    const alertElement = document.createElement('div');
    alertElement.className = 'alert-item';
    alertElement.innerHTML = `
        <div class="alert-icon alert-${randomAlert.type}">
            <i class="${randomAlert.icon}"></i>
        </div>
        <div class="alert-content">
            <h4>${randomAlert.title}</h4>
            <p>${randomAlert.message}</p>
            <span class="alert-time">${randomAlert.time}</span>
        </div>
    `;
    
    // Add animation
    alertElement.style.opacity = '0';
    alertElement.style.transform = 'translateY(-20px)';
    
    alertsContainer.insertBefore(alertElement, alertsContainer.firstChild);
    
    // Animate in
    setTimeout(() => {
        alertElement.style.transition = 'all 0.3s ease';
        alertElement.style.opacity = '1';
        alertElement.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove oldest alert if more than 3
    const allAlerts = alertsContainer.querySelectorAll('.alert-item');
    if (allAlerts.length > 3) {
        const oldestAlert = allAlerts[allAlerts.length - 1];
        oldestAlert.style.transition = 'all 0.3s ease';
        oldestAlert.style.opacity = '0';
        oldestAlert.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            oldestAlert.remove();
        }, 300);
    }
}

// Interactive Elements
function initializeInteractiveElements() {
    // Quick action buttons
    const quickActions = document.querySelectorAll('.quick-action-item');
    quickActions.forEach(action => {
        action.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            // Show loading state
            const icon = this.querySelector('i');
            const originalIcon = icon.className;
            icon.className = 'bi bi-arrow-clockwise';
            icon.style.animation = 'spin 1s linear infinite';
            
            // Simulate navigation delay
            setTimeout(() => {
                icon.className = originalIcon;
                icon.style.animation = '';
                window.location.href = this.href;
            }, 500);
        });
    });
    
    // Action buttons in table
    const actionButtons = document.querySelectorAll('.action-buttons .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const icon = this.querySelector('i');
            const action = icon.className.includes('eye') ? 'View' : 'Track';
            
            // Show tooltip
            showTooltip(this, `${action} shipment`);
            
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-custom';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 0.5rem;
        border-radius: 0.375rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            tooltip.remove();
        }, 200);
    }, 2000);
}

// Dashboard Charts
function initializeDashboardCharts() {
    // Mini chart for recent activity
    const miniChartCanvas = document.getElementById('miniActivityChart');
    if (miniChartCanvas) {
        createMiniActivityChart(miniChartCanvas);
    }
    
    // Create sparklines for stats
    createStatsSparklines();
}

function createMiniActivityChart(canvas) {
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 24 }, (_, i) => i),
            datasets: [{
                label: 'Activity',
                data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 10),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });
}

function createStatsSparklines() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        const sparklineContainer = document.createElement('div');
        sparklineContainer.className = 'sparkline-container';
        sparklineContainer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 60px;
            height: 30px;
            opacity: 0.7;
        `;
        
        const canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 30;
        sparklineContainer.appendChild(canvas);
        
        card.style.position = 'relative';
        card.appendChild(sparklineContainer);
        
        // Create sparkline chart
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 10 }, (_, i) => i),
                datasets: [{
                    data: Array.from({ length: 10 }, () => Math.random() * 100),
                    borderColor: index % 2 === 0 ? '#10b981' : '#3b82f6',
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
    });
}

// Dashboard Widgets
function initializeDashboardWidgets() {
    // Initialize progress bars
    animateProgressBars();
    
    // Initialize counters
    initializeCounters();
    
    // Initialize widget interactions
    initializeWidgetInteractions();
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-out';
            bar.style.width = width;
        }, 100);
    });
}

function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function initializeWidgetInteractions() {
    // Card hover effects
    const cards = document.querySelectorAll('.premium-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Stat card interactions
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            // Show detailed view (placeholder)
            const statLabel = this.querySelector('.stat-label').textContent;
            window.SCMXPert.showToast(`Viewing detailed ${statLabel} analytics`, 'info');
        });
    });
}

// Export dashboard functions
window.Dashboard = {
    updateDashboardStats,
    updateShipmentStatus,
    addNewAlert,
    showTooltip
};

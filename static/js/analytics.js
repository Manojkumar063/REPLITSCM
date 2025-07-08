// Analytics page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
});

function initializeAnalytics() {
    // Initialize analytics dashboard
    initializeAnalyticsCharts();
    
    // Initialize interactive elements
    initializeAnalyticsInteractions();
    
    // Initialize real-time updates
    initializeAnalyticsUpdates();
    
    // Initialize export functionality
    initializeAnalyticsExport();
    
    // Initialize performance metrics
    initializePerformanceMetrics();
}

// Chart Initialization
function initializeAnalyticsCharts() {
    // Initialize main charts if containers exist
    const trendsChart = document.getElementById('shipmentTrendsChart');
    const statusChart = document.getElementById('statusDistributionChart');
    
    if (trendsChart) {
        // Chart will be initialized by the template script with actual data
        console.log('Shipment trends chart container ready');
    }
    
    if (statusChart) {
        // Chart will be initialized by the template script with actual data
        console.log('Status distribution chart container ready');
    }
    
    // Initialize additional charts
    initializeMetricCharts();
}

function initShipmentTrendsChart(monthlyData) {
    const ctx = document.getElementById('shipmentTrendsChart');
    if (!ctx) return;
    
    // Process monthly data
    const labels = Object.keys(monthlyData).sort();
    const data = labels.map(month => monthlyData[month] || 0);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(month => {
                const date = new Date(month + '-01');
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }),
            datasets: [{
                label: 'Shipments',
                data: data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return `Month: ${context[0].label}`;
                        },
                        label: function(context) {
                            return `Shipments: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function initStatusDistributionChart(statusData) {
    const ctx = document.getElementById('statusDistributionChart');
    if (!ctx) return;
    
    // Process status data
    const labels = Object.keys(statusData);
    const data = Object.values(statusData);
    
    // Define colors for different statuses
    const colors = {
        'In Transit': '#3b82f6',
        'Delivered': '#10b981',
        'Delayed': '#ef4444',
        'Pending': '#f59e0b',
        'Cancelled': '#6b7280'
    };
    
    const backgroundColors = labels.map(label => colors[label] || '#94a3b8');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#6b7280'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function initializeMetricCharts() {
    // Initialize mini charts for performance metrics
    const performanceMetrics = document.querySelectorAll('.metric-progress');
    
    performanceMetrics.forEach((metric, index) => {
        const value = parseInt(metric.querySelector('.metric-value').textContent);
        const progressBar = metric.querySelector('.progress-fill');
        
        // Animate progress bar
        setTimeout(() => {
            progressBar.style.width = value + '%';
            
            // Add gradient based on value
            if (value >= 80) {
                progressBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
            } else if (value >= 60) {
                progressBar.style.background = 'linear-gradient(90deg, #3b82f6, #2563eb)';
            } else {
                progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
            }
        }, index * 200);
    });
}

// Interactive Elements
function initializeAnalyticsInteractions() {
    // Time range selector
    const timeRangeSelect = document.querySelector('.analytics-controls select');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            handleTimeRangeChange(this.value);
        });
    }
    
    // Export button
    const exportButton = document.querySelector('.analytics-controls .btn-premium-primary');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            handleExportData();
        });
    }
    
    // Metric cards interactions
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', function() {
            showMetricDetails(this);
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Recommendation actions
    const recommendationButtons = document.querySelectorAll('.recommendation-content button');
    recommendationButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleRecommendationAction(this);
        });
    });
    
    // Chart interactions
    initializeChartInteractions();
}

function handleTimeRangeChange(range) {
    // Show loading state
    const chartsContainer = document.querySelector('.analytics-container');
    window.SCMXPert.showLoading(chartsContainer);
    
    // Simulate data refresh
    setTimeout(() => {
        window.SCMXPert.hideLoading(chartsContainer);
        window.SCMXPert.showToast(`Analytics updated for ${range}`, 'success');
        
        // In a real application, this would fetch new data and update charts
        updateChartsWithNewData(range);
    }, 1000);
}

function handleExportData() {
    const exportButton = document.querySelector('.analytics-controls .btn-premium-primary');
    const originalContent = exportButton.innerHTML;
    
    // Show loading state
    exportButton.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Exporting...';
    exportButton.disabled = true;
    
    // Simulate export process
    setTimeout(() => {
        // Create download link
        const data = generateExportData();
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Restore button
        exportButton.innerHTML = originalContent;
        exportButton.disabled = false;
        
        window.SCMXPert.showToast('Analytics data exported successfully', 'success');
    }, 2000);
}

function generateExportData() {
    // Generate CSV data for export
    const headers = ['Date', 'Total Shipments', 'Delivered', 'In Transit', 'Delayed', 'Total Cost'];
    const rows = [
        ['2024-01-01', '125', '98', '22', '5', '$12,450.00'],
        ['2024-01-02', '132', '105', '20', '7', '$13,200.00'],
        ['2024-01-03', '118', '92', '19', '7', '$11,800.00'],
        ['2024-01-04', '145', '115', '25', '5', '$14,500.00'],
        ['2024-01-05', '138', '108', '23', '7', '$13,800.00']
    ];
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csvContent;
}

function showMetricDetails(card) {
    const metricLabel = card.querySelector('.metric-label').textContent;
    const metricValue = card.querySelector('.metric-number').textContent;
    
    // Create detailed view modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content premium-card">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-bar-chart me-2"></i>
                        ${metricLabel} Details
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="metric-overview">
                                <div class="metric-value-large">${metricValue}</div>
                                <div class="metric-label-large">${metricLabel}</div>
                                <div class="metric-trend-large">
                                    <i class="bi bi-arrow-up text-success"></i>
                                    <span class="text-success">+12.5% vs last month</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <canvas id="metricDetailChart" height="200"></canvas>
                        </div>
                    </div>
                    <div class="mt-4">
                        <h6>Key Insights</h6>
                        <ul class="insights-list">
                            <li>Performance has improved by 12.5% compared to last month</li>
                            <li>Peak performance recorded on weekdays</li>
                            <li>Consistent upward trend over the past quarter</li>
                            <li>Above industry average benchmarks</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-premium-outline" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-premium-primary">Export Details</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .metric-overview {
            text-align: center;
            padding: 2rem;
            background: var(--bg-tertiary);
            border-radius: 1rem;
        }
        .metric-value-large {
            font-size: 3rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }
        .metric-label-large {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }
        .metric-trend-large {
            font-size: 1rem;
            font-weight: 500;
        }
        .insights-list {
            list-style: none;
            padding: 0;
        }
        .insights-list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
            position: relative;
            padding-left: 1.5rem;
        }
        .insights-list li::before {
            content: '•';
            color: var(--accent-color);
            position: absolute;
            left: 0;
            top: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Initialize detail chart
    modal.addEventListener('shown.bs.modal', function() {
        const ctx = document.getElementById('metricDetailChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: metricLabel,
                        data: [65, 72, 78, 85],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
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
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    });
    
    // Clean up on close
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
        style.remove();
    });
}

function handleRecommendationAction(button) {
    const recommendation = button.closest('.recommendation-item');
    const title = recommendation.querySelector('h4').textContent;
    
    // Add loading state
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;
        
        // Mark as completed
        recommendation.style.opacity = '0.6';
        recommendation.style.position = 'relative';
        
        const completedBadge = document.createElement('div');
        completedBadge.innerHTML = '<i class="bi bi-check-circle text-success"></i> Completed';
        completedBadge.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--bg-primary);
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
        `;
        recommendation.appendChild(completedBadge);
        
        window.SCMXPert.showToast(`Action completed: ${title}`, 'success');
    }, 1500);
}

function initializeChartInteractions() {
    // Add fullscreen toggle for charts
    const chartCards = document.querySelectorAll('.premium-card:has(canvas)');
    
    chartCards.forEach(card => {
        const header = card.querySelector('.card-header');
        if (header) {
            const fullscreenBtn = document.createElement('button');
            fullscreenBtn.className = 'btn btn-premium-outline btn-sm ms-2';
            fullscreenBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
            fullscreenBtn.addEventListener('click', function() {
                toggleChartFullscreen(card);
            });
            
            const actions = header.querySelector('.card-actions');
            if (actions) {
                actions.appendChild(fullscreenBtn);
            }
        }
    });
}

function toggleChartFullscreen(card) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Full Screen Chart</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="chart-fullscreen-container" style="height: 80vh;">
                        <canvas id="fullscreenChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Clean up on close
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

// Real-time Updates
function initializeAnalyticsUpdates() {
    // Update metrics every 60 seconds
    setInterval(updateAnalyticsMetrics, 60000);
    
    // Update charts every 5 minutes
    setInterval(updateAnalyticsCharts, 300000);
}

function updateAnalyticsMetrics() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    
    metricNumbers.forEach(metric => {
        // Add pulse animation
        metric.style.animation = 'pulse 1s';
        setTimeout(() => {
            metric.style.animation = '';
        }, 1000);
        
        // Simulate metric changes
        if (Math.random() > 0.7) {
            const currentValue = parseFloat(metric.textContent.replace(/[^0-9.]/g, ''));
            const change = (Math.random() - 0.5) * 0.1; // ±5% change
            const newValue = currentValue * (1 + change);
            
            if (metric.textContent.includes('$')) {
                metric.textContent = '$' + newValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else {
                metric.textContent = Math.round(newValue).toLocaleString();
            }
        }
    });
}

function updateAnalyticsCharts() {
    const chartContainers = document.querySelectorAll('canvas');
    
    chartContainers.forEach(container => {
        // Add subtle animation to indicate update
        container.style.opacity = '0.8';
        setTimeout(() => {
            container.style.opacity = '1';
        }, 300);
    });
}

function updateChartsWithNewData(timeRange) {
    // This would typically fetch new data from the server
    // For now, we'll just show that the charts are being updated
    console.log(`Updating charts for time range: ${timeRange}`);
    
    // Simulate chart updates
    const charts = Chart.instances;
    Object.values(charts).forEach(chart => {
        if (chart && chart.update) {
            chart.update('none');
        }
    });
}

// Export Functionality
function initializeAnalyticsExport() {
    // Initialize export options
    const exportFormats = ['CSV', 'PDF', 'Excel'];
    console.log('Export formats available:', exportFormats);
}

// Performance Metrics
function initializePerformanceMetrics() {
    // Initialize performance monitoring
    observePerformanceMetrics();
    
    // Initialize metric animations
    animateMetricBars();
}

function observePerformanceMetrics() {
    const metrics = document.querySelectorAll('.metric-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateMetricBar(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    metrics.forEach(metric => {
        observer.observe(metric);
    });
}

function animateMetricBars() {
    const progressBars = document.querySelectorAll('.metric-progress .progress-fill');
    
    progressBars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.width = width;
        }, index * 200);
    });
}

function animateMetricBar(metricItem) {
    const progressBar = metricItem.querySelector('.progress-fill');
    const value = metricItem.querySelector('.metric-value');
    
    if (progressBar && value) {
        const targetWidth = parseInt(value.textContent);
        let currentWidth = 0;
        
        const animate = () => {
            if (currentWidth < targetWidth) {
                currentWidth += 2;
                progressBar.style.width = currentWidth + '%';
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

// Utility Functions
function formatAnalyticsData(data) {
    // Format data for display
    if (typeof data === 'number') {
        return data.toLocaleString();
    }
    return data;
}

function calculateTrend(currentValue, previousValue) {
    if (previousValue === 0) return 0;
    return ((currentValue - previousValue) / previousValue) * 100;
}

function getMetricColor(value, thresholds) {
    if (value >= thresholds.good) return '#10b981';
    if (value >= thresholds.warning) return '#f59e0b';
    return '#ef4444';
}

// Export analytics functions
window.Analytics = {
    initShipmentTrendsChart,
    initStatusDistributionChart,
    handleTimeRangeChange,
    handleExportData,
    showMetricDetails,
    updateAnalyticsMetrics,
    formatAnalyticsData,
    calculateTrend
};

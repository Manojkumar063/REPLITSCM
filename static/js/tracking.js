// Tracking page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();
});

function initializeTracking() {
    // Initialize tracking search
    initializeTrackingSearch();
    
    // Initialize shipment interactions
    initializeShipmentInteractions();
    
    // Initialize real-time tracking
    initializeRealTimeTracking();
    
    // Initialize map functionality
    initializeTrackingMap();
    
    // Initialize filters
    initializeTrackingFilters();
}

// Tracking Search
function initializeTrackingSearch() {
    const searchInput = document.querySelector('.tracking-search input');
    const searchButton = document.querySelector('.tracking-search button');
    
    if (searchInput && searchButton) {
        // Search on button click
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performTrackingSearch(searchInput.value);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performTrackingSearch(this.value);
            }
        });
        
        // Real-time search suggestions
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length > 2) {
                    showSearchSuggestions(this.value);
                } else {
                    hideSearchSuggestions();
                }
            }, 300);
        });
        
        // Clear search suggestions when input loses focus
        searchInput.addEventListener('blur', function() {
            setTimeout(() => {
                hideSearchSuggestions();
            }, 200);
        });
    }
}

function performTrackingSearch(query) {
    if (!query.trim()) {
        window.SCMXPert.showToast('Please enter a tracking number', 'warning');
        return;
    }
    
    // Show loading state
    const searchButton = document.querySelector('.tracking-search button');
    const originalContent = searchButton.innerHTML;
    searchButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    searchButton.style.animation = 'spin 1s linear infinite';
    
    // Filter shipments
    const shipmentCards = document.querySelectorAll('.shipment-card');
    let found = false;
    
    shipmentCards.forEach(card => {
        const trackingNumber = card.querySelector('.tracking-number').textContent;
        if (trackingNumber.toLowerCase().includes(query.toLowerCase())) {
            card.style.display = 'block';
            card.classList.add('highlight-search');
            found = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Restore button
    setTimeout(() => {
        searchButton.innerHTML = originalContent;
        searchButton.style.animation = '';
        
        if (!found) {
            window.SCMXPert.showToast('No shipments found matching your search', 'info');
        } else {
            window.SCMXPert.showToast(`Found ${document.querySelectorAll('.shipment-card:not([style*="display: none"])').length} shipments`, 'success');
        }
    }, 500);
}

function showSearchSuggestions(query) {
    const searchContainer = document.querySelector('.tracking-search');
    let suggestionsContainer = searchContainer.querySelector('.search-suggestions');
    
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
            margin-top: 0.5rem;
        `;
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(suggestionsContainer);
    }
    
    // Get matching tracking numbers
    const trackingNumbers = Array.from(document.querySelectorAll('.tracking-number'))
        .map(el => el.textContent)
        .filter(num => num.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
    
    if (trackingNumbers.length > 0) {
        suggestionsContainer.innerHTML = trackingNumbers.map(num => `
            <div class="search-suggestion" data-tracking="${num}">
                <i class="bi bi-search me-2"></i>
                ${num}
            </div>
        `).join('');
        
        // Add click handlers
        suggestionsContainer.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.style.cssText = `
                padding: 0.75rem 1rem;
                cursor: pointer;
                border-bottom: 1px solid var(--border-color);
                transition: background-color 0.2s ease;
            `;
            
            suggestion.addEventListener('click', function() {
                const trackingNumber = this.dataset.tracking;
                document.querySelector('.tracking-search input').value = trackingNumber;
                performTrackingSearch(trackingNumber);
                hideSearchSuggestions();
            });
            
            suggestion.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--bg-tertiary)';
            });
            
            suggestion.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
        });
        
        suggestionsContainer.style.display = 'block';
    } else {
        hideSearchSuggestions();
    }
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.querySelector('.search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Shipment Interactions
function initializeShipmentInteractions() {
    const shipmentCards = document.querySelectorAll('.shipment-card');
    
    shipmentCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
        
        // Add click handler for card
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.shipment-actions')) {
                showShipmentDetails(this);
            }
        });
        
        // Initialize action buttons
        const actionButtons = card.querySelectorAll('.shipment-actions button');
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                handleShipmentAction(this, card);
            });
        });
    });
}

function showShipmentDetails(card) {
    const trackingNumber = card.querySelector('.tracking-number').textContent;
    const status = card.querySelector('.status-badge').textContent;
    const origin = card.querySelector('.route-point:first-child span').textContent;
    const destination = card.querySelector('.route-point:last-child span').textContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content premium-card">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-box-seam me-2"></i>
                        Shipment Details
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-group">
                                <label>Tracking Number</label>
                                <div class="detail-value tracking-number">${trackingNumber}</div>
                            </div>
                            <div class="detail-group">
                                <label>Status</label>
                                <div class="detail-value">
                                    <span class="status-badge ${status.toLowerCase().replace(' ', '-')}">${status}</span>
                                </div>
                            </div>
                            <div class="detail-group">
                                <label>Origin</label>
                                <div class="detail-value">${origin}</div>
                            </div>
                            <div class="detail-group">
                                <label>Destination</label>
                                <div class="detail-value">${destination}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="tracking-timeline">
                                <h6>Tracking Timeline</h6>
                                <div class="timeline">
                                    <div class="timeline-item active">
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <h6>Package Picked Up</h6>
                                            <p>Your package has been picked up from ${origin}</p>
                                            <small>2 hours ago</small>
                                        </div>
                                    </div>
                                    <div class="timeline-item active">
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <h6>In Transit</h6>
                                            <p>Package is on its way to destination</p>
                                            <small>1 hour ago</small>
                                        </div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <h6>Out for Delivery</h6>
                                            <p>Package will be delivered today</p>
                                            <small>Estimated</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-premium-outline" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-premium-primary">Track Live</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for modal content
    const style = document.createElement('style');
    style.textContent = `
        .detail-group {
            margin-bottom: 1rem;
        }
        .detail-group label {
            display: block;
            font-weight: 600;
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
        }
        .detail-value {
            color: var(--text-primary);
            font-size: 1rem;
        }
        .tracking-timeline {
            background: var(--bg-tertiary);
            border-radius: 0.75rem;
            padding: 1rem;
        }
        .timeline {
            position: relative;
            padding-left: 2rem;
        }
        .timeline::before {
            content: '';
            position: absolute;
            left: 0.5rem;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--border-color);
        }
        .timeline-item {
            position: relative;
            margin-bottom: 1.5rem;
        }
        .timeline-item:last-child {
            margin-bottom: 0;
        }
        .timeline-marker {
            position: absolute;
            left: -1.5rem;
            top: 0.25rem;
            width: 1rem;
            height: 1rem;
            background: var(--border-color);
            border-radius: 50%;
            border: 2px solid var(--bg-primary);
        }
        .timeline-item.active .timeline-marker {
            background: var(--success-color);
        }
        .timeline-content h6 {
            margin: 0 0 0.25rem 0;
            font-size: 0.875rem;
            font-weight: 600;
        }
        .timeline-content p {
            margin: 0 0 0.25rem 0;
            font-size: 0.75rem;
            color: var(--text-secondary);
        }
        .timeline-content small {
            font-size: 0.75rem;
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(style);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Clean up on close
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
        style.remove();
    });
}

function handleShipmentAction(button, card) {
    const action = button.querySelector('i').className.includes('eye') ? 'view' : 'track';
    const trackingNumber = card.querySelector('.tracking-number').textContent;
    
    // Add loading state
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    button.style.animation = 'spin 1s linear infinite';
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.animation = '';
        
        if (action === 'view') {
            showShipmentDetails(card);
        } else {
            showLiveTracking(trackingNumber);
        }
    }, 500);
}

function showLiveTracking(trackingNumber) {
    // Create live tracking modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content premium-card">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-geo-alt me-2"></i>
                        Live Tracking - ${trackingNumber}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="map-container">
                                <div id="trackingMap" style="height: 400px; background: var(--bg-tertiary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
                                    <div class="text-center">
                                        <i class="bi bi-map" style="font-size: 3rem; color: var(--text-secondary);"></i>
                                        <p class="mt-2 text-muted">Live map tracking would be displayed here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="tracking-info">
                                <div class="info-card">
                                    <h6>Current Location</h6>
                                    <p><i class="bi bi-geo-alt me-2"></i>Chicago, IL</p>
                                </div>
                                <div class="info-card">
                                    <h6>Next Stop</h6>
                                    <p><i class="bi bi-arrow-right me-2"></i>Detroit, MI</p>
                                </div>
                                <div class="info-card">
                                    <h6>Estimated Arrival</h6>
                                    <p><i class="bi bi-clock me-2"></i>2 hours</p>
                                </div>
                                <div class="info-card">
                                    <h6>Speed</h6>
                                    <p><i class="bi bi-speedometer2 me-2"></i>65 mph</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-premium-outline" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-premium-primary">Share Location</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Clean up on close
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

// Real-time Tracking
function initializeRealTimeTracking() {
    // Update tracking information every 15 seconds
    setInterval(updateTrackingInfo, 15000);
    
    // Simulate real-time updates
    simulateRealTimeUpdates();
}

function updateTrackingInfo() {
    const shipmentCards = document.querySelectorAll('.shipment-card');
    
    shipmentCards.forEach(card => {
        const statusBadge = card.querySelector('.status-badge');
        const progressBar = card.querySelector('.progress-fill');
        
        // Add subtle pulse animation
        statusBadge.style.animation = 'pulse 1s';
        setTimeout(() => {
            statusBadge.style.animation = '';
        }, 1000);
        
        // Simulate progress updates
        if (progressBar && Math.random() > 0.8) {
            const currentWidth = parseInt(progressBar.style.width);
            if (currentWidth < 100) {
                progressBar.style.width = (currentWidth + 5) + '%';
            }
        }
    });
}

function simulateRealTimeUpdates() {
    const updates = [
        'Package picked up from warehouse',
        'In transit to sorting facility',
        'Arrived at sorting facility',
        'Departed from sorting facility',
        'Out for delivery',
        'Delivered successfully'
    ];
    
    // Show random updates
    setInterval(() => {
        if (Math.random() > 0.7) {
            const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
            window.SCMXPert.showToast(randomUpdate, 'info');
        }
    }, 30000);
}

// Map Functionality
function initializeTrackingMap() {
    // Placeholder for map initialization
    // In a real application, this would integrate with Google Maps, Mapbox, etc.
    console.log('Map functionality would be initialized here');
}

// Tracking Filters
function initializeTrackingFilters() {
    const filterButton = document.querySelector('.btn:contains("Filter")');
    if (filterButton) {
        filterButton.addEventListener('click', showFilterModal);
    }
}

function showFilterModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content premium-card">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-funnel me-2"></i>
                        Filter Shipments
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-select premium-input" id="statusFilter">
                            <option value="">All Statuses</option>
                            <option value="in-transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="delayed">Delayed</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Priority</label>
                        <select class="form-select premium-input" id="priorityFilter">
                            <option value="">All Priorities</option>
                            <option value="standard">Standard</option>
                            <option value="express">Express</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Date Range</label>
                        <div class="row">
                            <div class="col-6">
                                <input type="date" class="form-control premium-input" id="startDate">
                            </div>
                            <div class="col-6">
                                <input type="date" class="form-control premium-input" id="endDate">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-premium-outline" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-premium-primary" onclick="applyFilters()">Apply Filters</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Clean up on close
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const shipmentCards = document.querySelectorAll('.shipment-card');
    let visibleCount = 0;
    
    shipmentCards.forEach(card => {
        let visible = true;
        
        // Status filter
        if (statusFilter) {
            const cardStatus = card.querySelector('.status-badge').className;
            if (!cardStatus.includes(statusFilter)) {
                visible = false;
            }
        }
        
        // Priority filter
        if (priorityFilter) {
            const cardPriority = card.querySelector('.priority-badge').className;
            if (!cardPriority.includes(priorityFilter)) {
                visible = false;
            }
        }
        
        // Show/hide card
        if (visible) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.querySelector('.modal'));
    modal.hide();
    
    // Show result
    window.SCMXPert.showToast(`Showing ${visibleCount} shipments`, 'success');
}

// Export tracking functions
window.Tracking = {
    performTrackingSearch,
    showShipmentDetails,
    showLiveTracking,
    applyFilters
};

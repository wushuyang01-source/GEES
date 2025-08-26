document.addEventListener('DOMContentLoaded', function() {
    const gcsItems = document.querySelectorAll('.gcs__item');
    const systemTooltips = document.querySelectorAll('.system-tooltip');
    const systemCircles = document.querySelectorAll('.system-circle');
    const connectionLines = document.querySelectorAll('.connection-line');
    const gcsCenter = document.querySelector('.gcs__center');
    
    let currentIndex = 0;
    
    // Map system names to circle classes and center classes
    const systemCircleMap = {
        'ems': 'system-circle--ems',
        'pcs': 'system-circle--pcs',
        'pms': 'system-circle--pms',
        'bms': 'system-circle--bms'
    };
    
    const centerClassMap = {
        'ems': 'gcs__center--ems',
        'pcs': 'gcs__center--pcs',
        'pms': 'gcs__center--pms',
        'bms': 'gcs__center--bms'
    };
    
    function updateActiveSystem(index) {
        // Remove active classes from all elements
        gcsItems.forEach(item => item.classList.remove('gcs__item--active'));
        systemCircles.forEach(circle => circle.classList.remove('system-circle--active'));
        systemTooltips.forEach(tooltip => tooltip.classList.remove('system-tooltip--active'));
        connectionLines.forEach(line => line.classList.remove('connection-line--active'));
        
        // Remove all center state classes
        Object.values(centerClassMap).forEach(className => {
            gcsCenter.classList.remove(className);
        });
        
        // Get current system from data attribute
        const currentSystem = gcsItems[index].dataset.system;
        
        // Add active class to current system elements
        gcsItems[index].classList.add('gcs__item--active');
        
        // Activate corresponding tooltip in center
        const activeTooltip = document.querySelector(`.system-tooltip[data-system="${currentSystem}"]`);
        if (activeTooltip) {
            activeTooltip.classList.add('system-tooltip--active');
        }
        
        // Add center styling class
        const centerClass = centerClassMap[currentSystem];
        if (centerClass) {
            gcsCenter.classList.add(centerClass);
        }
        
        // Find and activate corresponding circle
        const circleClass = systemCircleMap[currentSystem];
        const activeCircle = document.querySelector(`.${circleClass}`);
        if (activeCircle) {
            activeCircle.classList.add('system-circle--active');
        }
        
        // Activate connection lines with staggered animation
        setTimeout(() => {
            connectionLines.forEach((line, i) => {
                setTimeout(() => {
                    line.classList.add('connection-line--active');
                }, i * 100);
            });
        }, 200);
    }
    
    // Add click handlers for list items
    gcsItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateActiveSystem(currentIndex);
        });
        
        // Add keyboard support
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
        
        // Make items focusable
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Select ${item.dataset.system.toUpperCase()} system`);
    });
    
    // Add click handlers for system circles
    systemCircles.forEach((circle) => {
        circle.addEventListener('click', () => {
            const circleClasses = Array.from(circle.classList);
            let systemType = '';
            
            // Find which system this circle represents
            for (const [system, className] of Object.entries(systemCircleMap)) {
                if (circleClasses.includes(className)) {
                    systemType = system;
                    break;
                }
            }
            
            if (systemType) {
                // Find the index of this system
                const targetIndex = Array.from(gcsItems).findIndex(item => 
                    item.dataset.system === systemType
                );
                
                if (targetIndex !== -1) {
                    currentIndex = targetIndex;
                    updateActiveSystem(currentIndex);
                }
            }
        });
        
        // Add keyboard support for circles
        circle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                circle.click();
            }
        });
        
        // Make circles focusable
        circle.setAttribute('tabindex', '0');
        circle.setAttribute('role', 'button');
    });
    
    // Keyboard navigation for the entire GCS section
    const gcsSection = document.querySelector('.gcs');
    document.addEventListener('keydown', (e) => {
        if (gcsSection && gcsSection.contains(e.target)) {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % gcsItems.length;
                    updateActiveSystem(currentIndex);
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + gcsItems.length) % gcsItems.length;
                    updateActiveSystem(currentIndex);
                    break;
            }
        }
    });
    
    // Initialize with first system active
    if (gcsItems.length > 0) {
        updateActiveSystem(0);
    } else {
        console.warn('GCS items not found. Check if the HTML elements exist.');
    }
    
    // Add ARIA live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    
    if (gcsSection) {
        gcsSection.appendChild(liveRegion);
        
        // Update live region when system changes
        const originalUpdateActiveSystem = updateActiveSystem;
        updateActiveSystem = function(index) {
            originalUpdateActiveSystem(index);
            const systemLabel = gcsItems[index].querySelector('.gcs__label strong');
            if (systemLabel) {
                liveRegion.textContent = `Now showing ${systemLabel.textContent}`;
            }
        };
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Function to load footer
    function loadFooter() {
        fetch('includes/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
                console.log('Footer loaded successfully');
                
                // Fix paths based on current page location
                fixFooterPaths();
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Fallback: try to load from relative path for subpages
                fetch('../includes/footer.html')
                    .then(response => response.text())
                    .then(data => {
                        document.getElementById('footer-placeholder').innerHTML = data;
                        console.log('Footer loaded from relative path');
                        
                        // Fix paths based on current page location
                        fixFooterPaths();
                    })
                    .catch(err => {
                        console.error('Failed to load footer from both paths:', err);
                    });
            });
    }
    
    // Function to fix footer paths based on current page location
    function fixFooterPaths() {
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.includes('/page/') || currentPath.includes('/Page/');
        
        console.log('Current path (footer):', currentPath);
        console.log('Is in subfolder (footer):', isInSubfolder);
        
        if (isInSubfolder) {
            // We're in a subfolder (like page/), so we need to go up one level
            const pathPrefix = '../';
            
            // Fix logo path in footer
            const footerLogo = document.querySelector('.footer__logo img');
            if (footerLogo) {
                const currentSrc = footerLogo.getAttribute('src');
                if (currentSrc && !currentSrc.startsWith('../')) {
                    footerLogo.src = pathPrefix + currentSrc.replace('../', '');
                }
            }
            
            // Fix all footer navigation links
            const footerLinks = document.querySelectorAll('.footer__link');
            footerLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    // Handle different types of links
                    if (href.startsWith('#')) {
                        // Hash links should point to index.html
                        link.href = pathPrefix + 'index.html' + href;
                    } else if (href.startsWith('../page/')) {
                        // Already relative, but we need to remove one level
                        link.href = href.replace('../page/', '');
                    } else if (href.startsWith('page/')) {
                        // Remove page/ since we're already in page folder
                        link.href = href.replace('page/', '');
                    } else if (!href.startsWith('../') && !href.startsWith('http')) {
                        // Add path prefix for other relative links
                        link.href = pathPrefix + href;
                    }
                }
            });
            
            // Fix E-Calculator button link if it has a specific href
            const eCalculatorBtn = document.querySelector('.footer__contact .btn');
            if (eCalculatorBtn) {
                const href = eCalculatorBtn.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('../')) {
                    eCalculatorBtn.href = pathPrefix + href;
                }
            }
            
        } else {
            // We're in the root folder
            // Fix footer links to include proper paths for page folder
            const footerLinks = document.querySelectorAll('.footer__link');
            footerLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('../page/')) {
                    // Remove ../ since we're in root
                    link.href = href.replace('../', '');
                }
            });
            
            // Make sure logo path is correct for root
            const footerLogo = document.querySelector('.footer__logo img');
            if (footerLogo) {
                const currentSrc = footerLogo.getAttribute('src');
                if (currentSrc && currentSrc.startsWith('../')) {
                    footerLogo.src = currentSrc.replace('../', '');
                }
            }
        }
        
        console.log('Footer paths fixed for location:', currentPath);
    }
    
    loadFooter();
});
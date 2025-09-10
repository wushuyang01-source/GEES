document.addEventListener('DOMContentLoaded', function() {
    // Function to load header
    function loadHeader() {
        fetch('includes/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
                console.log('Header loaded successfully');
                
                // Fix paths based on current page location
                fixHeaderPaths();
                
                // After header is loaded, initialize mega menu functionality
                initializeMegaMenu();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // Fallback: try to load from relative path for subpages
                fetch('../includes/header.html')
                    .then(response => response.text())
                    .then(data => {
                        document.getElementById('header-placeholder').innerHTML = data;
                        console.log('Header loaded from relative path');
                        
                        // Fix paths based on current page location
                        fixHeaderPaths();
                        
                        initializeMegaMenu();
                    })
                    .catch(err => {
                        console.error('Failed to load header from both paths:', err);
                    });
            });
    }
    
    // Function to fix header paths based on current page location
    function fixHeaderPaths() {
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.includes('/Pages/');
        
        console.log('Current path:', currentPath);
        console.log('Is in subfolder:', isInSubfolder);
        
        if (isInSubfolder) {
            // We're in a subfolder (like Pages/), so we need to go up one level
            const pathPrefix = '../';
            
            // Fix logo path
            const logo = document.querySelector('.header__logo img');
            if (logo) {
                logo.src = pathPrefix + 'images/logo.png';
            }
            
            // Fix navigation links
            const homeLink = document.querySelector('a[href*="index.html#home"]');
            if (homeLink) {
                homeLink.href = pathPrefix + 'index.html#home';
            }
            
            const newsLink = document.querySelector('a[href*="index.html#news"]');
            if (newsLink) {
                newsLink.href = pathPrefix + 'index.html#news';
            }
            
            // Fix all links that reference index.html sections
            const sectionLinks = document.querySelectorAll('a[href*="index.html#"]');
            sectionLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('../')) {
                    link.href = pathPrefix + href;
                }
            });
            
            // Fix feature card images
            const featureImages = document.querySelectorAll('.mega-menu__feature-card img');
            featureImages.forEach(img => {
                const src = img.getAttribute('src');
                if (src && !src.startsWith('../')) {
                    img.src = pathPrefix + src;
                }
            });
            
            // // Fix E-Pilot link to be relative to current subfolder
            // const ePilotLink = document.querySelector('a[href*="Pages/e-pilotship.html"]');
            // if (ePilotLink) {
            //     ePilotLink.href = 'e-pilotship.html'; // Remove Pages/ since we're already in Pages/
            // }
        } else {
            // We're in the root folder, paths should be as they are
            // But we need to ensure E-Pilot link includes Pages/
            // const ePilotLink = document.querySelector('a[href*="e-pilotship.html"]');
            // if (ePilotLink && !ePilotLink.href.includes('Pages/')) {
            //     ePilotLink.href = 'Pages/e-pilotship.html';
            // }
        }
        
        console.log('Header paths fixed for location:', currentPath);
    }
    
    loadHeader();
});

// Function to initialize mega menu (moved from mega-menu.js)
function initializeMegaMenu() {
    console.log('Initializing mega menu...'); // Debug
    
    const header = document.querySelector('.header');
    const megaMenus = document.querySelectorAll('.mega-menu');
    
    if (!header) {
        console.error('Header not found!');
        return;
    }
    
    console.log('Found header and', megaMenus.length, 'mega menus'); // Debug
    
    function updateMegaMenuPosition() {
        const headerHeight = header.offsetHeight;
        
        megaMenus.forEach(menu => {
            menu.style.top = headerHeight + 'px';
        });
    }
    
    // Update position on load and resize
    updateMegaMenuPosition();
    window.addEventListener('resize', updateMegaMenuPosition);
    window.addEventListener('scroll', updateMegaMenuPosition);
    
    // Get all mega menu items with submenus
    const megaMenuItems = document.querySelectorAll('.mega-menu__item--has-submenu');
    
    console.log('Found mega menu items:', megaMenuItems.length); // Debug
    
    // Category mapping for Electric Ships (UPDATED WITH ALL CHINESE TRANSLATIONS)
    const eShipCategoryMap = {
        // English mappings
        'E-Pilot': 'e-pilot',
        'E-Tug': 'e-tug',
        'E-Barge': 'e-barge',
        'E-CTV': 'e-ctv',
        'E-Ferry': 'e-ferry',
        // Chinese mappings
        'E-领航船': 'e-pilot',
        'E-拖轮': 'e-tug',
        'E-驳船': 'e-barge',
        'E-运输船': 'e-barge',  // Alternative Chinese name for E-Barge
        'E-船员运输船': 'e-ctv',
        'E-渡船': 'e-ferry'
    };
    
    // Category mapping for System Integration (UPDATED WITH CHINESE TRANSLATIONS)
    const systemIntegrationCategoryMap = {
        // English mappings
        'Three Propulsion Systems': 'three-system',
        'Product': 'product',
        'Control System': 'gcs-control',
        // Chinese mappings
        '三种推进系统': 'three-system',
        '产品': 'product',
        '控制系统': 'gcs-control'
    };
    
    // Category mapping for E-Ship Design
    const eShipDesignCategoryMap = {
        'Design by series': 'design-phase',
        'Proposal Design': 'proposal-phase',
        'Prototype Design': 'implementation-phase'
    };
    
    // Category mapping for About (UPDATED WITH CHINESE TRANSLATIONS)
    const aboutCategoryMap = {
        // English mappings
        'About Company': 'about-company',
        'Contact': 'contact',
        // Chinese mappings
        '关于公司': 'about-company',
        '联系我们': 'contact'
    };
    
    // Click event handlers for submenu activation
    megaMenuItems.forEach((item, index) => {
        const link = item.querySelector('.mega-menu__link');
        
        if (!link) {
            console.warn(`No link found for menu item ${index}`);
            return;
        }
        
        console.log(`Setting up click handler for item ${index}:`, link.textContent.trim()); // Debug
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const categoryText = link.textContent.trim();
            console.log('=== CLICK EVENT ===');
            console.log('Clicked category:', categoryText);
            
            // Find the parent mega menu content
            const megaMenuContent = item.closest('.mega-menu__content');
            if (!megaMenuContent) {
                console.log('ERROR: Could not find mega-menu__content');
                return;
            }
            
            const megaMenuSubmenus = megaMenuContent.querySelectorAll('.submenu');
            console.log('Found submenus:', megaMenuSubmenus.length);
            
            // Determine which category map to use based on the parent nav item
            const parentNavItem = item.closest('.nav__item--dropdown');
            if (!parentNavItem) {
                console.log('ERROR: Could not find parent nav item');
                return;
            }
            
            const parentNavLink = parentNavItem.querySelector('.nav__link');
            if (!parentNavLink) {
                console.log('ERROR: Could not find parent nav link');
                return;
            }
            
            const parentNavText = parentNavLink.textContent.trim();
            console.log('Parent nav link:', parentNavText);
            
            let categoryKey = null;
            
            // UPDATED: Better logic to handle both English and Chinese
            if (parentNavText === 'E-Ship Design' || parentNavText === '电动船舶设计') {
                categoryKey = eShipDesignCategoryMap[categoryText];
                console.log('Using E-Ship Design mapping, key:', categoryKey);
            } else if (parentNavText.includes('E-Ship') || parentNavText.includes('New Model E-Ship') || 
                       parentNavText.includes('电动船舶') || parentNavText.includes('新型电动船舶')) {
                categoryKey = eShipCategoryMap[categoryText];
                console.log('Using E-Ship mapping, key:', categoryKey);
            } else if (parentNavText.includes('System Integration') || parentNavText.includes('系统集成')) {
                categoryKey = systemIntegrationCategoryMap[categoryText];
                console.log('Using System Integration mapping, key:', categoryKey);
            } else if (parentNavText === 'About' || parentNavText === '关于我们') {
                categoryKey = aboutCategoryMap[categoryText];
                console.log('Using About mapping, key:', categoryKey);
            }
            
            if (!categoryKey) {
                console.log('ERROR: No category key found for:', categoryText, 'in parent:', parentNavText);
                console.log('Available E-Ship keys:', Object.keys(eShipCategoryMap));
                console.log('Available System Integration keys:', Object.keys(systemIntegrationCategoryMap));
                console.log('Available About keys:', Object.keys(aboutCategoryMap));
                return;
            }
            
            // Check if this submenu is already active
            const targetSubmenu = megaMenuContent.querySelector(`[data-category="${categoryKey}"]`);
            console.log('Target submenu found:', !!targetSubmenu);
            console.log('Looking for selector:', `[data-category="${categoryKey}"]`);
            
            if (!targetSubmenu) {
                console.log('ERROR: Target submenu not found for category:', categoryKey);
                // Debug: List all available submenus
                const allSubmenus = megaMenuContent.querySelectorAll('.submenu');
                console.log('Available submenus:');
                allSubmenus.forEach(submenu => {
                    console.log('- data-category:', submenu.getAttribute('data-category'));
                });
                return;
            }
            
            const isCurrentlyActive = targetSubmenu.classList.contains('active');
            console.log('Currently active:', isCurrentlyActive);
            
            // Hide all submenus in this specific mega menu
            megaMenuSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
            
            // Remove active class from all menu items in this mega menu
            const allMenuItems = megaMenuContent.querySelectorAll('.mega-menu__item--has-submenu .mega-menu__link');
            allMenuItems.forEach(menuLink => {
                menuLink.classList.remove('active');
            });
            
            // If the clicked submenu wasn't active, show it
            if (!isCurrentlyActive) {
                targetSubmenu.classList.add('active');
                megaMenuContent.classList.add('submenu-active');
                link.classList.add('active');
                console.log('✅ Submenu activated successfully');
            } else {
                // If it was active, just hide it (toggle behavior)
                megaMenuContent.classList.remove('submenu-active');
                console.log('✅ Submenu toggled off');
            }
            
            console.log('=== END CLICK EVENT ===');
        });
    });
    
    // Close submenu when clicking outside
    document.addEventListener('click', function(e) {
        const isInsideMegaMenu = e.target.closest('.mega-menu');
        const isNavDropdown = e.target.closest('.nav__item--dropdown');
        
        if (!isInsideMegaMenu && !isNavDropdown) {
            console.log('Clicked outside, hiding all submenus');
            
            const allSubmenus = document.querySelectorAll('.submenu');
            const allMegaMenuContents = document.querySelectorAll('.mega-menu__content');
            const allActiveLinks = document.querySelectorAll('.mega-menu__link.active');
            
            allSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
            
            allMegaMenuContents.forEach(content => {
                content.classList.remove('submenu-active');
            });
            
            allActiveLinks.forEach(link => {
                link.classList.remove('active');
            });
        }
    });
    
    // Hide submenu when leaving the mega menu entirely
    megaMenus.forEach(megaMenu => {
        megaMenu.addEventListener('mouseleave', function() {
            console.log('Mouse left mega menu, hiding submenus');
            
            const megaMenuContent = megaMenu.querySelector('.mega-menu__content');
            const megaMenuSubmenus = megaMenu.querySelectorAll('.submenu');
            const activeLinks = megaMenu.querySelectorAll('.mega-menu__link.active');
            
            megaMenuSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
            
            if (megaMenuContent) {
                megaMenuContent.classList.remove('submenu-active');
            }
            
            activeLinks.forEach(link => {
                link.classList.remove('active');
            });
        });
    });
    
    console.log('Mega menu initialization complete!'); // Debug

    
}
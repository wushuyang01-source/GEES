// Add this to a new file: js/mega-menu.js or add to existing JS file:

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Mega menu script loaded');
    
    // Get all mega menu items with submenus
    const megaMenuItems = document.querySelectorAll('.mega-menu__item--has-submenu');
    console.log('📋 Found mega menu items:', megaMenuItems.length);
    
    // List all found items for debugging
    megaMenuItems.forEach((item, index) => {
        const link = item.querySelector('.mega-menu__link');
        if (link) {
            console.log(`📌 Item ${index}: "${link.textContent.trim()}"`);
        }
    });
    
    // Category mapping for About
    const aboutCategoryMap = {
        'About Company': 'about-company',
        'Contact': 'contact'
    };
    
    // Click event handlers for submenu activation
    megaMenuItems.forEach((item, index) => {
        const link = item.querySelector('.mega-menu__link');
        if (!link) return;
        
        console.log(`🔗 Setting up click handler for: "${link.textContent.trim()}"`);
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const categoryText = link.textContent.trim();
            console.log('\n=== 🎯 CLICK EVENT ===');
            console.log('🖱️ Clicked category:', categoryText);
            
            // Find the parent mega menu content
            const megaMenuContent = item.closest('.mega-menu__content');
            if (!megaMenuContent) {
                console.error('❌ Could not find mega-menu__content');
                return;
            }
            
            // Find parent nav item
            const parentNavItem = item.closest('.nav__item--dropdown');
            if (!parentNavItem) {
                console.error('❌ Could not find parent nav item');
                return;
            }
                
            const parentNavLink = parentNavItem.querySelector('.nav__link');
            if (!parentNavLink) {
                console.error('❌ Could not find parent nav link');
                return;
            }
            
            const parentNavText = parentNavLink.textContent.trim();
            console.log('📂 Parent nav:', parentNavText);
            
            // Only handle About menu for now
            if (parentNavText !== 'About') {
                console.log('ℹ️ Not About menu, skipping...');
                return;
            }
            
            // Get category key for About menu
            const categoryKey = aboutCategoryMap[categoryText];
            console.log('🔑 Category key:', categoryKey);
            
            if (!categoryKey) {
                console.error('❌ No category key found for:', categoryText);
                console.log('📋 Available keys:', Object.keys(aboutCategoryMap));
                return;
            }
            
            // Find target submenu
            const targetSubmenu = megaMenuContent.querySelector(`[data-category="${categoryKey}"]`);
            console.log('🎯 Looking for selector:', `[data-category="${categoryKey}"]`);
            console.log('✅ Target submenu found:', !!targetSubmenu);
            
            if (!targetSubmenu) {
                console.error('❌ Target submenu not found');
                // Debug: List all available submenus
                const allSubmenus = megaMenuContent.querySelectorAll('.submenu');
                console.log('📋 Available submenus:');
                allSubmenus.forEach(submenu => {
                    console.log(`   - data-category: "${submenu.getAttribute('data-category')}"`);
                });
                return;
            }
            
            // Toggle submenu
            const isCurrentlyActive = targetSubmenu.classList.contains('active');
            console.log('🔄 Currently active:', isCurrentlyActive);
            
            // Hide all submenus first
            const allSubmenus = megaMenuContent.querySelectorAll('.submenu');
            const allActiveLinks = megaMenuContent.querySelectorAll('.mega-menu__link.active');
            
            allSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
            
            allActiveLinks.forEach(activeLink => {
                activeLink.classList.remove('active');
            });
            
            megaMenuContent.classList.remove('submenu-active');
            
            // If wasn't active, activate it
            if (!isCurrentlyActive) {
                targetSubmenu.classList.add('active');
                megaMenuContent.classList.add('submenu-active');
                link.classList.add('active');
                console.log('✅ Submenu activated successfully!');
            } else {
                console.log('ℹ️ Submenu toggled off');
            }
            
            console.log('=== END CLICK EVENT ===\n');
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
});
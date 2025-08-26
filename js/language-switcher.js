/* filepath: c:\Users\Yifan Feng\OneDrive - TU Eindhoven\桌面\electrical-website-template\js\language-switcher.js */
class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.isInitialized = false;
        this.isDropdownOpen = false;
        this.init();
    }

    init() {
        this.waitForHeader();
    }

    waitForHeader() {
        const checkHeader = () => {
            const languageSwitcher = document.getElementById('languageSwitcher');
            if (languageSwitcher && !this.isInitialized) {
                this.isInitialized = true;
                this.setupElements();
                this.setupEventListeners();
                this.loadLanguage(this.currentLang);
                this.updateDropdownDisplay();
            } else if (!this.isInitialized) {
                setTimeout(checkHeader, 100);
            }
        };
        checkHeader();
    }

    setupElements() {
        this.languageSwitcher = document.getElementById('languageSwitcher');
        this.languageBtn = document.getElementById('languageBtn');
        this.languageDropdown = document.getElementById('languageDropdown');
        this.langOptions = document.querySelectorAll('.lang-option');
        this.currentLanguageDisplay = this.languageBtn.querySelector('.current-language');
        this.translatableElements = document.querySelectorAll('[data-translate]');
    }

    setupEventListeners() {
        // Toggle dropdown
        this.languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Language option clicks
        this.langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                this.switchLanguage(lang);
                this.closeDropdown();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeDropdown();
        });

        // Prevent dropdown from closing when clicking inside
        this.languageDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
        this.languageSwitcher.classList.toggle('open', this.isDropdownOpen);
    }

    closeDropdown() {
        this.isDropdownOpen = false;
        this.languageSwitcher.classList.remove('open');
    }

    switchLanguage(lang) {
        if (!translations[lang] || lang === this.currentLang) {
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.refreshTranslatableElements();
        this.loadLanguage(lang);
        this.updateDropdownDisplay();
        this.updateDocumentLang(lang);
        
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    updateDropdownDisplay() {
        // Update the current language display
        const langConfig = {
            en: { flag: '🇺🇸', text: 'English' },
            zh: { flag: '🇨🇳', text: '中文' }
        };

        const config = langConfig[this.currentLang];
        if (config && this.currentLanguageDisplay) {
            this.currentLanguageDisplay.querySelector('.flag-emoji').textContent = config.flag;
            this.currentLanguageDisplay.querySelector('.lang-text').textContent = config.text;
        }

        // Update active state in dropdown
        this.langOptions.forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-lang') === this.currentLang);
        });
    }

    refreshTranslatableElements() {
        this.translatableElements = document.querySelectorAll('[data-translate]');
    }

    loadLanguage(lang) {
        const langData = translations[lang];
        
        this.translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = langData[key];
            
            if (translation) {
                this.updateElement(element, translation);
            }
        });
    }

    updateElement(element, translation) {
        const tagName = element.tagName.toLowerCase();
        
        switch (tagName) {
            case 'input':
                if (element.type === 'submit' || element.type === 'button') {
                    element.value = translation;
                } else {
                    element.placeholder = translation;
                }
                break;
            case 'textarea':
                element.placeholder = translation;
                break;
            case 'option':
                element.textContent = translation;
                break;
            case 'title':
                document.title = translation;
                break;
            default:
                element.textContent = translation;
        }
    }

    updateDocumentLang(lang) {
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    }

    reinitialize() {
        this.isInitialized = false;
        this.waitForHeader();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});

// Listen for when header is loaded
window.addEventListener('headerLoaded', () => {
    if (window.languageSwitcher) {
        window.languageSwitcher.reinitialize();
    }
});
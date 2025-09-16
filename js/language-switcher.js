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

// === 通用：根据语言更新所有 data-link-* 和 data-img-* 元素 ===
function updateLinksByLanguage(lang) {
    document.querySelectorAll('a[data-link-en][data-link-zh]').forEach(link => {
        const newHref = link.getAttribute(`data-link-${lang}`);
        if (newHref) link.href = newHref;
    });
}

function updateImgsByLanguage(lang) {
    document.querySelectorAll('img[data-img-en][data-img-zh]').forEach(img => {
        const newSrc = img.getAttribute(`data-img-${lang}`) || img.getAttribute('data-img-en');
        if (newSrc) {
            // 只有在 src 不等于目标时再赋值，避免不必要的重绘
            if (img.src.indexOf(newSrc) === -1) img.src = newSrc;
        }
    });
}

function applyLanguageToPage(lang) {
    updateLinksByLanguage(lang);
    updateImgsByLanguage(lang);
    // 如果你还有其他基于 data-attribute 的切换（比如 data-video-*、data-doc-*），也在这里统一处理
}

// 页面第一次加载时按 localStorage 设置（常规情况）
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'en';
    applyLanguageToPage(savedLang);
});

// 语言切换时实时更新（你已有的事件）
window.addEventListener('languageChanged', (e) => {
    applyLanguageToPage(e.detail.lang);
});

// 关键：当页面从 bfcache / 历史恢复时也重新应用（解决“返回后再点变回英文”）
window.addEventListener('pageshow', (e) => {
    const savedLang = localStorage.getItem('language') || 'en';
    applyLanguageToPage(savedLang);

    // 可选：如果 languageSwitcher 已存在，强制同步 UI 状态
    if (window.languageSwitcher && typeof window.languageSwitcher.loadLanguage === 'function') {
        window.languageSwitcher.loadLanguage(savedLang);
        if (typeof window.languageSwitcher.updateDropdownDisplay === 'function') {
            window.languageSwitcher.updateDropdownDisplay();
        }
    }

    // 开发时调试用：在控制台查看是否触发 pageshow
    // console.log('pageshow fired, persisted=', e.persisted, 'lang=', savedLang);
});


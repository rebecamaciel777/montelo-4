// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcons();
    }

    updateThemeIcons() {
        const themeButtons = document.querySelectorAll('.theme-toggle');
        const icon = this.theme === 'light' ? 'fa-moon' : 'fa-sun';
        
        themeButtons.forEach(button => {
            const iconElement = button.querySelector('i');
            iconElement.className = `fas ${icon}`;
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    setupEventListeners() {
        const themeButtons = document.querySelectorAll('.theme-toggle');
        themeButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleTheme());
        });
    }
}

// Mobile Menu Management
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.menu = document.getElementById('mobileMenu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (this.menuBtn && this.menu) {
            this.setupEventListeners();
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('active', this.isOpen);
        
        const icon = this.menuBtn.querySelector('i');
        icon.className = this.isOpen ? 'fas fa-times' : 'fas fa-bars';
    }

    close() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        
        const icon = this.menuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
    }

    setupEventListeners() {
        this.menuBtn.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking on links
        const menuLinks = document.querySelectorAll('.mobile-menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.close();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new MobileMenu();
    new ContactForm();
    new SmoothScroll();
    new AnimationObserver();
    new StatsCounter();
    new HeaderScroll();
 // Add loading animation styles
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            animation: slideInDown 0.3s ease;
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .stat-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .stat-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    console.log('🌞 MONTELO Solar Platform initialized successfully!');
});

document.addEventListener('DOMContentLoaded', () => {
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling; // The faq-content div
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Close all other open items
            faqTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    const otherContent = otherTrigger.nextElementSibling;
                    if (otherTrigger.getAttribute('aria-expanded') === 'true') {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                        otherContent.setAttribute('aria-hidden', 'true');
                        otherContent.classList.remove('open');
                    }
                }
            });

            // Toggle the clicked item
            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                content.setAttribute('aria-hidden', 'true');
                content.classList.remove('open');
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                content.setAttribute('aria-hidden', 'false');
                content.classList.add('open');
            }
        });
    });
});

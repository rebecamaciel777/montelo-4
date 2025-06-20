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

// Form Management
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate API call
            await this.simulateSubmission(data);
            
            // Show success message
            this.showMessage('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
            
        } catch (error) {
            // Show error message
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
        }
    }

    async simulateSubmission(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data (in real app, this would be sent to server)
        console.log('Form submitted:', data);
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('Simulated error'));
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;

        // Add styles
        messageEl.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            ${type === 'success' 
                ? 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;'
                : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
            }
        `;

        // Insert message
        this.form.insertBefore(messageEl, this.form.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        e.preventDefault();
        
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, options);

        // Observe elements
        const animatedElements = document.querySelectorAll('.card, .stat-item, .provider-card, .installer-card, .financing-card, .partner-card');
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Stats Counter Animation
class StatsCounter {
    constructor() {
        this.init();
    }

    init() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const options = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, options);

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d,]/g, '');
        
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    }
}

// Header Scroll Effect
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (this.header) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.header.style.background = scrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(255, 255, 255, 0.8)';
        this.header.style.boxShadow = scrolled 
            ? '0 2px 20px rgba(0, 0, 0, 0.1)' 
            : 'none';
    }
}

// Initialize everything when DOM is loaded
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

// Utility Functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format phone numbers
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },

    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Generate star rating HTML
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt star"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star star empty"></i>';
        }
        
        return starsHTML;
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, MobileMenu, ContactForm, utils };
}
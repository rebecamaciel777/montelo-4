// Installer Application Manager
class InstallerApplicationManager {
    constructor() {
        this.form = document.getElementById('installerApplicationForm');
        this.currentStep = 1;
        this.totalSteps = 6;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFileUploads();
        this.setupFormValidation();
    }

    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }

        // ZIP code validation
        const zipInput = document.getElementById('zipCode');
        if (zipInput) {
            zipInput.addEventListener('input', (e) => this.validateZipCode(e));
        }

        // Real-time form validation
        const requiredInputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });
    }

    setupFileUploads() {
        const fileInputs = [
            { input: 'licenseUpload', display: 'licenseFileName' },
            { input: 'insuranceUpload', display: 'insuranceFileName' },
            { input: 'portfolioUpload', display: 'portfolioFileName' }
        ];

        fileInputs.forEach(({ input, display }) => {
            const fileInput = document.getElementById(input);
            const fileDisplay = document.getElementById(display);
            
            if (fileInput && fileDisplay) {
                fileInput.addEventListener('change', (e) => {
                    this.handleFileUpload(e, fileDisplay);
                });
            }
        });
    }

    setupFormValidation() {
        // Custom validation messages
        const validationRules = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                pattern: /^$$\d{3}$$ \d{3}-\d{4}$/,
                message: 'Please enter a valid phone number'
            },
            zipCode: {
                pattern: /^\d{5}(-\d{4})?$/,
                message: 'Please enter a valid ZIP code'
            }
        };

        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateFieldWithPattern(field, validationRules[fieldName]);
                });
            }
        });
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        e.target.value = value;
    }

    validateZipCode(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = `${value.slice(0, 5)}-${value.slice(5, 9)}`;
        }
        e.target.value = value;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        
        // Remove existing error
        this.clearFieldError(field);
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, `${this.getFieldLabel(field)} is required`);
            return false;
        }
        
        // Check minimum length for text fields
        if (field.type === 'text' && value && value.length < 2) {
            this.showFieldError(field, `${this.getFieldLabel(field)} must be at least 2 characters`);
            return false;
        }
        
        return true;
    }

    validateFieldWithPattern(field, rule) {
        const value = field.value.trim();
        
        if (value && !rule.pattern.test(value)) {
            this.showFieldError(field, rule.message);
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    getFieldLabel(field) {
        const label = field.parentNode.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    handleFileUpload(e, displayElement) {
        const files = e.target.files;
        
        if (files.length === 0) {
            displayElement.textContent = '';
            return;
        }
        
        if (files.length === 1) {
            displayElement.textContent = files[0].name;
        } else {
            displayElement.textContent = `${files.length} files Select Plan`;
        }
        
        // Validate file types and sizes
        this.validateFiles(files, e.target);
    }

    validateFiles(files, input) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = {
            'licenseUpload': ['application/pdf', 'image/jpeg', 'image/png'],
            'insuranceUpload': ['application/pdf', 'image/jpeg', 'image/png'],
            'portfolioUpload': ['image/jpeg', 'image/png']
        };
        
        const inputId = input.id;
        const allowed = allowedTypes[inputId] || [];
        
        for (let file of files) {
            // Check file size
            if (file.size > maxSize) {
                this.showMessage(`File "${file.name}" is too large. Maximum size is 5MB.`, 'error');
                input.value = '';
                return false;
            }
            
            // Check file type
            if (allowed.length > 0 && !allowed.includes(file.type)) {
                this.showMessage(`File "${file.name}" has an invalid format.`, 'error');
                input.value = '';
                return false;
            }
        }
        
        return true;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate entire form
        if (!this.validateForm()) {
            this.showMessage('Please correct the errors in the form before submitting.', 'error');
            return;
        }
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';
        submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Simulate API submission
            await this.submitApplication(formData);
            
            // Show success message
            this.showSuccessPage();
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showMessage('There was an error submitting your application. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm() {
        let isValid = true;
        
        // Validate all required fields
        const requiredFields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Check if at least one certification is Select Plan
        const certifications = this.form.querySelectorAll('input[name="certifications"]:checked');
        if (certifications.length === 0) {
            this.showMessage('Please select at least one certification.', 'error');
            isValid = false;
        }
        
        // Check if terms are accepted
        const termsCheckbox = this.form.querySelector('input[name="terms"]');
        if (!termsCheckbox.checked) {
            this.showMessage('Please accept the Terms of Service and Privacy Policy.', 'error');
            isValid = false;
        }
        
        return isValid;
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    async submitApplication(data) {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Log the application data (in real app, this would be sent to server)
        console.log('Installer Application Submitted:', data);
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
            return Promise.resolve({ success: true, applicationId: 'APP-' + Date.now() });
        } else {
            return Promise.reject(new Error('Simulated server error'));
        }
    }

    showSuccessPage() {
        // Hide the form
        this.form.style.display = 'none';
        
        // Create success message
        const successHTML = `
            <div class="success-container">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Application Submitted Successfully!</h2>
                <p>Thank you for your interest in becoming a MONTELO certified installer.</p>
                <div class="success-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>We'll review your application within 2-3 business days</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <span>You'll receive an email confirmation shortly</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>Our team may contact you for additional information</span>
                    </div>
                </div>
                <div class="success-actions">
                    <a href="index.html" class="btn btn-primary">Return to Home</a>
                    <a href="installers.html" class="btn btn-outline">Browse Installers</a>
                </div>
            </div>
        `;
        
        // Insert success message
        const applicationSection = document.querySelector('.application-section .container');
        applicationSection.innerHTML = successHTML;
        
        // Scroll to success message
        applicationSection.scrollIntoView({ behavior: 'smooth' });
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.installer-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `installer-message installer-message-${type}`;
        messageEl.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;

        // Add styles
        messageEl.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            z-index: 3000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            ${type === 'success' 
                ? 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;'
                : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
            }
        `;

        // Add animation styles if not already present
        if (!document.querySelector('#installer-animations')) {
            const style = document.createElement('style');
            style.id = 'installer-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .field-error {
                    color: #dc2626;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                
                .field-error::before {
                    content: "⚠";
                    font-size: 0.75rem;
                }
                
                .form-group input.error,
                .form-group select.error,
                .form-group textarea.error {
                    border-color: #dc2626;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
                }
                
                .success-container {
                    text-align: center;
                    padding: 3rem 2rem;
                    background: var(--bg-card);
                    border-radius: 1rem;
                    border: 2px solid var(--border-color);
                }
                
                .success-icon {
                    font-size: 4rem;
                    color: #10b981;
                    margin-bottom: 1rem;
                }
                
                .success-container h2 {
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                }
                
                .success-details {
                    margin: 2rem 0;
                    text-align: left;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    color: var(--text-secondary);
                }
                
                .detail-item i {
                    color: var(--orange-500);
                    width: 1.25rem;
                }
                
                .success-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 2rem;
                }
            `;
            document.head.appendChild(style);
        }

        // Insert message
        document.body.appendChild(messageEl);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Utility functions for form enhancement
const installerUtils = {
    // Format business name
    formatBusinessName(name) {
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    },
    
    // Validate license number format
    validateLicenseNumber(license, state) {
        const patterns = {
            'CA': /^\d{6,8}$/,
            'TX': /^[A-Z]{2}\d{6}$/,
            'FL': /^[A-Z]{2}\d{7}$/,
            'NY': /^\d{7}$/
        };
        
        const pattern = patterns[state];
        return pattern ? pattern.test(license) : license.length >= 6;
    },
    
    // Get state name from abbreviation
    getStateName(abbr) {
        const states = {
            'CA': 'California',
            'TX': 'Texas',
            'FL': 'Florida',
            'NY': 'New York',
            'AZ': 'Arizona',
            'NV': 'Nevada',
            'CO': 'Colorado',
            'NC': 'North Carolina',
            'NJ': 'New Jersey',
            'MA': 'Massachusetts'
        };
        return states[abbr] || abbr;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('installerApplicationForm')) {
        new InstallerApplicationManager();
        console.log('Installer application form initialized successfully!');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InstallerApplicationManager, installerUtils };
}
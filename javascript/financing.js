// Sample finance partners data
const partnersData = [
    {
        id: 1,
        name: "SolarBank Financial",
        type: "Bank",
        description: "Competitive rates for solar installations with flexible repayment terms.",
        features: ["Prime rate + 2%", "Up to $100,000", "10-year terms"],
        rating: 4.7,
        contact: "+1 (555) 636-9111",
        email: "solar@solarbank.com",
        featured: true
    },
    {
        id: 2,
        name: "Green Loans America",
        type: "Lender",
        description: "Specialized green energy financing with preferential rates.",
        features: ["From 5.9% APR", "Up to $75,000", "7-year terms"],
        rating: 4.5,
        contact: "+1 (555) 575-9404",
        email: "greenloans@gla.com",
        featured: false
    },
    {
        id: 3,
        name: "EcoCredit Solutions",
        type: "Credit Union",
        description: "Comprehensive solar financing with energy efficiency assessments.",
        features: ["Prime rate + 1.5%", "Up to $80,000", "12-year terms"],
        rating: 4.6,
        contact: "+1 (555) 294-4444",
        email: "solar@ecocredit.com",
        featured: true
    },
    {
        id: 4,
        name: "SolarCredit Finance",
        type: "Specialist Lender",
        description: "Dedicated solar financing with quick approval processes.",
        features: ["From 6.5% APR", "Up to $150,000", "15-year terms"],
        rating: 4.8,
        contact: "+1 (555) 555-0123",
        email: "info@solarcredit.com",
        featured: false
    },
    {
        id: 5,
        name: "Renewable Energy Bank",
        type: "Bank",
        description: "Full-service renewable energy financing solutions.",
        features: ["Prime rate + 2.5%", "Up to $200,000", "20-year terms"],
        rating: 4.4,
        contact: "+1 (555) 123-7890",
        email: "renewables@rebank.com",
        featured: false
    },
    {
        id: 6,
        name: "CleanTech Lending",
        type: "Online Lender",
        description: "Fast online approvals for residential and commercial solar projects.",
        features: ["From 7.9% APR", "Up to $50,000", "5-year terms"],
        rating: 4.3,
        contact: "+1 (555) 987-1234",
        email: "apply@cleantechlending.com",
        featured: true
    }
];

class FinancingManager {
    constructor() {
        this.partners = partnersData;
        this.init();
    }

    init() {
        this.renderPartners();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const consultationForm = document.getElementById('consultationForm');
        
        if (consultationForm) {
            consultationForm.addEventListener('submit', (e) => this.handleConsultationSubmit(e));
        }
    }

    async handleConsultationSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate API call
            await this.simulateConsultationSubmission(data);
            
            // Show success message
            this.showConsultationMessage('Thank you! Our finance partners will contact you within 24 hours.', 'success');
            e.target.reset();
            
        } catch (error) {
            // Show error message
            this.showConsultationMessage('Sorry, there was an error submitting your request. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
        }
    }

    async simulateConsultationSubmission(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data
        console.log('Consultation request submitted:', data);
        
        // Simulate success
        return Promise.resolve();
    }

    showConsultationMessage(message, type) {
        const form = document.getElementById('consultationForm');
        if (!form) return;

        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
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

        // Insert message at the top of the form
        form.insertBefore(messageEl, form.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    renderPartners() {
        const grid = document.getElementById('partnersGrid');
        if (!grid) return;

        grid.innerHTML = this.partners.map(partner => this.createPartnerCard(partner)).join('');
    }

    createPartnerCard(partner) {
        return `
            <div class="partner-card ${partner.featured ? 'featured' : ''}">
                <div class="partner-header">
                    <div class="partner-info">
                        <h3>
                            ${partner.name}
                            ${partner.featured ? '<span class="tier-badge featured">Featured</span>' : ''}
                        </h3>
                        <div class="partner-type">${partner.type}</div>
                    </div>
                    <div class="partner-rating">
                        <i class="fas fa-star"></i>
                        <span>${partner.rating}</span>
                    </div>
                </div>

                <p class="partner-description">${partner.description}</p>

                <div class="partner-features">
                    <h4>Key Features:</h4>
                    <ul>
                        ${partner.features.map(feature => `
                            <li>
                                <i class="fas fa-check"></i>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${partner.contact}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${partner.email}</span>
                    </div>
                </div>

                <div class="partner-actions">
                    <button class="btn btn-primary" onclick="getQuote(${partner.id})">
                        Get Quote
                    </button>
                    <button class="btn btn-outline" onclick="learnMore(${partner.id})">
                        Learn More
                    </button>
                </div>
            </div>
        `;
    }
}

// Global functions for partner actions
function getQuote(partnerId) {
    const partner = partnersData.find(p => p.id === partnerId);
    if (partner) {
        alert(`Getting quote from ${partner.name}\n\nThis would redirect to their application process or open a quote form.`);
        // In a real app, this would redirect to the partner's application or open a quote form
    }
}

function learnMore(partnerId) {
    const partner = partnersData.find(p => p.id === partnerId);
    if (partner) {
        alert(`Learning more about ${partner.name}\n\nThis would show detailed information about their financing options.`);
        // In a real app, this would show detailed partner information
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('partnersGrid')) {
        new FinancingManager();
    }
});
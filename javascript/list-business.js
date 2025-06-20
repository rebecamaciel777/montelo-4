// Pricing plans data
const pricingPlans = [
    {
        name: "Standard",
        price: 49,
        period: "/month",
        description: "Perfect for small solar providers getting started",
        features: [
            "Basic business listing",
            "Contact information display",
            "Up to 5 service categories",
            "Customer reviews",
            "Basic analytics"
        ],
        popular: false
    },
    {
        name: "Premium",
        price: 99,
        period: "/month",
        description: "Enhanced visibility for growing businesses",
        features: [
            "Everything in Standard",
            "Featured placement in search",
            "Unlimited service categories",
            "Photo gallery (up to 20 images)",
            "Lead generation tools",
            "Priority customer support",
            "Advanced analytics"
        ],
        popular: true
    },
    {
        name: "Elite",
        price: 199,
        period: "/month",
        description: "Maximum exposure for established companies",
        features: [
            "Everything in Premium",
            "Top placement in all searches",
            "Unlimited photo gallery",
            "Video showcase",
            "Custom business profile page",
            "Lead priority routing",
            "Dedicated account manager",
            "White-label solutions"
        ],
        popular: false
    }
];

// Services options
const servicesOptions = [
    "Residential Solar Installation",
    "Commercial Solar Systems",
    "Industrial Solar Solutions",
    "Solar Panel Maintenance",
    "Battery Storage Systems",
    "Grid-Tie Systems",
    "Off-Grid Solutions",
    "Solar Water Heating",
    "Energy Audits",
    "System Design",
    "Inverter Installation",
    "Solar Financing",
    "Monitoring Systems"
];

class ListBusinessManager {
    constructor() {
        this.selectedPlan = 'Premium';
        this.selectedServices = [];
        this.init();
    }

    init() {
        this.renderPricingPlans();
        this.renderServicesGrid();
        this.updatePaymentSummary();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const businessForm = document.getElementById('businessForm');
        
        if (businessForm) {
            businessForm.addEventListener('submit', (e) => this.handleBusinessSubmit(e));
        }
    }

    renderPricingPlans() {
        const grid = document.getElementById('pricingGrid');
        if (!grid) return;

        grid.innerHTML = pricingPlans.map(plan => this.createPricingCard(plan)).join('');
        
        // Add click event listeners to pricing cards
        grid.querySelectorAll('.pricing-card').forEach((card, index) => {
            card.addEventListener('click', () => this.selectPlan(pricingPlans[index].name));
        });
    }

    createPricingCard(plan) {
        const isSelected = this.selectedPlan === plan.name;
        
        return `
            <div class="pricing-card ${plan.popular ? 'popular' : ''} ${isSelected ? 'selected' : ''}" data-plan="${plan.name}">
                <h3>${plan.name}</h3>
                <div class="pricing-price">
                    <span class="price-amount">$${plan.price}</span>
                    <span class="price-period">${plan.period}</span>
                </div>
                <p class="pricing-description">${plan.description}</p>
                <ul class="pricing-features">
                    ${plan.features.map(feature => `
                        <li>
                            <i class="fas fa-check"></i>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
                <button class="btn select-plan-btn ${isSelected ? 'btn-primary' : 'btn-outline'}">
                    ${isSelected ? 'Selected' : 'Select Plan'}
                </button>
            </div>
        `;
    }

    selectPlan(planName) {
        this.selectedPlan = planName;
        this.renderPricingPlans();
        this.updatePaymentSummary();
    }

    renderServicesGrid() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        grid.innerHTML = servicesOptions.map(service => `
            <div class="service-checkbox">
                <input type="checkbox" id="service-${service.replace(/\s+/g, '-').toLowerCase()}" 
                       value="${service}" onchange="listBusinessManager.toggleService('${service}')">
                <label for="service-${service.replace(/\s+/g, '-').toLowerCase()}">${service}</label>
            </div>
        `).join('');
    }

    toggleService(service) {
        const index = this.selectedServices.indexOf(service);
        if (index > -1) {
            this.selectedServices.splice(index, 1);
        } else {
            this.selectedServices.push(service);
        }
    }

    updatePaymentSummary() {
        const selectedPlanData = pricingPlans.find(plan => plan.name === this.selectedPlan);
        const planNameEl = document.getElementById('selectedPlanName');
        const planPriceEl = document.getElementById('selectedPlanPrice');

        if (planNameEl && selectedPlanData) {
            planNameEl.textContent = selectedPlanData.name;
        }

        if (planPriceEl && selectedPlanData) {
            planPriceEl.textContent = `$${selectedPlanData.price}/month`;
        }
    }

    async handleBusinessSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitApplication');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Add selected plan and services
        data.selectedPlan = this.selectedPlan;
        data.selectedServices = this.selectedServices;
        
        try {
            // Validate required fields
            this.validateBusinessForm(data);
            
            // Simulate API call
            await this.simulateBusinessSubmission(data);
            
            // Show success message and redirect
            alert('Thank you! Your business application has been submitted successfully. You will receive a confirmation email shortly and our team will review your application within 24 hours.');
            
            // In a real app, this would redirect to a success page or payment processor
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            // Show error message
            alert(`Error: ${error.message}`);
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
        }
    }

    validateBusinessForm(data) {
        const requiredFields = [
            'businessName',
            'contactPerson',
            'email',
            'phone',
            'businessType',
            'city',
            'state',
            'description',
            'yearsInBusiness',
            'teamSize'
        ];

        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                throw new Error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
            }
        }

        if (this.selectedServices.length === 0) {
            throw new Error('Please select at least one service that you offer.');
        }

        if (!data.acceptTerms) {
            throw new Error('Please accept the Terms and Conditions to continue.');
        }

        // Validate email format
        if (!utils.isValidEmail(data.email)) {
            throw new Error('Please enter a valid email address.');
        }
    }

    async simulateBusinessSubmission(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Log form data
        console.log('Business application submitted:', data);
        
        // Simulate success
        return Promise.resolve();
    }
}

// Global variable to access the manager from HTML
let listBusinessManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pricingGrid')) {
        listBusinessManager = new ListBusinessManager();
    }
});
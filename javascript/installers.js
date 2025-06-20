// Sample installers data
const installersData = [
    {
        id: 1,
        name: "Elite Solar Installations",
        logo: "fas fa-tools",
        region: "West Coast",
        cities: ["Los Angeles", "San Francisco", "San Diego"],
        rating: 4.9,
        reviews: 187,
        experience: "12+ years",
        services: ["Residential Installation", "Commercial Projects", "Maintenance", "System Design"],
        certifications: ["NABCEP Certified", "Electrical Contractor", "OSHA Certified"],
        tier: "Verified",
        description: "Premium solar installation company with extensive experience in complex projects.",
        phone: "+1 (555) 456-7890",
        email: "info@elitesolar.com",
        completedProjects: 500,
        state: "west"
    },
    {
        id: 2,
        name: "PowerTech Installers",
        logo: "fas fa-wrench",
        region: "Midwest",
        cities: ["Chicago", "Detroit", "Milwaukee"],
        rating: 4.7,
        reviews: 143,
        experience: "8+ years",
        services: ["Grid-Tie Systems", "Battery Backup", "Solar Water Heating", "Energy Audits"],
        certifications: ["NABCEP Certified", "Licensed Electrician"],
        tier: "Featured",
        description: "Reliable installation services with focus on quality and customer satisfaction.",
        phone: "+1 (555) 789-0123",
        email: "contact@powertech.com",
        completedProjects: 350,
        state: "midwest"
    },
    {
        id: 3,
        name: "Coastal Solar Solutions",
        logo: "fas fa-sun",
        region: "East Coast",
        cities: ["Miami", "Tampa", "Jacksonville"],
        rating: 4.8,
        reviews: 92,
        experience: "6+ years",
        services: ["Residential Solar", "Off-Grid Solutions", "Pool Solar Heating", "Inverter Installation"],
        certifications: ["NABCEP Certified", "Electrical Contractor"],
        tier: "Standard",
        description: "Coastal region specialists with expertise in marine environment installations.",
        phone: "+1 (555) 234-5678",
        email: "hello@coastalsolar.com",
        completedProjects: 280,
        state: "east"
    },
    {
        id: 4,
        name: "Green Energy Installers",
        logo: "fas fa-leaf",
        region: "Southwest",
        cities: ["Phoenix", "Tucson", "Albuquerque"],
        rating: 4.6,
        reviews: 76,
        experience: "10+ years",
        services: ["Commercial Solar", "Industrial Projects", "Maintenance Contracts", "System Monitoring"],
        certifications: ["NABCEP Certified", "Licensed Contractor", "OSHA Certified"],
        tier: "Verified",
        description: "Industrial and commercial solar specialists with proven track record.",
        phone: "+1 (555) 567-8901",
        email: "info@greenenergy.com",
        completedProjects: 420,
        state: "southwest"
    },
    {
        id: 5,
        name: "Mountain Solar Co",
        logo: "fas fa-mountain",
        region: "Mountain States",
        cities: ["Denver", "Salt Lake City", "Boise"],
        rating: 4.5,
        reviews: 134,
        experience: "9+ years",
        services: ["Residential Solar", "Snow Load Systems", "High Altitude Installation"],
        certifications: ["NABCEP Certified", "Mountain Safety Certified"],
        tier: "Featured",
        description: "Specialized in high-altitude and extreme weather solar installations.",
        phone: "+1 (555) 678-9012",
        email: "info@mountainsolar.com",
        completedProjects: 290,
        state: "west"
    },
    {
        id: 6,
        name: "Urban Solar Solutions",
        logo: "fas fa-city",
        region: "East Coast",
        cities: ["New York", "Boston", "Philadelphia"],
        rating: 4.4,
        reviews: 98,
        experience: "7+ years",
        services: ["Urban Installation", "Rooftop Systems", "Building Integration"],
        certifications: ["NABCEP Certified", "NYC Licensed"],
        tier: "Standard",
        description: "Urban solar specialists with experience in complex city installations.",
        phone: "+1 (555) 789-1234",
        email: "contact@urbansolar.com",
        completedProjects: 245,
        state: "east"
    }
];

class InstallersManager {
    constructor() {
        this.installers = installersData;
        this.filteredInstallers = [...this.installers];
        this.init();
    }

    init() {
        this.renderInstallers();
        this.setupEventListeners();
        this.setupModal();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInstallers');
        const regionFilter = document.getElementById('regionFilter');
        const tierFilter = document.getElementById('tierFilter');
        const applyFiltersBtn = document.getElementById('applyInstallersFilters');
        const requestQuoteBtn = document.getElementById('requestQuoteBtn');

        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce(() => this.filterInstallers(), 300));
        }

        if (regionFilter) {
            regionFilter.addEventListener('change', () => this.filterInstallers());
        }

        if (tierFilter) {
            tierFilter.addEventListener('change', () => this.filterInstallers());
        }

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.filterInstallers());
        }

        if (requestQuoteBtn) {
            requestQuoteBtn.addEventListener('click', () => this.openQuoteModal());
        }
    }

    setupModal() {
        const modal = document.getElementById('quoteModal');
        const closeBtn = document.getElementById('closeQuoteModal');
        const cancelBtn = document.getElementById('cancelQuote');
        const quoteForm = document.getElementById('quoteForm');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeQuoteModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeQuoteModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeQuoteModal();
                }
            });
        }

        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => this.handleQuoteSubmit(e));
        }
    }

    openQuoteModal() {
        const modal = document.getElementById('quoteModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeQuoteModal() {
        const modal = document.getElementById('quoteModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    async handleQuoteSubmit(e) {
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
            await this.simulateQuoteSubmission(data);
            
            // Show success message
            alert('Thank you! Your quote request has been submitted. Our certified installers will contact you within 24 hours.');
            e.target.reset();
            this.closeQuoteModal();
            
        } catch (error) {
            // Show error message
            alert('Sorry, there was an error submitting your quote request. Please try again.');
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
        }
    }

    async simulateQuoteSubmission(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data
        console.log('Quote request submitted:', data);
        
        // Simulate success
        return Promise.resolve();
    }

    filterInstallers() {
        const searchTerm = document.getElementById('searchInstallers')?.value.toLowerCase() || '';
        const regionFilter = document.getElementById('regionFilter')?.value || '';
        const tierFilter = document.getElementById('tierFilter')?.value || '';

        this.filteredInstallers = this.installers.filter(installer => {
            const matchesSearch = installer.name.toLowerCase().includes(searchTerm) ||
                                installer.services.some(service => service.toLowerCase().includes(searchTerm)) ||
                                installer.description.toLowerCase().includes(searchTerm);
            
            const matchesRegion = !regionFilter || installer.state === regionFilter;
            const matchesTier = !tierFilter || installer.tier.toLowerCase() === tierFilter;

            return matchesSearch && matchesRegion && matchesTier;
        });

        this.renderInstallers();
    }

    renderInstallers() {
        const grid = document.getElementById('installersGrid');
        const noResults = document.getElementById('noInstallersResults');

        if (!grid) return;

        if (this.filteredInstallers.length === 0) {
            grid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        if (noResults) noResults.style.display = 'none';

        grid.innerHTML = this.filteredInstallers.map(installer => this.createInstallerCard(installer)).join('');
    }

    createInstallerCard(installer) {
        return `
            <div class="installer-card">
                <div class="installer-header">
                    <div class="installer-info">
                        <div class="installer-logo">
                            <i class="${installer.logo}"></i>
                        </div>
                        <div class="installer-details">
                            <h3>${installer.name}</h3>
                            <div class="installer-location">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${installer.region}</span>
                            </div>
                        </div>
                    </div>
                    <div class="tier-badge ${installer.tier.toLowerCase()}">${installer.tier}</div>
                </div>

                <div class="rating">
                    <div class="stars">
                        ${utils.generateStars(installer.rating)}
                    </div>
                    <span class="rating-text">${installer.rating}</span>
                    <span class="rating-count">(${installer.reviews})</span>
                    <div class="experience">
                        <i class="fas fa-calendar"></i>
                        <span>${installer.experience}</span>
                    </div>
                </div>

                <p class="installer-description">${installer.description}</p>

                <div class="services-section">
                    <h4>Service Areas:</h4>
                    <div class="services-tags">
                        ${installer.cities.slice(0, 3).map(city => `<span class="service-tag">${city}</span>`).join('')}
                        ${installer.cities.length > 3 ? `<span class="service-tag">+${installer.cities.length - 3} more</span>` : ''}
                    </div>
                </div>

                <div class="services-section">
                    <h4>Services:</h4>
                    <div class="services-tags">
                        ${installer.services.slice(0, 3).map(service => `<span class="service-tag">${service}</span>`).join('')}
                        ${installer.services.length > 3 ? `<span class="service-tag">+${installer.services.length - 3} more</span>` : ''}
                    </div>
                </div>

                <div class="certifications-section">
                    <h4>Certifications:</h4>
                    <div class="certifications-list">
                        ${installer.certifications.map(cert => `
                            <div class="certification-item">
                                <i class="fas fa-award"></i>
                                ${cert}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="projects-info">
                    <span>Completed Projects: <strong>${installer.completedProjects}+</strong></span>
                </div>

                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${installer.phone}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${installer.email}</span>
                    </div>
                </div>

                <div class="installer-actions">
                    <button class="btn btn-primary" onclick="viewInstallerProfile(${installer.id})">
                        View Profile
                    </button>
                    <button class="btn btn-outline" onclick="getInstallerQuote(${installer.id})">
                        Get Quote
                    </button>
                </div>
            </div>
        `;
    }
}

// Global functions for installer actions
function viewInstallerProfile(installerId) {
    const installer = installersData.find(i => i.id === installerId);
    if (installer) {
        alert(`Viewing profile for ${installer.name}\n\nThis would open a detailed installer profile page with portfolio, reviews, and more information.`);
        // In a real app, this would navigate to a detailed installer profile page
    }
}

function getInstallerQuote(installerId) {
    const installer = installersData.find(i => i.id === installerId);
    if (installer) {
        alert(`Getting quote from ${installer.name}\n\nThis would open a quote form specifically for this installer.`);
        // In a real app, this would open a quote form for the specific installer
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('installersGrid')) {
        new InstallersManager();
    }
});
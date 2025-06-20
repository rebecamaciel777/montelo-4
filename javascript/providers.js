// Sample providers data
const providersData = [
    {
        id: 1,
        name: "SunPower Solutions",
        logo: "fas fa-sun",
        location: "Los Angeles, CA",
        rating: 4.8,
        reviews: 124,
        services: ["Residential Solar", "Commercial Solar", "Battery Storage"],
        tier: "Elite",
        description: "Leading solar provider with 15+ years of experience in sustainable energy solutions.",
        phone: "+1 (555) 123-4567",
        email: "info@sunpowersolutions.com",
        state: "california"
    },
    {
        id: 2,
        name: "Green Energy Co",
        logo: "fas fa-leaf",
        location: "Austin, TX",
        rating: 4.6,
        reviews: 89,
        services: ["Solar Panels", "Inverters", "Maintenance"],
        tier: "Premium",
        description: "Affordable solar solutions for homes and businesses across Texas.",
        phone: "+1 (555) 987-6543",
        email: "contact@greenenergy.com",
        state: "texas"
    },
    {
        id: 3,
        name: "Solar Innovations",
        logo: "fas fa-bolt",
        location: "Miami, FL",
        rating: 4.7,
        reviews: 156,
        services: ["Grid-Tie Systems", "Off-Grid Solutions", "Solar Heating"],
        tier: "Standard",
        description: "Innovative solar technology solutions with cutting-edge equipment.",
        phone: "+1 (555) 555-7890",
        email: "hello@solarinnovations.com",
        state: "florida"
    },
    {
        id: 4,
        name: "Eco Solar Systems",
        logo: "fas fa-seedling",
        location: "Phoenix, AZ",
        rating: 4.5,
        reviews: 67,
        services: ["Residential Solar", "Solar Water Heating", "Energy Audits"],
        tier: "Premium",
        description: "Eco-friendly solar solutions with a focus on environmental sustainability.",
        phone: "+1 (555) 234-5678",
        email: "info@ecosolar.com",
        state: "arizona"
    },
    {
        id: 5,
        name: "Bright Future Solar",
        logo: "fas fa-solar-panel",
        location: "New York, NY",
        rating: 4.9,
        reviews: 203,
        services: ["Commercial Solar", "Industrial Projects", "System Design"],
        tier: "Elite",
        description: "Premium solar installations for commercial and industrial clients.",
        phone: "+1 (555) 345-6789",
        email: "contact@brightfuturesolar.com",
        state: "new-york"
    },
    {
        id: 6,
        name: "Desert Sun Energy",
        logo: "fas fa-sun",
        location: "Las Vegas, NV",
        rating: 4.4,
        reviews: 78,
        services: ["Residential Solar", "Battery Backup", "Monitoring"],
        tier: "Standard",
        description: "Reliable solar energy solutions for desert climates.",
        phone: "+1 (555) 456-7890",
        email: "info@desertsun.com",
        state: "california"
    }
];

class ProvidersManager {
    constructor() {
        this.providers = providersData;
        this.filteredProviders = [...this.providers];
        this.init();
    }

    init() {
        this.renderProviders();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchProviders');
        const locationFilter = document.getElementById('locationFilter');
        const tierFilter = document.getElementById('tierFilter');
        const applyFiltersBtn = document.getElementById('applyFilters');

        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce(() => this.filterProviders(), 300));
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', () => this.filterProviders());
        }

        if (tierFilter) {
            tierFilter.addEventListener('change', () => this.filterProviders());
        }

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.filterProviders());
        }
    }

    filterProviders() {
        const searchTerm = document.getElementById('searchProviders')?.value.toLowerCase() || '';
        const locationFilter = document.getElementById('locationFilter')?.value || '';
        const tierFilter = document.getElementById('tierFilter')?.value || '';

        this.filteredProviders = this.providers.filter(provider => {
            const matchesSearch = provider.name.toLowerCase().includes(searchTerm) ||
                                provider.services.some(service => service.toLowerCase().includes(searchTerm)) ||
                                provider.description.toLowerCase().includes(searchTerm);
            
            const matchesLocation = !locationFilter || provider.state === locationFilter;
            const matchesTier = !tierFilter || provider.tier.toLowerCase() === tierFilter;

            return matchesSearch && matchesLocation && matchesTier;
        });

        this.renderProviders();
    }

    renderProviders() {
        const grid = document.getElementById('providersGrid');
        const noResults = document.getElementById('noResults');

        if (!grid) return;

        if (this.filteredProviders.length === 0) {
            grid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        if (noResults) noResults.style.display = 'none';

        grid.innerHTML = this.filteredProviders.map(provider => this.createProviderCard(provider)).join('');
    }

    createProviderCard(provider) {
        return `
            <div class="provider-card">
                <div class="provider-header">
                    <div class="provider-info">
                        <div class="provider-logo">
                            <i class="${provider.logo}"></i>
                        </div>
                        <div class="provider-details">
                            <h3>${provider.name}</h3>
                            <div class="provider-location">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${provider.location}</span>
                            </div>
                        </div>
                    </div>
                    <div class="tier-badge ${provider.tier.toLowerCase()}">${provider.tier}</div>
                </div>

                <div class="rating">
                    <div class="stars">
                        ${utils.generateStars(provider.rating)}
                    </div>
                    <span class="rating-text">${provider.rating}</span>
                    <span class="rating-count">(${provider.reviews} reviews)</span>
                </div>

                <p class="provider-description">${provider.description}</p>

                <div class="services-section">
                    <h4>Services:</h4>
                    <div class="services-tags">
                        ${provider.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                    </div>
                </div>

                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${provider.phone}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${provider.email}</span>
                    </div>
                </div>

                <div class="provider-actions">
                    <button class="btn btn-primary" onclick="viewProviderDetails(${provider.id})">
                        View Details
                    </button>
                    <button class="btn btn-outline" onclick="contactProvider(${provider.id})">
                        Contact
                    </button>
                </div>
            </div>
        `;
    }
}

// Global functions for provider actions
function viewProviderDetails(providerId) {
    const provider = providersData.find(p => p.id === providerId);
    if (provider) {
        alert(`Viewing details for ${provider.name}\n\nThis would open a detailed provider profile page.`);
        // In a real app, this would navigate to a detailed provider page
    }
}

function contactProvider(providerId) {
    const provider = providersData.find(p => p.id === providerId);
    if (provider) {
        alert(`Contacting ${provider.name}\n\nThis would open a contact form or messaging interface.`);
        // In a real app, this would open a contact form or messaging interface
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('providersGrid')) {
        new ProvidersManager();
    }
});
/**
 * Main Application Entry Point for ContractFlow
 * Initializes the application and registers routes
 */

// Register routes immediately
registerRoutes();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading state
    const loadingElement = document.getElementById('loading');
    loadingElement.classList.add('hidden');
    
    // Apply dark mode if saved in state
    if (window.state && window.state.getState('darkMode')) {
        document.body.classList.add('dark-mode');
    }
    
    // Initialize body click handler for dropdowns
    document.body.addEventListener('click', (e) => {
        // Close any open dropdowns if clicking outside
        const dropdowns = document.querySelectorAll('.dropdown.open');
        if (dropdowns.length > 0) {
            const isClickInDropdown = Array.from(dropdowns).some(dropdown => 
                dropdown.contains(e.target) || 
                e.target.classList.contains('dropdown-toggle'));
                
            if (!isClickInDropdown) {
                dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
            }
        }
    });
});

/**
 * Register application routes
 */
function registerRoutes() {
    console.log('Registering routes...');
    
    // Auth routes
    window.router.register('/login', async () => {
        console.log('Executing login route handler');
        await loadComponent('AuthForm');
        
        const loginForm = window.components.AuthForm.renderLogin();
        console.log('Login form rendered from route handler');
        
        // Asegurarnos de que los eventos se configuran después de montar el componente
        setTimeout(() => {
            console.log('Setting up events from route handler');
            window.components.AuthForm.setupEvents();
        }, 50);
        
        return loginForm;
    });
    
    window.router.register('/register', async () => {
        await loadComponent('AuthForm');
        return window.components.AuthForm.renderRegister();
    });
    
    // Dashboard route
    window.router.register('/', async () => {
        if (!window.auth.isAuthenticated()) {
            window.router.navigate('/login');
            return;
        }
        
        await loadComponent('Layout');
        await loadComponent('Dashboard');
        
        const layout = window.components.Layout.render();
        const dashboardContent = window.components.Dashboard.render();
        
        // Replace content area with dashboard
        const contentArea = layout.querySelector('#content-area');
        contentArea.innerHTML = '';
        contentArea.appendChild(dashboardContent);
        
        return layout;
    }, { requiresAuth: true, requiredPermission: 'view_dashboard' });
    
    // Alias for dashboard
    window.router.register('/dashboard', () => window.router.navigate('/'), { requiresAuth: true });
    
    // Contracts route
    window.router.register('/contracts', async () => {
        if (!window.auth.isAuthenticated()) {
            window.router.navigate('/login');
            return;
        }
        
        await loadComponent('Layout');
        await loadComponent('ContractList');
        
        const layout = window.components.Layout.render();
        const contractsContent = window.components.ContractList.render();
        
        // Replace content area with contracts list
        const contentArea = layout.querySelector('#content-area');
        contentArea.innerHTML = '';
        contentArea.appendChild(contractsContent);
        
        return layout;
    }, { requiresAuth: true, requiredPermission: 'view_contracts' });
    
    // Contract detail route
    window.router.register('/contracts/:id', async (params) => {
        if (!window.auth.isAuthenticated()) {
            window.router.navigate('/login');
            return;
        }
        
        await loadComponent('Layout');
        await loadComponent('ContractDetail');
        
        const layout = window.components.Layout.render();
        const contractContent = window.components.ContractDetail.render(params.id);
        
        // Replace content area with contract detail
        const contentArea = layout.querySelector('#content-area');
        contentArea.innerHTML = '';
        contentArea.appendChild(contractContent);
        
        return layout;
    }, { requiresAuth: true, requiredPermission: 'view_contracts' });
    
    // Templates route
    window.router.register('/templates', async () => {
        if (!window.auth.isAuthenticated()) {
            window.router.navigate('/login');
            return;
        }
        
        await loadComponent('Layout');
        await loadComponent('TemplateList');
        
        const layout = window.components.Layout.render();
        const templatesContent = window.components.TemplateList.render();
        
        // Replace content area with templates list
        const contentArea = layout.querySelector('#content-area');
        contentArea.innerHTML = '';
        contentArea.appendChild(templatesContent);
        
        return layout;
    }, { requiresAuth: true, requiredPermission: 'view_templates' });
    
    // Organization route
    window.router.register('/organization', async () => {
        if (!window.auth.isAuthenticated()) {
            window.router.navigate('/login');
            return;
        }
        
        await loadComponent('Layout');
        await loadComponent('Organization');
        
        const layout = window.components.Layout.render();
        const organizationContent = window.components.Organization.render();
        
        // Replace content area with organization details
        const contentArea = layout.querySelector('#content-area');
        contentArea.innerHTML = '';
        contentArea.appendChild(organizationContent);
        
        return layout;
    }, { requiresAuth: true, requiredPermission: 'view_organization' });
    
    // User profile route
    window.router.register('/profile', async () => {
        if (!window.auth.isAuthenticated()) {
            window.router.navigate('/login');
            return;
        }
        
        await loadComponent('Layout');
        await loadComponent('UserProfile');
        
        const layout = window.components.Layout.render();
        const profileContent = window.components.UserProfile.render();
        
        // Replace content area with user profile
        const contentArea = layout.querySelector('#content-area');
        contentArea.innerHTML = '';
        contentArea.appendChild(profileContent);
        
        return layout;
    }, { requiresAuth: true, requiredPermission: 'view_profile' });
    
    // Logout route
    window.router.register('/logout', () => {
        window.auth.logout();
        window.router.navigate('/login');
        dom.showToast('You have been logged out', 'info');
    });
    
    // 404 Not Found handler
    window.router.setNotFoundHandler(() => {
        return `
            <div class="not-found-page">
                <div class="container text-center p-5">
                    <h1 class="mb-4">404 - Page Not Found</h1>
                    <p class="mb-4">The page you are looking for does not exist or has been moved.</p>
                    <a href="#/" class="btn btn-primary">Go to Dashboard</a>
                </div>
            </div>
        `;
    });
    
    console.log('Routes registered successfully:', window.router.routes.map(r => r.path));
}

/**
 * Load a component dynamically
 * @param {string} componentName - Name of the component to load
 * @returns {Promise} Promise that resolves when component is loaded
 */
async function loadComponent(componentName) {
    // Initialize components container if it doesn't exist
    if (!window.components) {
        window.components = {};
    }
    
    // If component is already loaded, return immediately
    if (window.components[componentName]) {
        return Promise.resolve();
    }
    
    try {
        // Load the component script
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `js/components/${componentName}.js`;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load component: ${componentName}`));
            document.head.appendChild(script);
        });
    } catch (error) {
        console.error(`Error loading component ${componentName}:`, error);
        throw error;
    }
} 
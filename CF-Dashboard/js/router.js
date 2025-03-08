/**
 * Client-side Router for ContractFlow
 * Handles hash-based routing without page reloads
 */

class Router {
    constructor() {
        this.routes = [];
        this.isInitialized = false;
        this.notFoundHandler = () => {
            console.error('Route not found');
            return '<div class="text-center p-5"><h2>Page Not Found</h2><p>The page you are looking for does not exist.</p><a href="#/" class="btn btn-primary">Go to Dashboard</a></div>';
        };
        this.currentRoute = null;
        this.params = {};
        this.query = {};
        
        // Start listening for hash changes
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        
        // We'll delay the initial route handling until after DOM content loaded
        // AND after routes have been registered
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, checking if routes are registered...');
            // If there are routes registered, handle the initial route
            if (this.routes.length > 0) {
                console.log('Routes are already registered, handling initial route');
                this.isInitialized = true;
                this.handleRouteChange();
            } else {
                console.log('No routes registered yet, will try again in 500ms');
                // If routes are not yet registered, try again in a moment
                setTimeout(() => {
                    console.log('Checking again for routes...');
                    if (this.routes.length > 0) {
                        console.log('Routes found, handling initial route');
                        this.isInitialized = true;
                        this.handleRouteChange();
                    } else {
                        console.error('No routes registered after timeout, navigation may not work correctly');
                    }
                }, 500);
            }
        });
    }
    
    /**
     * Register a route
     * @param {string} path - Route path with optional params like /route/:param
     * @param {Function} handler - Route handler function
     * @param {Object} options - Additional route options (middleware, etc.)
     */
    register(path, handler, options = {}) {
        // Convert path pattern to regex for matching
        const pattern = this.pathToRegex(path);
        
        this.routes.push({
            path,
            pattern,
            handler,
            options
        });
        
        return this;
    }
    
    /**
     * Set 404 Not Found handler
     * @param {Function} handler - Not found handler function
     */
    setNotFoundHandler(handler) {
        this.notFoundHandler = handler;
        return this;
    }
    
    /**
     * Convert path pattern to regex for route matching
     * @param {string} path - Route path pattern
     * @returns {RegExp} Regular expression for matching routes
     */
    pathToRegex(path) {
        // Replace params with regex groups
        const patternString = path
            .replace(/:\w+/g, '([^/]+)')
            .replace(/\//g, '\\/')
            .replace(/\*$/, '.*');
        
        return new RegExp(`^${patternString}$`);
    }
    
    /**
     * Extract params from route path
     * @param {string} path - Route path pattern
     * @param {string} url - Current URL
     * @returns {Object} Extracted params
     */
    extractParams(path, url) {
        const params = {};
        const paramNames = (path.match(/:\w+/g) || []).map(name => name.substring(1));
        const paramValues = url.match(this.pathToRegex(path));
        
        if (paramValues) {
            // Skip the first element (full match)
            paramValues.slice(1).forEach((value, index) => {
                params[paramNames[index]] = decodeURIComponent(value);
            });
        }
        
        return params;
    }
    
    /**
     * Extract query params from URL
     * @param {string} url - Current URL with query string
     * @returns {Object} Extracted query params
     */
    extractQueryParams(url) {
        const query = {};
        const queryStart = url.indexOf('?');
        
        if (queryStart !== -1) {
            const queryString = url.substring(queryStart + 1);
            const pairs = queryString.split('&');
            
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                query[decodeURIComponent(key)] = decodeURIComponent(value || '');
            });
        }
        
        return query;
    }
    
    /**
     * Handle route change
     */
    async handleRouteChange() {
        // Ensure there are routes registered
        if (this.routes.length === 0) {
            console.error('No routes registered yet. Navigation will not work.');
            return;
        }

        // Get current hash without the # symbol
        let url = window.location.hash.substring(1) || '/';
        console.log('Current URL:', url);
        
        // Extract query string
        const queryIndex = url.indexOf('?');
        let queryString = '';
        
        if (queryIndex !== -1) {
            queryString = url.substring(queryIndex);
            url = url.substring(0, queryIndex);
        }
        
        // Find matching route
        const route = this.routes.find(route => url.match(route.pattern));
        
        // If no route matches, use not found handler
        if (!route) {
            console.error(`No route found matching: ${url}`);
            console.log('Available routes:', this.routes.map(r => r.path));
            this.mountView(this.notFoundHandler());
            this.currentRoute = null;
            this.params = {};
            this.query = {};
            return;
        }
        
        console.log('Matched route:', route.path);
        
        // Extract route params
        this.params = this.extractParams(route.path, url);
        
        // Extract query params
        this.query = this.extractQueryParams(queryString);
        
        // Store current route
        this.currentRoute = route;
        
        // Check if the route requires authentication
        if (route.options.requiresAuth) {
            console.log('Route requires authentication, checking auth status...');
            if (!window.auth || !window.auth.isAuthenticated()) {
                console.log('Not authenticated, redirecting to login');
                
                // Store the current URL as the redirect destination
                const redirect = url;
                console.log('Setting redirect destination:', redirect);
                
                // Navigate to login with redirect parameter
                this.navigate('/login', { redirect: redirect });
                return;
            }
            console.log('Authentication check passed');
        }
        
        // Check permissions if specified
        if (route.options.requiredPermission) {
            console.log(`Route requires permission: ${route.options.requiredPermission}`);
            if (!window.state || !window.state.hasPermission(route.options.requiredPermission)) {
                // User doesn't have permission
                console.error(`Permission denied: ${route.options.requiredPermission}`);
                this.mountView('<div class="text-center p-5"><h2>Access Denied</h2><p>You do not have permission to access this page.</p><a href="#/" class="btn btn-primary">Go to Dashboard</a></div>');
                return;
            }
            console.log('Permission check passed');
        }
        
        try {
            // Show loading indicator
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.classList.remove('hidden');
            }
            
            // Execute route handler and get view content
            console.log('Executing route handler...');
            const viewContent = await route.handler(this.params, this.query);
            
            // Mount the view in the app container
            this.mountView(viewContent);
            console.log('View mounted successfully');
        } catch (error) {
            console.error('Error handling route:', error);
            this.mountView('<div class="text-center p-5"><h2>Error</h2><p>An error occurred while loading this page.</p><pre>' + error.message + '</pre><a href="#/" class="btn btn-primary">Go to Dashboard</a></div>');
        } finally {
            // Hide loading indicator
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.classList.add('hidden');
            }
        }
    }
    
    /**
     * Mount view content in the app container
     * @param {string|HTMLElement} content - View content
     */
    mountView(content) {
        const appContainer = document.getElementById('app');
        
        // Keep the loading element but clear other content
        const loadingElement = document.getElementById('loading');
        appContainer.innerHTML = '';
        appContainer.appendChild(loadingElement);
        
        if (content instanceof HTMLElement) {
            appContainer.appendChild(content);
        } else {
            // Create a wrapper for the HTML content
            const viewWrapper = document.createElement('div');
            viewWrapper.classList.add('view-wrapper');
            viewWrapper.innerHTML = content;
            appContainer.appendChild(viewWrapper);
        }
    }
    
    /**
     * Programmatically navigate to a route
     * @param {string} path - Route path
     * @param {Object} query - Query parameters
     */
    navigate(path, query = {}) {
        console.log('Navigating to:', path, 'with query:', query);
        
        try {
            let url = path;
            
            // Add query params if any
            if (Object.keys(query).length > 0) {
                const queryString = Object.entries(query)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join('&');
                
                url += `?${queryString}`;
            }
            
            console.log('Final URL:', url);
            
            // Update location hash
            window.location.hash = url;
            
            console.log('Navigation complete');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }
    
    /**
     * Get current route parameters
     * @returns {Object} Route parameters
     */
    getParams() {
        return { ...this.params };
    }
    
    /**
     * Get current query parameters
     * @returns {Object} Query parameters
     */
    getQuery() {
        return { ...this.query };
    }
    
    /**
     * Get current route path
     * @returns {string|null} Current route path
     */
    getCurrentPath() {
        return this.currentRoute ? this.currentRoute.path : null;
    }
}

// Create and export router instance
const router = new Router();
window.router = router;

// Register routes
window.router.register('/contracts/new', async () => {
    if (!window.auth.isAuthenticated()) {
        window.router.navigate('/login');
        return;
    }
    
    await loadComponent('Layout');
    await loadComponent('ContractCreate');
    
    const layout = window.components.Layout.render();
    const createContent = window.components.ContractCreate.render();
    
    // Replace content area with contract creation form
    const contentArea = layout.querySelector('#content-area');
    contentArea.innerHTML = '';
    contentArea.appendChild(createContent);
    
    return layout;
}, { requiresAuth: true });

// Contract detail route
window.router.register('/contracts/:id', async (params) => {
    if (!window.auth.isAuthenticated()) {
        window.router.navigate('/login');
        return;
    }
    
    await loadComponent('Layout');
    await loadComponent('ContractDetail');
    
    const layout = window.components.Layout.render();
    const detailContent = window.components.ContractDetail.render(params.id);
    
    // Replace content area with contract detail view
    const contentArea = layout.querySelector('#content-area');
    contentArea.innerHTML = '';
    contentArea.appendChild(detailContent);
    
    return layout;
}, { requiresAuth: true });

// Template detail route
window.router.register('/templates/:id', async (params) => {
    if (!window.auth.isAuthenticated()) {
        window.router.navigate('/login');
        return;
    }
    
    await loadComponent('Layout');
    await loadComponent('TemplateDetail');
    
    const layout = window.components.Layout.render();
    const detailContent = window.components.TemplateDetail.render(params.id);
    
    // Replace content area with template detail view
    const contentArea = layout.querySelector('#content-area');
    contentArea.innerHTML = '';
    contentArea.appendChild(detailContent);
    
    return layout;
}, { requiresAuth: true });

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
    
    // Replace content area with user profile view
    const contentArea = layout.querySelector('#content-area');
    contentArea.innerHTML = '';
    contentArea.appendChild(profileContent);
    
    return layout;
}, { requiresAuth: true }); 
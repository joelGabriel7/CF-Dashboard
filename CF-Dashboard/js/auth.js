/**
 * Authentication Module for ContractFlow
 * Handles user login, registration, and session management
 */

class AuthManager {
    constructor() {
        this.tokenKey = 'contractflow_auth_token';
        this.tokenExpiry = 'contractflow_auth_expiry';
        
        // Initialize from localStorage
        this.token = localStorage.getItem(this.tokenKey) || null;
        this.expiry = localStorage.getItem(this.tokenExpiry) || null;
        
        // Check token validity on init
        this.checkTokenValidity();
    }
    
    /**
     * Check if the current auth token is valid
     * @returns {boolean} True if token is valid
     */
    checkTokenValidity() {
        console.log('Checking token validity...');
        console.log('Token exists:', Boolean(this.token));
        console.log('Expiry exists:', Boolean(this.expiry));
        
        if (!this.token || !this.expiry) {
            console.log('No token or expiry found');
            return false;
        }
        
        // Check if token has expired
        const now = new Date().getTime();
        const expiryTime = parseInt(this.expiry, 10);
        
        console.log('Current time:', now);
        console.log('Token expiry time:', expiryTime);
        console.log('Time remaining (ms):', expiryTime - now);
        
        if (now > expiryTime) {
            // Token expired, clear it
            console.log('Token has expired, clearing it');
            this.logout();
            return false;
        }
        
        console.log('Token is valid');
        return true;
    }
    
    /**
     * Login user with credentials
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Promise resolving to user data
     */
    login(email, password) {
        console.log('Login attempt with email:', email);
        
        return new Promise((resolve, reject) => {
            // In a real app, this would be an API call
            // For this demo, we'll use mock data
            setTimeout(() => {
                try {
                    // Find user in mock data
                    const user = this.findUserByCredentials(email, password);
                    
                    if (!user) {
                        console.error('User not found with email:', email);
                        reject(new Error('Invalid email or password'));
                        return;
                    }
                    
                    console.log('User found:', user);
                    
                    // Generate a fake token and expiry
                    this.token = this.generateFakeToken();
                    
                    // Set token to expire in 1 day
                    const expiry = new Date();
                    expiry.setDate(expiry.getDate() + 1);
                    this.expiry = expiry.getTime().toString();
                    
                    // Store in localStorage
                    localStorage.setItem(this.tokenKey, this.token);
                    localStorage.setItem(this.tokenExpiry, this.expiry);
                    
                    console.log('Authentication successful, token stored');
                    
                    // Get organization data if user belongs to one
                    if (user.organizationId) {
                        console.log('Getting organization data for ID:', user.organizationId);
                        const organization = window.mockData.getOrganization(user.organizationId);
                        if (organization) {
                            console.log('Setting organization in state:', organization);
                            window.state.setState('organization', organization);
                        } else {
                            console.error('Organization not found for ID:', user.organizationId);
                        }
                    }
                    
                    // Set user in state
                    console.log('Setting current user in state');
                    window.state.setCurrentUser(user);
                    
                    // Check authentication state after login
                    console.log('Authentication state after login:', this.isAuthenticated());
                    
                    resolve(user);
                } catch (err) {
                    console.error('Error during login:', err);
                    reject(err);
                }
            }, 800); // Simulate network delay
        });
    }
    
    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Promise resolving to user data
     */
    register(userData) {
        return new Promise((resolve, reject) => {
            // In a real app, this would be an API call
            setTimeout(() => {
                try {
                    // Check if email already exists
                    const users = window.mockData.getUsers();
                    const existingUser = users.find(user => user.email === userData.email);
                    
                    if (existingUser) {
                        reject(new Error('Email already registered'));
                        return;
                    }
                    
                    // Create new user (in a real app this would be done on the server)
                    const newUser = {
                        id: Math.floor(Math.random() * 1000) + 10, // Random ID
                        name: userData.name,
                        email: userData.email,
                        role: userData.accountType === 'business' ? 'ADMIN' : 'EDITOR',
                        createdAt: new Date().toISOString(),
                        accountType: userData.accountType,
                        organizationId: userData.accountType === 'business' ? Math.floor(Math.random() * 100) : null
                    };
                    
                    // Add to mock data (in a real app, this would be persisted in the database)
                    window.mockData.addUser(newUser);
                    
                    // Login the new user
                    this.token = this.generateFakeToken();
                    
                    // Set token to expire in 1 day
                    const expiry = new Date();
                    expiry.setDate(expiry.getDate() + 1);
                    this.expiry = expiry.getTime().toString();
                    
                    // Store in localStorage
                    localStorage.setItem(this.tokenKey, this.token);
                    localStorage.setItem(this.tokenExpiry, this.expiry);
                    
                    // Set user in state
                    window.state.setCurrentUser(newUser);
                    
                    resolve(newUser);
                } catch (err) {
                    reject(err);
                }
            }, 1000); // Simulate network delay
        });
    }
    
    /**
     * Logout current user
     */
    logout() {
        // Clear token from storage
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenExpiry);
        
        // Reset token and expiry
        this.token = null;
        this.expiry = null;
        
        // Clear user from state
        window.state.clearState(true);
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean} True if user is authenticated
     */
    isAuthenticated() {
        console.log('Checking authentication status...');
        
        // Check token validity
        const tokenValid = this.checkTokenValidity();
        console.log('Token validity:', tokenValid);
        
        // Check if user exists in state
        const userExists = window.state && window.state.isAuthenticated();
        console.log('User exists in state:', userExists);
        
        // Both conditions must be true for authentication
        const isAuth = tokenValid && userExists;
        console.log('Final authentication status:', isAuth);
        
        return isAuth;
    }
    
    /**
     * Refresh current session
     * @returns {Promise<boolean>} Promise resolving to refresh success
     */
    refreshSession() {
        return new Promise((resolve, reject) => {
            if (!this.isAuthenticated()) {
                reject(new Error('Not authenticated'));
                return;
            }
            
            // In a real app, this would validate the token with the server
            // For this demo, just extend the expiry
            
            // Set token to expire in 1 more day
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 1);
            this.expiry = expiry.getTime().toString();
            
            // Update localStorage
            localStorage.setItem(this.tokenExpiry, this.expiry);
            
            resolve(true);
        });
    }
    
    /**
     * Find user by credentials in mock data
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object|null} User object if found, null otherwise
     */
    findUserByCredentials(email, password) {
        // In a real app, password would be hashed and compared on the server
        // For this demo, we'll just check the email and assume correct password for the demo users
        
        // Default mock users in case mockData is not available
        const defaultMockUsers = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'ADMIN',
                createdAt: '2023-01-01T00:00:00.000Z',
                accountType: 'business',
                organizationId: 1,
                profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            {
                id: 2,
                name: 'Editor User',
                email: 'editor@example.com',
                role: 'EDITOR',
                createdAt: '2023-01-02T00:00:00.000Z',
                accountType: 'personal',
                organizationId: 1,
                profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            {
                id: 3,
                name: 'Viewer User',
                email: 'viewer@example.com',
                role: 'VIEWER',
                createdAt: '2023-01-03T00:00:00.000Z',
                accountType: 'personal',
                organizationId: 1,
                profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
            }
        ];
        
        // Use mockData if available, otherwise use default users
        const mockUsers = window.mockData && window.mockData.getUsers ? 
            window.mockData.getUsers() : defaultMockUsers;
        
        console.log('Available users for login:', mockUsers.map(u => u.email));
        
        // Find user by email
        return mockUsers.find(user => user.email === email) || null;
    }
    
    /**
     * Generate a fake authentication token
     * @returns {string} Fake token
     */
    generateFakeToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return token;
    }
}

// Create and export auth manager instance
const auth = new AuthManager();
window.auth = auth; 
/**
 * State management for the ContractFlow application
 * Manages global state with pub/sub pattern and localStorage persistence
 */

// Create State Management Class
class StateManager {
    constructor() {
        this.state = {};
        this.subscribers = [];
        this.persistedKeys = [
            'currentUser',
            'darkMode',
            'userPreferences'
        ];
        
        // Initialize state from localStorage
        this.loadPersistedState();
    }
    
    /**
     * Initialize default state values
     */
    initializeDefaultState() {
        // Set defaults if they don't exist
        if (!this.state.darkMode) {
            this.state.darkMode = false;
        }
        
        if (!this.state.userPreferences) {
            this.state.userPreferences = {
                notificationsEnabled: true,
                emailNotifications: true,
                contractReminders: true,
                dashboardView: 'list'
            };
        }
        
        // We don't set currentUser - that should only be set on login
    }
    
    /**
     * Set state for a specific key
     * @param {string} key - State key to update
     * @param {*} value - New value or update function
     */
    setState(key, value) {
        const oldValue = this.state[key];
        
        // If value is a function, call it with the current value to get the new value
        if (typeof value === 'function') {
            this.state[key] = value(oldValue);
        } else {
            this.state[key] = value;
        }
        
        // Persist to localStorage if needed
        if (this.persistedKeys.includes(key)) {
            this.persistState();
        }
        
        // Notify subscribers
        this.notifySubscribers(key, oldValue, this.state[key]);
    }
    
    /**
     * Get state for a specific key
     * @param {string} key - State key to retrieve
     * @return {*} State value for the key
     */
    getState(key) {
        return this.state[key];
    }
    
    /**
     * Get a full copy of the current state
     * @return {Object} Complete state object (cloned)
     */
    getFullState() {
        return JSON.parse(JSON.stringify(this.state));
    }
    
    /**
     * Subscribe to state changes
     * @param {Function} callback - Function to call on state change
     * @return {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        
        // Return unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }
    
    /**
     * Notify all subscribers about state change
     * @param {string} key - The key that changed
     * @param {*} oldValue - Previous value
     * @param {*} newValue - New value
     */
    notifySubscribers(key, oldValue, newValue) {
        this.subscribers.forEach(callback => {
            try {
                callback(key, oldValue, newValue, this.state);
            } catch (err) {
                console.error('Error in state subscriber:', err);
            }
        });
    }
    
    /**
     * Persist state to localStorage
     */
    persistState() {
        const persistedState = {};
        
        this.persistedKeys.forEach(key => {
            if (this.state[key] !== undefined) {
                persistedState[key] = this.state[key];
            }
        });
        
        localStorage.setItem('contractflow_state', JSON.stringify(persistedState));
    }
    
    /**
     * Load persisted state from localStorage
     */
    loadPersistedState() {
        try {
            const savedState = localStorage.getItem('contractflow_state');
            
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                
                // Merge saved state with current state
                Object.keys(parsedState).forEach(key => {
                    this.state[key] = parsedState[key];
                });
            }
            
            // Set default values for required state items
            this.initializeDefaultState();
        } catch (err) {
            console.error('Error loading persisted state:', err);
            // Initialize with defaults
            this.initializeDefaultState();
        }
    }
    
    /**
     * Clear all state (for logout)
     * @param {boolean} preservePreferences - Whether to preserve user preferences
     */
    clearState(preservePreferences = true) {
        const preferences = preservePreferences ? this.state.userPreferences : null;
        const darkMode = preservePreferences ? this.state.darkMode : false;
        
        // Reset the state
        this.state = {};
        
        // Restore preferences if needed
        if (preservePreferences) {
            this.state.userPreferences = preferences;
            this.state.darkMode = darkMode;
        } else {
            this.initializeDefaultState();
        }
        
        // Persist the cleared state
        this.persistState();
        
        // Notify subscribers of reset
        this.notifySubscribers('stateReset', null, null, this.state);
    }
    
    /**
     * Set user authentication data
     * @param {Object} userData - User data object
     */
    setCurrentUser(userData) {
        this.setState('currentUser', userData);
        
        // Get contracts for the new user
        if (userData && userData.id) {
            this.loadUserData(userData.id);
        }
    }
    
    /**
     * Load user-specific data 
     * @param {number} userId - User ID to load data for
     */
    loadUserData(userId) {
        console.log('Loading user data for userId:', userId);
        
        // Check if mockData is available
        if (!window.mockData) {
            console.error('mockData is not available!');
            
            // Provide some default data if mockData is not available
            this.setState('contracts', []);
            this.setState('templates', []);
            this.setState('notifications', []);
            return;
        }
        
        // In a real app, this would fetch from an API
        // For this project, we use mock data
        
        try {
            // Get current user
            const user = this.state.currentUser;
            if (!user) {
                console.error('No current user found in state');
                return;
            }

            // Load organization data first if user belongs to one
            if (user.organizationId) {
                console.log('Loading organization data for ID:', user.organizationId);
                const organization = window.mockData.getOrganization(user.organizationId);
                if (organization) {
                    console.log('Setting organization in state:', organization);
                    this.setState('organization', organization);
                } else {
                    console.error('Organization not found for ID:', user.organizationId);
                }
            }
            
            // Load contracts for user
            this.setState('contracts', window.mockData.getContractsForUser(userId));
            
            // Load templates
            this.setState('templates', window.mockData.getTemplates());
            
            // Load notifications
            this.setState('notifications', window.mockData.getNotificationsForUser(userId));
            
            console.log('User data loaded successfully');
            console.log('Current state:', this.state);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        this.setState('darkMode', !this.state.darkMode);
        
        // Apply dark mode to body
        if (this.state.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    /**
     * Check if user is authenticated
     * @return {boolean} True if user is logged in
     */
    isAuthenticated() {
        return Boolean(this.state.currentUser);
    }
    
    /**
     * Check if user has a specific permission
     * @param {string} permission - Permission to check
     * @return {boolean} True if user has permission
     */
    hasPermission(permission) {
        const user = this.state.currentUser;
        
        if (!user) return false;
        
        // Admin has all permissions
        if (user.role === 'ADMIN') return true;
        
        // Permission mapping based on roles
        const rolePermissions = {
            'EDITOR': [
                'view_dashboard',
                'view_contracts',
                'edit_contracts',
                'create_contracts',
                'view_templates',
                'edit_templates',
                'view_profile'
            ],
            'VIEWER': [
                'view_dashboard',
                'view_contracts',
                'view_profile'
            ]
        };
        
        // Check if user's role has the permission
        return rolePermissions[user.role]?.includes(permission) || false;
    }
}

// Create and export state manager instance
const state = new StateManager();
window.state = state; 
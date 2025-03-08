/**
 * Authentication Form Component
 * Handles user login and registration forms
 */

class AuthForm {
    constructor() {
        this.loadStyles();
        this.formState = {
            email: '',
            password: '',
            name: '',
            accountType: 'personal',
            passwordConfirm: '',
        };
        this.errors = {};
        this.isLoading = false;
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/authform.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/authform.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render login form
     * @returns {HTMLElement} The login form element
     */
    renderLogin() {
        console.log('Rendering login form...');
        
        // Crear el formulario como un elemento DOM en lugar de una cadena HTML
        const container = document.createElement('div');
        container.className = 'auth-container';
        
        container.innerHTML = `
            <div class="auth-form-container">
                <div class="auth-header">
                    <h1 class="auth-title">
                        <i class="fas fa-file-contract"></i>
                        ContractFlow
                    </h1>
                    <h2>Sign In to Your Account</h2>
                    <p>Manage your contracts easily and efficiently</p>
                </div>
                
                <form id="login-form" class="auth-form">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <div class="input-group">
                            <span class="input-icon"><i class="fas fa-envelope"></i></span>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Enter your email"
                                value="${this.formState.email}"
                                required
                            >
                        </div>
                        ${this.errors.email ? `<div class="error-message">${this.errors.email}</div>` : ''}
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="input-group">
                            <span class="input-icon"><i class="fas fa-lock"></i></span>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Enter your password"
                                required
                            >
                            <button type="button" class="toggle-password" tabindex="-1">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        ${this.errors.password ? `<div class="error-message">${this.errors.password}</div>` : ''}
                    </div>
                    
                    <div class="form-options">
                        <div class="remember-me">
                            <input type="checkbox" id="remember-me">
                            <label for="remember-me">Remember me</label>
                        </div>
                        <a href="#/forgot-password" class="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block" id="login-button">
                        ${this.isLoading ? '<span class="spinner-border spinner-border-sm"></span> Signing In...' : 'Sign In'}
                    </button>
                    
                    <div class="auth-message">
                        ${this.errors.general ? `<div class="error-message">${this.errors.general}</div>` : ''}
                    </div>
                </form>
                
                <div class="auth-footer">
                    <p>Don't have an account? <a href="#/register">Sign Up</a></p>
                </div>
                
                <div class="test-account-info">
                    <h4>Demo Accounts</h4>
                    <div class="test-accounts">
                        <div class="test-account">
                            <div class="test-role">Admin</div>
                            <div class="test-email">admin@example.com</div>
                        </div>
                        <div class="test-account">
                            <div class="test-role">Editor</div>
                            <div class="test-email">editor@example.com</div>
                        </div>
                        <div class="test-account">
                            <div class="test-role">Viewer</div>
                            <div class="test-email">viewer@example.com</div>
                        </div>
                    </div>
                    <p class="test-note">Use any password for these demo accounts</p>
                </div>
            </div>
        `;
        
        // Ahora configuramos los manejadores de eventos inmediatamente
        setTimeout(() => {
            console.log('Setting up events after render...');
            this.setupEvents();
        }, 0);
        
        console.log('Login form rendered');
        return container;
    }
    
    /**
     * Render registration form
     * @returns {HTMLElement} The registration form element
     */
    renderRegister() {
        console.log('Rendering registration form...');
        
        // Crear el formulario como un elemento DOM
        const container = document.createElement('div');
        container.className = 'auth-container';
        
        container.innerHTML = `
            <div class="auth-form-container">
                <div class="auth-header">
                    <h1 class="auth-title">
                        <i class="fas fa-file-contract"></i>
                        ContractFlow
                    </h1>
                    <h2>Create Your Account</h2>
                    <p>Join thousands of users managing contracts with ease</p>
                </div>
                
                <form id="register-form" class="auth-form">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <div class="input-group">
                            <span class="input-icon"><i class="fas fa-user"></i></span>
                            <input 
                                type="text" 
                                id="name" 
                                placeholder="Enter your full name"
                                value="${this.formState.name}"
                                required
                            >
                        </div>
                        ${this.errors.name ? `<div class="error-message">${this.errors.name}</div>` : ''}
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-email">Email Address</label>
                        <div class="input-group">
                            <span class="input-icon"><i class="fas fa-envelope"></i></span>
                            <input 
                                type="email" 
                                id="reg-email" 
                                placeholder="Enter your email"
                                value="${this.formState.email}"
                                required
                            >
                        </div>
                        ${this.errors.email ? `<div class="error-message">${this.errors.email}</div>` : ''}
                    </div>
                    
                    <div class="form-group">
                        <label for="account-type">Account Type</label>
                        <div class="account-type-selector">
                            <label class="account-type-option ${this.formState.accountType === 'personal' ? 'selected' : ''}">
                                <input 
                                    type="radio" 
                                    name="account-type" 
                                    value="personal"
                                    ${this.formState.accountType === 'personal' ? 'checked' : ''}
                                >
                                <i class="fas fa-user"></i>
                                <span>Personal</span>
                                <small>For individual freelancers</small>
                            </label>
                            <label class="account-type-option ${this.formState.accountType === 'business' ? 'selected' : ''}">
                                <input 
                                    type="radio" 
                                    name="account-type" 
                                    value="business"
                                    ${this.formState.accountType === 'business' ? 'checked' : ''}
                                >
                                <i class="fas fa-building"></i>
                                <span>Business</span>
                                <small>For teams and companies</small>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-password">Password</label>
                        <div class="input-group">
                            <span class="input-icon"><i class="fas fa-lock"></i></span>
                            <input 
                                type="password" 
                                id="reg-password" 
                                placeholder="Create a password"
                                required
                            >
                            <button type="button" class="toggle-password" tabindex="-1">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        ${this.errors.password ? `<div class="error-message">${this.errors.password}</div>` : ''}
                        <div class="password-strength">
                            <div class="strength-meter">
                                <div class="strength-segment"></div>
                                <div class="strength-segment"></div>
                                <div class="strength-segment"></div>
                                <div class="strength-segment"></div>
                            </div>
                            <span class="strength-text">Password strength</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="password-confirm">Confirm Password</label>
                        <div class="input-group">
                            <span class="input-icon"><i class="fas fa-lock"></i></span>
                            <input 
                                type="password" 
                                id="password-confirm" 
                                placeholder="Confirm your password"
                                required
                            >
                        </div>
                        ${this.errors.passwordConfirm ? `<div class="error-message">${this.errors.passwordConfirm}</div>` : ''}
                    </div>
                    
                    <div class="form-group terms-agreement">
                        <input type="checkbox" id="terms" required>
                        <label for="terms">I agree to the <a href="#/terms">Terms of Service</a> and <a href="#/privacy">Privacy Policy</a></label>
                        ${this.errors.terms ? `<div class="error-message">${this.errors.terms}</div>` : ''}
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block" id="register-button">
                        ${this.isLoading ? '<span class="spinner-border spinner-border-sm"></span> Creating Account...' : 'Create Account'}
                    </button>
                    
                    <div class="auth-message">
                        ${this.errors.general ? `<div class="error-message">${this.errors.general}</div>` : ''}
                    </div>
                </form>
                
                <div class="auth-footer">
                    <p>Already have an account? <a href="#/login">Sign In</a></p>
                </div>
            </div>
        `;
        
        // Configurar eventos inmediatamente
        setTimeout(() => {
            console.log('Setting up register form events...');
            this.setupEvents();
        }, 0);
        
        console.log('Registration form rendered');
        return container;
    }
    
    /**
     * Set up event handlers after the component is mounted
     */
    setupEvents() {
        console.log('Setting up AuthForm events...');
        
        // Login form submission
        const loginForm = document.getElementById('login-form');
        console.log('Login form found:', Boolean(loginForm));
        
        if (loginForm) {
            console.log('Attaching submit event to login form');
            
            // Eliminar eventos previos para evitar duplicaciones
            loginForm.removeEventListener('submit', this.handleLogin);
            
            // Función de debug para el evento submit
            const handleSubmitDebug = (e) => {
                console.log('Login form submitted!');
                console.log('Form data:', new FormData(loginForm));
                console.log('Email:', document.getElementById('email').value);
                // Continuamos con el handler normal
                this.handleLogin(e);
            };
            
            // Añadir el evento con el handler de debug
            loginForm.addEventListener('submit', handleSubmitDebug.bind(this));
            
            // Toggle password visibility
            const togglePassword = loginForm.querySelector('.toggle-password');
            if (togglePassword) {
                togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
            }
            
            console.log('Added direct onclick handler to login button');
            // Añadir también un handler al botón de login directamente
            const loginButton = document.getElementById('login-button');
            if (loginButton) {
                loginButton.onclick = (e) => {
                    console.log('Login button clicked!');
                    if (loginForm) {
                        console.log('Submitting form programmatically');
                        loginForm.dispatchEvent(new Event('submit'));
                    }
                };
            }
        } else {
            console.error('Login form not found in the DOM!');
            console.log('Current DOM elements:', 
                Array.from(document.querySelectorAll('*')).map(el => el.tagName).join(', '));
        }
        
        // Registration form submission
        const registerForm = document.getElementById('register-form');
        console.log('Register form found:', Boolean(registerForm));
        
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
            
            // Toggle password visibility
            const togglePassword = registerForm.querySelectorAll('.toggle-password');
            if (togglePassword) {
                togglePassword.forEach(toggle => {
                    toggle.addEventListener('click', this.togglePasswordVisibility.bind(this));
                });
            }
            
            // Password strength meter
            const passwordInput = document.getElementById('reg-password');
            if (passwordInput) {
                passwordInput.addEventListener('input', this.updatePasswordStrength.bind(this));
            }
            
            // Account type selector
            const accountTypeOptions = registerForm.querySelectorAll('.account-type-option input');
            if (accountTypeOptions) {
                accountTypeOptions.forEach(option => {
                    option.addEventListener('change', this.handleAccountTypeChange.bind(this));
                });
            }
        }
        
        console.log('AuthForm events setup complete');
    }
    
    /**
     * Handle login form submission
     * @param {Event} event - Form submission event
     */
    async handleLogin(event) {
        console.log('Login form submitted!', event);
        
        // Prevenir la acción por defecto del formulario
        if (event) {
            event.preventDefault();
        }
        
        // Reset errors
        this.errors = {};
        
        // Get form values
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!emailInput || !passwordInput) {
            console.error('Could not find email or password inputs!');
            console.log('Email input:', emailInput);
            console.log('Password input:', passwordInput);
            this.errors.general = 'There was a problem with the form. Please try again.';
            return;
        }
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        console.log('Login attempt with:', email);
        
        // Validate form
        let isValid = true;
        
        if (!email) {
            this.errors.email = 'Email is required';
            isValid = false;
        } else if (!this.validateEmail(email)) {
            this.errors.email = 'Please enter a valid email address';
            isValid = false;
        }
        
        if (!password) {
            this.errors.password = 'Password is required';
            isValid = false;
        }
        
        if (!isValid) {
            console.log('Form validation failed:', this.errors);
            // Re-render form with errors
            const container = document.querySelector('.auth-container');
            if (container) {
                container.replaceWith(this.renderLogin());
                this.setupEvents();
            } else {
                console.error('Auth container not found for re-rendering!');
            }
            return;
        }
        
        // Show loading state
        this.isLoading = true;
        const loginButton = document.getElementById('login-button');
        if (loginButton) {
            loginButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Signing In...';
            loginButton.disabled = true;
        }
        
        try {
            console.log('Attempting login with:', email);
            // Attempt login
            const userData = await window.auth.login(email, password);
            console.log('Login successful, user data:', userData);
            
            console.log('Login successful, checking for redirect...');
            
            // Check if we need to redirect to a specific page after login
            const query = window.router.getQuery();
            console.log('Current query params:', query);
            
            const redirectTo = query.redirect ? decodeURIComponent(query.redirect) : '/';
            
            console.log('Redirecting to:', redirectTo);
            
            // Para demostración, usamos una redirección directa en caso de que el router falle
            if (redirectTo !== '/') {
                window.location.hash = redirectTo;
                return;
            }
            
            // Redirect to dashboard or the requested page
            window.router.navigate(redirectTo);
            dom.showToast('Successfully logged in', 'success');
        } catch (error) {
            console.error('Login error:', error);
            // Handle login error
            this.errors.general = error.message || 'Login failed. Please try again.';
            this.isLoading = false;
            
            // Re-render form with error
            const container = document.querySelector('.auth-container');
            if (container) {
                container.replaceWith(this.renderLogin());
                this.setupEvents();
            }
        }
    }
    
    /**
     * Handle registration form submission
     * @param {Event} event - Form submission event
     */
    async handleRegister(event) {
        event.preventDefault();
        
        // Reset errors
        this.errors = {};
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('reg-email').value;
        const accountTypeInputs = document.querySelectorAll('input[name="account-type"]');
        const accountType = Array.from(accountTypeInputs).find(input => input.checked)?.value || 'personal';
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        const termsChecked = document.getElementById('terms').checked;
        
        // Validate form
        let isValid = true;
        
        if (!name) {
            this.errors.name = 'Name is required';
            isValid = false;
        }
        
        if (!email) {
            this.errors.email = 'Email is required';
            isValid = false;
        } else if (!this.validateEmail(email)) {
            this.errors.email = 'Please enter a valid email address';
            isValid = false;
        }
        
        if (!password) {
            this.errors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            this.errors.password = 'Password must be at least 8 characters long';
            isValid = false;
        }
        
        if (password !== passwordConfirm) {
            this.errors.passwordConfirm = 'Passwords do not match';
            isValid = false;
        }
        
        if (!termsChecked) {
            this.errors.terms = 'You must agree to the Terms of Service and Privacy Policy';
            isValid = false;
        }
        
        // Update form state
        this.formState = {
            name,
            email,
            accountType,
            password,
            passwordConfirm
        };
        
        if (!isValid) {
            // Re-render form with errors
            const container = document.querySelector('.auth-container');
            if (container) {
                container.outerHTML = this.renderRegister();
                this.setupEvents();
            }
            return;
        }
        
        // Show loading state
        this.isLoading = true;
        const registerButton = document.getElementById('register-button');
        if (registerButton) {
            registerButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating Account...';
            registerButton.disabled = true;
        }
        
        try {
            // Attempt registration
            await window.auth.register({
                name,
                email,
                accountType,
                password
            });
            
            // Redirect to dashboard on success
            window.router.navigate('/');
            dom.showToast('Account created successfully!', 'success');
        } catch (error) {
            // Handle registration error
            this.errors.general = error.message || 'Registration failed. Please try again.';
            this.isLoading = false;
            
            // Re-render form with error
            const container = document.querySelector('.auth-container');
            if (container) {
                container.outerHTML = this.renderRegister();
                this.setupEvents();
            }
        }
    }
    
    /**
     * Toggle password field visibility
     * @param {Event} event - Button click event
     */
    togglePasswordVisibility(event) {
        const button = event.currentTarget;
        const icon = button.querySelector('i');
        const input = button.closest('.input-group').querySelector('input');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
    
    /**
     * Update password strength meter
     * @param {Event} event - Input event
     */
    updatePasswordStrength(event) {
        const password = event.target.value;
        const strengthMeter = document.querySelector('.strength-meter');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthMeter || !strengthText) return;
        
        // Reset strength indicators
        const segments = strengthMeter.querySelectorAll('.strength-segment');
        segments.forEach(segment => {
            segment.className = 'strength-segment';
        });
        
        // Calculate password strength
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;
        
        // Update UI
        for (let i = 0; i < strength; i++) {
            segments[i].classList.add('active');
        }
        
        switch (strength) {
            case 0:
            case 1:
                strengthText.textContent = 'Weak';
                strengthText.className = 'strength-text weak';
                break;
            case 2:
                strengthText.textContent = 'Fair';
                strengthText.className = 'strength-text fair';
                break;
            case 3:
                strengthText.textContent = 'Good';
                strengthText.className = 'strength-text good';
                break;
            case 4:
                strengthText.textContent = 'Strong';
                strengthText.className = 'strength-text strong';
                break;
        }
    }
    
    /**
     * Handle account type change
     * @param {Event} event - Radio button change event
     */
    handleAccountTypeChange(event) {
        const accountType = event.target.value;
        
        // Update form state
        this.formState.accountType = accountType;
        
        // Update UI
        const options = document.querySelectorAll('.account-type-option');
        options.forEach(option => {
            const input = option.querySelector('input');
            if (input.value === accountType) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    /**
     * Validate email format
     * @param {string} email - Email address to validate
     * @returns {boolean} Is email valid
     */
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

// Register component
window.components = window.components || {};
window.components.AuthForm = new AuthForm();

// Initialize events after DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    const authForm = window.components.AuthForm;
    if (authForm) {
        setTimeout(() => {
            authForm.setupEvents();
        }, 0);
    }
}); 
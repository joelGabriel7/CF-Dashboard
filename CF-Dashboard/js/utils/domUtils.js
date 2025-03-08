/**
 * DOM Utility functions for common operations
 */

const dom = {
    /**
     * Creates a DOM element with attributes and children
     * @param {string} tag - The HTML tag name
     * @param {Object} attributes - Attributes to set on the element
     * @param {Array|string} children - Child elements or text content
     * @returns {HTMLElement} The created element
     */
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                for (const [dataKey, dataValue] of Object.entries(value)) {
                    element.dataset[dataKey] = dataValue;
                }
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        }
        
        // Add children
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof HTMLElement) {
                    element.appendChild(child);
                } else if (child !== null && child !== undefined) {
                    element.appendChild(document.createTextNode(child.toString()));
                }
            });
        } else if (children !== null && children !== undefined) {
            element.textContent = children.toString();
        }
        
        return element;
    },

    /**
     * Query selector wrapper
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element to query within (defaults to document)
     * @returns {HTMLElement|null} The selected element or null
     */
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    /**
     * Query selector all wrapper
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element to query within (defaults to document)
     * @returns {NodeList} List of matching elements
     */
    $$(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },

    /**
     * Loads a CSS file dynamically
     * @param {string} path - Path to the CSS file
     * @returns {Promise} Promise that resolves when the CSS is loaded
     */
    loadCSS(path) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = path;
            
            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Failed to load CSS: ${path}`));
            
            document.head.appendChild(link);
        });
    },

    /**
     * Safely set HTML content (use with caution - sanitize user input!)
     * @param {HTMLElement} element - Element to set content for
     * @param {string} htmlContent - HTML content to set
     */
    setHTML(element, htmlContent) {
        if (!element) return;
        element.innerHTML = htmlContent;
    },

    /**
     * Shows a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of toast (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     */
    showToast(message, type = 'info', duration = 3000) {
        // Remove existing toast if present
        const existingToast = this.$('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = this.createElement('div', {
            className: `toast toast-${type}`
        }, message);
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
            
            // Animate out after duration
            setTimeout(() => {
                toast.classList.remove('show');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, duration);
        }, 10);
    },

    /**
     * Creates a modal dialog
     * @param {string} title - Modal title
     * @param {string|HTMLElement} content - Modal content
     * @param {Array} actions - Array of button configs {label, action, className}
     * @returns {HTMLElement} The modal element
     */
    createModal(title, content, actions = []) {
        // Create modal structure
        const modalOverlay = this.createElement('div', {
            className: 'modal-overlay',
            onclick: (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.classList.remove('show');
                    setTimeout(() => modalOverlay.remove(), 300);
                }
            }
        });
        
        const modalContainer = this.createElement('div', {
            className: 'modal-container'
        });
        
        const modalHeader = this.createElement('div', {
            className: 'modal-header'
        }, [
            this.createElement('h3', {}, title),
            this.createElement('button', {
                className: 'modal-close',
                onclick: () => {
                    modalOverlay.classList.remove('show');
                    setTimeout(() => modalOverlay.remove(), 300);
                }
            }, [
                this.createElement('i', {
                    className: 'fas fa-times'
                })
            ])
        ]);
        
        const modalBody = this.createElement('div', {
            className: 'modal-body'
        });
        
        if (content instanceof HTMLElement) {
            modalBody.appendChild(content);
        } else {
            modalBody.innerHTML = content;
        }
        
        const modalFooter = this.createElement('div', {
            className: 'modal-footer'
        });
        
        // Add action buttons
        actions.forEach(({ label, action, className = 'btn-secondary' }) => {
            const button = this.createElement('button', {
                className: `btn ${className}`,
                onclick: () => {
                    if (typeof action === 'function') {
                        action();
                    }
                    modalOverlay.classList.remove('show');
                    setTimeout(() => modalOverlay.remove(), 300);
                }
            }, label);
            
            modalFooter.appendChild(button);
        });
        
        // Assemble modal
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalBody);
        modalContainer.appendChild(modalFooter);
        modalOverlay.appendChild(modalContainer);
        
        // Add to DOM
        document.body.appendChild(modalOverlay);
        
        // Trigger animation
        setTimeout(() => {
            modalOverlay.classList.add('show');
        }, 10);
        
        return modalOverlay;
    },

    /**
     * Format date utility
     * @param {Date|string} date - Date to format
     * @param {string} format - Format style ('short', 'medium', 'long')
     * @returns {string} Formatted date string
     */
    formatDate(date, format = 'medium') {
        const dateObj = date instanceof Date ? date : new Date(date);
        
        switch (format) {
            case 'short':
                return dateObj.toLocaleDateString();
            case 'long':
                return dateObj.toLocaleDateString(undefined, { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            case 'time':
                return dateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            case 'datetime':
                return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`;
            case 'medium':
            default:
                return dateObj.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
        }
    },

    /**
     * Debounce a function call
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    /**
     * Add event listener with automatic cleanup
     * @param {HTMLElement} element - Element to attach listener to
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @returns {Function} Function to remove the listener
     */
    addEventListenerWithCleanup(element, event, handler) {
        if (!element) return () => {};
        
        element.addEventListener(event, handler);
        
        // Return function to remove listener
        return () => element.removeEventListener(event, handler);
    },

    /**
     * Shows a modal dialog with options
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string} options.content - Modal content (HTML)
     * @param {string} options.okText - Text for confirm button
     * @param {string} options.cancelText - Text for cancel button
     * @param {string} options.okClass - Class for confirm button
     * @param {string} options.size - Modal size (sm, md, lg)
     * @param {Function} options.onConfirm - Callback when confirm is clicked
     * @param {Function} options.onCancel - Callback when cancel is clicked
     * @returns {HTMLElement} The modal element
     */
    showModal(options) {
        // Load modal styles if not already loaded
        if (!document.querySelector('link[href="css/components/modal.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/modal.css';
            document.head.appendChild(link);
        }
        
        const {
            title,
            content,
            okText = 'OK',
            cancelText,
            okClass = 'btn-primary',
            size = 'md',
            onConfirm,
            onCancel
        } = options;
        
        // Create modal structure
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContainer = document.createElement('div');
        modalContainer.className = `modal-container modal-${size}`;
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.innerHTML = content;
        
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        
        // Function to close the modal
        const closeModal = () => {
            modalOverlay.classList.remove('show');
            setTimeout(() => modalOverlay.remove(), 300);
        };
        
        // Set up close button event
        closeButton.addEventListener('click', () => {
            if (onCancel) onCancel();
            closeModal();
        });
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                if (onCancel) onCancel();
                closeModal();
            }
        });
        
        // Add cancel button if specified
        if (cancelText) {
            const cancelButton = document.createElement('button');
            cancelButton.className = 'btn btn-secondary';
            cancelButton.textContent = cancelText;
            
            cancelButton.addEventListener('click', () => {
                if (onCancel) onCancel();
                closeModal();
            });
            
            modalFooter.appendChild(cancelButton);
        }
        
        // Add confirm button
        const confirmButton = document.createElement('button');
        confirmButton.className = `btn ${okClass}`;
        confirmButton.textContent = okText;
        
        confirmButton.addEventListener('click', () => {
            if (onConfirm) {
                // If onConfirm returns false, don't close the modal
                const result = onConfirm();
                if (result === false) return;
            }
            closeModal();
        });
        
        modalFooter.appendChild(confirmButton);
        
        // Assemble modal
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalBody);
        modalContainer.appendChild(modalFooter);
        modalOverlay.appendChild(modalContainer);
        
        // Add to DOM
        document.body.appendChild(modalOverlay);
        
        // Trigger animation
        setTimeout(() => {
            modalOverlay.classList.add('show');
            
            // Execute any scripts in the modal content
            const scripts = modalBody.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        }, 10);
        
        return modalOverlay;
    }
};

// Export the dom object
window.dom = dom; 
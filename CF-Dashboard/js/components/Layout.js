/**
 * Layout Component
 * Main layout structure with sidebar and header for authenticated pages
 */

class Layout {
    constructor() {
        this.loadStyles();
        this.currentUser = window.state.getState('currentUser');
        this.unsubscribe = null;
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/layout.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/layout.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the layout component
     * @returns {HTMLElement} The layout element
     */
    render() {
        // Create main layout container
        const layout = dom.createElement('div', {
            className: 'app-layout'
        });
        
        // Create sidebar
        const sidebar = this.renderSidebar();
        
        // Create main content area
        const mainContent = dom.createElement('div', {
            className: 'main-content'
        });
        
        // Create header
        const header = this.renderHeader();
        
        // Create content area
        const contentArea = dom.createElement('div', {
            id: 'content-area',
            className: 'content-area'
        });
        
        // Assemble the layout
        mainContent.appendChild(header);
        mainContent.appendChild(contentArea);
        layout.appendChild(sidebar);
        layout.appendChild(mainContent);
        
        // Set up event handlers
        this.setupEventHandlers(layout);
        
        return layout;
    }
    
    /**
     * Render the sidebar with navigation links
     * @returns {HTMLElement} The sidebar element
     */
    renderSidebar() {
        const sidebar = dom.createElement('div', {
            className: 'sidebar'
        });
        
        // Logo section
        const logoSection = dom.createElement('div', {
            className: 'sidebar-logo'
        }, [
            dom.createElement('a', {
                href: '#/'
            }, [
                dom.createElement('h1', {}, [
                    dom.createElement('i', {
                        className: 'fas fa-file-contract mr-2'
                    }),
                    'ContractFlow'
                ])
            ])
        ]);
        
        // Navigation section
        const navSection = dom.createElement('nav', {
            className: 'sidebar-nav'
        });
        
        // Create navigation items based on user role
        const navItems = this.getNavigationItems();
        
        navItems.forEach(item => {
            if (item.visible) {
                const navItem = dom.createElement('a', {
                    href: item.url,
                    className: this.isActivePath(item.url) ? 'nav-item active' : 'nav-item'
                }, [
                    dom.createElement('i', {
                        className: `${item.icon} nav-icon`
                    }),
                    item.label
                ]);
                
                navSection.appendChild(navItem);
            }
        });
        
        // User section at bottom
        const userSection = dom.createElement('div', {
            className: 'sidebar-user'
        }, [
            dom.createElement('div', {
                className: 'user-info'
            }, [
                dom.createElement('div', {
                    className: 'user-avatar'
                }, [
                    dom.createElement('img', {
                        src: this.currentUser.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                        alt: this.currentUser.name
                    })
                ]),
                dom.createElement('div', {
                    className: 'user-details'
                }, [
                    dom.createElement('div', {
                        className: 'user-name'
                    }, this.currentUser.name),
                    dom.createElement('div', {
                        className: 'user-role'
                    }, this.getRoleLabel(this.currentUser.role))
                ])
            ]),
            dom.createElement('a', {
                href: '#/logout',
                className: 'logout-button'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-sign-out-alt'
                }),
                'Logout'
            ])
        ]);
        
        // Assemble sidebar
        sidebar.appendChild(logoSection);
        sidebar.appendChild(navSection);
        sidebar.appendChild(userSection);
        
        return sidebar;
    }
    
    /**
     * Render the header with actions and user info
     * @returns {HTMLElement} The header element
     */
    renderHeader() {
        const header = dom.createElement('header', {
            className: 'app-header'
        });
        
        // Mobile menu toggle button
        const menuToggle = dom.createElement('button', {
            className: 'menu-toggle',
            onclick: this.toggleSidebar
        }, [
            dom.createElement('i', {
                className: 'fas fa-bars'
            })
        ]);
        
        // Page title based on current route
        const pageTitle = dom.createElement('h2', {
            className: 'page-title'
        }, this.getPageTitle());
        
        // Right side actions
        const headerActions = dom.createElement('div', {
            className: 'header-actions'
        });
        
        // Create New button (if user has permission)
        if (window.state.hasPermission('create_contracts')) {
            const createButton = dom.createElement('button', {
                className: 'btn btn-primary btn-sm',
                onclick: this.handleCreateContract
            }, [
                dom.createElement('i', {
                    className: 'fas fa-plus mr-1'
                }),
                'New Contract'
            ]);
            
            headerActions.appendChild(createButton);
        }
        
        // Dark mode toggle
        const darkModeToggle = dom.createElement('button', {
            className: 'btn-icon',
            title: 'Toggle Dark Mode',
            onclick: this.toggleDarkMode
        }, [
            dom.createElement('i', {
                className: window.state.getState('darkMode') ? 'fas fa-sun' : 'fas fa-moon'
            })
        ]);
        
        // Notifications dropdown
        const notificationsDropdown = this.renderNotificationsDropdown();
        
        // User dropdown
        const userDropdown = this.renderUserDropdown();
        
        // Assemble header
        headerActions.appendChild(darkModeToggle);
        headerActions.appendChild(notificationsDropdown);
        headerActions.appendChild(userDropdown);
        
        header.appendChild(menuToggle);
        header.appendChild(pageTitle);
        header.appendChild(headerActions);
        
        return header;
    }
    
    /**
     * Render notifications dropdown
     * @returns {HTMLElement} The notifications dropdown element
     */
    renderNotificationsDropdown() {
        // Get notifications from state
        const notifications = window.state.getState('notifications') || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        // Create dropdown container
        const dropdown = dom.createElement('div', {
            className: 'dropdown notifications-dropdown'
        });
        
        // Create dropdown toggle
        const dropdownToggle = dom.createElement('button', {
            className: 'dropdown-toggle btn-icon',
            onclick: (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            }
        }, [
            dom.createElement('i', {
                className: 'fas fa-bell'
            }),
            unreadCount > 0 ? dom.createElement('span', {
                className: 'badge badge-notification'
            }, unreadCount.toString()) : null
        ]);
        
        // Create dropdown content
        const dropdownContent = dom.createElement('div', {
            className: 'dropdown-content'
        });
        
        // Notifications header
        dropdownContent.appendChild(dom.createElement('div', {
            className: 'dropdown-header'
        }, [
            dom.createElement('h4', {}, 'Notifications'),
            unreadCount > 0 ? dom.createElement('button', {
                className: 'btn-text',
                onclick: this.markAllNotificationsRead
            }, 'Mark all read') : null
        ]));
        
        // Notifications list
        const notificationsList = dom.createElement('div', {
            className: 'notifications-list'
        });
        
        if (notifications.length === 0) {
            notificationsList.appendChild(dom.createElement('div', {
                className: 'empty-state'
            }, 'No notifications'));
        } else {
            // Sort notifications by date (newest first)
            const sortedNotifications = [...notifications].sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            // Show only the 5 most recent notifications
            sortedNotifications.slice(0, 5).forEach(notification => {
                const notificationItem = dom.createElement('a', {
                    href: `#${notification.link}`,
                    className: notification.read ? 'notification-item' : 'notification-item unread',
                    onclick: () => this.handleNotificationClick(notification)
                }, [
                    dom.createElement('div', {
                        className: 'notification-icon'
                    }, [
                        dom.createElement('i', {
                            className: this.getNotificationIcon(notification.type)
                        })
                    ]),
                    dom.createElement('div', {
                        className: 'notification-content'
                    }, [
                        dom.createElement('p', {
                            className: 'notification-message'
                        }, notification.message),
                        dom.createElement('span', {
                            className: 'notification-time'
                        }, this.formatTimeAgo(notification.timestamp))
                    ])
                ]);
                
                notificationsList.appendChild(notificationItem);
            });
        }
        
        dropdownContent.appendChild(notificationsList);
        
        // View all link
        dropdownContent.appendChild(dom.createElement('div', {
            className: 'dropdown-footer'
        }, [
            dom.createElement('a', {
                href: '#/notifications',
                className: 'view-all'
            }, 'View all notifications')
        ]));
        
        // Assemble dropdown
        dropdown.appendChild(dropdownToggle);
        dropdown.appendChild(dropdownContent);
        
        return dropdown;
    }
    
    /**
     * Render user dropdown
     * @returns {HTMLElement} The user dropdown element
     */
    renderUserDropdown() {
        // Create dropdown container
        const dropdown = dom.createElement('div', {
            className: 'dropdown user-dropdown'
        });
        
        // Create dropdown toggle
        const dropdownToggle = dom.createElement('div', {
            className: 'dropdown-toggle user-toggle',
            onclick: (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            }
        }, [
            dom.createElement('div', {
                className: 'user-avatar'
            }, [
                dom.createElement('img', {
                    src: this.currentUser.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                    alt: this.currentUser.name
                })
            ])
        ]);
        
        // Create dropdown content
        const dropdownContent = dom.createElement('div', {
            className: 'dropdown-content'
        });
        
        // User info header
        dropdownContent.appendChild(dom.createElement('div', {
            className: 'dropdown-header user-header'
        }, [
            dom.createElement('h4', {}, this.currentUser.name),
            dom.createElement('p', {}, this.currentUser.email)
        ]));
        
        // Dropdown links
        const dropdownLinks = [
            { label: 'My Profile', icon: 'fas fa-user', url: '#/profile' },
            { label: 'Settings', icon: 'fas fa-cog', url: '#/settings' },
            { label: 'Help & Support', icon: 'fas fa-question-circle', url: '#/help' }
        ];
        
        const dropdownList = dom.createElement('div', {
            className: 'dropdown-list'
        });
        
        dropdownLinks.forEach(link => {
            dropdownList.appendChild(dom.createElement('a', {
                href: link.url,
                className: 'dropdown-item'
            }, [
                dom.createElement('i', {
                    className: link.icon
                }),
                link.label
            ]));
        });
        
        dropdownContent.appendChild(dropdownList);
        
        // Logout option
        dropdownContent.appendChild(dom.createElement('div', {
            className: 'dropdown-footer'
        }, [
            dom.createElement('a', {
                href: '#/logout',
                className: 'dropdown-item logout'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-sign-out-alt'
                }),
                'Logout'
            ])
        ]));
        
        // Assemble dropdown
        dropdown.appendChild(dropdownToggle);
        dropdown.appendChild(dropdownContent);
        
        return dropdown;
    }
    
    /**
     * Set up event handlers for the layout
     * @param {HTMLElement} layoutElement - The layout container element
     */
    setupEventHandlers(layoutElement) {
        // Subscribe to state changes
        this.unsubscribe = window.state.subscribe((key, oldValue, newValue) => {
            if (key === 'darkMode') {
                // Update dark mode icon
                const darkModeIcon = layoutElement.querySelector('.header-actions .btn-icon i');
                if (darkModeIcon) {
                    darkModeIcon.className = newValue ? 'fas fa-sun' : 'fas fa-moon';
                }
            } else if (key === 'notifications') {
                // Update notifications dropdown
                const notificationsDropdown = layoutElement.querySelector('.notifications-dropdown');
                if (notificationsDropdown) {
                    const newDropdown = this.renderNotificationsDropdown();
                    notificationsDropdown.replaceWith(newDropdown);
                }
            }
        });
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
        });
    }
    
    /**
     * Toggle sidebar visibility on mobile
     */
    toggleSidebar() {
        document.querySelector('.app-layout').classList.toggle('sidebar-open');
    }
    
    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        window.state.toggleDarkMode();
    }
    
    /**
     * Handle create contract button click
     */
    handleCreateContract() {
        window.router.navigate('/contracts/new');
    }
    
    /**
     * Handle notification click
     * @param {Object} notification - Notification object
     */
    handleNotificationClick(notification) {
        // Mark notification as read
        if (!notification.read) {
            const notifications = window.state.getState('notifications');
            const updatedNotifications = notifications.map(n => 
                n.id === notification.id ? { ...n, read: true } : n
            );
            
            window.state.setState('notifications', updatedNotifications);
        }
    }
    
    /**
     * Mark all notifications as read
     */
    markAllNotificationsRead() {
        const notifications = window.state.getState('notifications');
        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
        
        window.state.setState('notifications', updatedNotifications);
    }
    
    /**
     * Get navigation items based on user permissions
     * @returns {Array} Array of navigation items
     */
    getNavigationItems() {
        return [
            {
                label: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
                url: '#/',
                visible: window.state.hasPermission('view_dashboard')
            },
            {
                label: 'Contracts',
                icon: 'fas fa-file-contract',
                url: '#/contracts',
                visible: window.state.hasPermission('view_contracts')
            },
            {
                label: 'Templates',
                icon: 'fas fa-copy',
                url: '#/templates',
                visible: window.state.hasPermission('view_templates')
            },
            {
                label: 'Organization',
                icon: 'fas fa-building',
                url: '#/organization',
                visible: window.state.hasPermission('view_organization')
            },
            {
                label: 'Profile',
                icon: 'fas fa-user',
                url: '#/profile',
                visible: window.state.hasPermission('view_profile')
            }
        ];
    }
    
    /**
     * Check if a path is active
     * @param {string} path - Path to check
     * @returns {boolean} True if path is active
     */
    isActivePath(path) {
        const currentPath = window.location.hash;
        
        if (path === '#/') {
            return currentPath === '#/' || currentPath === '#/dashboard';
        }
        
        return currentPath.startsWith(path);
    }
    
    /**
     * Get page title based on current route
     * @returns {string} Page title
     */
    getPageTitle() {
        const currentPath = window.location.hash;
        
        if (currentPath === '#/' || currentPath === '#/dashboard') {
            return 'Dashboard';
        } else if (currentPath.startsWith('#/contracts/')) {
            if (currentPath === '#/contracts/new') {
                return 'New Contract';
            }
            return 'Contract Details';
        } else if (currentPath === '#/contracts') {
            return 'Contracts';
        } else if (currentPath === '#/templates') {
            return 'Templates';
        } else if (currentPath === '#/organization') {
            return 'Organization';
        } else if (currentPath === '#/profile') {
            return 'Profile';
        }
        
        return 'Dashboard';
    }
    
    /**
     * Get notification icon based on type
     * @param {string} type - Notification type
     * @returns {string} Icon class
     */
    getNotificationIcon(type) {
        switch (type) {
            case 'contract_signed':
                return 'fas fa-check-circle text-success';
            case 'contract_expired':
                return 'fas fa-exclamation-circle text-error';
            case 'contract_created':
                return 'fas fa-file-contract text-primary';
            case 'invitation':
                return 'fas fa-user-plus text-info';
            case 'reminder':
                return 'fas fa-bell text-warning';
            default:
                return 'fas fa-bell';
        }
    }
    
    /**
     * Format time ago from timestamp
     * @param {string} timestamp - ISO timestamp
     * @returns {string} Time ago string
     */
    formatTimeAgo(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) {
            return 'Just now';
        } else if (diffMin < 60) {
            return `${diffMin}m ago`;
        } else if (diffHour < 24) {
            return `${diffHour}h ago`;
        } else if (diffDay < 7) {
            return `${diffDay}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    /**
     * Get readable role label
     * @param {string} role - Role code
     * @returns {string} Role label
     */
    getRoleLabel(role) {
        switch (role) {
            case 'ADMIN':
                return 'Administrator';
            case 'EDITOR':
                return 'Editor';
            case 'VIEWER':
                return 'Viewer';
            default:
                return role;
        }
    }
}

// Register component
window.components = window.components || {};
window.components.Layout = new Layout(); 
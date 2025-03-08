/**
 * User Profile Component
 * Displays and allows editing of user profile information
 */

class UserProfile {
    constructor() {
        this.loadStyles();
        this.user = null;
        this.isEditing = false;
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/userprofile.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/userprofile.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the user profile component
     * @returns {HTMLElement} The user profile element
     */
    render() {
        // Create main container
        const container = dom.createElement('div', {
            className: 'profile-container'
        });
        
        // Load user data
        this.loadUserData();
        
        // If user is loading, show loading state
        if (!this.user) {
            container.appendChild(this.renderLoading());
            return container;
        }
        
        // Render page header
        const header = this.renderHeader();
        
        // Render profile content
        const content = this.renderContent();
        
        // Assemble component
        container.appendChild(header);
        container.appendChild(content);
        
        // Set up event handlers
        setTimeout(() => {
            this.setupEventHandlers();
        }, 0);
        
        return container;
    }
    
    /**
     * Load user data
     */
    loadUserData() {
        try {
            // Get current user from state
            this.user = window.state.getState('currentUser');
            
            if (!this.user) {
                // Fallback to mock data if no user in state
                const users = window.mockData.getUsers();
                this.user = users[0]; // Get first user as current
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.user = null;
        }
    }
    
    /**
     * Render loading state
     * @returns {HTMLElement} Loading element
     */
    renderLoading() {
        return dom.createElement('div', {
            className: 'loading-container'
        }, [
            dom.createElement('div', {
                className: 'spinner'
            }),
            dom.createElement('p', {}, 'Loading profile...')
        ]);
    }
    
    /**
     * Render page header
     * @returns {HTMLElement} Header element
     */
    renderHeader() {
        return dom.createElement('div', {
            className: 'profile-header'
        }, [
            dom.createElement('div', {
                className: 'profile-title-area'
            }, [
                dom.createElement('div', {
                    className: 'back-button'
                }, [
                    dom.createElement('a', {
                        href: '#/dashboard',
                        className: 'btn btn-link'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-arrow-left'
                        }),
                        ' Back to Dashboard'
                    ])
                ]),
                dom.createElement('h1', {}, 'My Profile')
            ]),
            dom.createElement('div', {
                className: 'profile-actions'
            }, [
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'edit-profile-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-edit'
                    }),
                    ' Edit Profile'
                ])
            ])
        ]);
    }
    
    /**
     * Render profile content
     * @returns {HTMLElement} Content element
     */
    renderContent() {
        return dom.createElement('div', {
            className: 'profile-content'
        }, [
            dom.createElement('div', {
                className: 'profile-main'
            }, [
                this.renderPersonalInfo(),
                this.renderAccountInfo(),
                this.renderPreferences()
            ]),
            dom.createElement('div', {
                className: 'profile-sidebar'
            }, [
                this.renderActivitySummary(),
                this.renderTeamMembers()
            ])
        ]);
    }
    
    /**
     * Render personal information section
     * @returns {HTMLElement} Personal info section
     */
    renderPersonalInfo() {
        return dom.createElement('div', {
            className: 'profile-section'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('div', {
                    className: 'section-icon'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-user'
                    })
                ]),
                dom.createElement('h2', {}, 'Personal Information')
            ]),
            dom.createElement('div', {
                className: 'profile-info-container'
            }, [
                dom.createElement('div', {
                    className: 'profile-avatar-container'
                }, [
                    dom.createElement('div', {
                        className: 'profile-avatar'
                    }, [
                        dom.createElement('img', {
                            src: this.user.avatar || 'assets/images/default-avatar.png',
                            alt: 'Profile Avatar'
                        })
                    ]),
                    !this.isEditing ? null : dom.createElement('button', {
                        className: 'btn btn-sm btn-outline avatar-upload-btn',
                        id: 'avatar-upload-btn'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-camera'
                        }),
                        ' Change Photo'
                    ])
                ]),
                dom.createElement('div', {
                    className: 'profile-details'
                }, [
                    this.renderProfileField('name', 'Name', this.user.name),
                    this.renderProfileField('title', 'Job Title', this.user.title || 'Not specified'),
                    this.renderProfileField('department', 'Department', this.user.department || 'Not specified'),
                    this.renderProfileField('location', 'Location', this.user.location || 'Not specified')
                ])
            ])
        ]);
    }
    
    /**
     * Render account information section
     * @returns {HTMLElement} Account info section
     */
    renderAccountInfo() {
        return dom.createElement('div', {
            className: 'profile-section'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('div', {
                    className: 'section-icon'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-id-card'
                    })
                ]),
                dom.createElement('h2', {}, 'Account Information')
            ]),
            dom.createElement('div', {
                className: 'profile-details'
            }, [
                this.renderProfileField('email', 'Email', this.user.email),
                this.renderProfileField('phone', 'Phone', this.user.phone || 'Not specified'),
                this.renderProfileField('role', 'Role', this.user.role || 'User'),
                this.renderProfileField('organization', 'Organization', this.user.organization?.name || 'Not specified')
            ]),
            !this.isEditing ? null : dom.createElement('div', {
                className: 'password-change-section'
            }, [
                dom.createElement('h3', {}, 'Change Password'),
                dom.createElement('div', {
                    className: 'form-group'
                }, [
                    dom.createElement('label', {
                        htmlFor: 'current-password'
                    }, 'Current Password'),
                    dom.createElement('input', {
                        type: 'password',
                        id: 'current-password',
                        className: 'form-control',
                        placeholder: '••••••••'
                    })
                ]),
                dom.createElement('div', {
                    className: 'form-group'
                }, [
                    dom.createElement('label', {
                        htmlFor: 'new-password'
                    }, 'New Password'),
                    dom.createElement('input', {
                        type: 'password',
                        id: 'new-password',
                        className: 'form-control',
                        placeholder: '••••••••'
                    })
                ]),
                dom.createElement('div', {
                    className: 'form-group'
                }, [
                    dom.createElement('label', {
                        htmlFor: 'confirm-password'
                    }, 'Confirm New Password'),
                    dom.createElement('input', {
                        type: 'password',
                        id: 'confirm-password',
                        className: 'form-control',
                        placeholder: '••••••••'
                    })
                ]),
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'change-password-btn'
                }, 'Update Password')
            ])
        ]);
    }
    
    /**
     * Render preferences section
     * @returns {HTMLElement} Preferences section
     */
    renderPreferences() {
        return dom.createElement('div', {
            className: 'profile-section'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('div', {
                    className: 'section-icon'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-cog'
                    })
                ]),
                dom.createElement('h2', {}, 'Preferences')
            ]),
            dom.createElement('div', {
                className: 'preferences-list'
            }, [
                this.renderPreferenceToggle('email_notifications', 'Email Notifications', true),
                this.renderPreferenceToggle('contract_reminders', 'Contract Reminders', true),
                this.renderPreferenceToggle('dark_mode', 'Dark Mode', document.body.classList.contains('dark-mode')),
                this.renderPreferenceToggle('two_factor_auth', 'Two-Factor Authentication', false)
            ])
        ]);
    }
    
    /**
     * Render activity summary section
     * @returns {HTMLElement} Activity summary section
     */
    renderActivitySummary() {
        return dom.createElement('div', {
            className: 'sidebar-section'
        }, [
            dom.createElement('h3', {}, [
                dom.createElement('i', {
                    className: 'fas fa-chart-line'
                }),
                ' Activity Summary'
            ]),
            dom.createElement('div', {
                className: 'activity-stats'
            }, [
                dom.createElement('div', {
                    className: 'stat-item'
                }, [
                    dom.createElement('span', {
                        className: 'stat-value'
                    }, '24'),
                    dom.createElement('span', {
                        className: 'stat-label'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-file-contract'
                        }),
                        ' Contracts'
                    ])
                ]),
                dom.createElement('div', {
                    className: 'stat-item'
                }, [
                    dom.createElement('span', {
                        className: 'stat-value'
                    }, '8'),
                    dom.createElement('span', {
                        className: 'stat-label'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-file-signature'
                        }),
                        ' Signed'
                    ])
                ]),
                dom.createElement('div', {
                    className: 'stat-item'
                }, [
                    dom.createElement('span', {
                        className: 'stat-value'
                    }, '5'),
                    dom.createElement('span', {
                        className: 'stat-label'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-clock'
                        }),
                        ' Pending'
                    ])
                ])
            ]),
            dom.createElement('div', {
                className: 'recent-activity'
            }, [
                dom.createElement('h4', {}, 'Recent Activity'),
                dom.createElement('ul', {
                    className: 'activity-list'
                }, [
                    dom.createElement('li', {
                        className: 'activity-item'
                    }, [
                        dom.createElement('div', {
                            className: 'activity-icon'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-edit'
                            })
                        ]),
                        dom.createElement('div', {
                            className: 'activity-content'
                        }, [
                            dom.createElement('p', {
                                className: 'activity-text'
                            }, 'You edited the NDA contract'),
                            dom.createElement('span', {
                                className: 'activity-time'
                            }, '2 hours ago')
                        ])
                    ]),
                    dom.createElement('li', {
                        className: 'activity-item'
                    }, [
                        dom.createElement('div', {
                            className: 'activity-icon'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-signature'
                            })
                        ]),
                        dom.createElement('div', {
                            className: 'activity-content'
                        }, [
                            dom.createElement('p', {
                                className: 'activity-text'
                            }, 'You signed the Service Agreement'),
                            dom.createElement('span', {
                                className: 'activity-time'
                            }, '1 day ago')
                        ])
                    ]),
                    dom.createElement('li', {
                        className: 'activity-item'
                    }, [
                        dom.createElement('div', {
                            className: 'activity-icon'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-plus'
                            })
                        ]),
                        dom.createElement('div', {
                            className: 'activity-content'
                        }, [
                            dom.createElement('p', {
                                className: 'activity-text'
                            }, 'You created a new contract'),
                            dom.createElement('span', {
                                className: 'activity-time'
                            }, '3 days ago')
                        ])
                    ])
                ])
            ])
        ]);
    }
    
    /**
     * Render team members section
     * @returns {HTMLElement} Team members section
     */
    renderTeamMembers() {
        // Get organization members (mock data)
        const orgId = this.user.organization?.id;
        let members = [];
        
        if (orgId) {
            members = window.mockData.getOrganizationMembers(orgId) || [];
            // Remove current user from list
            members = members.filter(member => member.id !== this.user.id);
            // Limit to 5 members
            members = members.slice(0, 5);
        }
        
        return dom.createElement('div', {
            className: 'sidebar-section'
        }, [
            dom.createElement('h3', {}, [
                dom.createElement('i', {
                    className: 'fas fa-users'
                }),
                ' Team Members'
            ]),
            dom.createElement('div', {
                className: 'team-members-list'
            }, members.length > 0
                ? members.map(member => 
                    dom.createElement('div', {
                        className: 'team-member'
                    }, [
                        dom.createElement('div', {
                            className: 'member-avatar'
                        }, [
                            dom.createElement('img', {
                                src: member.avatar || 'assets/images/default-avatar.png',
                                alt: member.name
                            })
                        ]),
                        dom.createElement('div', {
                            className: 'member-info'
                        }, [
                            dom.createElement('span', {
                                className: 'member-name'
                            }, member.name),
                            dom.createElement('span', {
                                className: 'member-role'
                            }, member.role || 'Team Member')
                        ])
                    ])
                )
                : dom.createElement('p', {
                    className: 'no-members'
                }, 'No team members found.')
            ),
            members.length > 0 ? dom.createElement('a', {
                href: '#',
                className: 'view-all-link',
                id: 'view-all-members'
            }, [
                'View all members ',
                dom.createElement('i', {
                    className: 'fas fa-chevron-right'
                })
            ]) : null
        ]);
    }
    
    /**
     * Render a profile field
     * @param {string} id - Field ID
     * @param {string} label - Field label
     * @param {string} value - Field value
     * @returns {HTMLElement} Profile field element
     */
    renderProfileField(id, label, value) {
        if (this.isEditing) {
            return dom.createElement('div', {
                className: 'profile-field'
            }, [
                dom.createElement('label', {
                    htmlFor: `profile-${id}`
                }, label),
                dom.createElement('input', {
                    type: 'text',
                    id: `profile-${id}`,
                    className: 'form-control',
                    value: value,
                    disabled: id === 'email' || id === 'role' || id === 'organization'
                })
            ]);
        } else {
            return dom.createElement('div', {
                className: 'profile-field'
            }, [
                dom.createElement('span', {
                    className: 'field-label'
                }, label),
                dom.createElement('span', {
                    className: 'field-value'
                }, value)
            ]);
        }
    }
    
    /**
     * Render a preference toggle
     * @param {string} id - Preference ID
     * @param {string} label - Preference label
     * @param {boolean} checked - Whether the preference is enabled
     * @returns {HTMLElement} Preference toggle element
     */
    renderPreferenceToggle(id, label, checked) {
        return dom.createElement('div', {
            className: 'preference-item'
        }, [
            dom.createElement('label', {
                htmlFor: `pref-${id}`,
                className: 'preference-label'
            }, label),
            dom.createElement('div', {
                className: 'toggle-switch'
            }, [
                dom.createElement('input', {
                    type: 'checkbox',
                    id: `pref-${id}`,
                    checked: checked,
                    disabled: !this.isEditing && id !== 'dark_mode'
                }),
                dom.createElement('span', {
                    className: 'toggle-slider'
                })
            ])
        ]);
    }
    
    /**
     * Set up event handlers
     */
    setupEventHandlers() {
        // Edit profile button
        const editBtn = document.getElementById('edit-profile-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.handleEditProfile());
        }
        
        // Dark mode toggle
        const darkModeToggle = document.getElementById('pref-dark_mode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => this.handleDarkModeToggle(e));
        }
        
        // View all members link
        const viewAllMembersLink = document.getElementById('view-all-members');
        if (viewAllMembersLink) {
            viewAllMembersLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleViewAllMembers();
            });
        }
        
        // Change password button (only in edit mode)
        if (this.isEditing) {
            const changePasswordBtn = document.getElementById('change-password-btn');
            if (changePasswordBtn) {
                changePasswordBtn.addEventListener('click', () => this.handleChangePassword());
            }
            
            // Avatar upload button
            const avatarUploadBtn = document.getElementById('avatar-upload-btn');
            if (avatarUploadBtn) {
                avatarUploadBtn.addEventListener('click', () => this.handleAvatarUpload());
            }
        }
    }
    
    /**
     * Handle edit profile button click
     */
    handleEditProfile() {
        if (this.isEditing) {
            // Save changes
            this.saveProfileChanges();
            this.isEditing = false;
            dom.showToast('Profile updated successfully', 'success');
        } else {
            // Enter edit mode
            this.isEditing = true;
            
            // Update button text
            const editBtn = document.getElementById('edit-profile-btn');
            if (editBtn) {
                editBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            }
            
            // Re-render content
            const container = document.querySelector('.profile-container');
            if (container) {
                const oldContent = container.querySelector('.profile-content');
                if (oldContent) {
                    const newContent = this.renderContent();
                    container.replaceChild(newContent, oldContent);
                    this.setupEventHandlers();
                }
            }
        }
    }
    
    /**
     * Save profile changes
     */
    saveProfileChanges() {
        // Get updated values
        const name = document.getElementById('profile-name')?.value;
        const title = document.getElementById('profile-title')?.value;
        const department = document.getElementById('profile-department')?.value;
        const location = document.getElementById('profile-location')?.value;
        const phone = document.getElementById('profile-phone')?.value;
        
        // Update user object
        if (name) this.user.name = name;
        if (title) this.user.title = title;
        if (department) this.user.department = department;
        if (location) this.user.location = location;
        if (phone) this.user.phone = phone;
        
        // Update preferences
        const emailNotifications = document.getElementById('pref-email_notifications')?.checked;
        const contractReminders = document.getElementById('pref-contract_reminders')?.checked;
        const twoFactorAuth = document.getElementById('pref-two_factor_auth')?.checked;
        
        // Update user preferences
        this.user.preferences = {
            ...(this.user.preferences || {}),
            emailNotifications,
            contractReminders,
            twoFactorAuth
        };
        
        // Update button text
        const editBtn = document.getElementById('edit-profile-btn');
        if (editBtn) {
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
        }
        
        // Re-render content
        const container = document.querySelector('.profile-container');
        if (container) {
            const oldContent = container.querySelector('.profile-content');
            if (oldContent) {
                const newContent = this.renderContent();
                container.replaceChild(newContent, oldContent);
                this.setupEventHandlers();
            }
        }
    }
    
    /**
     * Handle dark mode toggle
     * @param {Event} event - Change event
     */
    handleDarkModeToggle(event) {
        const isDarkMode = event.target.checked;
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Save preference
        if (this.user && this.user.preferences) {
            this.user.preferences.darkMode = isDarkMode;
        }
    }
    
    /**
     * Handle view all members link click
     */
    handleViewAllMembers() {
        dom.showToast('Team members view would be implemented here', 'info');
    }
    
    /**
     * Handle change password button click
     */
    handleChangePassword() {
        const currentPassword = document.getElementById('current-password')?.value;
        const newPassword = document.getElementById('new-password')?.value;
        const confirmPassword = document.getElementById('confirm-password')?.value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            dom.showToast('Please fill in all password fields', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            dom.showToast('New passwords do not match', 'error');
            return;
        }
        
        // In a real app, we would send this to the server
        dom.showToast('Password updated successfully', 'success');
        
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    }
    
    /**
     * Handle avatar upload button click
     */
    handleAvatarUpload() {
        // In a real app, this would open a file picker
        dom.showToast('Avatar upload would be implemented here', 'info');
    }
}

// Register component when script is loaded
window.components = window.components || {};
window.components.UserProfile = new UserProfile(); 
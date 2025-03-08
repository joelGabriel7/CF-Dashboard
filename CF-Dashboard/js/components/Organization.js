/**
 * Organization Component
 * Displays and manages organization details, members, and invitations
 */

class Organization {
    constructor() {
        this.loadStyles();
        this.organization = null;
        this.members = [];
        this.unsubscribe = null;
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/organization.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/organization.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the organization component
     * @returns {HTMLElement} The organization element
     */
    render() {
        // Get organization data from state
        this.organization = window.state.getState('organization') || null;
        const currentUser = window.state.getState('currentUser');
        
        // Create container
        const container = dom.createElement('div', {
            className: 'organization-container'
        });
        
        // If no organization data is available
        if (!this.organization) {
            container.appendChild(this.renderNoOrganization());
            return container;
        }
        
        // Fetch organization members
        this.members = window.mockData.getOrganizationMembers(this.organization.id) || [];
        
        // Organization header
        const header = this.renderHeader();
        
        // Organization details
        const details = this.renderDetails();
        
        // Subscription info
        const subscription = this.renderSubscriptionInfo();
        
        // Department section
        const departments = this.renderDepartments();
        
        // Members section
        const membersSection = this.renderMembersSection();
        
        // Recent Activity section
        const activitySection = this.renderActivitySection();
        
        // Invitations section (only for ADMIN)
        const invitationsSection = window.state.hasPermission('manage_invitations') ? 
            this.renderInvitationsSection(this.organization.pendingInvitations) : null;
        
        // Settings section (only for ADMIN)
        const settingsSection = window.state.hasPermission('manage_organization') ?
            this.renderSettingsSection() : null;
        
        // Assemble the component
        container.appendChild(header);
        container.appendChild(details);
        container.appendChild(subscription);
        container.appendChild(departments);
        container.appendChild(membersSection);
        container.appendChild(activitySection);
        if (invitationsSection) container.appendChild(invitationsSection);
        if (settingsSection) container.appendChild(settingsSection);
        
        // Setup event handlers
        setTimeout(() => {
            this.setupEventHandlers();
        }, 0);
        
        return container;
    }
    
    /**
     * Render organization header
     * @returns {HTMLElement} Header element
     */
    renderHeader() {
        return dom.createElement('div', {
            className: 'section-header'
        }, [
            dom.createElement('h1', {}, 'Organization'),
            window.state.hasPermission('manage_organization') ? 
            dom.createElement('button', {
                className: 'btn btn-primary',
                id: 'edit-org-btn'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-edit mr-2'
                }),
                'Edit Organization'
            ]) : null
        ]);
    }
    
    /**
     * Render organization details
     * @returns {HTMLElement} Details element
     */
    renderDetails() {
        return dom.createElement('div', {
            className: 'org-details-card'
        }, [
            dom.createElement('div', {
                className: 'org-header'
            }, [
                dom.createElement('div', {
                    className: 'org-logo'
                }, [
                    dom.createElement('img', {
                        src: this.organization.logoUrl || 'https://via.placeholder.com/150',
                        alt: this.organization.name
                    })
                ]),
                dom.createElement('div', {
                    className: 'org-title'
                }, [
                    dom.createElement('h2', {}, this.organization.name),
                    dom.createElement('div', {
                        className: 'org-meta'
                    }, [
                        dom.createElement('span', {
                            className: 'org-plan'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-award'
                            }),
                            this.formatPlanName(this.organization.plan)
                        ]),
                        dom.createElement('span', {
                            className: 'org-created'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-calendar'
                            }),
                            `Created on ${dom.formatDate(this.organization.createdAt, 'long')}`
                        ])
                    ])
                ])
            ]),
            dom.createElement('div', {
                className: 'org-stats'
            }, [
                this.createStatItem('Members', this.members.length, 'fas fa-users'),
                this.createStatItem('Contracts', window.state.getState('contracts')?.length || 0, 'fas fa-file-contract'),
                this.createStatItem('Templates', window.state.getState('templates')?.length || 0, 'fas fa-copy')
            ])
        ]);
    }
    
    /**
     * Create a stat item for organization details
     * @param {string} label - Stat label
     * @param {number} value - Stat value
     * @param {string} icon - Icon class
     * @returns {HTMLElement} Stat item element
     */
    createStatItem(label, value, icon) {
        return dom.createElement('div', {
            className: 'stat-item'
        }, [
            dom.createElement('div', {
                className: 'stat-icon'
            }, [
                dom.createElement('i', {
                    className: icon
                })
            ]),
            dom.createElement('div', {
                className: 'stat-content'
            }, [
                dom.createElement('div', {
                    className: 'stat-value'
                }, value.toString()),
                dom.createElement('div', {
                    className: 'stat-label'
                }, label)
            ])
        ]);
    }
    
    /**
     * Render subscription information
     * @returns {HTMLElement} Subscription section element
     */
    renderSubscriptionInfo() {
        const subscription = this.organization.subscription;
        
        return dom.createElement('div', {
            className: 'section-container'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('h2', {}, 'Subscription'),
                window.state.hasPermission('manage_organization') ?
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'upgrade-plan-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-crown mr-2'
                    }),
                    'Upgrade Plan'
                ]) : null
            ]),
            dom.createElement('div', {
                className: 'subscription-details'
            }, [
                dom.createElement('div', {
                    className: 'subscription-info'
                }, [
                    dom.createElement('div', {
                        className: 'subscription-status'
                    }, [
                        dom.createElement('span', {
                            className: `status-badge ${subscription.status}`
                        }, subscription.status.toUpperCase()),
                        dom.createElement('span', {
                            className: 'plan-name'
                        }, this.formatPlanName(subscription.planId))
                    ]),
                    dom.createElement('div', {
                        className: 'billing-info'
                    }, [
                        dom.createElement('span', {}, [
                            'Billing Cycle: ',
                            subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)
                        ]),
                        dom.createElement('span', {}, [
                            'Next Billing: ',
                            dom.formatDate(subscription.nextBillingDate, 'medium')
                        ])
                    ])
                ]),
                dom.createElement('div', {
                    className: 'subscription-features'
                }, [
                    dom.createElement('h4', {}, 'Plan Features'),
                    dom.createElement('ul', {
                        className: 'features-list'
                    }, subscription.features.map(feature => 
                        dom.createElement('li', {}, [
                            dom.createElement('i', {
                                className: 'fas fa-check'
                            }),
                            feature
                        ])
                    ))
                ])
            ])
        ]);
    }
    
    /**
     * Render departments section
     * @returns {HTMLElement} Departments section element
     */
    renderDepartments() {
        return dom.createElement('div', {
            className: 'section-container'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('h2', {}, 'Departments'),
                window.state.hasPermission('manage_organization') ?
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'add-department-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-plus mr-2'
                    }),
                    'Add Department'
                ]) : null
            ]),
            dom.createElement('div', {
                className: 'departments-grid'
            }, this.organization.departments.map(dept => 
                dom.createElement('div', {
                    className: 'department-card'
                }, [
                    dom.createElement('div', {
                        className: 'department-icon'
                    }, [
                        dom.createElement('i', {
                            className: this.getDepartmentIcon(dept.name)
                        })
                    ]),
                    dom.createElement('div', {
                        className: 'department-info'
                    }, [
                        dom.createElement('h3', {}, dept.name),
                        dom.createElement('span', {
                            className: 'member-count'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-users'
                            }),
                            `${dept.memberCount} members`
                        ])
                    ])
                ])
            ))
        ]);
    }
    
    /**
     * Render recent activity section
     * @returns {HTMLElement} Activity section element
     */
    renderActivitySection() {
        return dom.createElement('div', {
            className: 'section-container'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('h2', {}, 'Recent Activity')
            ]),
            dom.createElement('div', {
                className: 'activity-list'
            }, this.organization.recentActivity.map(activity => 
                dom.createElement('div', {
                    className: 'activity-item'
                }, [
                    dom.createElement('div', {
                        className: 'activity-icon'
                    }, [
                        dom.createElement('i', {
                            className: this.getActivityIcon(activity.type)
                        })
                    ]),
                    dom.createElement('div', {
                        className: 'activity-content'
                    }, [
                        dom.createElement('div', {
                            className: 'activity-message'
                        }, this.formatActivityMessage(activity)),
                        dom.createElement('div', {
                            className: 'activity-time'
                        }, dom.formatDate(activity.timestamp, 'datetime'))
                    ])
                ])
            ))
        ]);
    }
    
    /**
     * Render settings section
     * @returns {HTMLElement} Settings section element
     */
    renderSettingsSection() {
        const settings = this.organization.settings;
        
        return dom.createElement('div', {
            className: 'section-container'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('h2', {}, 'Organization Settings')
            ]),
            dom.createElement('div', {
                className: 'settings-grid'
            }, [
                this.renderSettingToggle('Allow Guest Access', 
                    'Permit temporary access for external collaborators',
                    settings.allowGuestAccess,
                    'allowGuestAccess'),
                this.renderSettingToggle('Require Approval', 
                    'New members need admin approval to join',
                    settings.requireApproval,
                    'requireApproval'),
                dom.createElement('div', {
                    className: 'setting-item'
                }, [
                    dom.createElement('div', {
                        className: 'setting-header'
                    }, [
                        dom.createElement('h3', {}, 'Default Contract Duration'),
                        dom.createElement('input', {
                            type: 'number',
                            value: settings.defaultContractDuration,
                            min: '1',
                            max: '365',
                            className: 'duration-input',
                            'data-setting': 'defaultContractDuration'
                        })
                    ]),
                    dom.createElement('p', {
                        className: 'setting-description'
                    }, 'Default duration in days for new contracts')
                ]),
                dom.createElement('div', {
                    className: 'setting-item notification-preferences'
                }, [
                    dom.createElement('h3', {}, 'Notification Preferences'),
                    dom.createElement('div', {
                        className: 'notification-options'
                    }, [
                        this.renderNotificationToggle('Email Notifications', 
                            settings.notificationPreferences.email,
                            'email'),
                        this.renderNotificationToggle('In-App Notifications', 
                            settings.notificationPreferences.inApp,
                            'inApp'),
                        this.renderNotificationToggle('Contract Expiry Alerts', 
                            settings.notificationPreferences.contractExpiry,
                            'contractExpiry'),
                        this.renderNotificationToggle('New Member Alerts', 
                            settings.notificationPreferences.newMembers,
                            'newMembers')
                    ])
                ])
            ])
        ]);
    }
    
    /**
     * Render a setting toggle
     * @param {string} title - Setting title
     * @param {string} description - Setting description
     * @param {boolean} value - Current value
     * @param {string} key - Setting key
     * @returns {HTMLElement} Setting toggle element
     */
    renderSettingToggle(title, description, value, key) {
        return dom.createElement('div', {
            className: 'setting-item'
        }, [
            dom.createElement('div', {
                className: 'setting-header'
            }, [
                dom.createElement('h3', {}, title),
                dom.createElement('label', {
                    className: 'switch'
                }, [
                    dom.createElement('input', {
                        type: 'checkbox',
                        checked: value,
                        'data-setting': key
                    }),
                    dom.createElement('span', {
                        className: 'slider'
                    })
                ])
            ]),
            dom.createElement('p', {
                className: 'setting-description'
            }, description)
        ]);
    }
    
    /**
     * Render a notification preference toggle
     * @param {string} label - Toggle label
     * @param {boolean} value - Current value
     * @param {string} key - Preference key
     * @returns {HTMLElement} Notification toggle element
     */
    renderNotificationToggle(label, value, key) {
        return dom.createElement('label', {
            className: 'notification-option'
        }, [
            dom.createElement('input', {
                type: 'checkbox',
                checked: value,
                'data-notification': key
            }),
            label
        ]);
    }
    
    /**
     * Get icon class for department
     * @param {string} name - Department name
     * @returns {string} Icon class
     */
    getDepartmentIcon(name) {
        switch (name.toLowerCase()) {
            case 'legal':
                return 'fas fa-balance-scale';
            case 'sales':
                return 'fas fa-chart-line';
            case 'operations':
                return 'fas fa-cogs';
            case 'hr':
                return 'fas fa-users';
            default:
                return 'fas fa-building';
        }
    }
    
    /**
     * Get icon class for activity type
     * @param {string} type - Activity type
     * @returns {string} Icon class
     */
    getActivityIcon(type) {
        switch (type) {
            case 'member_joined':
                return 'fas fa-user-plus';
            case 'plan_upgraded':
                return 'fas fa-arrow-up';
            case 'settings_updated':
                return 'fas fa-cog';
            default:
                return 'fas fa-info-circle';
        }
    }
    
    /**
     * Format activity message
     * @param {Object} activity - Activity data
     * @returns {string} Formatted message
     */
    formatActivityMessage(activity) {
        switch (activity.type) {
            case 'member_joined':
                const member = this.members.find(m => m.id === activity.userId);
                return `${member ? member.name : 'A new member'} joined the organization`;
            case 'plan_upgraded':
                return `Organization plan upgraded from ${this.formatPlanName(activity.from)} to ${this.formatPlanName(activity.to)}`;
            case 'settings_updated':
                const updater = this.members.find(m => m.id === activity.by);
                return `Settings updated by ${updater ? updater.name : 'an administrator'}`;
            default:
                return 'Unknown activity';
        }
    }
    
    /**
     * Render members section
     * @returns {HTMLElement} Members section element
     */
    renderMembersSection() {
        return dom.createElement('div', {
            className: 'section-container'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('h2', {}, 'Team Members'),
                window.state.hasPermission('manage_members') ? 
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'invite-member-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-user-plus mr-2'
                    }),
                    'Invite Member'
                ]) : null
            ]),
            dom.createElement('div', {
                className: 'members-list'
            }, this.members.length > 0 ? 
                this.members.map(member => this.renderMemberItem(member)) :
                [dom.createElement('div', {
                    className: 'empty-state'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-users'
                    }),
                    dom.createElement('p', {}, 'No members found')
                ])]
            )
        ]);
    }
    
    /**
     * Render a member item
     * @param {Object} member - Member data
     * @returns {HTMLElement} Member item element
     */
    renderMemberItem(member) {
        const currentUser = window.state.getState('currentUser');
        const isCurrentUser = member.id === currentUser.id;
        const canManageUser = window.state.hasPermission('manage_members') && !isCurrentUser;
        
        return dom.createElement('div', {
            className: 'member-item',
            'data-id': member.id
        }, [
            dom.createElement('div', {
                className: 'member-avatar'
            }, [
                dom.createElement('img', {
                    src: member.profileImage || 'https://via.placeholder.com/40',
                    alt: member.name
                })
            ]),
            dom.createElement('div', {
                className: 'member-info'
            }, [
                dom.createElement('div', {
                    className: 'member-name'
                }, [
                    member.name,
                    isCurrentUser ? dom.createElement('span', {
                        className: 'current-user-badge'
                    }, 'You') : null
                ]),
                dom.createElement('div', {
                    className: 'member-email'
                }, member.email),
                dom.createElement('div', {
                    className: 'member-role'
                }, this.formatRoleName(member.role))
            ]),
            canManageUser ? dom.createElement('div', {
                className: 'member-actions'
            }, [
                dom.createElement('button', {
                    className: 'btn-icon',
                    title: 'Change Role',
                    'data-action': 'change-role',
                    'data-id': member.id
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-user-cog'
                    })
                ]),
                dom.createElement('button', {
                    className: 'btn-icon',
                    title: 'Remove Member',
                    'data-action': 'remove-member',
                    'data-id': member.id
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-user-minus'
                    })
                ])
            ]) : null
        ]);
    }
    
    /**
     * Render invitations section
     * @param {Array} invitations - Pending invitations
     * @returns {HTMLElement} Invitations section element
     */
    renderInvitationsSection(invitations) {
        return dom.createElement('div', {
            className: 'section-container'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('h2', {}, 'Pending Invitations'),
                invitations.length > 0 ? dom.createElement('div', {
                    className: 'invitation-count'
                }, `${invitations.length} pending`) : null
            ]),
            dom.createElement('div', {
                className: 'invitations-list'
            }, invitations.length > 0 ? 
                invitations.map(invitation => this.renderInvitationItem(invitation)) :
                [dom.createElement('div', {
                    className: 'empty-state'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-envelope'
                    }),
                    dom.createElement('p', {}, 'No pending invitations')
                ])]
            )
        ]);
    }
    
    /**
     * Render an invitation item
     * @param {Object} invitation - Invitation data
     * @returns {HTMLElement} Invitation item element
     */
    renderInvitationItem(invitation) {
        const inviter = window.mockData.getUser(invitation.invitedBy);
        
        return dom.createElement('div', {
            className: 'invitation-item'
        }, [
            dom.createElement('div', {
                className: 'invitation-icon'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-envelope'
                })
            ]),
            dom.createElement('div', {
                className: 'invitation-info'
            }, [
                dom.createElement('div', {
                    className: 'invitation-email'
                }, invitation.email),
                dom.createElement('div', {
                    className: 'invitation-details'
                }, [
                    dom.createElement('span', {
                        className: 'invitation-role'
                    }, this.formatRoleName(invitation.role)),
                    dom.createElement('span', {
                        className: 'invitation-date'
                    }, [
                        'Invited ',
                        dom.formatDate(invitation.invitedAt, 'short'),
                        ' by ',
                        inviter ? inviter.name : 'Unknown'
                    ])
                ])
            ]),
            dom.createElement('div', {
                className: 'invitation-actions'
            }, [
                dom.createElement('button', {
                    className: 'btn-icon',
                    title: 'Resend Invitation',
                    'data-action': 'resend-invitation',
                    'data-email': invitation.email
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-paper-plane'
                    })
                ]),
                dom.createElement('button', {
                    className: 'btn-icon',
                    title: 'Cancel Invitation',
                    'data-action': 'cancel-invitation',
                    'data-email': invitation.email
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-times'
                    })
                ])
            ])
        ]);
    }
    
    /**
     * Render no organization found message
     * @returns {HTMLElement} No organization element
     */
    renderNoOrganization() {
        return dom.createElement('div', {
            className: 'empty-state-container'
        }, [
            dom.createElement('div', {
                className: 'empty-state-icon'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-building'
                })
            ]),
            dom.createElement('h2', {}, 'No Organization Found'),
            dom.createElement('p', {
                className: 'empty-state-text'
            }, 'You are not part of any organization at the moment'),
            dom.createElement('button', {
                className: 'btn btn-primary',
                id: 'create-org-btn'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-plus mr-2'
                }),
                'Create Organization'
            ])
        ]);
    }
    
    /**
     * Format role name for display
     * @param {string} role - Role code
     * @returns {string} Formatted role name
     */
    formatRoleName(role) {
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
    
    /**
     * Format plan name for display
     * @param {string} plan - Plan code
     * @returns {string} Formatted plan name
     */
    formatPlanName(plan) {
        switch (plan) {
            case 'free':
                return 'Free Plan';
            case 'basic':
                return 'Basic Plan';
            case 'pro':
                return 'Professional Plan';
            case 'business':
                return 'Business Plan';
            case 'enterprise':
                return 'Enterprise Plan';
            default:
                return plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
        }
    }
    
    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Edit organization
        const editOrgBtn = document.getElementById('edit-org-btn');
        if (editOrgBtn) {
            editOrgBtn.addEventListener('click', this.handleEditOrganization.bind(this));
        }
        
        // Create organization
        const createOrgBtn = document.getElementById('create-org-btn');
        if (createOrgBtn) {
            createOrgBtn.addEventListener('click', this.handleCreateOrganization.bind(this));
        }
        
        // Invite member
        const inviteMemberBtn = document.getElementById('invite-member-btn');
        if (inviteMemberBtn) {
            inviteMemberBtn.addEventListener('click', this.handleInviteMember.bind(this));
        }
        
        // Member actions
        const memberActions = document.querySelectorAll('[data-action="change-role"], [data-action="remove-member"]');
        memberActions.forEach(button => {
            const action = button.getAttribute('data-action');
            const memberId = parseInt(button.getAttribute('data-id'), 10);
            
            button.addEventListener('click', () => {
                if (action === 'change-role') {
                    this.handleChangeRole(memberId);
                } else if (action === 'remove-member') {
                    this.handleRemoveMember(memberId);
                }
            });
        });
        
        // Invitation actions
        const invitationActions = document.querySelectorAll('[data-action="resend-invitation"], [data-action="cancel-invitation"]');
        invitationActions.forEach(button => {
            const action = button.getAttribute('data-action');
            const email = button.getAttribute('data-email');
            
            button.addEventListener('click', () => {
                if (action === 'resend-invitation') {
                    this.handleResendInvitation(email);
                } else if (action === 'cancel-invitation') {
                    this.handleCancelInvitation(email);
                }
            });
        });
    }
    
    /**
     * Handle edit organization
     */
    handleEditOrganization() {
        // In a real app, this would open a modal to edit organization details
        dom.showToast('Edit organization feature would open here', 'info');
    }
    
    /**
     * Handle create organization
     */
    handleCreateOrganization() {
        // In a real app, this would open a modal to create a new organization
        dom.showToast('Create organization feature would open here', 'info');
    }
    
    /**
     * Handle invite member
     */
    handleInviteMember() {
        // Create a modal to invite a new member
        const content = dom.createElement('form', {
            id: 'invite-form',
            className: 'invite-form'
        }, [
            dom.createElement('div', {
                className: 'form-group'
            }, [
                dom.createElement('label', {
                    for: 'invite-email'
                }, 'Email Address'),
                dom.createElement('input', {
                    type: 'email',
                    id: 'invite-email',
                    placeholder: 'Enter email address',
                    required: true
                })
            ]),
            dom.createElement('div', {
                className: 'form-group'
            }, [
                dom.createElement('label', {
                    for: 'invite-role'
                }, 'Role'),
                dom.createElement('select', {
                    id: 'invite-role',
                    required: true
                }, [
                    dom.createElement('option', {
                        value: 'VIEWER'
                    }, 'Viewer'),
                    dom.createElement('option', {
                        value: 'EDITOR'
                    }, 'Editor'),
                    dom.createElement('option', {
                        value: 'ADMIN'
                    }, 'Administrator')
                ])
            ])
        ]);
        
        dom.createModal('Invite Team Member', content, [
            {
                label: 'Cancel',
                className: 'btn-secondary',
                action: () => {}
            },
            {
                label: 'Send Invitation',
                className: 'btn-primary',
                action: () => {
                    const email = document.getElementById('invite-email').value;
                    const role = document.getElementById('invite-role').value;
                    
                    if (email && role) {
                        // In a real app, this would send an invitation
                        dom.showToast(`Invitation sent to ${email}`, 'success');
                    }
                }
            }
        ]);
    }
    
    /**
     * Handle change role
     * @param {number} memberId - Member ID
     */
    handleChangeRole(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;
        
        const content = dom.createElement('div', {
            className: 'change-role-modal'
        }, [
            dom.createElement('p', {}, `Current role: ${this.formatRoleName(member.role)}`),
            dom.createElement('div', {
                className: 'form-group'
            }, [
                dom.createElement('label', {
                    for: 'new-role'
                }, 'New Role'),
                dom.createElement('select', {
                    id: 'new-role'
                }, [
                    dom.createElement('option', {
                        value: 'VIEWER',
                        selected: member.role === 'VIEWER'
                    }, 'Viewer'),
                    dom.createElement('option', {
                        value: 'EDITOR',
                        selected: member.role === 'EDITOR'
                    }, 'Editor'),
                    dom.createElement('option', {
                        value: 'ADMIN',
                        selected: member.role === 'ADMIN'
                    }, 'Administrator')
                ])
            ])
        ]);
        
        dom.createModal(`Change Role for ${member.name}`, content, [
            {
                label: 'Cancel',
                className: 'btn-secondary',
                action: () => {}
            },
            {
                label: 'Update Role',
                className: 'btn-primary',
                action: () => {
                    const newRole = document.getElementById('new-role').value;
                    
                    // In a real app, this would update the user's role
                    dom.showToast(`Role updated to ${this.formatRoleName(newRole)}`, 'success');
                }
            }
        ]);
    }
    
    /**
     * Handle remove member
     * @param {number} memberId - Member ID
     */
    handleRemoveMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;
        
        const content = dom.createElement('div', {}, [
            dom.createElement('p', {}, `Are you sure you want to remove ${member.name} from the organization?`),
            dom.createElement('p', {
                className: 'text-muted'
            }, 'This action cannot be undone.')
        ]);
        
        dom.createModal('Remove Team Member', content, [
            {
                label: 'Cancel',
                className: 'btn-secondary',
                action: () => {}
            },
            {
                label: 'Remove',
                className: 'btn-danger',
                action: () => {
                    // In a real app, this would remove the member
                    dom.showToast(`${member.name} has been removed from the organization`, 'success');
                }
            }
        ]);
    }
    
    /**
     * Handle resend invitation
     * @param {string} email - Invitation email
     */
    handleResendInvitation(email) {
        // In a real app, this would resend the invitation
        dom.showToast(`Invitation resent to ${email}`, 'success');
    }
    
    /**
     * Handle cancel invitation
     * @param {string} email - Invitation email
     */
    handleCancelInvitation(email) {
        const content = dom.createElement('div', {}, [
            dom.createElement('p', {}, `Are you sure you want to cancel the invitation sent to ${email}?`)
        ]);
        
        dom.createModal('Cancel Invitation', content, [
            {
                label: 'No',
                className: 'btn-secondary',
                action: () => {}
            },
            {
                label: 'Yes, Cancel',
                className: 'btn-danger',
                action: () => {
                    // In a real app, this would cancel the invitation
                    dom.showToast(`Invitation to ${email} has been cancelled`, 'success');
                }
            }
        ]);
    }
}

// Register component
window.components = window.components || {};
window.components.Organization = new Organization(); 
/**
 * Template Detail Component
 * Displays detailed information about a contract template
 */

class TemplateDetail {
    constructor() {
        this.loadStyles();
        this.template = null;
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/templatedetail.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/templatedetail.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the template detail component
     * @param {string} templateId - Template ID to display
     * @returns {HTMLElement} The template detail element
     */
    render(templateId) {
        // Create main container
        const container = dom.createElement('div', {
            className: 'template-detail-container'
        });
        
        // Load template data
        this.loadTemplateData(templateId);
        
        // If template is loading, show loading state
        if (!this.template) {
            container.appendChild(this.renderLoading());
            return container;
        }
        
        // Render page header
        const header = this.renderHeader();
        
        // Render template content
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
     * Load template data
     * @param {string} templateId - Template ID to load
     */
    loadTemplateData(templateId) {
        try {
            const id = parseInt(templateId, 10);
            this.template = window.mockData.getTemplate(id);
            
            if (!this.template) {
                this.template = null;
            }
        } catch (error) {
            console.error('Error loading template:', error);
            this.template = null;
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
            dom.createElement('p', {}, 'Loading template...')
        ]);
    }
    
    /**
     * Render not found state
     * @returns {HTMLElement} Not found element
     */
    renderNotFound() {
        return dom.createElement('div', {
            className: 'not-found-container'
        }, [
            dom.createElement('div', {
                className: 'not-found-content'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-file-excel fa-4x'
                }),
                dom.createElement('h2', {}, 'Template Not Found'),
                dom.createElement('p', {}, 'The template you are looking for does not exist or has been removed.'),
                dom.createElement('a', {
                    href: '#/templates',
                    className: 'btn btn-primary'
                }, 'Back to Templates')
            ])
        ]);
    }
    
    /**
     * Render page header
     * @returns {HTMLElement} Header element
     */
    renderHeader() {
        return dom.createElement('div', {
            className: 'detail-header'
        }, [
            dom.createElement('div', {
                className: 'detail-title-area'
            }, [
                dom.createElement('div', {
                    className: 'back-button'
                }, [
                    dom.createElement('a', {
                        href: '#/templates',
                        className: 'btn btn-link'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-arrow-left'
                        }),
                        ' Back to Templates'
                    ])
                ]),
                dom.createElement('div', {
                    className: 'template-title-wrapper'
                }, [
                    dom.createElement('h1', {}, this.template.name),
                    dom.createElement('div', {
                        className: 'template-meta'
                    }, [
                        dom.createElement('span', {
                            className: `category-badge ${this.template.category.toLowerCase()}`
                        }, this.template.category),
                        dom.createElement('span', {
                            className: 'usage-count'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-file-contract'
                            }),
                            ` Used ${this.template.usageCount} times`
                        ]),
                        dom.createElement('span', {
                            className: 'last-updated'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-clock'
                            }),
                            ` Updated ${dom.formatDate(this.template.updatedAt)}`
                        ])
                    ])
                ])
            ]),
            dom.createElement('div', {
                className: 'detail-actions'
            }, [
                dom.createElement('button', {
                    className: 'btn btn-outline',
                    id: 'edit-template-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-edit'
                    }),
                    ' Edit'
                ]),
                dom.createElement('button', {
                    className: 'btn btn-outline',
                    id: 'duplicate-template-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-copy'
                    }),
                    ' Duplicate'
                ]),
                dom.createElement('button', {
                    className: 'btn btn-outline',
                    id: 'download-template-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-download'
                    }),
                    ' Download'
                ]),
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'use-template-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-plus'
                    }),
                    ' Use Template'
                ])
            ])
        ]);
    }
    
    /**
     * Render template content
     * @returns {HTMLElement} Content element
     */
    renderContent() {
        return dom.createElement('div', {
            className: 'template-detail-content'
        }, [
            dom.createElement('div', {
                className: 'template-main-content'
            }, [
                this.renderOverview(),
                this.renderPreview(),
                this.renderClauses()
            ]),
            dom.createElement('div', {
                className: 'template-sidebar'
            }, [
                this.renderUsageStats(),
                this.renderTags(),
                this.renderRelatedTemplates()
            ])
        ]);
    }
    
    /**
     * Render template overview section
     * @returns {HTMLElement} Overview section
     */
    renderOverview() {
        return dom.createElement('div', {
            className: 'detail-section'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('div', {
                    className: 'section-icon'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-info-circle'
                    })
                ]),
                dom.createElement('h2', {}, 'Overview')
            ]),
            dom.createElement('div', {
                className: 'template-description'
            }, [
                dom.createElement('p', {}, this.template.description)
            ]),
            dom.createElement('div', {
                className: 'template-details'
            }, [
                dom.createElement('div', {
                    className: 'detail-grid'
                }, [
                    dom.createElement('div', {
                        className: 'detail-item'
                    }, [
                        dom.createElement('span', {
                            className: 'detail-label'
                        }, 'Category'),
                        dom.createElement('span', {
                            className: 'detail-value'
                        }, this.template.category)
                    ]),
                    dom.createElement('div', {
                        className: 'detail-item'
                    }, [
                        dom.createElement('span', {
                            className: 'detail-label'
                        }, 'Created'),
                        dom.createElement('span', {
                            className: 'detail-value'
                        }, dom.formatDate(this.template.createdAt))
                    ]),
                    dom.createElement('div', {
                        className: 'detail-item'
                    }, [
                        dom.createElement('span', {
                            className: 'detail-label'
                        }, 'Last Updated'),
                        dom.createElement('span', {
                            className: 'detail-value'
                        }, dom.formatDate(this.template.updatedAt))
                    ]),
                    dom.createElement('div', {
                        className: 'detail-item'
                    }, [
                        dom.createElement('span', {
                            className: 'detail-label'
                        }, 'Usage Count'),
                        dom.createElement('span', {
                            className: 'detail-value'
                        }, `${this.template.usageCount} times`)
                    ])
                ])
            ])
        ]);
    }
    
    /**
     * Render template preview section
     * @returns {HTMLElement} Preview section
     */
    renderPreview() {
        return dom.createElement('div', {
            className: 'detail-section'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('div', {
                    className: 'section-icon'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-eye'
                    })
                ]),
                dom.createElement('h2', {}, 'Preview')
            ]),
            dom.createElement('div', {
                className: 'template-preview-content'
            }, [
                dom.createElement('div', {
                    className: 'preview-document'
                }, [
                    dom.createElement('div', {
                        className: 'document-header'
                    }, [
                        dom.createElement('h3', {}, this.template.name),
                        dom.createElement('p', {
                            className: 'document-type'
                        }, this.template.category)
                    ]),
                    dom.createElement('div', {
                        className: 'document-body'
                    }, [
                        dom.createElement('p', {}, 'This is a preview of the template document. In a real application, this would show the actual template content with placeholders for variables.'),
                        dom.createElement('p', {}, 'The template includes standard clauses and sections that would be customized when creating a new contract from this template.')
                    ])
                ])
            ])
        ]);
    }
    
    /**
     * Render template clauses section
     * @returns {HTMLElement} Clauses section
     */
    renderClauses() {
        // Generate some sample clauses based on the template category
        const clauses = this.generateSampleClauses();
        
        return dom.createElement('div', {
            className: 'detail-section'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('div', {
                    className: 'section-icon'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-list-alt'
                    })
                ]),
                dom.createElement('h2', {}, 'Standard Clauses')
            ]),
            dom.createElement('div', {
                className: 'clauses-list'
            }, clauses.map(clause => 
                dom.createElement('div', {
                    className: 'clause-item'
                }, [
                    dom.createElement('div', {
                        className: 'clause-header'
                    }, [
                        dom.createElement('h3', {}, clause.title),
                        dom.createElement('span', {
                            className: clause.required ? 'clause-required' : 'clause-optional'
                        }, clause.required ? 'Required' : 'Optional')
                    ]),
                    dom.createElement('p', {
                        className: 'clause-description'
                    }, clause.description)
                ])
            ))
        ]);
    }
    
    /**
     * Generate sample clauses based on template category
     * @returns {Array} Array of clause objects
     */
    generateSampleClauses() {
        const category = this.template.category.toLowerCase();
        const clauses = [];
        
        // Common clauses for all templates
        clauses.push({
            title: 'Definitions',
            description: 'Defines key terms used throughout the document.',
            required: true
        });
        
        clauses.push({
            title: 'Term and Termination',
            description: 'Specifies the duration of the agreement and conditions for termination.',
            required: true
        });
        
        // Category-specific clauses
        if (category === 'employment') {
            clauses.push({
                title: 'Compensation and Benefits',
                description: 'Details salary, bonuses, and benefits provided to the employee.',
                required: true
            });
            clauses.push({
                title: 'Duties and Responsibilities',
                description: 'Outlines the job responsibilities and performance expectations.',
                required: true
            });
            clauses.push({
                title: 'Non-Compete',
                description: 'Restricts the employee from working with competitors for a specified period after employment ends.',
                required: false
            });
        } else if (category === 'nda') {
            clauses.push({
                title: 'Definition of Confidential Information',
                description: 'Specifies what information is considered confidential under the agreement.',
                required: true
            });
            clauses.push({
                title: 'Obligations of Receiving Party',
                description: 'Details the responsibilities of the party receiving confidential information.',
                required: true
            });
            clauses.push({
                title: 'Exclusions from Confidential Information',
                description: 'Identifies information that is not considered confidential under the agreement.',
                required: false
            });
        } else if (category === 'services') {
            clauses.push({
                title: 'Scope of Services',
                description: 'Defines the services to be provided under the agreement.',
                required: true
            });
            clauses.push({
                title: 'Payment Terms',
                description: 'Specifies payment amounts, schedules, and methods.',
                required: true
            });
            clauses.push({
                title: 'Intellectual Property Rights',
                description: 'Addresses ownership of work products and intellectual property.',
                required: false
            });
        } else {
            // Generic clauses for other categories
            clauses.push({
                title: 'Representations and Warranties',
                description: 'Statements of fact and promises made by the parties.',
                required: true
            });
            clauses.push({
                title: 'Limitation of Liability',
                description: 'Limits the liability of parties under certain circumstances.',
                required: false
            });
            clauses.push({
                title: 'Dispute Resolution',
                description: 'Outlines the process for resolving disputes between parties.',
                required: false
            });
        }
        
        return clauses;
    }
    
    /**
     * Render usage statistics section
     * @returns {HTMLElement} Usage stats section
     */
    renderUsageStats() {
        // Ensure usageCount is a valid number
        const totalUses = this.template.usageCount || 0;
        
        // Calculate statistics with fallbacks to prevent NaN
        const signedContracts = Math.floor(totalUses * 0.7) || 0;
        const pendingContracts = Math.floor(totalUses * 0.2) || 0;
        const expiredContracts = totalUses - signedContracts - pendingContracts || 0;
        
        return dom.createElement('div', {
            className: 'sidebar-section'
        }, [
            dom.createElement('h3', {}, [
                dom.createElement('i', {
                    className: 'fas fa-chart-bar'
                }),
                ' Usage Statistics'
            ]),
            dom.createElement('div', {
                className: 'usage-stats'
            }, [
                dom.createElement('div', {
                    className: 'stat-item'
                }, [
                    dom.createElement('span', {
                        className: 'stat-value'
                    }, totalUses.toString()),
                    dom.createElement('span', {
                        className: 'stat-label'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-file-contract'
                        }),
                        ' Total Uses'
                    ])
                ]),
                dom.createElement('div', {
                    className: 'stat-item'
                }, [
                    dom.createElement('span', {
                        className: 'stat-value'
                    }, signedContracts.toString()),
                    dom.createElement('span', {
                        className: 'stat-label'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-signature'
                        }),
                        ' Signed'
                    ])
                ]),
                dom.createElement('div', {
                    className: 'stat-item'
                }, [
                    dom.createElement('span', {
                        className: 'stat-value'
                    }, pendingContracts.toString()),
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
                className: 'usage-chart-container',
                id: 'usage-chart-container'
            })
        ]);
    }
    
    /**
     * Render tags section
     * @returns {HTMLElement} Tags section
     */
    renderTags() {
        return dom.createElement('div', {
            className: 'sidebar-section'
        }, [
            dom.createElement('h3', {}, [
                dom.createElement('i', {
                    className: 'fas fa-tags'
                }),
                ' Tags'
            ]),
            dom.createElement('div', {
                className: 'tags-container'
            }, this.template.tags && this.template.tags.length > 0 
                ? this.template.tags.map(tag => 
                    dom.createElement('span', {
                        className: 'tag'
                    }, tag)
                )
                : dom.createElement('p', {
                    className: 'no-tags'
                }, 'No tags added to this template.')
            )
        ]);
    }
    
    /**
     * Render related templates section
     * @returns {HTMLElement} Related templates section
     */
    renderRelatedTemplates() {
        // Get all templates
        const allTemplates = window.mockData.getTemplates();
        
        // Filter templates in the same category (excluding current template)
        const relatedTemplates = allTemplates
            .filter(t => t.category === this.template.category && t.id !== this.template.id)
            .slice(0, 3); // Limit to 3 related templates
        
        return dom.createElement('div', {
            className: 'sidebar-section'
        }, [
            dom.createElement('h3', {}, [
                dom.createElement('i', {
                    className: 'fas fa-link'
                }),
                ' Related Templates'
            ]),
            dom.createElement('div', {
                className: 'related-templates'
            }, relatedTemplates.length > 0
                ? relatedTemplates.map(template => 
                    dom.createElement('a', {
                        href: `#/templates/${template.id}`,
                        className: 'related-template-item'
                    }, [
                        dom.createElement('div', {
                            className: 'related-template-icon'
                        }, [
                            dom.createElement('i', {
                                className: this.getTemplateIcon(template.category)
                            })
                        ]),
                        dom.createElement('div', {
                            className: 'related-template-info'
                        }, [
                            dom.createElement('span', {
                                className: 'related-template-name'
                            }, template.name),
                            dom.createElement('span', {
                                className: 'related-template-usage'
                            }, `Used ${template.usageCount} times`)
                        ])
                    ])
                )
                : dom.createElement('p', {
                    className: 'no-related'
                }, 'No related templates found.')
            )
        ]);
    }
    
    /**
     * Get icon class for template category
     * @param {string} category - Template category
     * @returns {string} Icon class
     */
    getTemplateIcon(category) {
        const categoryLower = category.toLowerCase();
        
        switch (categoryLower) {
            case 'employment':
                return 'fas fa-user-tie';
            case 'nda':
                return 'fas fa-user-secret';
            case 'services':
                return 'fas fa-concierge-bell';
            case 'partnership':
                return 'fas fa-handshake';
            case 'lease':
                return 'fas fa-home';
            case 'sale':
                return 'fas fa-shopping-cart';
            default:
                return 'fas fa-file-contract';
        }
    }
    
    /**
     * Set up event handlers
     */
    setupEventHandlers() {
        // Edit template button
        const editBtn = document.getElementById('edit-template-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.handleEditTemplate());
        }
        
        // Duplicate template button
        const duplicateBtn = document.getElementById('duplicate-template-btn');
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', () => this.handleDuplicateTemplate());
        }
        
        // Download template button
        const downloadBtn = document.getElementById('download-template-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleDownloadTemplate());
        }
        
        // Use template button
        const useBtn = document.getElementById('use-template-btn');
        if (useBtn) {
            useBtn.addEventListener('click', () => this.handleUseTemplate());
        }
    }
    
    /**
     * Handle edit template button click
     */
    handleEditTemplate() {
        dom.showToast('Edit template functionality would be implemented here', 'info');
    }
    
    /**
     * Handle duplicate template button click
     */
    handleDuplicateTemplate() {
        dom.showToast('Template duplicated successfully', 'success');
    }
    
    /**
     * Handle download template button click
     */
    handleDownloadTemplate() {
        dom.showToast('Downloading template...', 'info');
        setTimeout(() => {
            dom.showToast('Template downloaded successfully', 'success');
        }, 1500);
    }
    
    /**
     * Handle use template button click
     */
    handleUseTemplate() {
        // Navigate to contract creation page with template ID
        window.router.navigate(`/contracts/new?template=${this.template.id}`);
    }
}

// Register component when script is loaded
window.components = window.components || {};
window.components.TemplateDetail = new TemplateDetail(); 
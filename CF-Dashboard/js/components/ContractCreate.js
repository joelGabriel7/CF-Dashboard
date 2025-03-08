/**
 * Contract Create Component
 * Handles the creation of new contracts
 */

class ContractCreate {
    constructor() {
        this.loadStyles();
        this.templates = [];
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/contractcreate.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/contractcreate.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the contract creation component
     * @returns {HTMLElement} The contract creation element
     */
    render() {
        // Get templates for the dropdown
        this.templates = window.mockData.getTemplates() || [];
        
        // Create main container
        const container = dom.createElement('div', {
            className: 'contract-create-container'
        });
        
        // Render page header
        const header = this.renderHeader();
        
        // Render form
        const form = this.renderForm();
        
        // Assemble component
        container.appendChild(header);
        container.appendChild(form);
        
        // Set up event handlers
        setTimeout(() => {
            this.setupEventHandlers();
        }, 0);
        
        return container;
    }
    
    /**
     * Render page header
     * @returns {HTMLElement} Header element
     */
    renderHeader() {
        return dom.createElement('div', {
            className: 'create-header'
        }, [
            dom.createElement('div', {
                className: 'create-title-area'
            }, [
                dom.createElement('div', {
                    className: 'back-button'
                }, [
                    dom.createElement('a', {
                        href: '#/contracts',
                        className: 'btn btn-link'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-arrow-left'
                        }),
                        ' Back to Contracts'
                    ])
                ]),
                dom.createElement('h1', {}, 'Create New Contract')
            ])
        ]);
    }
    
    /**
     * Render contract creation form
     * @returns {HTMLElement} Form element
     */
    renderForm() {
        const formContainer = dom.createElement('div', {
            className: 'create-form-container'
        });
        
        const form = dom.createElement('form', {
            className: 'create-form',
            id: 'contract-create-form'
        }, [
            // Basic Information Section
            dom.createElement('div', {
                className: 'form-section'
            }, [
                dom.createElement('div', {
                    className: 'form-section-header'
                }, [
                    dom.createElement('div', {
                        className: 'form-section-icon'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-info-circle'
                        })
                    ]),
                    dom.createElement('h2', {}, 'Basic Information')
                ]),
                dom.createElement('div', {
                    className: 'form-row'
                }, [
                    dom.createElement('div', {
                        className: 'form-group'
                    }, [
                        dom.createElement('label', {
                            htmlFor: 'contract-title',
                            className: 'required-label'
                        }, 'Contract Title'),
                        dom.createElement('input', {
                            type: 'text',
                            id: 'contract-title',
                            className: 'form-control',
                            required: true,
                            placeholder: 'Enter contract title'
                        }),
                        dom.createElement('span', {
                            className: 'form-hint'
                        }, 'Give your contract a clear, descriptive title')
                    ]),
                    dom.createElement('div', {
                        className: 'form-group'
                    }, [
                        dom.createElement('label', {
                            htmlFor: 'contract-type',
                            className: 'required-label'
                        }, 'Contract Type'),
                        dom.createElement('select', {
                            id: 'contract-type',
                            className: 'form-control',
                            required: true
                        }, [
                            dom.createElement('option', { value: '' }, 'Select contract type'),
                            dom.createElement('option', { value: 'Employment' }, 'Employment'),
                            dom.createElement('option', { value: 'NDA' }, 'Non-Disclosure Agreement'),
                            dom.createElement('option', { value: 'Services' }, 'Services Agreement'),
                            dom.createElement('option', { value: 'Partnership' }, 'Partnership Agreement'),
                            dom.createElement('option', { value: 'Lease' }, 'Lease Agreement'),
                            dom.createElement('option', { value: 'Sale' }, 'Sales Contract')
                        ]),
                        dom.createElement('span', {
                            className: 'form-hint'
                        }, 'Select the type that best describes this contract')
                    ])
                ])
            ]),
            
            // Template Selection Section
            dom.createElement('div', {
                className: 'form-section'
            }, [
                dom.createElement('div', {
                    className: 'form-section-header'
                }, [
                    dom.createElement('div', {
                        className: 'form-section-icon'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-file-alt'
                        })
                    ]),
                    dom.createElement('h2', {}, 'Template Selection')
                ]),
                dom.createElement('div', {
                    className: 'form-group'
                }, [
                    dom.createElement('label', {
                        htmlFor: 'contract-template'
                    }, 'Select Template (Optional)'),
                    dom.createElement('select', {
                        id: 'contract-template',
                        className: 'form-control'
                    }, [
                        dom.createElement('option', { value: '' }, 'Start from scratch'),
                        ...this.templates.map(template => 
                            dom.createElement('option', {
                                value: template.id
                            }, template.name)
                        )
                    ]),
                    dom.createElement('span', {
                        className: 'form-hint'
                    }, 'Using a template will pre-fill some fields for you')
                ]),
                dom.createElement('div', {
                    className: 'template-preview',
                    id: 'template-preview'
                }, [
                    dom.createElement('div', {
                        className: 'template-preview-header'
                    }, [
                        dom.createElement('span', {
                            className: 'template-preview-title',
                            id: 'preview-title'
                        }, ''),
                        dom.createElement('span', {
                            className: 'template-preview-category',
                            id: 'preview-category'
                        }, '')
                    ]),
                    dom.createElement('p', {
                        className: 'template-preview-description',
                        id: 'preview-description'
                    }, '')
                ])
            ]),
            
            // Contract Details Section
            dom.createElement('div', {
                className: 'form-section'
            }, [
                dom.createElement('div', {
                    className: 'form-section-header'
                }, [
                    dom.createElement('div', {
                        className: 'form-section-icon'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-file-contract'
                        })
                    ]),
                    dom.createElement('h2', {}, 'Contract Details')
                ]),
                dom.createElement('div', {
                    className: 'form-group'
                }, [
                    dom.createElement('label', {
                        htmlFor: 'contract-summary'
                    }, 'Summary'),
                    dom.createElement('textarea', {
                        id: 'contract-summary',
                        className: 'form-control',
                        rows: '4',
                        placeholder: 'Enter contract summary'
                    }),
                    dom.createElement('span', {
                        className: 'form-hint'
                    }, 'Provide a brief summary of the contract purpose and terms')
                ]),
                dom.createElement('div', {
                    className: 'form-row'
                }, [
                    dom.createElement('div', {
                        className: 'form-group'
                    }, [
                        dom.createElement('label', {
                            htmlFor: 'contract-tags'
                        }, 'Tags'),
                        dom.createElement('input', {
                            type: 'text',
                            id: 'contract-tags',
                            className: 'form-control',
                            placeholder: 'Enter tags (comma separated)'
                        }),
                        dom.createElement('span', {
                            className: 'form-hint'
                        }, 'Tags help you organize and find contracts later')
                    ]),
                    dom.createElement('div', {
                        className: 'form-group'
                    }, [
                        dom.createElement('label', {
                            htmlFor: 'contract-status'
                        }, 'Initial Status'),
                        dom.createElement('select', {
                            id: 'contract-status',
                            className: 'form-control'
                        }, [
                            dom.createElement('option', { value: 'draft' }, 'Draft'),
                            dom.createElement('option', { value: 'pending' }, 'Pending Signature')
                        ]),
                        dom.createElement('span', {
                            className: 'form-hint'
                        }, 'Set the initial status of this contract')
                    ])
                ])
            ]),
            
            // Form Actions
            this.renderFormActions()
        ]);
        
        formContainer.appendChild(form);
        return formContainer;
    }
    
    /**
     * Render form actions
     * @returns {HTMLElement} Form actions element
     */
    renderFormActions() {
        return dom.createElement('div', {
            className: 'form-actions'
        }, [
            dom.createElement('button', {
                type: 'button',
                className: 'btn btn-secondary',
                id: 'cancel-create'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-times'
                }),
                ' Cancel'
            ]),
            dom.createElement('button', {
                type: 'submit',
                className: 'btn btn-primary',
                id: 'submit-create'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-plus'
                }),
                ' Create Contract'
            ])
        ]);
    }
    
    /**
     * Set up event handlers
     */
    setupEventHandlers() {
        const form = document.getElementById('contract-create-form');
        const cancelBtn = document.getElementById('cancel-create');
        const templateSelect = document.getElementById('contract-template');
        
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.handleCancel());
        }
        
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => this.handleTemplateChange(e));
        }
    }
    
    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    handleSubmit(event) {
        event.preventDefault();
        
        const title = document.getElementById('contract-title').value;
        const type = document.getElementById('contract-type').value;
        const templateId = document.getElementById('contract-template').value;
        const summary = document.getElementById('contract-summary').value;
        const status = document.getElementById('contract-status').value;
        const tags = document.getElementById('contract-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);
        
        if (!title || !type) {
            dom.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        try {
            // Get current user from state
            const currentUser = window.state.getState('currentUser');
            
            if (!currentUser) {
                throw new Error('No user logged in');
            }
            
            // Create new contract
            const newContract = {
                id: Date.now(),
                title,
                type,
                status: status || 'draft',
                summary,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: currentUser.id,
                templateId: templateId || null,
                parties: [],
                tags,
                history: [
                    {
                        type: 'created',
                        title: 'Contract Created',
                        description: templateId ? 
                            `Contract created from template: ${this.templates.find(t => t.id.toString() === templateId)?.name}` :
                            'Contract created from scratch',
                        date: new Date().toISOString()
                    }
                ]
            };
            
            // Save contract to mockData
            window.mockData.addContract(newContract);
            
            // Update global state with the new contract
            const currentContracts = window.state.getState('contracts') || [];
            window.state.setState('contracts', [...currentContracts, newContract]);
            
            // Show success message
            dom.showToast('Contract created successfully', 'success');
            
            // Navigate to the new contract detail page
            window.router.navigate(`/contracts/${newContract.id}`);
            
        } catch (error) {
            console.error('Error creating contract:', error);
            dom.showToast('Error creating contract', 'error');
        }
    }
    
    /**
     * Handle cancel button click
     */
    handleCancel() {
        window.router.navigate('/contracts');
    }
    
    /**
     * Handle template selection change
     * @param {Event} event - Change event
     */
    handleTemplateChange(event) {
        const templateId = event.target.value;
        const previewElement = document.getElementById('template-preview');
        
        if (!templateId) {
            previewElement.classList.remove('visible');
            return;
        }
        
        const template = this.templates.find(t => t.id.toString() === templateId);
        if (template) {
            // Update preview
            document.getElementById('preview-title').textContent = template.name;
            document.getElementById('preview-category').textContent = template.category;
            document.getElementById('preview-description').textContent = template.description;
            
            // Show preview
            previewElement.classList.add('visible');
            
            // Pre-fill form fields based on template
            document.getElementById('contract-title').value = `${template.name} - Contract`;
            document.getElementById('contract-type').value = template.category;
            document.getElementById('contract-summary').value = template.description;
            document.getElementById('contract-tags').value = template.tags.join(', ');
        }
    }
}

// Register component when script is loaded
window.components = window.components || {};
window.components.ContractCreate = new ContractCreate(); 
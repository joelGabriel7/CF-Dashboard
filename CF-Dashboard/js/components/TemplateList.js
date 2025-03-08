/**
 * Template List Component
 * Displays a searchable, filterable list of contract templates
 */

class TemplateList {
    constructor() {
        this.loadStyles();
        this.templates = [];
        this.filteredTemplates = [];
        this.filters = {
            category: '',
            search: ''
        };
        this.sort = {
            field: 'name',
            direction: 'asc'
        };
        this.pagination = {
            page: 1,
            perPage: 8,
            total: 0,
            totalPages: 0
        };
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/templatelist.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/templatelist.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the template list component
     * @returns {HTMLElement} The template list element
     */
    render() {
        // Get templates from state or mock data
        this.templates = window.mockData.getTemplates() || [];
        
        // Apply filters and sorting
        this.applyFilters();
        
        // Create component container
        const container = dom.createElement('div', {
            className: 'template-list-container'
        });
        
        // Render page header
        const header = this.renderHeader();
        
        // Render search and filters
        const filters = this.renderFilters();
        
        // Render template grid
        const grid = this.renderTemplateGrid();
        
        // Render pagination
        const pagination = this.renderPagination();
        
        // Assemble component
        container.appendChild(header);
        container.appendChild(filters);
        container.appendChild(grid);
        container.appendChild(pagination);
        
        // Set up event handlers
        setTimeout(() => {
            this.setupEventHandlers();
        }, 0);
        
        return container;
    }
    
    /**
     * Render page header with actions
     * @returns {HTMLElement} Header element
     */
    renderHeader() {
        return dom.createElement('div', {
            className: 'template-header'
        }, [
            dom.createElement('div', {
                className: 'template-title-area'
            }, [
                dom.createElement('h1', {}, 'Templates'),
                dom.createElement('p', {
                    className: 'text-secondary'
                }, 'Browse and use contract templates')
            ]),
            dom.createElement('div', {
                className: 'template-actions'
            }, [
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'create-template-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-plus'
                    }),
                    ' Create Template'
                ])
            ])
        ]);
    }
    
    /**
     * Render search and filters section
     * @returns {HTMLElement} Filters element
     */
    renderFilters() {
        const filterSection = dom.createElement('div', {
            className: 'filter-section'
        });
        
        // Search input
        const searchGroup = dom.createElement('div', {
            className: 'filter-group'
        }, [
            dom.createElement('label', {
                htmlFor: 'template-search'
            }, 'Search Templates'),
            dom.createElement('input', {
                type: 'text',
                id: 'template-search',
                placeholder: 'Search by name or description',
                value: this.filters.search
            })
        ]);
        
        // Category filter
        const categoryGroup = dom.createElement('div', {
            className: 'filter-group'
        }, [
            dom.createElement('label', {
                htmlFor: 'template-category'
            }, 'Category'),
            dom.createElement('select', {
                id: 'template-category'
            }, this.getCategoryOptions())
        ]);
        
        // Filter actions
        const filterActions = dom.createElement('div', {
            className: 'filter-actions'
        }, [
            dom.createElement('button', {
                className: 'btn btn-secondary',
                id: 'clear-filters-btn'
            }, 'Clear Filters')
        ]);
        
        filterSection.appendChild(searchGroup);
        filterSection.appendChild(categoryGroup);
        filterSection.appendChild(filterActions);
        
        return filterSection;
    }
    
    /**
     * Get category options for select dropdown
     * @returns {Array} Array of option elements
     */
    getCategoryOptions() {
        const categories = [...new Set(this.templates.map(template => template.category))];
        
        // Add "All Categories" option
        const options = [
            dom.createElement('option', {
                value: ''
            }, 'All Categories')
        ];
        
        // Add category options
        categories.forEach(category => {
            options.push(
                dom.createElement('option', {
                    value: category
                }, category)
            );
        });
        
        return options;
    }
    
    /**
     * Render template grid
     * @returns {HTMLElement} Template grid element
     */
    renderTemplateGrid() {
        const gridContainer = dom.createElement('div', {
            className: 'template-grid'
        });
        
        const paginatedTemplates = this.getPaginatedTemplates();
        
        if (paginatedTemplates.length === 0) {
            // Show no results message
            gridContainer.appendChild(this.renderEmptyState());
        } else {
            // Render template cards
            paginatedTemplates.forEach(template => {
                gridContainer.appendChild(this.renderTemplateCard(template));
            });
        }
        
        return gridContainer;
    }
    
    /**
     * Render a single template card
     * @param {Object} template - Template object
     * @returns {HTMLElement} Template card element
     */
    renderTemplateCard(template) {
        const card = dom.createElement('div', {
            className: 'template-card',
            'data-id': template.id
        });
        
        // Card header with icon and title
        const cardHeader = dom.createElement('div', {
            className: 'template-card-header'
        }, [
            dom.createElement('div', {
                className: `template-icon ${template.category.toLowerCase()}`
            }, [
                dom.createElement('i', {
                    className: this.getTemplateIcon(template.category)
                })
            ]),
            dom.createElement('h3', {
                className: 'template-title'
            }, template.name)
        ]);
        
        // Card body with description and metadata
        const cardBody = dom.createElement('div', {
            className: 'template-card-body'
        }, [
            dom.createElement('p', {
                className: 'template-description'
            }, template.description),
            dom.createElement('div', {
                className: 'template-meta'
            }, [
                dom.createElement('div', {
                    className: 'template-usage'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-file-contract'
                    }),
                    ` Used ${template.usageCount} times`
                ]),
                dom.createElement('div', {
                    className: 'template-date'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-clock'
                    }),
                    ` ${dom.formatDate(template.updatedAt)}`
                ])
            ])
        ]);
        
        // Card actions
        const cardActions = dom.createElement('div', {
            className: 'template-card-actions'
        }, [
            dom.createElement('button', {
                className: 'btn btn-primary template-btn use-template-btn',
                'data-id': template.id
            }, 'Use Template'),
            dom.createElement('div', {
                className: 'template-dropdown',
                'data-id': template.id
            }, [
                dom.createElement('button', {
                    className: 'template-dropdown-toggle',
                    'data-id': template.id
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-ellipsis-v'
                    })
                ]),
                dom.createElement('div', {
                    className: 'template-dropdown-menu'
                }, [
                    dom.createElement('a', {
                        href: '#',
                        className: 'template-dropdown-item edit-template',
                        'data-id': template.id
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-edit'
                        }),
                        'Edit'
                    ]),
                    dom.createElement('a', {
                        href: '#',
                        className: 'template-dropdown-item duplicate-template',
                        'data-id': template.id
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-copy'
                        }),
                        'Duplicate'
                    ]),
                    dom.createElement('a', {
                        href: '#',
                        className: 'template-dropdown-item download-template',
                        'data-id': template.id
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-download'
                        }),
                        'Download'
                    ]),
                    dom.createElement('a', {
                        href: '#',
                        className: 'template-dropdown-item delete-template delete',
                        'data-id': template.id
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-trash-alt'
                        }),
                        'Delete'
                    ])
                ])
            ])
        ]);
        
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardActions);
        
        return card;
    }
    
    /**
     * Get appropriate icon for template category
     * @param {string} category - Template category
     * @returns {string} CSS class for the icon
     */
    getTemplateIcon(category) {
        switch (category.toLowerCase()) {
            case 'employment':
                return 'fas fa-user-tie';
            case 'nda':
                return 'fas fa-user-secret';
            case 'services':
                return 'fas fa-handshake';
            case 'partnership':
                return 'fas fa-hands-helping';
            case 'lease':
                return 'fas fa-home';
            case 'sale':
                return 'fas fa-shopping-cart';
            case 'general':
                return 'fas fa-file-alt';
            default:
                return 'fas fa-file-contract';
        }
    }
    
    /**
     * Render pagination controls
     * @returns {HTMLElement} Pagination element
     */
    renderPagination() {
        const paginationContainer = dom.createElement('div', {
            className: 'pagination-container'
        });
        
        // Only show pagination if there are enough items
        if (this.filteredTemplates.length <= this.pagination.perPage) {
            return paginationContainer;
        }
        
        // Create pagination wrapper
        const pagination = dom.createElement('div', {
            className: 'pagination'
        });
        
        // Previous page button
        const prevButton = dom.createElement('button', {
            className: `pagination-btn pagination-nav ${this.pagination.page === 1 ? 'disabled' : ''}`,
            'data-page': 'prev',
            disabled: this.pagination.page === 1,
            title: 'Previous page'
        }, [
            dom.createElement('i', {
                className: 'fas fa-chevron-left'
            })
        ]);
        
        // Page numbers
        const pageNumbers = this.renderPageNumbers();
        
        // Next page button
        const nextButton = dom.createElement('button', {
            className: `pagination-btn pagination-nav ${this.pagination.page === this.pagination.totalPages ? 'disabled' : ''}`,
            'data-page': 'next',
            disabled: this.pagination.page === this.pagination.totalPages,
            title: 'Next page'
        }, [
            dom.createElement('i', {
                className: 'fas fa-chevron-right'
            })
        ]);
        
        // Assemble pagination
        pagination.appendChild(prevButton);
        pageNumbers.childNodes.forEach(node => {
            pagination.appendChild(node);
        });
        pagination.appendChild(nextButton);
        
        // Page size selector (inline)
        const pageSizeSelector = this.renderPageSizeSelector();
        
        // Page info
        const pageInfo = dom.createElement('div', {
            className: 'pagination-info'
        }, `Showing ${(this.pagination.page - 1) * this.pagination.perPage + 1} - 
            ${Math.min(this.pagination.page * this.pagination.perPage, this.filteredTemplates.length)} 
            of ${this.filteredTemplates.length} templates`);
        
        // Assemble pagination container
        paginationContainer.appendChild(pagination);
        paginationContainer.appendChild(dom.createElement('div', {
            className: 'pagination-controls'
        }, [
            pageSizeSelector,
            pageInfo
        ]));
        
        return paginationContainer;
    }
    
    /**
     * Render page number buttons
     * @returns {DocumentFragment} Page numbers fragment
     */
    renderPageNumbers() {
        const fragment = document.createDocumentFragment();
        
        // Determine which page numbers to show
        let startPage = Math.max(1, this.pagination.page - 2);
        let endPage = Math.min(this.pagination.totalPages, startPage + 4);
        
        // Adjust if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // First page button if not showing first page
        if (startPage > 1) {
            fragment.appendChild(
                dom.createElement('button', {
                    className: 'pagination-btn',
                    'data-page': 1,
                    title: 'First page'
                }, '1')
            );
            
            if (startPage > 2) {
                fragment.appendChild(
                    dom.createElement('span', {
                        className: 'pagination-ellipsis',
                        title: 'More pages'
                    }, '...')
                );
            }
        }
        
        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            fragment.appendChild(
                dom.createElement('button', {
                    className: `pagination-btn ${i === this.pagination.page ? 'active' : ''}`,
                    'data-page': i,
                    title: `Page ${i}`
                }, i.toString())
            );
        }
        
        // Last page button if not showing last page
        if (endPage < this.pagination.totalPages) {
            if (endPage < this.pagination.totalPages - 1) {
                fragment.appendChild(
                    dom.createElement('span', {
                        className: 'pagination-ellipsis',
                        title: 'More pages'
                    }, '...')
                );
            }
            
            fragment.appendChild(
                dom.createElement('button', {
                    className: 'pagination-btn',
                    'data-page': this.pagination.totalPages,
                    title: 'Last page'
                }, this.pagination.totalPages.toString())
            );
        }
        
        return fragment;
    }
    
    /**
     * Render page size selector
     * @returns {HTMLElement} Page size selector
     */
    renderPageSizeSelector() {
        const container = dom.createElement('div', {
            className: 'page-size-selector'
        });
        
        container.appendChild(dom.createElement('span', {}, 'Show'));
        
        const select = dom.createElement('select', {
            id: 'page-size-select',
            className: 'page-size-select'
        }, [
            dom.createElement('option', { value: '8', selected: this.pagination.perPage === 8 }, '8'),
            dom.createElement('option', { value: '16', selected: this.pagination.perPage === 16 }, '16'),
            dom.createElement('option', { value: '24', selected: this.pagination.perPage === 24 }, '24')
        ]);
        
        container.appendChild(select);
        container.appendChild(dom.createElement('span', {}, 'per page'));
        
        return container;
    }
    
    /**
     * Handle page size change
     * @param {Event} event - Select event
     */
    handlePageSizeChange(event) {
        const newPerPage = parseInt(event.target.value, 10);
        
        // Calculate new page to keep the first visible item the same if possible
        const firstVisibleItem = (this.pagination.page - 1) * this.pagination.perPage + 1;
        const newPage = Math.ceil(firstVisibleItem / newPerPage);
        
        this.pagination.perPage = newPerPage;
        this.pagination.page = newPage;
        this.pagination.totalPages = Math.ceil(this.filteredTemplates.length / this.pagination.perPage);
        
        this.refreshGrid();
    }
    
    /**
     * Apply filters and sorting to templates
     */
    applyFilters() {
        let filtered = [...this.templates];
        
        // Apply category filter
        if (this.filters.category) {
            filtered = filtered.filter(template => 
                template.category.toLowerCase().includes(this.filters.category.toLowerCase())
            );
        }
        
        // Apply search filter
        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(template => 
                template.name.toLowerCase().includes(search) || 
                template.description.toLowerCase().includes(search) ||
                template.category.toLowerCase().includes(search)
            );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let valueA = a[this.sort.field];
            let valueB = b[this.sort.field];
            
            // Handle string comparisons
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            
            // Compare values based on sort direction
            if (this.sort.direction === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
        
        // Update filtered templates and pagination
        this.filteredTemplates = filtered;
        this.pagination.total = filtered.length;
        this.pagination.totalPages = Math.ceil(filtered.length / this.pagination.perPage);
        this.pagination.page = Math.min(this.pagination.page, this.pagination.totalPages || 1);
    }
    
    /**
     * Get paginated subset of templates
     * @returns {Array} Paginated templates
     */
    getPaginatedTemplates() {
        const start = (this.pagination.page - 1) * this.pagination.perPage;
        const end = start + this.pagination.perPage;
        return this.filteredTemplates.slice(start, end);
    }
    
    /**
     * Handle page change
     * @param {number|string} page - Page number or 'prev'/'next'
     */
    handlePageChange(page) {
        if (page === 'prev') {
            this.pagination.page = Math.max(1, this.pagination.page - 1);
        } else if (page === 'next') {
            this.pagination.page = Math.min(this.pagination.totalPages, this.pagination.page + 1);
        } else {
            this.pagination.page = parseInt(page, 10);
        }
        
        this.refreshGrid();
    }
    
    /**
     * Handle search input change
     * @param {Event} event - Input event
     */
    handleSearchChange(event) {
        this.filters.search = event.target.value;
        this.pagination.page = 1;
        this.refreshGrid();
        
        // Show/hide clear filters button
        const clearBtn = document.getElementById('clear-filters-btn');
        if (clearBtn) {
            clearBtn.style.display = 
                Object.keys(this.filters).some(key => this.filters[key]) ? '' : 'none';
        }
    }
    
    /**
     * Handle category filter change
     * @param {Event} event - Select event
     */
    handleCategoryChange(event) {
        this.filters.category = event.target.value;
        this.pagination.page = 1;
        this.refreshGrid();
        
        // Show/hide clear filters button
        const clearBtn = document.getElementById('clear-filters-btn');
        if (clearBtn) {
            clearBtn.style.display = 
                Object.keys(this.filters).some(key => this.filters[key]) ? '' : 'none';
        }
    }
    
    /**
     * Handle clear filters button click
     */
    handleClearFilters() {
        // Reset filters
        this.filters = {
            category: '',
            search: ''
        };
        
        // Reset form elements
        document.getElementById('template-search').value = '';
        document.getElementById('template-category').value = '';
        
        // Reset pagination
        this.pagination.page = 1;
        
        // Apply filters and refresh grid
        this.applyFilters();
        this.refreshGrid();
        
        // Hide clear filters button
        const clearBtn = document.getElementById('clear-filters-btn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }
    
    /**
     * Handle template card click
     * @param {Event} event - Click event
     */
    handleTemplateClick(event) {
        const card = event.target.closest('.template-card');
        if (!card) return;
        
        // Don't trigger if clicking a button
        if (event.target.closest('button')) return;
        
        const templateId = card.getAttribute('data-id');
        window.router.navigate(`/templates/${templateId}`);
    }
    
    /**
     * Handle use template button click
     * @param {Event} event - Click event
     */
    handleUseTemplate(event) {
        const templateId = event.currentTarget.getAttribute('data-id');
        const template = this.templates.find(t => t.id.toString() === templateId);
        
        if (template) {
            dom.showModal({
                title: `Use Template: ${template.name}`,
                content: `
                    <div class="use-template-form">
                        <p>You are about to create a new contract using the "${template.name}" template.</p>
                        <div class="form-group">
                            <label for="contract-name">Contract Name</label>
                            <input type="text" id="contract-name" class="form-control" 
                                placeholder="Enter contract name" value="${template.name} - Contract">
                        </div>
                        <div class="form-group">
                            <label for="contract-summary">Contract Summary</label>
                            <textarea id="contract-summary" class="form-control" rows="3" 
                                placeholder="Enter contract summary">${template.description || ''}</textarea>
                        </div>
                    </div>
                `,
                okText: 'Create Contract',
                cancelText: 'Cancel',
                onConfirm: () => {
                    const contractName = document.getElementById('contract-name').value;
                    const contractSummary = document.getElementById('contract-summary').value;
                    
                    if (contractName) {
                        // Crear el nuevo contrato
                        const newContract = {
                            id: Date.now(), // Generar un ID único
                            title: contractName,
                            type: template.category,
                            status: 'draft',
                            summary: contractSummary,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            createdBy: window.auth.getCurrentUser()?.id || 1,
                            templateId: template.id,
                            parties: [],
                            tags: [],
                            history: [
                                {
                                    type: 'created',
                                    title: 'Contract Created',
                                    description: `Contract created from template: ${template.name}`,
                                    date: new Date().toISOString()
                                }
                            ]
                        };

                        // Guardar el nuevo contrato en el estado global o mock data
                        try {
                            window.mockData.addContract(newContract);
                            template.usageCount++; // Incrementar el contador de uso de la plantilla
                            
                            dom.showToast(`Creating new contract: ${contractName}`, 'success');
                            
                            // Redirigir al nuevo contrato después de un breve retraso
                            setTimeout(() => {
                                window.router.navigate(`/contracts/${newContract.id}`);
                            }, 500);
                        } catch (error) {
                            console.error('Error creating contract:', error);
                            dom.showToast('Error creating contract', 'error');
                            return false;
                        }
                    } else {
                        dom.showToast('Please enter a contract name', 'error');
                        return false; // Prevent modal from closing
                    }
                }
            });
        }
    }
    
    /**
     * Handle template actions button click
     * @param {Event} event - Click event
     */
    handleTemplateActions(event) {
        event.stopPropagation();
        const button = event.currentTarget;
        const templateId = button.getAttribute('data-id');
        const template = this.templates.find(t => t.id.toString() === templateId);
        
        if (template) {
            dom.showDropdownMenu(button, [
                {
                    label: 'View Details',
                    icon: 'fas fa-eye',
                    onClick: () => window.router.navigate(`/templates/${templateId}`)
                },
                {
                    label: 'Edit Template',
                    icon: 'fas fa-edit',
                    onClick: () => this.handleEditTemplate(templateId)
                },
                {
                    label: 'Duplicate',
                    icon: 'fas fa-copy',
                    onClick: () => this.handleDuplicateTemplate(templateId)
                },
                {
                    label: 'Download',
                    icon: 'fas fa-download',
                    onClick: () => this.handleDownloadTemplate(templateId)
                },
                {
                    label: 'Delete',
                    icon: 'fas fa-trash',
                    className: 'text-danger',
                    onClick: () => this.handleDeleteTemplate(templateId)
                }
            ]);
        }
    }
    
    /**
     * Handle create template button click
     */
    handleCreateTemplate() {
        // Implement create template functionality
        dom.showModal({
            title: 'Create New Template',
            content: `
                <div class="create-template-form">
                    <div class="form-group">
                        <label for="new-template-name">Template Name</label>
                        <input type="text" id="new-template-name" class="form-control" placeholder="Enter template name">
                    </div>
                    <div class="form-group">
                        <label for="new-template-category">Category</label>
                        <select id="new-template-category" class="form-control">
                            <option value="">Select Category</option>
                            <option value="employment">Employment</option>
                            <option value="nda">NDA</option>
                            <option value="services">Services</option>
                            <option value="partnership">Partnership</option>
                            <option value="lease">Lease</option>
                            <option value="sale">Sale</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="new-template-description">Description</label>
                        <textarea id="new-template-description" class="form-control" rows="3" placeholder="Enter template description"></textarea>
                    </div>
                </div>
            `,
            okText: 'Create Template',
            cancelText: 'Cancel',
            onConfirm: () => {
                const name = document.getElementById('new-template-name').value;
                const category = document.getElementById('new-template-category').value;
                const description = document.getElementById('new-template-description').value;
                
                if (name && category) {
                    const newTemplate = {
                        id: this.templates.length + 1, // Simple ID generation
                        name,
                        category,
                        description,
                        usageCount: 0
                    };
                    this.templates.push(newTemplate);
                    dom.showToast('Template created successfully', 'success');
                    this.refreshGrid();
                } else {
                    dom.showToast('Please fill in all required fields', 'error');
                    return false; // Prevent modal from closing
                }
            }
        });
    }
    
    /**
     * Handle edit template action
     * @param {string} templateId - Template ID
     */
    handleEditTemplate(templateId) {
        dom.showToast('Edit template feature coming soon', 'info');
    }
    
    /**
     * Handle duplicate template action
     * @param {string} templateId - Template ID
     */
    handleDuplicateTemplate(templateId) {
        const template = this.templates.find(t => t.id.toString() === templateId);
        if (template) {
            dom.showToast(`Duplicating template: ${template.name}`, 'info');
            setTimeout(() => {
                dom.showToast('Template duplicated successfully', 'success');
                this.refreshGrid();
            }, 1000);
        }
    }
    
    /**
     * Handle download template action
     * @param {string} templateId - Template ID
     */
    handleDownloadTemplate(templateId) {
        const template = this.templates.find(t => t.id.toString() === templateId);
        if (template) {
            dom.showToast(`Downloading template: ${template.name}`, 'info');
            setTimeout(() => {
                dom.showToast('Template downloaded successfully', 'success');
            }, 1000);
        }
    }
    
    /**
     * Handle delete template action
     * @param {string} templateId - Template ID
     */
    handleDeleteTemplate(templateId) {
        const template = this.templates.find(t => t.id.toString() === templateId);
        if (template) {
            dom.showModal({
                title: 'Delete Template',
                content: `
                    <p>Are you sure you want to delete the template "${template.name}"?</p>
                    <p class="text-danger"><strong>This action cannot be undone.</strong></p>
                `,
                okText: 'Delete',
                okClass: 'btn-danger',
                cancelText: 'Cancel',
                onConfirm: () => {
                    dom.showToast('Template deleted successfully', 'success');
                    this.refreshGrid();
                }
            });
        }
    }
    
    /**
     * Refresh the template grid
     */
    refreshGrid() {
        this.applyFilters();
        
        const container = document.querySelector('.template-list-container');
        if (!container) return;
        
        // Remove old grid and pagination
        const oldGrid = container.querySelector('.template-grid');
        const oldPagination = container.querySelector('.pagination-container');
        
        if (oldGrid) {
            const newGrid = this.renderTemplateGrid();
            container.replaceChild(newGrid, oldGrid);
        }
        
        if (oldPagination) {
            const newPagination = this.renderPagination();
            container.replaceChild(newPagination, oldPagination);
        }
        
        // Reattach event handlers
        this.setupEventHandlers();
    }
    
    /**
     * Set up event handlers for the component
     */
    setupEventHandlers() {
        // Search input
        const searchInput = document.getElementById('template-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearchChange(e));
        }
        
        // Category filter
        const categoryFilter = document.getElementById('template-category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.handleCategoryChange(e));
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.handleClearFilters());
        }
        
        // Create template button
        const createBtn = document.getElementById('create-template-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.handleCreateTemplate());
        }
        
        // Template cards
        const templateCards = document.querySelectorAll('.template-card');
        templateCards.forEach(card => {
            card.addEventListener('click', (e) => this.handleTemplateClick(e));
        });
        
        // Use template buttons
        const useTemplateBtns = document.querySelectorAll('.use-template-btn');
        useTemplateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                this.handleUseTemplate(e);
            });
        });
        
        // Template dropdown toggles
        const dropdownToggles = document.querySelectorAll('.template-dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                const dropdown = toggle.closest('.template-dropdown');
                dropdown.classList.toggle('open');
            });
        });
        
        // Template dropdown items
        const dropdownItems = document.querySelectorAll('.template-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                e.preventDefault();
                
                const templateId = parseInt(item.getAttribute('data-id'), 10);
                
                if (item.classList.contains('edit-template')) {
                    this.handleEditTemplate(templateId);
                } else if (item.classList.contains('duplicate-template')) {
                    this.handleDuplicateTemplate(templateId);
                } else if (item.classList.contains('download-template')) {
                    this.handleDownloadTemplate(templateId);
                } else if (item.classList.contains('delete-template')) {
                    this.handleDeleteTemplate(templateId);
                }
                
                // Close dropdown
                const dropdown = item.closest('.template-dropdown');
                dropdown.classList.remove('open');
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.template-dropdown')) {
                document.querySelectorAll('.template-dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
        
        // Pagination buttons
        const paginationBtns = document.querySelectorAll('.pagination-btn');
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    const page = btn.getAttribute('data-page');
                    this.handlePageChange(page);
                }
            });
        });
        
        // Page size selector
        const pageSizeSelect = document.getElementById('page-size-select');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => this.handlePageSizeChange(e));
        }
    }
    
    /**
     * Render no results message
     * @returns {HTMLElement} Empty state element
     */
    renderEmptyState() {
        return dom.createElement('div', {
            className: 'empty-state'
        }, [
            dom.createElement('i', {
                className: 'fas fa-file-alt'
            }),
            dom.createElement('h3', {}, 'No Templates Found'),
            dom.createElement('p', {}, 'Try adjusting your search or filters'),
            dom.createElement('button', {
                className: 'btn btn-primary',
                id: 'create-template-btn'
            }, [
                dom.createElement('i', {
                    className: 'fas fa-plus'
                }),
                ' Create Template'
            ])
        ]);
    }
}

// Register component when script is loaded
window.components = window.components || {};
window.components.TemplateList = new TemplateList(); 
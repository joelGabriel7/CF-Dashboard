/**
 * Contract List Component
 * Displays a filterable, sortable list of contracts
 */

class ContractList {
    constructor() {
        this.loadStyles();
        this.contracts = [];
        this.filteredContracts = [];
        this.filters = {
            status: '',
            type: '',
            search: '',
            dateFrom: '',
            dateTo: ''
        };
        this.sort = {
            field: 'createdAt',
            direction: 'desc'
        };
        this.pagination = {
            page: 1,
            perPage: 10,
            total: 0,
            totalPages: 0
        };
        this.unsubscribe = null;
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/contractlist.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/contractlist.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the contract list component
     * @returns {HTMLElement} The contract list element
     */
    render() {
        // Get contracts from state
        this.contracts = window.state.getState('contracts') || [];
        
        // Parse URL query parameters for initial filters
        this.parseQueryParams();
        
        // Apply filters and sorting
        this.applyFilters();
        
        // Create component container
        const container = dom.createElement('div', {
            className: 'contract-list-container'
        });
        
        // Render page header
        const header = this.renderHeader();
        
        // Render filters section
        const filters = this.renderFilters();
        
        // Render contracts table
        const table = this.renderTable();
        
        // Render pagination
        const pagination = this.renderPagination();
        
        // Assemble component
        container.appendChild(header);
        container.appendChild(filters);
        container.appendChild(table);
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
            className: 'list-header'
        }, [
            dom.createElement('div', {
                className: 'list-title'
            }, [
                dom.createElement('h1', {}, 'Contracts'),
                dom.createElement('p', {
                    className: 'text-secondary'
                }, 'Manage your contracts')
            ]),
            dom.createElement('div', {
                className: 'list-actions'
            }, [
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'new-contract-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-plus'
                    }),
                    ' New Contract'
                ])
            ])
        ]);
    }
    
    /**
     * Render filters section
     * @returns {HTMLElement} Filters element
     */
    renderFilters() {
        return dom.createElement('div', {
            className: 'filters-section'
        }, [
            dom.createElement('div', {
                className: 'search-box'
            }, [
                dom.createElement('input', {
                    type: 'text',
                    placeholder: 'Search contracts...',
                    id: 'search-input',
                    value: this.filters.search
                }),
                dom.createElement('i', {
                    className: 'fas fa-search'
                })
            ]),
            
            dom.createElement('div', {
                className: 'filters-controls'
            }, [
                // Status filter
                dom.createElement('div', {
                    className: 'filter-control'
                }, [
                    dom.createElement('label', {
                        for: 'status-filter'
                    }, 'Status'),
                    dom.createElement('select', {
                        id: 'status-filter',
                        value: this.filters.status
                    }, [
                        dom.createElement('option', {
                            value: ''
                        }, 'All Statuses'),
                        dom.createElement('option', {
                            value: 'draft'
                        }, 'Draft'),
                        dom.createElement('option', {
                            value: 'pending'
                        }, 'Pending'),
                        dom.createElement('option', {
                            value: 'signed'
                        }, 'Signed'),
                        dom.createElement('option', {
                            value: 'expired'
                        }, 'Expired')
                    ])
                ]),
                
                // Type filter
                dom.createElement('div', {
                    className: 'filter-control'
                }, [
                    dom.createElement('label', {
                        for: 'type-filter'
                    }, 'Type'),
                    dom.createElement('select', {
                        id: 'type-filter',
                        value: this.filters.type
                    }, this.getTypeOptions())
                ]),
                
                // Date filters
                dom.createElement('div', {
                    className: 'filter-control date-filter'
                }, [
                    dom.createElement('label', {
                        for: 'date-from'
                    }, 'From'),
                    dom.createElement('input', {
                        type: 'date',
                        id: 'date-from',
                        value: this.filters.dateFrom
                    })
                ]),
                
                dom.createElement('div', {
                    className: 'filter-control date-filter'
                }, [
                    dom.createElement('label', {
                        for: 'date-to'
                    }, 'To'),
                    dom.createElement('input', {
                        type: 'date',
                        id: 'date-to',
                        value: this.filters.dateTo
                    })
                ]),
                
                // Clear filters button
                dom.createElement('button', {
                    className: 'btn btn-secondary',
                    id: 'clear-filters-btn'
                }, 'Clear Filters')
            ])
        ]);
    }
    
    /**
     * Render contracts table
     * @returns {HTMLElement} Table element
     */
    renderTable() {
        return dom.createElement('div', {
            className: 'contracts-table-container'
        }, [
            this.filteredContracts.length > 0 ?
            dom.createElement('table', {
                className: 'table contracts-table'
            }, [
                dom.createElement('thead', {}, [
                    dom.createElement('tr', {}, [
                        this.renderSortableHeader('title', 'Contract Name'),
                        this.renderSortableHeader('type', 'Type'),
                        this.renderSortableHeader('status', 'Status'),
                        this.renderSortableHeader('createdAt', 'Created Date'),
                        this.renderSortableHeader('expiresAt', 'Expiry Date'),
                        dom.createElement('th', {
                            className: 'actions-column'
                        }, 'Actions')
                    ])
                ]),
                dom.createElement('tbody', {}, 
                    this.getPaginatedContracts().map(contract => this.renderContractRow(contract))
                )
            ]) :
            dom.createElement('div', {
                className: 'empty-state'
            }, [
                dom.createElement('div', {
                    className: 'empty-icon'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-file-contract'
                    })
                ]),
                dom.createElement('h3', {}, 'No Contracts Found'),
                dom.createElement('p', {}, 'Try adjusting your filters or create a new contract')
            ])
        ]);
    }
    
    /**
     * Render a sortable table header
     * @param {string} field - Sort field
     * @param {string} label - Header label
     * @returns {HTMLElement} Header cell element
     */
    renderSortableHeader(field, label) {
        const isActive = this.sort.field === field;
        
        return dom.createElement('th', {
            className: `sortable-header ${isActive ? 'active' : ''}`,
            'data-sort': field,
            onclick: () => this.handleSort(field)
        }, [
            label,
            dom.createElement('span', {
                className: 'sort-icon'
            }, [
                isActive ? 
                dom.createElement('i', {
                    className: `fas fa-sort-${this.sort.direction === 'asc' ? 'up' : 'down'}`
                }) :
                dom.createElement('i', {
                    className: 'fas fa-sort'
                })
            ])
        ]);
    }
    
    /**
     * Render a contract table row
     * @param {Object} contract - Contract data
     * @returns {HTMLElement} Table row element
     */
    renderContractRow(contract) {
        return dom.createElement('tr', {
            'data-id': contract.id
        }, [
            dom.createElement('td', {
                className: 'contract-name-cell',
                'data-label': 'Contract Name'
            }, [
                dom.createElement('a', {
                    href: `#/contracts/${contract.id}`,
                    className: 'contract-link'
                }, contract.title)
            ]),
            
            dom.createElement('td', {
                className: 'contract-type-cell',
                'data-label': 'Type'
            }, contract.type),
            
            dom.createElement('td', {
                className: 'contract-status-cell',
                'data-label': 'Status'
            }, [
                dom.createElement('span', {
                    className: `badge badge-${contract.status}`
                }, this.formatStatus(contract.status))
            ]),
            
            dom.createElement('td', {
                className: 'contract-date-cell',
                'data-label': 'Created Date'
            }, dom.formatDate(contract.createdAt, 'medium')),
            
            dom.createElement('td', {
                className: 'contract-date-cell',
                'data-label': 'Expiry Date'
            }, dom.formatDate(contract.expiresAt, 'medium')),
            
            dom.createElement('td', {
                className: 'contract-actions-cell',
                'data-label': 'Actions'
            }, [
                dom.createElement('div', {
                    className: 'actions-group'
                }, [
                    dom.createElement('a', {
                        href: `#/contracts/${contract.id}`,
                        className: 'btn-icon',
                        title: 'View Details'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-eye'
                        })
                    ]),
                    
                    window.state.hasPermission('edit_contracts') && contract.status !== 'signed' && contract.status !== 'expired' ?
                    dom.createElement('a', {
                        href: `#/contracts/${contract.id}/edit`,
                        className: 'btn-icon',
                        title: 'Edit Contract'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-edit'
                        })
                    ]) : null,
                    
                    dom.createElement('button', {
                        className: 'btn-icon',
                        title: 'Download PDF',
                        'data-id': contract.id,
                        'data-action': 'download'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-download'
                        })
                    ])
                ])
            ])
        ]);
    }
    
    /**
     * Render pagination controls
     * @returns {HTMLElement} Pagination element
     */
    renderPagination() {
        return dom.createElement('div', {
            className: 'pagination-container'
        }, [
            dom.createElement('div', {
                className: 'pagination-info'
            }, [
                `Showing ${(this.pagination.page - 1) * this.pagination.perPage + 1} - ${Math.min(this.pagination.page * this.pagination.perPage, this.pagination.total)} of ${this.pagination.total} contracts`
            ]),
            
            dom.createElement('div', {
                className: 'pagination-controls'
            }, [
                dom.createElement('button', {
                    className: 'pagination-btn',
                    disabled: this.pagination.page === 1,
                    id: 'prev-page-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-chevron-left'
                    }),
                    'Previous'
                ]),
                
                dom.createElement('div', {
                    className: 'pagination-pages'
                }, this.renderPageNumbers()),
                
                dom.createElement('button', {
                    className: 'pagination-btn',
                    disabled: this.pagination.page === this.pagination.totalPages,
                    id: 'next-page-btn'
                }, [
                    'Next',
                    dom.createElement('i', {
                        className: 'fas fa-chevron-right'
                    })
                ])
            ])
        ]);
    }
    
    /**
     * Render page number buttons
     * @returns {Array} Array of page number elements
     */
    renderPageNumbers() {
        const pages = [];
        const totalPages = this.pagination.totalPages;
        const currentPage = this.pagination.page;
        
        // Always show first page
        pages.push(
            dom.createElement('button', {
                className: `page-number ${currentPage === 1 ? 'active' : ''}`,
                'data-page': 1
            }, '1')
        );
        
        // Show ellipsis if needed
        if (currentPage > 3) {
            pages.push(
                dom.createElement('span', {
                    className: 'page-ellipsis'
                }, '...')
            );
        }
        
        // Calculate range of pages to show
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        // Adjust range if at edges
        if (currentPage <= 3) {
            endPage = Math.min(totalPages - 1, 4);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(2, totalPages - 3);
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                dom.createElement('button', {
                    className: `page-number ${currentPage === i ? 'active' : ''}`,
                    'data-page': i
                }, i.toString())
            );
        }
        
        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            pages.push(
                dom.createElement('span', {
                    className: 'page-ellipsis'
                }, '...')
            );
        }
        
        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pages.push(
                dom.createElement('button', {
                    className: `page-number ${currentPage === totalPages ? 'active' : ''}`,
                    'data-page': totalPages
                }, totalPages.toString())
            );
        }
        
        return pages;
    }
    
    /**
     * Get unique contract types for the filter dropdown
     * @returns {Array} Array of option elements
     */
    getTypeOptions() {
        // Get unique types
        const types = [...new Set(this.contracts.map(contract => contract.type))];
        
        // Create options with empty option first
        const options = [
            dom.createElement('option', {
                value: ''
            }, 'All Types')
        ];
        
        // Add type options
        types.sort().forEach(type => {
            options.push(
                dom.createElement('option', {
                    value: type,
                    selected: this.filters.type === type
                }, type)
            );
        });
        
        return options;
    }
    
    /**
     * Format contract status for display
     * @param {string} status - Contract status code
     * @returns {string} Formatted status text
     */
    formatStatus(status) {
        switch (status) {
            case 'draft': return 'Draft';
            case 'pending': return 'Pending';
            case 'signed': return 'Signed';
            case 'expired': return 'Expired';
            default: return status.charAt(0).toUpperCase() + status.slice(1);
        }
    }
    
    /**
     * Parse URL query parameters for filters
     */
    parseQueryParams() {
        const query = window.router.getQuery();
        
        // Apply filters from URL
        if (query.status) {
            this.filters.status = query.status;
        }
        
        if (query.type) {
            this.filters.type = query.type;
        }
        
        if (query.search) {
            this.filters.search = query.search;
        }
        
        if (query.dateFrom) {
            this.filters.dateFrom = query.dateFrom;
        }
        
        if (query.dateTo) {
            this.filters.dateTo = query.dateTo;
        }
        
        if (query.page) {
            this.pagination.page = parseInt(query.page, 10) || 1;
        }
        
        if (query.sort) {
            const [field, direction] = query.sort.split(':');
            if (field && direction) {
                this.sort.field = field;
                this.sort.direction = direction;
            }
        }
    }
    
    /**
     * Update URL with current filters and sort state
     */
    updateQueryParams() {
        const params = {};
        
        if (this.filters.status) {
            params.status = this.filters.status;
        }
        
        if (this.filters.type) {
            params.type = this.filters.type;
        }
        
        if (this.filters.search) {
            params.search = this.filters.search;
        }
        
        if (this.filters.dateFrom) {
            params.dateFrom = this.filters.dateFrom;
        }
        
        if (this.filters.dateTo) {
            params.dateTo = this.filters.dateTo;
        }
        
        if (this.pagination.page > 1) {
            params.page = this.pagination.page;
        }
        
        params.sort = `${this.sort.field}:${this.sort.direction}`;
        
        // Update URL without triggering navigation
        const url = `/contracts`;
        history.replaceState(null, '', `#${url}${Object.keys(params).length ? '?' + new URLSearchParams(params) : ''}`);
    }
    
    /**
     * Apply filters and sorting to contracts
     */
    applyFilters() {
        // Start with all contracts
        let filtered = [...this.contracts];
        
        // Apply status filter
        if (this.filters.status) {
            filtered = filtered.filter(contract => contract.status === this.filters.status);
        }
        
        // Apply type filter
        if (this.filters.type) {
            filtered = filtered.filter(contract => contract.type === this.filters.type);
        }
        
        // Apply search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(contract => 
                contract.title.toLowerCase().includes(searchTerm) ||
                contract.type.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply date filters
        if (this.filters.dateFrom) {
            const fromDate = new Date(this.filters.dateFrom);
            filtered = filtered.filter(contract => 
                new Date(contract.createdAt) >= fromDate
            );
        }
        
        if (this.filters.dateTo) {
            const toDate = new Date(this.filters.dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            filtered = filtered.filter(contract => 
                new Date(contract.createdAt) <= toDate
            );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let valueA = a[this.sort.field];
            let valueB = b[this.sort.field];
            
            // Handle dates
            if (this.sort.field === 'createdAt' || this.sort.field === 'expiresAt') {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            } else {
                // Handle string comparison
                if (typeof valueA === 'string') {
                    valueA = valueA.toLowerCase();
                }
                if (typeof valueB === 'string') {
                    valueB = valueB.toLowerCase();
                }
            }
            
            // Compare values based on direction
            if (this.sort.direction === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });
        
        // Update filtered contracts
        this.filteredContracts = filtered;
        
        // Update pagination
        this.pagination.total = filtered.length;
        this.pagination.totalPages = Math.max(1, Math.ceil(filtered.length / this.pagination.perPage));
        
        // Adjust current page if out of bounds
        if (this.pagination.page > this.pagination.totalPages) {
            this.pagination.page = this.pagination.totalPages;
        }
        
        // Update URL
        this.updateQueryParams();
    }
    
    /**
     * Get paginated contracts for current page
     * @returns {Array} Paginated contracts
     */
    getPaginatedContracts() {
        const start = (this.pagination.page - 1) * this.pagination.perPage;
        const end = start + this.pagination.perPage;
        
        return this.filteredContracts.slice(start, end);
    }
    
    /**
     * Handle sort header click
     * @param {string} field - Sort field
     */
    handleSort(field) {
        // If clicking the same field, toggle direction
        if (this.sort.field === field) {
            this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // Otherwise, set new field and default to asc
            this.sort.field = field;
            this.sort.direction = 'asc';
        }
        
        // Reapply filters with new sort
        this.applyFilters();
        
        // Re-render table
        this.refreshTable();
    }
    
    /**
     * Handle page change
     * @param {number} page - Page number
     */
    handlePageChange(page) {
        if (page < 1 || page > this.pagination.totalPages) return;
        
        this.pagination.page = page;
        this.updateQueryParams();
        this.refreshTable();
        
        // Scroll to top of table
        const tableContainer = document.querySelector('.contracts-table-container');
        if (tableContainer) {
            tableContainer.scrollTop = 0;
        }
    }
    
    /**
     * Handle filter change
     */
    handleFilterChange() {
        // Get filter values from form
        const statusFilter = document.getElementById('status-filter');
        const typeFilter = document.getElementById('type-filter');
        const searchInput = document.getElementById('search-input');
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        
        // Update filters
        this.filters.status = statusFilter.value;
        this.filters.type = typeFilter.value;
        this.filters.search = searchInput.value.trim();
        this.filters.dateFrom = dateFromInput.value;
        this.filters.dateTo = dateToInput.value;
        
        // Reset to first page
        this.pagination.page = 1;
        
        // Apply filters
        this.applyFilters();
        
        // Refresh the table
        this.refreshTable();
    }
    
    /**
     * Handle clear filters button click
     */
    handleClearFilters() {
        // Reset filters
        this.filters = {
            status: '',
            type: '',
            search: '',
            dateFrom: '',
            dateTo: ''
        };
        
        // Reset form inputs
        const statusFilter = document.getElementById('status-filter');
        const typeFilter = document.getElementById('type-filter');
        const searchInput = document.getElementById('search-input');
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        
        if (statusFilter) statusFilter.value = '';
        if (typeFilter) typeFilter.value = '';
        if (searchInput) searchInput.value = '';
        if (dateFromInput) dateFromInput.value = '';
        if (dateToInput) dateToInput.value = '';
        
        // Reset to first page
        this.pagination.page = 1;
        
        // Apply filters
        this.applyFilters();
        
        // Refresh the table
        this.refreshTable();
    }
    
    /**
     * Handle create contract button click
     */
    handleCreateContract() {
        window.router.navigate('/contracts/new');
    }
    
    /**
     * Handle contract download button click
     * @param {number} contractId - Contract ID
     */
    handleDownloadContract(contractId) {
        const contract = this.contracts.find(c => c.id === contractId);
        if (!contract) return;
        
        // In a real app, this would initiate a download
        // For this demo, just show a toast
        dom.showToast(`Downloaded ${contract.title}`, 'success');
    }
    
    /**
     * Re-render the table and pagination
     */
    refreshTable() {
        const tableContainer = document.querySelector('.contracts-table-container');
        const paginationContainer = document.querySelector('.pagination-container');
        
        if (tableContainer) {
            const newTable = this.renderTable();
            tableContainer.replaceWith(newTable);
        }
        
        if (paginationContainer) {
            const newPagination = this.renderPagination();
            paginationContainer.replaceWith(newPagination);
        }
        
        // Reattach event handlers
        this.setupEventHandlers();
    }
    
    /**
     * Set up event handlers
     */
    setupEventHandlers() {
        // New contract button
        const newContractBtn = document.getElementById('new-contract-btn');
        if (newContractBtn) {
            newContractBtn.addEventListener('click', () => {
                window.router.navigate('/contracts/new');
            });
        }
        
        // Filter inputs
        const statusFilter = document.getElementById('status-filter');
        const typeFilter = document.getElementById('type-filter');
        const searchInput = document.getElementById('search-input');
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
        
        if (typeFilter) {
            typeFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', dom.debounce(this.handleFilterChange.bind(this), 300));
        }
        
        if (dateFromInput) {
            dateFromInput.addEventListener('change', this.handleFilterChange.bind(this));
        }
        
        if (dateToInput) {
            dateToInput.addEventListener('change', this.handleFilterChange.bind(this));
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', this.handleClearFilters.bind(this));
        }
        
        // Pagination buttons
        const prevPageBtn = document.getElementById('prev-page-btn');
        const nextPageBtn = document.getElementById('next-page-btn');
        const pageButtons = document.querySelectorAll('.page-number');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (this.pagination.page > 1) {
                    this.handlePageChange(this.pagination.page - 1);
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                if (this.pagination.page < this.pagination.totalPages) {
                    this.handlePageChange(this.pagination.page + 1);
                }
            });
        }
        
        if (pageButtons) {
            pageButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const page = parseInt(button.dataset.page, 10);
                    this.handlePageChange(page);
                });
            });
        }
        
        // Download buttons
        const downloadButtons = document.querySelectorAll('button[data-action="download"]');
        if (downloadButtons) {
            downloadButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const contractId = parseInt(button.dataset.id, 10);
                    this.handleDownloadContract(contractId);
                });
            });
        }
    }
}

// Register component
window.components = window.components || {};
window.components.ContractList = new ContractList(); 
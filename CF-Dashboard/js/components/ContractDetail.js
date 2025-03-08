/**
 * Contract Detail Component
 * Displays detailed information about a specific contract
 */

class ContractDetail {
    constructor() {
        this.loadStyles();
        this.contract = null;
        this.unsubscribe = null;
        this.isLoading = true;
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/contractdetail.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/contractdetail.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the contract detail component
     * @param {string|number} contractId - ID of the contract to display
     * @returns {HTMLElement} The contract detail element
     */
    render(contractId) {
        // Create main container
        const container = dom.createElement('div', {
            className: 'contract-detail-container'
        });
        
        // Load contract data
        this.loadContractData(contractId);
        
        // Show loading state while fetching data
        if (this.isLoading) {
            container.appendChild(this.renderLoading());
            return container;
        }
        
        // Show not found message if contract doesn't exist
        if (!this.contract) {
            container.appendChild(this.renderNotFound());
            return container;
        }
        
        // Subscribe to contract updates in state
        this.subscribeToContractUpdates(contractId);
        
        // Render page header
        const header = this.renderHeader();
        
        // Render contract details
        const details = this.renderDetails();
        
        // Render parties information
        const parties = this.renderParties();
        
        // Render action sidebar
        const sidebar = this.renderSidebar();
        
        // Render contract history
        const history = this.renderHistory();
        
        // Assemble the component
        const contentWrapper = dom.createElement('div', {
            className: 'contract-detail-content'
        });
        
        const mainContent = dom.createElement('div', {
            className: 'contract-main-content'
        });
        
        mainContent.appendChild(details);
        mainContent.appendChild(parties);
        mainContent.appendChild(history);
        
        contentWrapper.appendChild(mainContent);
        contentWrapper.appendChild(sidebar);
        
        container.appendChild(header);
        container.appendChild(contentWrapper);
        
        // Set up event handlers
        setTimeout(() => {
            this.setupEventHandlers();
        }, 0);
        
        return container;
    }
    
    /**
     * Load contract data from state and mock API
     * @param {string|number} contractId - ID of the contract to load
     */
    loadContractData(contractId) {
        try {
            this.isLoading = true;
            
            // Parse ID as integer
            const id = parseInt(contractId, 10);
            
            // First try to get contract from state
            const contracts = window.state.getState('contracts') || [];
            this.contract = contracts.find(c => c.id === id);
            
            // If not in state, try to get from mock data
            if (!this.contract) {
                this.contract = window.mockData.getContract(id);
                
                // If found in mock data but not in state, update state
                if (this.contract) {
                    window.state.setState('contracts', [...contracts, this.contract]);
                }
            }
            
            if (!this.contract) {
                console.error(`Contract with ID ${id} not found`);
                dom.showToast('Contract not found', 'error');
            }
        } catch (error) {
            console.error('Error loading contract data:', error);
            dom.showToast('Error loading contract data', 'error');
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Subscribe to contract updates in state
     * @param {string|number} contractId - ID of the contract to watch
     */
    subscribeToContractUpdates(contractId) {
        // Unsubscribe from previous subscription if exists
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        
        // Subscribe to contract updates
        this.unsubscribe = window.state.subscribe((key, oldValue, newValue) => {
            if (key === 'contracts') {
                const id = parseInt(contractId, 10);
                const updatedContract = newValue.find(c => c.id === id);
                
                if (updatedContract && JSON.stringify(updatedContract) !== JSON.stringify(this.contract)) {
                    this.contract = updatedContract;
                    this.refreshDetails();
                }
            }
        });
    }
    
    /**
     * Render loading placeholder
     * @returns {HTMLElement} Loading element
     */
    renderLoading() {
        return dom.createElement('div', {
            className: 'loading-container'
        }, [
            dom.createElement('div', {
                className: 'spinner'
            }),
            dom.createElement('p', {}, 'Loading contract details...')
        ]);
    }
    
    /**
     * Render not found message
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
                    className: 'fas fa-file-excel fa-3x'
                }),
                dom.createElement('h2', {}, 'Contract Not Found'),
                dom.createElement('p', {}, 'The contract you are looking for does not exist or has been deleted.'),
                dom.createElement('a', {
                    href: '#/contracts',
                    className: 'btn btn-primary'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-arrow-left'
                    }),
                    ' Back to Contracts'
                ])
            ])
        ]);
    }
    
    /**
     * Render page header with contract title and actions
     * @returns {HTMLElement} Header element
     */
    renderHeader() {
        const statusClass = `status-badge ${this.contract.status}`;
        
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
                        href: '#/contracts',
                        className: 'btn btn-link'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-arrow-left'
                        }),
                        ' Back to Contracts'
                    ])
                ]),
                dom.createElement('h1', {}, this.contract.title),
                dom.createElement('div', {
                    className: 'contract-meta'
                }, [
                    dom.createElement('span', {
                        className: statusClass
                    }, this.formatStatus(this.contract.status)),
                    dom.createElement('span', {
                        className: 'type-badge'
                    }, this.contract.type)
                ])
            ]),
            dom.createElement('div', {
                className: 'detail-actions'
            }, [
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    id: 'edit-contract-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-edit'
                    }),
                    ' Edit Contract'
                ]),
                dom.createElement('button', {
                    className: 'btn btn-outline',
                    id: 'download-contract-btn'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-download'
                    }),
                    ' Download PDF'
                ])
            ])
        ]);
    }
    
    /**
     * Render contract details section
     * @returns {HTMLElement} Contract details element
     */
    renderDetails() {
        return dom.createElement('div', {
            className: 'detail-section'
        }, [
            dom.createElement('h2', {}, 'Contract Details'),
            dom.createElement('div', {
                className: 'detail-grid'
            }, [
                dom.createElement('div', {
                    className: 'detail-item'
                }, [
                    dom.createElement('span', {
                        className: 'detail-label'
                    }, 'Contract ID:'),
                    dom.createElement('span', {
                        className: 'detail-value'
                    }, `#${this.contract.id}`)
                ]),
                dom.createElement('div', {
                    className: 'detail-item'
                }, [
                    dom.createElement('span', {
                        className: 'detail-label'
                    }, 'Contract Type:'),
                    dom.createElement('span', {
                        className: 'detail-value'
                    }, this.contract.type)
                ]),
                dom.createElement('div', {
                    className: 'detail-item'
                }, [
                    dom.createElement('span', {
                        className: 'detail-label'
                    }, 'Created Date:'),
                    dom.createElement('span', {
                        className: 'detail-value'
                    }, new Date(this.contract.createdAt).toLocaleDateString())
                ]),
                dom.createElement('div', {
                    className: 'detail-item'
                }, [
                    dom.createElement('span', {
                        className: 'detail-label'
                    }, 'Last Modified:'),
                    dom.createElement('span', {
                        className: 'detail-value'
                    }, new Date(this.contract.updatedAt).toLocaleDateString())
                ]),
                dom.createElement('div', {
                    className: 'detail-item'
                }, [
                    dom.createElement('span', {
                        className: 'detail-label'
                    }, 'Created By:'),
                    dom.createElement('span', {
                        className: 'detail-value'
                    }, this.getCreatorName())
                ]),
                dom.createElement('div', {
                    className: 'detail-item'
                }, [
                    dom.createElement('span', {
                        className: 'detail-label'
                    }, 'Tags:'),
                    this.renderTags()
                ])
            ]),
            dom.createElement('div', {
                className: 'contract-summary'
            }, [
                dom.createElement('h3', {}, 'Summary'),
                dom.createElement('p', {}, this.contract.summary || 'No summary available for this contract.')
            ])
        ]);
    }
    
    /**
     * Render contract parties section
     * @returns {HTMLElement} Parties element
     */
    renderParties() {
        return dom.createElement('div', {
            className: 'detail-section'
        }, [
            dom.createElement('h2', {}, 'Parties Involved'),
            dom.createElement('div', {
                className: 'parties-container'
            }, this.contract.parties.map((party, index) => 
                dom.createElement('div', {
                    className: 'party-card'
                }, [
                    dom.createElement('div', {
                        className: 'party-header'
                    }, [
                        dom.createElement('h3', {}, `Party ${index + 1}`),
                        party.signedAt ? 
                            dom.createElement('span', {
                                className: 'signed-badge'
                            }, [
                                dom.createElement('i', {
                                    className: 'fas fa-check-circle'
                                }),
                                ' Signed'
                            ]) : 
                            dom.createElement('span', {
                                className: 'unsigned-badge'
                            }, [
                                dom.createElement('i', {
                                    className: 'fas fa-clock'
                                }),
                                ' Pending'
                            ])
                    ]),
                    dom.createElement('div', {
                        className: 'party-details'
                    }, [
                        dom.createElement('p', {}, [
                            dom.createElement('strong', {}, 'Name: '),
                            party.name
                        ]),
                        dom.createElement('p', {}, [
                            dom.createElement('strong', {}, 'Email: '),
                            party.email
                        ]),
                        party.signedAt ? 
                            dom.createElement('p', {}, [
                                dom.createElement('strong', {}, 'Signed Date: '),
                                new Date(party.signedAt).toLocaleDateString()
                            ]) : 
                            dom.createElement('button', {
                                className: 'btn btn-sm btn-outline',
                                'data-email': party.email,
                                'data-index': index
                            }, [
                                dom.createElement('i', {
                                    className: 'fas fa-envelope'
                                }),
                                ' Send Reminder'
                            ])
                    ])
                ])
            ))
        ]);
    }
    
    /**
     * Render sidebar with contract actions
     * @returns {HTMLElement} Sidebar element
     */
    renderSidebar() {
        return dom.createElement('div', {
            className: 'contract-sidebar'
        }, [
            dom.createElement('div', {
                className: 'sidebar-section'
            }, [
                dom.createElement('h3', {}, 'Contract Actions'),
                dom.createElement('div', {
                    className: 'action-buttons'
                }, [
                    dom.createElement('button', {
                        className: 'btn btn-full',
                        id: 'sign-contract-btn',
                        disabled: this.contract.status === 'signed'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-signature'
                        }),
                        ' Sign Contract'
                    ]),
                    dom.createElement('button', {
                        className: 'btn btn-full btn-outline',
                        id: 'share-contract-btn'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-share-alt'
                        }),
                        ' Share Contract'
                    ]),
                    dom.createElement('button', {
                        className: 'btn btn-full btn-outline',
                        id: 'clone-contract-btn'
                    }, [
                        dom.createElement('i', {
                            className: 'fas fa-copy'
                        }),
                        ' Clone Contract'
                    ]),
                    this.contract.status !== 'draft' ? null :
                        dom.createElement('button', {
                            className: 'btn btn-full btn-outline btn-danger',
                            id: 'delete-contract-btn'
                        }, [
                            dom.createElement('i', {
                                className: 'fas fa-trash'
                            }),
                            ' Delete Contract'
                        ])
                ].filter(Boolean))
            ]),
            dom.createElement('div', {
                className: 'sidebar-section'
            }, [
                dom.createElement('h3', {}, 'Related Documents'),
                this.contract.relatedDocuments && this.contract.relatedDocuments.length > 0 ?
                    dom.createElement('ul', {
                        className: 'document-list'
                    }, this.contract.relatedDocuments.map(doc => 
                        dom.createElement('li', {}, [
                            dom.createElement('i', {
                                className: 'fas fa-file-alt'
                            }),
                            dom.createElement('a', {
                                href: `#/documents/${doc.id}`
                            }, doc.name)
                        ])
                    )) :
                    dom.createElement('p', {
                        className: 'no-docs'
                    }, 'No related documents found')
            ])
        ]);
    }
    
    /**
     * Render contract history section
     * @returns {HTMLElement} History element
     */
    renderHistory() {
        return dom.createElement('div', {
            className: 'detail-section'
        }, [
            dom.createElement('h2', {}, 'Contract History'),
            this.contract.history && this.contract.history.length > 0 ?
                dom.createElement('div', {
                    className: 'timeline'
                }, this.contract.history.map(event => 
                    dom.createElement('div', {
                        className: 'timeline-item'
                    }, [
                        dom.createElement('div', {
                            className: 'timeline-icon'
                        }, [
                            dom.createElement('i', {
                                className: this.getEventIcon(event.type)
                            })
                        ]),
                        dom.createElement('div', {
                            className: 'timeline-content'
                        }, [
                            dom.createElement('h4', {}, event.title),
                            dom.createElement('p', {}, event.description),
                            dom.createElement('span', {
                                className: 'timeline-date'
                            }, new Date(event.date).toLocaleString())
                        ])
                    ])
                )) :
                dom.createElement('p', {
                    className: 'no-history'
                }, 'No history available for this contract')
        ]);
    }
    
    /**
     * Render tags for a contract
     * @returns {HTMLElement} Tags container
     */
    renderTags() {
        const tagsContainer = dom.createElement('div', {
            className: 'tags-container'
        });
        
        if (this.contract.tags && this.contract.tags.length > 0) {
            this.contract.tags.forEach(tag => {
                tagsContainer.appendChild(
                    dom.createElement('span', {
                        className: 'tag'
                    }, tag)
                );
            });
        } else {
            tagsContainer.appendChild(
                dom.createElement('span', {
                    className: 'no-tags'
                }, 'No tags')
            );
        }
        
        return tagsContainer;
    }
    
    /**
     * Get creator name from user ID
     * @returns {string} Name of the creator
     */
    getCreatorName() {
        try {
            const creator = window.mockData.getUser(this.contract.createdBy);
            return creator ? creator.name : 'Unknown User';
        } catch (error) {
            console.error('Error getting creator name:', error);
            return 'Unknown User';
        }
    }
    
    /**
     * Format status for display
     * @param {string} status - Contract status
     * @returns {string} Formatted status text
     */
    formatStatus(status) {
        const statusMap = {
            'draft': 'Draft',
            'pending': 'Pending Signature',
            'signed': 'Signed',
            'expired': 'Expired'
        };
        
        return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    /**
     * Get icon class for history event
     * @param {string} eventType - Type of history event
     * @returns {string} CSS class for the icon
     */
    getEventIcon(eventType) {
        switch (eventType) {
            case 'created':
                return 'fas fa-plus-circle';
            case 'edited':
                return 'fas fa-edit';
            case 'shared':
                return 'fas fa-share-alt';
            case 'signed':
                return 'fas fa-signature';
            case 'viewed':
                return 'fas fa-eye';
            case 'downloaded':
                return 'fas fa-download';
            default:
                return 'fas fa-circle';
        }
    }
    
    /**
     * Set up event handlers for the component
     */
    setupEventHandlers() {
        // Edit contract button
        const editBtn = document.getElementById('edit-contract-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.handleEditContract());
        }
        
        // Download contract button
        const downloadBtn = document.getElementById('download-contract-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleDownloadContract());
        }
        
        // Sign contract button
        const signBtn = document.getElementById('sign-contract-btn');
        if (signBtn) {
            signBtn.addEventListener('click', () => this.handleSignContract());
        }
        
        // Share contract button
        const shareBtn = document.getElementById('share-contract-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.handleShareContract());
        }
        
        // Clone contract button
        const cloneBtn = document.getElementById('clone-contract-btn');
        if (cloneBtn) {
            cloneBtn.addEventListener('click', () => this.handleCloneContract());
        }
        
        // Delete contract button
        const deleteBtn = document.getElementById('delete-contract-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.handleDeleteContract());
        }
        
        // Send reminder buttons
        const reminderBtns = document.querySelectorAll('.party-details .btn-outline');
        reminderBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const email = e.currentTarget.getAttribute('data-email');
                const index = e.currentTarget.getAttribute('data-index');
                this.handleSendReminder(email, index);
            });
        });
    }
    
    /**
     * Handle edit contract button click
     */
    handleEditContract() {
        dom.showModal({
            title: 'Edit Contract',
            size: 'lg',
            content: `
                <div class="form-group">
                    <label for="edit-title">Contract Title</label>
                    <input type="text" id="edit-title" class="form-control" value="${this.contract.title}" />
                </div>
                
                <div class="form-group">
                    <label for="edit-type">Contract Type</label>
                    <select id="edit-type" class="form-control">
                        <option value="nda" ${this.contract.type === 'nda' ? 'selected' : ''}>Non-Disclosure Agreement</option>
                        <option value="service" ${this.contract.type === 'service' ? 'selected' : ''}>Service Agreement</option>
                        <option value="employment" ${this.contract.type === 'employment' ? 'selected' : ''}>Employment Contract</option>
                        <option value="lease" ${this.contract.type === 'lease' ? 'selected' : ''}>Lease Agreement</option>
                        <option value="sale" ${this.contract.type === 'sale' ? 'selected' : ''}>Sales Contract</option>
                        <option value="license" ${this.contract.type === 'license' ? 'selected' : ''}>License Agreement</option>
                        <option value="other" ${this.contract.type === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-status">Status</label>
                    <select id="edit-status" class="form-control">
                        <option value="draft" ${this.contract.status === 'draft' ? 'selected' : ''}>Draft</option>
                        <option value="pending" ${this.contract.status === 'pending' ? 'selected' : ''}>Pending Signature</option>
                        <option value="signed" ${this.contract.status === 'signed' ? 'selected' : ''}>Signed</option>
                        <option value="expired" ${this.contract.status === 'expired' ? 'selected' : ''}>Expired</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-summary">Summary</label>
                    <textarea id="edit-summary" class="form-control" rows="4">${this.contract.summary || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="edit-tags">Tags (comma separated)</label>
                    <input type="text" id="edit-tags" class="form-control" value="${this.contract.tags ? this.contract.tags.join(', ') : ''}" />
                </div>
                
                <div class="form-section">
                    <h3>Parties</h3>
                    <div id="parties-container">
                        ${this.contract.parties.map((party, index) => `
                            <div class="party-edit-row" data-index="${index}">
                                <div class="row">
                                    <div class="col-md-5">
                                        <div class="form-group">
                                            <label>Name</label>
                                            <input type="text" class="form-control party-name" value="${party.name || ''}" />
                                        </div>
                                    </div>
                                    <div class="col-md-5">
                                        <div class="form-group">
                                            <label>Email</label>
                                            <input type="email" class="form-control party-email" value="${party.email || ''}" />
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label>&nbsp;</label>
                                            <button type="button" class="btn btn-danger btn-sm btn-block remove-party">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('') || '<p>No parties added yet.</p>'}
                    </div>
                    <button type="button" class="btn btn-outline-primary mt-2" id="add-party-btn">
                        <i class="fas fa-plus"></i> Add Party
                    </button>
                </div>
                
                <script>
                    // Add party button handler
                    document.getElementById('add-party-btn').addEventListener('click', function() {
                        const partiesContainer = document.getElementById('parties-container');
                        const index = document.querySelectorAll('.party-edit-row').length;
                        
                        const partyRow = document.createElement('div');
                        partyRow.className = 'party-edit-row';
                        partyRow.dataset.index = index;
                        
                        partyRow.innerHTML = \`
                            <div class="row">
                                <div class="col-md-5">
                                    <div class="form-group">
                                        <label>Name</label>
                                        <input type="text" class="form-control party-name" />
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" class="form-control party-email" />
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label>&nbsp;</label>
                                        <button type="button" class="btn btn-danger btn-sm btn-block remove-party">Remove</button>
                                    </div>
                                </div>
                            </div>
                        \`;
                        
                        partiesContainer.appendChild(partyRow);
                        
                        // Add event listener to the new remove button
                        partyRow.querySelector('.remove-party').addEventListener('click', function() {
                            partyRow.remove();
                        });
                    });
                    
                    // Remove party button handlers
                    document.querySelectorAll('.remove-party').forEach(button => {
                        button.addEventListener('click', function() {
                            this.closest('.party-edit-row').remove();
                        });
                    });
                </script>
            `,
            okText: 'Save Changes',
            cancelText: 'Cancel',
            onConfirm: () => {
                const title = document.getElementById('edit-title').value;
                const type = document.getElementById('edit-type').value;
                const status = document.getElementById('edit-status').value;
                const summary = document.getElementById('edit-summary').value;
                const tags = document.getElementById('edit-tags').value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag);
                
                // Get parties from the form
                const partyRows = document.querySelectorAll('.party-edit-row');
                const parties = Array.from(partyRows).map(row => {
                    return {
                        name: row.querySelector('.party-name').value,
                        email: row.querySelector('.party-email').value,
                        signed: false
                    };
                }).filter(party => party.name || party.email);
                
                if (!title) {
                    dom.showToast('Contract title is required', 'error');
                    return false; // Prevent modal from closing
                }
                
                try {
                    // Get current contracts from state
                    const currentContracts = window.state.getState('contracts') || [];
                    
                    // Find and update the contract
                    const updatedContracts = currentContracts.map(c => {
                        if (c.id === this.contract.id) {
                            // Create updated contract
                            const updatedContract = {
                                ...c,
                                title,
                                type,
                                status,
                                summary,
                                tags,
                                parties,
                                updatedAt: new Date().toISOString(),
                                history: [
                                    ...c.history,
                                    {
                                        type: 'edited',
                                        title: 'Contract Edited',
                                        description: 'Contract details were updated',
                                        date: new Date().toISOString()
                                    }
                                ]
                            };
                            
                            // Update this.contract for immediate UI update
                            this.contract = updatedContract;
                            
                            return updatedContract;
                        }
                        return c;
                    });
                    
                    // Update state
                    window.state.setState('contracts', updatedContracts);
                    
                    // Show success message
                    dom.showToast('Contract updated successfully', 'success');
                    
                    // Refresh the UI
                    this.refreshDetails();
                } catch (error) {
                    console.error('Error updating contract:', error);
                    dom.showToast('Error updating contract', 'error');
                }
            }
        });
    }
    
    /**
     * Refresh contract details after editing
     */
    refreshDetails() {
        const container = document.querySelector('.contract-detail-container');
        if (!container) return;
        
        // Remove old details and re-render
        const oldDetails = container.querySelector('.contract-main-content');
        if (oldDetails) {
            const newDetails = this.renderDetails();
            oldDetails.replaceWith(newDetails);
        }
    }
    
    /**
     * Handle download contract button click
     */
    handleDownloadContract() {
        dom.showToast('Downloading contract...', 'info');
        console.log('Download contract:', this.contract.id);
        setTimeout(() => {
            dom.showToast('Contract downloaded successfully', 'success');
        }, 1500);
    }
    
    /**
     * Handle sign contract button click
     */
    handleSignContract() {
        dom.showModal({
            title: 'Sign Contract',
            content: `
                <p>You are about to sign the contract "${this.contract.title}".</p>
                <div class="form-group">
                    <label for="signature-type">Signature Type</label>
                    <select id="signature-type" class="form-control">
                        <option value="electronic">Electronic Signature</option>
                        <option value="digital">Digital Certificate</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="signature-name">Full Name</label>
                    <input type="text" id="signature-name" class="form-control" value="${window.state.getState('currentUser')?.name || ''}" />
                </div>
                <div class="signature-pad-container">
                    <label>Draw your signature below:</label>
                    <div class="signature-pad" id="signature-pad" style="border: 1px solid #ccc; height: 150px; margin-top: 10px; display: flex; justify-content: center; align-items: center;">
                        <span class="text-muted">Click here to sign</span>
                    </div>
                </div>
            `,
            okText: 'Sign Contract',
            cancelText: 'Cancel',
            onConfirm: () => {
                const name = document.getElementById('signature-name').value;
                
                if (!name) {
                    dom.showToast('Please enter your full name', 'error');
                    return false; // Prevent modal from closing
                }
                
                try {
                    // Get current user from state
                    const currentUser = window.state.getState('currentUser');
                    
                    if (!currentUser) {
                        throw new Error('No user logged in');
                    }
                    
                    // Get current contracts from state
                    const currentContracts = window.state.getState('contracts') || [];
                    
                    // Find and update the contract
                    const updatedContracts = currentContracts.map(c => {
                        if (c.id === this.contract.id) {
                            // Update contract status
                            const updatedContract = {
                                ...c,
                                status: 'signed',
                                updatedAt: new Date().toISOString(),
                                history: [
                                    ...c.history,
                                    {
                                        type: 'signed',
                                        title: 'Contract Signed',
                                        description: `Contract signed by ${name}`,
                                        date: new Date().toISOString()
                                    }
                                ]
                            };
                            
                            // Update this.contract for immediate UI update
                            this.contract = updatedContract;
                            
                            return updatedContract;
                        }
                        return c;
                    });
                    
                    // Update state
                    window.state.setState('contracts', updatedContracts);
                    
                    // Show success message
                    dom.showToast('Contract signed successfully', 'success');
                    
                    // Refresh the UI
                    this.refreshDetails();
                } catch (error) {
                    console.error('Error signing contract:', error);
                    dom.showToast('Error signing contract', 'error');
                }
            }
        });
    }
    
    /**
     * Handle share contract button click
     */
    handleShareContract() {
        dom.showModal({
            title: 'Share Contract',
            content: `
                <div class="form-group">
                    <label for="share-method">Share Method</label>
                    <select id="share-method" class="form-control">
                        <option value="email">Email</option>
                        <option value="link">Generate Link</option>
                        <option value="platform">Platform Invite</option>
                    </select>
                </div>
                
                <div id="email-share-options">
                    <div class="form-group">
                        <label for="share-email">Email Address</label>
                        <input type="email" id="share-email" class="form-control" placeholder="Enter email address" />
                    </div>
                    
                    <div class="form-group">
                        <label for="share-permission">Permission Level</label>
                        <select id="share-permission" class="form-control">
                            <option value="view">View Only</option>
                            <option value="comment">View & Comment</option>
                            <option value="edit">View & Edit</option>
                            <option value="sign">View & Sign</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="share-message">Message (Optional)</label>
                        <textarea id="share-message" class="form-control" rows="3" placeholder="Add a personal message"></textarea>
                    </div>
                </div>
                
                <div id="link-share-options" style="display: none;">
                    <div class="form-group">
                        <label for="link-expiry">Link Expiry</label>
                        <select id="link-expiry" class="form-control">
                            <option value="1">1 Day</option>
                            <option value="7" selected>7 Days</option>
                            <option value="30">30 Days</option>
                            <option value="0">No Expiry</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="link-permission">Permission Level</label>
                        <select id="link-permission" class="form-control">
                            <option value="view">View Only</option>
                            <option value="comment">View & Comment</option>
                        </select>
                    </div>
                </div>
                
                <div id="platform-share-options" style="display: none;">
                    <div class="form-group">
                        <label for="platform-user">Select User</label>
                        <select id="platform-user" class="form-control">
                            <option value="">Select a user...</option>
                            <option value="2">Jane Smith (jane@example.com)</option>
                            <option value="3">Bob Johnson (bob@example.com)</option>
                            <option value="4">Alice Williams (alice@example.com)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="platform-role">User Role</label>
                        <select id="platform-role" class="form-control">
                            <option value="viewer">Viewer</option>
                            <option value="reviewer">Reviewer</option>
                            <option value="approver">Approver</option>
                            <option value="signer">Signer</option>
                        </select>
                    </div>
                </div>
                
                <script>
                    // This script will be executed when the modal is shown
                    document.getElementById('share-method').addEventListener('change', function() {
                        const method = this.value;
                        document.getElementById('email-share-options').style.display = method === 'email' ? 'block' : 'none';
                        document.getElementById('link-share-options').style.display = method === 'link' ? 'block' : 'none';
                        document.getElementById('platform-share-options').style.display = method === 'platform' ? 'block' : 'none';
                    });
                </script>
            `,
            okText: 'Share',
            cancelText: 'Cancel',
            onConfirm: () => {
                const method = document.getElementById('share-method').value;
                
                try {
                    // Handle different sharing methods
                    if (method === 'email') {
                        const email = document.getElementById('share-email').value;
                        const permission = document.getElementById('share-permission').value;
                        
                        if (!email) {
                            dom.showToast('Please enter an email address', 'error');
                            return false; // Prevent modal from closing
                        }
                        
                        // Update contract history
                        this.addHistoryEvent('shared', `Contract shared with ${email}`, `Shared with permission: ${permission}`);
                        
                        dom.showToast(`Contract shared with ${email}`, 'success');
                    } else if (method === 'link') {
                        const expiry = document.getElementById('link-expiry').value;
                        const expiryText = expiry === '0' ? 'no expiry' : `${expiry} day${expiry > 1 ? 's' : ''}`;
                        
                        // Generate a fake share link
                        const shareLink = `https://contractflow.app/s/${this.contract.id}/${Math.random().toString(36).substring(2, 10)}`;
                        
                        // Copy to clipboard
                        navigator.clipboard.writeText(shareLink).then(() => {
                            dom.showToast(`Share link copied to clipboard (${expiryText})`, 'success');
                        }).catch(err => {
                            console.error('Could not copy text: ', err);
                            dom.showToast(`Share link generated (${expiryText})`, 'success');
                        });
                        
                        // Update contract history
                        this.addHistoryEvent('shared', 'Share link generated', `Link created with ${expiryText}`);
                    } else if (method === 'platform') {
                        const userId = document.getElementById('platform-user').value;
                        const role = document.getElementById('platform-role').value;
                        
                        if (!userId) {
                            dom.showToast('Please select a user', 'error');
                            return false; // Prevent modal from closing
                        }
                        
                        const userName = document.getElementById('platform-user').options[document.getElementById('platform-user').selectedIndex].text;
                        
                        // Update contract history
                        this.addHistoryEvent('shared', `Contract shared with ${userName}`, `Assigned role: ${role}`);
                        
                        dom.showToast(`Contract shared with ${userName}`, 'success');
                    }
                    
                    // Refresh the UI
                    this.refreshDetails();
                } catch (error) {
                    console.error('Error sharing contract:', error);
                    dom.showToast('Error sharing contract', 'error');
                }
            }
        });
    }
    
    /**
     * Add an event to the contract history
     * @param {string} type - Event type
     * @param {string} title - Event title
     * @param {string} description - Event description
     */
    addHistoryEvent(type, title, description) {
        // Get current contracts from state
        const currentContracts = window.state.getState('contracts') || [];
        
        // Find and update the contract
        const updatedContracts = currentContracts.map(c => {
            if (c.id === this.contract.id) {
                // Create new history event
                const historyEvent = {
                    type,
                    title,
                    description,
                    date: new Date().toISOString()
                };
                
                // Update contract with new history event
                const updatedContract = {
                    ...c,
                    updatedAt: new Date().toISOString(),
                    history: [...c.history, historyEvent]
                };
                
                // Update this.contract for immediate UI update
                this.contract = updatedContract;
                
                return updatedContract;
            }
            return c;
        });
        
        // Update state
        window.state.setState('contracts', updatedContracts);
    }
    
    /**
     * Handle clone contract button click
     */
    handleCloneContract() {
        dom.showModal({
            title: 'Clone Contract',
            content: `
                <p>You are about to create a copy of "${this.contract.title}".</p>
                <div class="form-group">
                    <label for="clone-title">New Contract Title</label>
                    <input type="text" id="clone-title" class="form-control" value="${this.contract.title} - Copy" />
                </div>
                <div class="form-group">
                    <label for="clone-summary">Summary (optional)</label>
                    <textarea id="clone-summary" class="form-control" rows="3">${this.contract.summary || ''}</textarea>
                </div>
            `,
            okText: 'Clone Contract',
            cancelText: 'Cancel',
            onConfirm: () => {
                const title = document.getElementById('clone-title').value;
                const summary = document.getElementById('clone-summary').value;
                
                if (!title) {
                    dom.showToast('Please enter a title for the new contract', 'error');
                    return false; // Prevent modal from closing
                }
                
                try {
                    // Get current user from state
                    const currentUser = window.state.getState('currentUser');
                    
                    if (!currentUser) {
                        throw new Error('No user logged in');
                    }
                    
                    // Create a clone of the contract
                    const clonedContract = {
                        ...this.contract,
                        id: Date.now(),
                        title: title,
                        summary: summary,
                        status: 'draft',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        createdBy: currentUser.id,
                        history: [
                            {
                                type: 'created',
                                title: 'Contract Cloned',
                                description: `Cloned from contract: ${this.contract.title}`,
                                date: new Date().toISOString()
                            }
                        ]
                    };
                    
                    // Save cloned contract to mockData
                    window.mockData.addContract(clonedContract);
                    
                    // Update global state with the new contract
                    const currentContracts = window.state.getState('contracts') || [];
                    window.state.setState('contracts', [...currentContracts, clonedContract]);
                    
                    // Show success message
                    dom.showToast('Contract cloned successfully', 'success');
                    
                    // Navigate to the new contract
                    setTimeout(() => {
                        window.router.navigate(`/contracts/${clonedContract.id}`);
                    }, 500);
                } catch (error) {
                    console.error('Error cloning contract:', error);
                    dom.showToast('Error cloning contract', 'error');
                }
            }
        });
    }
    
    /**
     * Handle delete contract button click
     */
    handleDeleteContract() {
        dom.showModal({
            title: 'Delete Contract',
            content: `
                <p>Are you sure you want to delete the contract "${this.contract.title}"?</p>
                <p class="text-danger"><strong>This action cannot be undone.</strong></p>
            `,
            okText: 'Delete',
            okClass: 'btn-danger',
            cancelText: 'Cancel',
            onConfirm: () => {
                try {
                    // Get current contracts from state
                    const currentContracts = window.state.getState('contracts') || [];
                    
                    // Filter out the deleted contract
                    const updatedContracts = currentContracts.filter(c => c.id !== this.contract.id);
                    
                    // Update state
                    window.state.setState('contracts', updatedContracts);
                    
                    // In a real app, we would also delete from the server
                    // For this demo, we'll just update the UI
                    
                    // Show success message
                    dom.showToast('Contract deleted successfully', 'success');
                    
                    // Navigate back to contracts list
                    window.router.navigate('/contracts');
                } catch (error) {
                    console.error('Error deleting contract:', error);
                    dom.showToast('Error deleting contract', 'error');
                }
            }
        });
    }
    
    /**
     * Handle send reminder button click
     * @param {string} email - Email to send reminder to
     * @param {number} partyIndex - Index of the party in the contract
     */
    handleSendReminder(email, partyIndex) {
        dom.showToast(`Sending reminder to ${email}...`, 'info');
        console.log('Send reminder:', email, 'Party index:', partyIndex);
        setTimeout(() => {
            dom.showToast(`Reminder sent to ${email}`, 'success');
        }, 1000);
    }
}

// Register component when script is loaded
window.components = window.components || {};
window.components.ContractDetail = new ContractDetail(); 
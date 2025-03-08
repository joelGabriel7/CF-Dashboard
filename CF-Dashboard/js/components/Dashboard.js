/**
 * Dashboard Component
 * Displays overview metrics, charts, and recent activity
 */

class Dashboard {
    constructor() {
        this.loadStyles();
        this.contractStats = {};
        this.unsubscribe = null;
    }
    
    /**
     * Load component specific styles
     */
    loadStyles() {
        if (!document.querySelector('link[href="css/components/dashboard.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/components/dashboard.css';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Render the dashboard component
     * @returns {HTMLElement} The dashboard element
     */
    render() {
        const currentUser = window.state.getState('currentUser');
        
        // Get contract statistics
        this.contractStats = window.mockData.getContractStats(currentUser.id);
        
        // Create dashboard container
        const dashboard = dom.createElement('div', {
            className: 'dashboard-container'
        });
        
        // Welcome section
        const welcomeSection = this.renderWelcomeSection(currentUser);
        
        // Metrics section
        const metricsSection = this.renderMetricsSection();
        
        // Charts section
        const chartsSection = this.renderChartsSection();
        
        // Recent contracts section
        const recentContractsSection = this.renderRecentContractsSection();
        
        // Assemble dashboard
        dashboard.appendChild(welcomeSection);
        dashboard.appendChild(metricsSection);
        dashboard.appendChild(chartsSection);
        dashboard.appendChild(recentContractsSection);
        
        // Set up event listeners and chart rendering
        setTimeout(() => {
            this.setupCharts();
            this.subscribeToContractChanges();
        }, 0);
        
        return dashboard;
    }
    
    /**
     * Subscribe to contract changes in state
     */
    subscribeToContractChanges() {
        // Unsubscribe from previous subscription if exists
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        
        // Subscribe to contract updates
        this.unsubscribe = window.state.subscribe((key, oldValue, newValue) => {
            if (key === 'contracts') {
                // Update contract stats
                const currentUser = window.state.getState('currentUser');
                this.contractStats = window.mockData.getContractStats(currentUser.id);
                
                // Redraw charts
                this.renderActivityChart();
                this.renderDistributionChart();
                
                // Update metrics
                this.updateMetrics();
            }
        });
    }
    
    /**
     * Update metrics cards with new data
     */
    updateMetrics() {
        const stats = this.contractStats;
        
        // Update total contracts
        const totalValue = document.querySelector('.metric-card:nth-child(1) .metric-value');
        if (totalValue) totalValue.textContent = stats.total.toString();
        
        // Update pending contracts
        const pendingValue = document.querySelector('.metric-card:nth-child(2) .metric-value');
        if (pendingValue) pendingValue.textContent = stats.pending.toString();
        
        // Update signed contracts
        const signedValue = document.querySelector('.metric-card:nth-child(3) .metric-value');
        if (signedValue) signedValue.textContent = stats.signed.toString();
        
        // Update expired contracts
        const expiredValue = document.querySelector('.metric-card:nth-child(4) .metric-value');
        if (expiredValue) expiredValue.textContent = stats.expired.toString();
    }
    
    /**
     * Render welcome section with user info
     * @param {Object} user - Current user object
     * @returns {HTMLElement} Welcome section element
     */
    renderWelcomeSection(user) {
        const now = new Date();
        const hour = now.getHours();
        
        let greeting;
        if (hour < 12) {
            greeting = 'Good morning';
        } else if (hour < 18) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }
        
        return dom.createElement('section', {
            className: 'welcome-section'
        }, [
            dom.createElement('div', {
                className: 'welcome-text'
            }, [
                dom.createElement('h1', {}, `${greeting}, ${user.name}`),
                dom.createElement('p', {}, 'Here\'s an overview of your contracts and recent activity')
            ]),
            dom.createElement('div', {
                className: 'welcome-actions'
            }, [
                window.state.hasPermission('create_contracts') ? 
                dom.createElement('button', {
                    className: 'btn btn-primary',
                    onclick: () => window.router.navigate('/contracts/new')
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-plus mr-2'
                    }),
                    'New Contract'
                ]) : null,
                
                dom.createElement('button', {
                    className: 'btn btn-secondary',
                    onclick: () => window.router.navigate('/contracts')
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-file-contract mr-2'
                    }),
                    'View All Contracts'
                ])
            ])
        ]);
    }
    
    /**
     * Render metrics cards section
     * @returns {HTMLElement} Metrics section element
     */
    renderMetricsSection() {
        const stats = this.contractStats;
        
        const metricsSection = dom.createElement('section', {
            className: 'metrics-section'
        });
        
        const title = dom.createElement('h2', {
            className: 'section-title'
        });
        title.textContent = 'Contract Metrics';
        metricsSection.appendChild(title);
        
        const metricsGrid = dom.createElement('div', {
            className: 'metrics-grid'
        });
        metricsSection.appendChild(metricsGrid);
        
        // Total Contracts
        const totalCard = this.createMetricCard({
            title: 'Total Contracts',
            value: stats.total,
            icon: 'fas fa-file-contract',
            iconClass: 'bg-primary',
            trend: '+5% from last month',
            trendPositive: true
        });
        metricsGrid.appendChild(totalCard);
        
        // Pending Signatures
        const pendingCard = this.createMetricCard({
            title: 'Pending Signatures',
            value: stats.pending,
            icon: 'fas fa-clock',
            iconClass: 'bg-warning',
            trend: '2 require attention',
            trendPositive: null,
            link: '#/contracts?status=pending'
        });
        metricsGrid.appendChild(pendingCard);
        
        // Signed Contracts
        const signedCard = this.createMetricCard({
            title: 'Signed Contracts',
            value: stats.signed,
            icon: 'fas fa-check-circle',
            iconClass: 'bg-success',
            trend: '+3 this month',
            trendPositive: true
        });
        metricsGrid.appendChild(signedCard);
        
        // Expired Contracts
        const expiredCard = this.createMetricCard({
            title: 'Expired Contracts',
            value: stats.expired,
            icon: 'fas fa-exclamation-circle',
            iconClass: 'bg-error',
            trend: '+1 this week',
            trendPositive: false,
            link: '#/contracts?status=expired'
        });
        metricsGrid.appendChild(expiredCard);
        
        return metricsSection;
    }
    
    /**
     * Create a single metric card
     * @param {Object} options - Card options
     * @returns {HTMLElement} Metric card element
     */
    createMetricCard({ title, value, icon, iconClass, trend, trendPositive, link }) {
        // Create the card container
        const card = document.createElement('div');
        card.className = 'metric-card';
        
        // Create the card content
        const content = document.createElement('div');
        content.className = 'metric-content';
        
        // Create header with icon and title
        const header = document.createElement('div');
        header.className = 'metric-header';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = `metric-icon ${iconClass}`;
        
        const iconElement = document.createElement('i');
        iconElement.className = icon;
        iconDiv.appendChild(iconElement);
        
        const titleElement = document.createElement('h3');
        titleElement.className = 'metric-title';
        titleElement.textContent = title;
        
        header.appendChild(iconDiv);
        header.appendChild(titleElement);
        
        // Create value element
        const valueElement = document.createElement('div');
        valueElement.className = 'metric-value';
        valueElement.textContent = value.toString();
        
        // Add header and value to content
        content.appendChild(header);
        content.appendChild(valueElement);
        
        // Add trend if provided
        if (trend) {
            const trendElement = document.createElement('div');
            trendElement.className = 'metric-trend';
            
            if (trendPositive === true) {
                trendElement.classList.add('positive');
                const trendIcon = document.createElement('i');
                trendIcon.className = 'fas fa-arrow-up';
                trendElement.appendChild(trendIcon);
            } else if (trendPositive === false) {
                trendElement.classList.add('negative');
                const trendIcon = document.createElement('i');
                trendIcon.className = 'fas fa-arrow-down';
                trendElement.appendChild(trendIcon);
            }
            
            trendElement.appendChild(document.createTextNode(' ' + trend));
            content.appendChild(trendElement);
        }
        
        // If link is provided, wrap in an anchor tag
        if (link) {
            const anchor = document.createElement('a');
            anchor.href = link;
            anchor.className = 'metric-card-link';
            anchor.appendChild(content);
            card.appendChild(anchor);
        } else {
            card.appendChild(content);
        }
        
        return card;
    }
    
    /**
     * Render charts section
     * @returns {HTMLElement} Charts section element
     */
    renderChartsSection() {
        const section = document.createElement('section');
        section.className = 'charts-section';
        
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Activity Overview';
        section.appendChild(title);
        
        const chartsGrid = document.createElement('div');
        chartsGrid.className = 'charts-grid';
        section.appendChild(chartsGrid);
        
        // Activity Chart Card
        const activityCard = document.createElement('div');
        activityCard.className = 'chart-card activity-chart-card';
        
        const activityHeader = document.createElement('div');
        activityHeader.className = 'chart-header';
        
        const activityTitle = document.createElement('h3');
        activityTitle.className = 'chart-title';
        activityTitle.textContent = 'Contract Activity';
        activityHeader.appendChild(activityTitle);
        
        const activityLegend = document.createElement('div');
        activityLegend.className = 'chart-legend';
        
        // Created legend item
        const createdItem = document.createElement('div');
        createdItem.className = 'legend-item';
        const createdColor = document.createElement('span');
        createdColor.className = 'legend-color created-color';
        createdItem.appendChild(createdColor);
        createdItem.appendChild(document.createTextNode('Created'));
        activityLegend.appendChild(createdItem);
        
        // Signed legend item
        const signedItem = document.createElement('div');
        signedItem.className = 'legend-item';
        const signedColor = document.createElement('span');
        signedColor.className = 'legend-color signed-color';
        signedItem.appendChild(signedColor);
        signedItem.appendChild(document.createTextNode('Signed'));
        activityLegend.appendChild(signedItem);
        
        // Expired legend item
        const expiredItem = document.createElement('div');
        expiredItem.className = 'legend-item';
        const expiredColor = document.createElement('span');
        expiredColor.className = 'legend-color expired-color';
        expiredItem.appendChild(expiredColor);
        expiredItem.appendChild(document.createTextNode('Expired'));
        activityLegend.appendChild(expiredItem);
        
        activityHeader.appendChild(activityLegend);
        activityCard.appendChild(activityHeader);
        
        const activityBody = document.createElement('div');
        activityBody.className = 'chart-body';
        
        const activityCanvas = document.createElement('canvas');
        activityCanvas.id = 'activity-chart';
        activityCanvas.width = '100%';
        activityCanvas.height = '200';
        activityBody.appendChild(activityCanvas);
        
        activityCard.appendChild(activityBody);
        chartsGrid.appendChild(activityCard);
        
        // Distribution Chart Card
        const distributionCard = document.createElement('div');
        distributionCard.className = 'chart-card distribution-chart-card';
        
        const distributionHeader = document.createElement('div');
        distributionHeader.className = 'chart-header';
        
        const distributionTitle = document.createElement('h3');
        distributionTitle.className = 'chart-title';
        distributionTitle.textContent = 'Contract Types';
        distributionHeader.appendChild(distributionTitle);
        
        distributionCard.appendChild(distributionHeader);
        
        const distributionBody = document.createElement('div');
        distributionBody.className = 'chart-body distribution-chart-body';
        
        const distributionCanvas = document.createElement('canvas');
        distributionCanvas.id = 'distribution-chart';
        distributionBody.appendChild(distributionCanvas);
        
        const distributionLegend = document.createElement('div');
        distributionLegend.id = 'distribution-legend';
        distributionLegend.className = 'distribution-legend';
        distributionBody.appendChild(distributionLegend);
        
        distributionCard.appendChild(distributionBody);
        chartsGrid.appendChild(distributionCard);
        
        return section;
    }
    
    /**
     * Render recent contracts section
     * @returns {HTMLElement} Recent contracts section element
     */
    renderRecentContractsSection() {
        const contracts = window.state.getState('contracts') || [];
        
        // Sort contracts by creation date (newest first) and take first 5
        const recentContracts = [...contracts]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        return dom.createElement('section', {
            className: 'recent-contracts-section'
        }, [
            dom.createElement('div', {
                className: 'section-header'
            }, [
                dom.createElement('h2', {
                    className: 'section-title'
                }, 'Recent Contracts'),
                dom.createElement('a', {
                    href: '#/contracts',
                    className: 'view-all-link'
                }, [
                    'View All ',
                    dom.createElement('i', {
                        className: 'fas fa-arrow-right'
                    })
                ])
            ]),
            
            dom.createElement('div', {
                className: 'recent-contracts-table'
            }, [
                dom.createElement('table', {
                    className: 'table'
                }, [
                    dom.createElement('thead', {}, [
                        dom.createElement('tr', {}, [
                            dom.createElement('th', {}, 'Contract Name'),
                            dom.createElement('th', {}, 'Type'),
                            dom.createElement('th', {}, 'Status'),
                            dom.createElement('th', {}, 'Date'),
                            dom.createElement('th', {}, 'Actions')
                        ])
                    ]),
                    dom.createElement('tbody', {}, 
                        recentContracts.length > 0 ? 
                            recentContracts.map(contract => this.createContractRow(contract)) : 
                            [dom.createElement('tr', {}, [
                                dom.createElement('td', {
                                    className: 'empty-state',
                                    colSpan: '5'
                                }, 'No contracts found')
                            ])]
                    )
                ])
            ])
        ]);
    }
    
    /**
     * Create a contract table row
     * @param {Object} contract - Contract data
     * @returns {HTMLElement} Table row element
     */
    createContractRow(contract) {
        return dom.createElement('tr', {}, [
            dom.createElement('td', {
                className: 'contract-name'
            }, [
                dom.createElement('a', {
                    href: `#/contracts/${contract.id}`,
                    className: 'contract-link'
                }, contract.title)
            ]),
            
            dom.createElement('td', {
                className: 'contract-type'
            }, contract.type),
            
            dom.createElement('td', {
                className: 'contract-status'
            }, [
                dom.createElement('span', {
                    className: `badge badge-${contract.status}`
                }, this.formatStatus(contract.status))
            ]),
            
            dom.createElement('td', {
                className: 'contract-date'
            }, dom.formatDate(contract.createdAt, 'short')),
            
            dom.createElement('td', {
                className: 'contract-actions'
            }, [
                dom.createElement('a', {
                    href: `#/contracts/${contract.id}`,
                    className: 'btn-icon btn-icon-sm',
                    title: 'View Details'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-eye'
                    })
                ]),
                
                window.state.hasPermission('edit_contracts') && contract.status !== 'signed' && contract.status !== 'expired' ?
                dom.createElement('a', {
                    href: `#/contracts/${contract.id}/edit`,
                    className: 'btn-icon btn-icon-sm',
                    title: 'Edit Contract'
                }, [
                    dom.createElement('i', {
                        className: 'fas fa-edit'
                    })
                ]) : null
            ])
        ]);
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
     * Set up charts after component is rendered
     */
    setupCharts() {
        this.renderActivityChart();
        this.renderDistributionChart();
    }
    
    /**
     * Render activity chart
     */
    renderActivityChart() {
        const canvas = document.getElementById('activity-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Get data from contract stats
        const months = this.contractStats.activityByMonth.map(m => `${m.month} ${m.year}`);
        const createdData = this.contractStats.activityByMonth.map(m => m.created);
        const signedData = this.contractStats.activityByMonth.map(m => m.signed);
        const expiredData = this.contractStats.activityByMonth.map(m => m.expired);
        
        // Chart configuration
        const isDarkMode = window.state.getState('darkMode');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? '#e8eaed' : '#5F6368';
        
        // Calculate chart dimensions based on container size
        const parentWidth = canvas.parentElement.offsetWidth;
        const parentHeight = canvas.parentElement.offsetHeight || 200;
        canvas.width = parentWidth;
        canvas.height = parentHeight;
        
        // Set up chart scale with some padding
        const maxValue = Math.max(...createdData, ...signedData, ...expiredData, 1); // Ensure at least 1 for empty data
        const stepSize = Math.max(1, Math.ceil(maxValue / 5));
        const yMax = Math.max(5, Math.ceil(maxValue / stepSize) * stepSize);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate chart dimensions
        const chartHeight = parentHeight - 30; // Leave space for labels
        const chartTop = 10;
        const chartBottom = chartTop + chartHeight;
        const chartLeft = 40; // Space for y-axis labels
        const chartRight = parentWidth - 20; // Space on right
        const chartWidth = chartRight - chartLeft;
        
        // Draw grid lines
        ctx.beginPath();
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        
        // Draw horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = chartBottom - (i * chartHeight / 5);
            ctx.moveTo(chartLeft, y);
            ctx.lineTo(chartRight, y);
            
            // Draw Y-axis labels
            ctx.fillStyle = textColor;
            ctx.font = '10px var(--font-family)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText((yMax * i / 5).toString(), chartLeft - 5, y);
        }
        
        // Draw vertical grid lines and X-axis labels
        const barCount = months.length || 1; // Ensure at least 1 for empty data
        const barWidth = Math.min(30, (chartWidth / barCount) * 0.2); // Limit max bar width
        const barSpacing = barWidth * 0.5;
        const barGroupWidth = barWidth * 3 + barSpacing * 2;
        const groupSpacing = (chartWidth - barCount * barGroupWidth) / (barCount + 1);
        
        for (let i = 0; i < barCount; i++) {
            const groupX = chartLeft + groupSpacing + i * (barGroupWidth + groupSpacing);
            const labelX = groupX + barGroupWidth / 2;
            
            // Draw X-axis labels
            ctx.fillStyle = textColor;
            ctx.font = '10px var(--font-family)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(months[i] || '', labelX, chartBottom + 5);
        }
        
        ctx.stroke();
        
        // Draw data bars
        for (let i = 0; i < barCount; i++) {
            const groupX = chartLeft + groupSpacing + i * (barGroupWidth + groupSpacing);
            
            // Created bars
            const createdHeight = Math.max(1, (createdData[i] / yMax) * chartHeight);
            ctx.fillStyle = 'rgba(66, 133, 244, 0.7)'; // Blue
            ctx.fillRect(
                groupX, 
                chartBottom - createdHeight, 
                barWidth, 
                createdHeight
            );
            
            // Signed bars
            const signedHeight = Math.max(1, (signedData[i] / yMax) * chartHeight);
            ctx.fillStyle = 'rgba(52, 168, 83, 0.7)'; // Green
            ctx.fillRect(
                groupX + barWidth + barSpacing, 
                chartBottom - signedHeight, 
                barWidth, 
                signedHeight
            );
            
            // Expired bars
            const expiredHeight = Math.max(1, (expiredData[i] / yMax) * chartHeight);
            ctx.fillStyle = 'rgba(234, 67, 53, 0.7)'; // Red
            ctx.fillRect(
                groupX + (barWidth + barSpacing) * 2, 
                chartBottom - expiredHeight, 
                barWidth, 
                expiredHeight
            );
        }
        
        // Add hover effect for interactivity
        canvas.onmousemove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if mouse is over a bar
            for (let i = 0; i < barCount; i++) {
                const groupX = chartLeft + groupSpacing + i * (barGroupWidth + groupSpacing);
                
                // Check created bar
                if (x >= groupX && x <= groupX + barWidth && 
                    y >= chartBottom - (createdData[i] / yMax) * chartHeight && y <= chartBottom) {
                    canvas.title = `Created: ${createdData[i]} in ${months[i]}`;
                    canvas.style.cursor = 'pointer';
                    return;
                }
                
                // Check signed bar
                if (x >= groupX + barWidth + barSpacing && 
                    x <= groupX + barWidth * 2 + barSpacing && 
                    y >= chartBottom - (signedData[i] / yMax) * chartHeight && y <= chartBottom) {
                    canvas.title = `Signed: ${signedData[i]} in ${months[i]}`;
                    canvas.style.cursor = 'pointer';
                    return;
                }
                
                // Check expired bar
                if (x >= groupX + (barWidth + barSpacing) * 2 && 
                    x <= groupX + barWidth * 3 + barSpacing * 2 && 
                    y >= chartBottom - (expiredData[i] / yMax) * chartHeight && y <= chartBottom) {
                    canvas.title = `Expired: ${expiredData[i]} in ${months[i]}`;
                    canvas.style.cursor = 'pointer';
                    return;
                }
            }
            
            canvas.title = '';
            canvas.style.cursor = 'default';
        };
    }
    
    /**
     * Render distribution pie chart
     */
    renderDistributionChart() {
        const canvas = document.getElementById('distribution-chart');
        const legendContainer = document.getElementById('distribution-legend');
        if (!canvas || !legendContainer) return;
        
        // Clear any existing content in the legend container
        legendContainer.innerHTML = '';
        
        const ctx = canvas.getContext('2d');
        const typeDistribution = this.contractStats.typeDistribution;
        
        // Prepare data
        const types = Object.keys(typeDistribution);
        const counts = Object.values(typeDistribution);
        const total = counts.reduce((sum, count) => sum + count, 0);
        
        // Define colors for each type
        const colors = [
            '#4285F4', // Blue
            '#34A853', // Green
            '#FBBC04', // Yellow
            '#EA4335', // Red
            '#9C27B0', // Purple
            '#00ACC1', // Cyan
            '#FF9800', // Orange
            '#607D8B'  // Blue Grey
        ];
        
        // Calculate chart dimensions based on container size
        const containerWidth = canvas.parentElement.offsetWidth;
        const containerHeight = canvas.parentElement.offsetHeight;
        
        // Set canvas size to be responsive but with max dimensions
        const size = Math.min(containerWidth, containerHeight, 180);
        canvas.width = size;
        canvas.height = size;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw pie chart
        let startAngle = 0;
        
        types.forEach((type, index) => {
            const count = typeDistribution[type];
            const sliceAngle = (count / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            // Add to legend
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const colorBox = document.createElement('span');
            colorBox.className = 'legend-color';
            colorBox.style.backgroundColor = colors[index % colors.length];
            
            const label = document.createElement('span');
            label.className = 'legend-label';
            
            // Format type name (e.g., "nda" -> "NDA")
            let typeName = type;
            if (type === 'nda') {
                typeName = 'NDA';
            } else {
                typeName = type.charAt(0).toUpperCase() + type.slice(1);
            }
            
            label.textContent = `${typeName}: ${count}`;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            legendContainer.appendChild(legendItem);
            
            startAngle += sliceAngle;
        });
    }
}

// Register component
window.components = window.components || {};
window.components.Dashboard = new Dashboard(); 
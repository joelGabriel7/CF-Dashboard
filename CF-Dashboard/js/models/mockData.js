/**
 * Mock Data Generator for ContractFlow
 * Provides fake data for the application to use instead of real API calls
 */

class MockData {
    constructor() {
        // Initialize with base data
        this.users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'ADMIN',
                createdAt: '2023-01-01T00:00:00.000Z',
                accountType: 'business',
                organizationId: 1,
                profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            {
                id: 2,
                name: 'Editor User',
                email: 'editor@example.com',
                role: 'EDITOR',
                createdAt: '2023-01-02T00:00:00.000Z',
                accountType: 'personal',
                organizationId: 1,
                profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            {
                id: 3,
                name: 'Viewer User',
                email: 'viewer@example.com',
                role: 'VIEWER',
                createdAt: '2023-01-03T00:00:00.000Z',
                accountType: 'personal',
                organizationId: 1,
                profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
            }
        ];
        
        this.organizations = [
            {
                id: 1,
                name: 'Acme Corporation',
                description: 'Leading provider of innovative business solutions',
                logoUrl: 'https://via.placeholder.com/150?text=ACME',
                plan: 'business',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-06-15T10:30:00.000Z',
                members: [1, 2, 3],
                stats: {
                    totalContracts: 156,
                    activeContracts: 89,
                    totalTemplates: 24,
                    totalMembers: 15
                },
                settings: {
                    allowGuestAccess: true,
                    requireApproval: true,
                    defaultContractDuration: 30,
                    notificationPreferences: {
                        email: true,
                        inApp: true,
                        contractExpiry: true,
                        newMembers: true
                    }
                },
                subscription: {
                    planId: 'business-pro',
                    status: 'active',
                    billingCycle: 'monthly',
                    nextBillingDate: '2024-01-01T00:00:00.000Z',
                    features: [
                        'Unlimited contracts',
                        'Custom templates',
                        'Advanced analytics',
                        'Priority support',
                        'Team collaboration'
                    ]
                },
                pendingInvitations: [
                    {
                        email: 'sarah.wilson@example.com',
                        role: 'EDITOR',
                        invitedBy: 1,
                        invitedAt: '2023-12-15T10:30:00.000Z'
                    },
                    {
                        email: 'john.doe@example.com',
                        role: 'VIEWER',
                        invitedBy: 1,
                        invitedAt: '2023-12-14T15:45:00.000Z'
                    },
                    {
                        email: 'maria.garcia@example.com',
                        role: 'EDITOR',
                        invitedBy: 1,
                        invitedAt: '2023-12-13T09:20:00.000Z'
                    }
                ],
                recentActivity: [
                    {
                        type: 'member_joined',
                        userId: 3,
                        timestamp: '2023-12-10T14:30:00.000Z'
                    },
                    {
                        type: 'plan_upgraded',
                        from: 'basic',
                        to: 'business',
                        timestamp: '2023-11-01T09:00:00.000Z'
                    },
                    {
                        type: 'settings_updated',
                        by: 1,
                        timestamp: '2023-10-15T16:45:00.000Z'
                    }
                ],
                departments: [
                    {
                        id: 1,
                        name: 'Legal',
                        memberCount: 5
                    },
                    {
                        id: 2,
                        name: 'Sales',
                        memberCount: 4
                    },
                    {
                        id: 3,
                        name: 'Operations',
                        memberCount: 3
                    },
                    {
                        id: 4,
                        name: 'HR',
                        memberCount: 3
                    }
                ]
            }
        ];
        
        this.contracts = this.generateContracts();
        this.templates = this.generateTemplates();
        this.notifications = this.generateNotifications();
    }
    
    /**
     * Generate fake contracts
     * @returns {Array} Array of contract objects
     */
    generateContracts() {
        const statuses = ['draft', 'pending', 'signed', 'expired'];
        const types = ['Employment', 'NDA', 'Services', 'Partnership', 'Lease'];
        const contracts = [];
        
        // Generate 30 contracts with different statuses
        for (let i = 1; i <= 30; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const userId = Math.floor(Math.random() * 3) + 1; // Random user 1-3
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90)); // Random date in last 90 days
            
            const contract = {
                id: i,
                title: `${type} Contract ${i}`,
                type: type,
                status: status,
                createdBy: userId,
                createdAt: createdDate.toISOString(),
                updatedAt: new Date(createdDate.getTime() + Math.random() * 86400000 * 10).toISOString(), // Random time after creation
                parties: [
                    {
                        name: 'Acme Corporation',
                        email: 'contracts@acme.com',
                        signedAt: status === 'signed' ? new Date(createdDate.getTime() + 86400000 * 2).toISOString() : null
                    },
                    {
                        name: `Partner ${i}`,
                        email: `partner${i}@example.com`,
                        signedAt: status === 'signed' ? new Date(createdDate.getTime() + 86400000 * 3).toISOString() : null
                    }
                ],
                value: Math.floor(Math.random() * 50000) + 5000, // Random value between 5,000 and 55,000
                expiresAt: status === 'expired' ? 
                    new Date(createdDate.getTime() + 86400000 * 30).toISOString() : 
                    new Date(Date.now() + 86400000 * 180).toISOString(),
                organizationId: 1,
                templateId: Math.floor(Math.random() * 10) + 1, // Random template 1-10
                documentUrl: `https://example.com/contracts/${i}.pdf`,
                metadata: {
                    tags: this.getRandomTags(),
                    department: ['Legal', 'HR', 'Sales', 'Operations'][Math.floor(Math.random() * 4)],
                    customFields: {
                        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
                    }
                },
                history: this.generateContractHistory(createdDate, status)
            };
            
            contracts.push(contract);
        }
        
        return contracts;
    }
    
    /**
     * Generate contract history events
     * @param {Date} createdDate - Contract creation date
     * @param {string} status - Contract status
     * @returns {Array} Array of history events
     */
    generateContractHistory(createdDate, status) {
        const history = [
            {
                action: 'created',
                timestamp: createdDate.toISOString(),
                userId: 1,
                userName: 'Admin User'
            }
        ];
        
        const editDate = new Date(createdDate.getTime() + 86400000); // 1 day after creation
        history.push({
            action: 'edited',
            timestamp: editDate.toISOString(),
            userId: 1,
            userName: 'Admin User',
            changes: ['Updated terms', 'Added payment schedule']
        });
        
        if (status === 'pending' || status === 'signed' || status === 'expired') {
            const sentDate = new Date(editDate.getTime() + 86400000); // 1 day after edit
            history.push({
                action: 'sent',
                timestamp: sentDate.toISOString(),
                userId: 1,
                userName: 'Admin User',
                recipients: ['partner@example.com']
            });
            
            if (status === 'signed' || status === 'expired') {
                const signedDate1 = new Date(sentDate.getTime() + 86400000);
                history.push({
                    action: 'signed',
                    timestamp: signedDate1.toISOString(),
                    partyName: 'Acme Corporation',
                    partyEmail: 'contracts@acme.com'
                });
                
                const signedDate2 = new Date(signedDate1.getTime() + 86400000);
                history.push({
                    action: 'signed',
                    timestamp: signedDate2.toISOString(),
                    partyName: 'Partner',
                    partyEmail: 'partner@example.com'
                });
                
                history.push({
                    action: 'completed',
                    timestamp: signedDate2.toISOString(),
                    userId: 1,
                    userName: 'Admin User'
                });
                
                if (status === 'expired') {
                    const expiredDate = new Date(signedDate2.getTime() + 86400000 * 30);
                    history.push({
                        action: 'expired',
                        timestamp: expiredDate.toISOString(),
                        system: true
                    });
                }
            }
        }
        
        return history;
    }
    
    /**
     * Generate random tags for contracts
     * @returns {Array} Array of tag strings
     */
    getRandomTags() {
        const allTags = ['important', 'renewal', 'confidential', 'urgent', 'archived', 'negotiation'];
        const numTags = Math.floor(Math.random() * 3) + 1;
        const tags = [];
        
        for (let i = 0; i < numTags; i++) {
            const tag = allTags[Math.floor(Math.random() * allTags.length)];
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        }
        
        return tags;
    }
    
    /**
     * Generate contract templates
     * @returns {Array} Array of template objects
     */
    generateTemplates() {
        const templates = [
            {
                id: 1,
                name: 'Standard Employment Contract',
                description: 'Standard employment agreement for full-time employees',
                category: 'Employment',
                createdBy: 1,
                createdAt: '2023-01-15T00:00:00.000Z',
                updatedAt: '2023-03-20T00:00:00.000Z',
                tags: ['employment', 'standard'],
                isPublic: true
            },
            {
                id: 2,
                name: 'Non-Disclosure Agreement',
                description: 'Confidentiality agreement for sensitive information protection',
                category: 'Legal',
                createdBy: 1,
                createdAt: '2023-01-16T00:00:00.000Z',
                updatedAt: '2023-02-20T00:00:00.000Z',
                tags: ['confidentiality', 'legal'],
                isPublic: true
            },
            {
                id: 3,
                name: 'Freelance Services Agreement',
                description: 'Contract for freelance or independent contractor services',
                category: 'Services',
                createdBy: 1,
                createdAt: '2023-01-17T00:00:00.000Z',
                updatedAt: '2023-04-05T00:00:00.000Z',
                tags: ['freelance', 'services'],
                isPublic: true
            },
            {
                id: 4,
                name: 'Software License Agreement',
                description: 'Terms for software licensing and usage',
                category: 'Technology',
                createdBy: 1,
                createdAt: '2023-01-18T00:00:00.000Z',
                updatedAt: '2023-03-10T00:00:00.000Z',
                tags: ['software', 'license'],
                isPublic: true
            },
            {
                id: 5,
                name: 'Commercial Lease Agreement',
                description: 'Contract for leasing commercial real estate property',
                category: 'Real Estate',
                createdBy: 1,
                createdAt: '2023-01-19T00:00:00.000Z',
                updatedAt: '2023-02-15T00:00:00.000Z',
                tags: ['lease', 'real estate'],
                isPublic: true
            },
            {
                id: 6,
                name: 'Partnership Agreement',
                description: 'Terms of partnership between two or more entities',
                category: 'Business',
                createdBy: 1,
                createdAt: '2023-01-20T00:00:00.000Z',
                updatedAt: '2023-03-25T00:00:00.000Z',
                tags: ['partnership', 'business'],
                isPublic: true
            },
            {
                id: 7,
                name: 'Sales Contract',
                description: 'Agreement for the sale of goods or services',
                category: 'Sales',
                createdBy: 2,
                createdAt: '2023-01-21T00:00:00.000Z',
                updatedAt: '2023-04-10T00:00:00.000Z',
                tags: ['sales', 'commerce'],
                isPublic: true
            },
            {
                id: 8,
                name: 'Consulting Agreement',
                description: 'Contract for consulting services',
                category: 'Services',
                createdBy: 2,
                createdAt: '2023-01-22T00:00:00.000Z',
                updatedAt: '2023-03-15T00:00:00.000Z',
                tags: ['consulting', 'services'],
                isPublic: true
            },
            {
                id: 9,
                name: 'Content Creation Agreement',
                description: 'Contract for content creation and rights management',
                category: 'Creative',
                createdBy: 2,
                createdAt: '2023-01-23T00:00:00.000Z',
                updatedAt: '2023-02-28T00:00:00.000Z',
                tags: ['content', 'creative'],
                isPublic: true
            },
            {
                id: 10,
                name: 'Joint Venture Agreement',
                description: 'Terms for a joint business venture between entities',
                category: 'Business',
                createdBy: 1,
                createdAt: '2023-01-24T00:00:00.000Z',
                updatedAt: '2023-03-30T00:00:00.000Z',
                tags: ['joint venture', 'business'],
                isPublic: true
            }
        ];
        
        return templates;
    }
    
    /**
     * Generate notifications
     * @returns {Array} Array of notification objects
     */
    generateNotifications() {
        const notifications = [];
        const types = ['contract_signed', 'contract_expired', 'contract_created', 'invitation', 'reminder'];
        const now = new Date();
        
        // Generate 15 notifications
        for (let i = 1; i <= 15; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const timestamp = new Date(now.getTime() - Math.random() * 86400000 * 7); // Random time in past week
            const userId = Math.floor(Math.random() * 3) + 1; // Random user 1-3
            const read = Math.random() > 0.3; // 30% unread
            
            let message, link, relatedId;
            
            switch (type) {
                case 'contract_signed':
                    relatedId = Math.floor(Math.random() * 30) + 1;
                    message = `Contract "${this.contracts.find(c => c.id === relatedId)?.title}" has been signed by all parties.`;
                    link = `/contracts/${relatedId}`;
                    break;
                case 'contract_expired':
                    relatedId = Math.floor(Math.random() * 30) + 1;
                    message = `Contract "${this.contracts.find(c => c.id === relatedId)?.title}" has expired.`;
                    link = `/contracts/${relatedId}`;
                    break;
                case 'contract_created':
                    relatedId = Math.floor(Math.random() * 30) + 1;
                    message = `New contract "${this.contracts.find(c => c.id === relatedId)?.title}" has been created.`;
                    link = `/contracts/${relatedId}`;
                    break;
                case 'invitation':
                    message = 'You have been invited to join a team.';
                    link = '/organization';
                    break;
                case 'reminder':
                    relatedId = Math.floor(Math.random() * 30) + 1;
                    message = `Reminder: Contract "${this.contracts.find(c => c.id === relatedId)?.title}" needs attention.`;
                    link = `/contracts/${relatedId}`;
                    break;
            }
            
            notifications.push({
                id: i,
                type,
                message,
                timestamp: timestamp.toISOString(),
                read,
                userId,
                link,
                relatedId
            });
        }
        
        return notifications;
    }
    
    /**
     * Get all users
     * @returns {Array} Array of user objects
     */
    getUsers() {
        return [...this.users];
    }
    
    /**
     * Get user by ID
     * @param {number} id - User ID
     * @returns {Object|null} User object or null if not found
     */
    getUser(id) {
        return this.users.find(user => user.id === id) || null;
    }
    
    /**
     * Add a new user
     * @param {Object} user - User object
     */
    addUser(user) {
        this.users.push(user);
    }
    
    /**
     * Get all contracts
     * @returns {Array} Array of contract objects
     */
    getContracts() {
        return [...this.contracts];
    }
    
    /**
     * Get contracts for a specific user
     * @param {number} userId - User ID
     * @returns {Array} Array of contract objects
     */
    getContractsForUser(userId) {
        // For simplicity, we'll return all contracts
        // In a real app, this would filter by user permissions
        return [...this.contracts];
    }
    
    /**
     * Get contract by ID
     * @param {number} id - Contract ID
     * @returns {Object|null} Contract object or null if not found
     */
    getContract(id) {
        return this.contracts.find(c => c.id === id) || null;
    }
    
    /**
     * Get all templates
     * @returns {Array} Array of template objects
     */
    getTemplates() {
        return [...this.templates];
    }
    
    /**
     * Get template by ID
     * @param {number} id - Template ID
     * @returns {Object|null} Template object or null if not found
     */
    getTemplate(id) {
        return this.templates.find(template => template.id === id) || null;
    }
    
    /**
     * Get all notifications
     * @returns {Array} Array of notification objects
     */
    getNotifications() {
        return [...this.notifications];
    }
    
    /**
     * Get notifications for a specific user
     * @param {number} userId - User ID
     * @returns {Array} Array of notification objects
     */
    getNotificationsForUser(userId) {
        return this.notifications.filter(notification => notification.userId === userId);
    }
    
    /**
     * Get organization by ID
     * @param {number} id - Organization ID
     * @returns {Object|null} Organization object or null if not found
     */
    getOrganization(id) {
        return this.organizations.find(org => org.id === id) || null;
    }
    
    /**
     * Get organization members
     * @param {number} orgId - Organization ID
     * @returns {Array} Array of user objects
     */
    getOrganizationMembers(orgId) {
        const org = this.getOrganization(orgId);
        if (!org) return [];
        
        return this.users.filter(user => org.members.includes(user.id));
    }
    
    /**
     * Get contract statistics for dashboard
     * @param {number} userId - User ID
     * @returns {Object} Statistics object
     */
    getContractStats(userId) {
        const contracts = this.getContractsForUser(userId);
        
        const stats = {
            total: contracts.length,
            draft: contracts.filter(c => c.status === 'draft').length,
            pending: contracts.filter(c => c.status === 'pending').length,
            signed: contracts.filter(c => c.status === 'signed').length,
            expired: contracts.filter(c => c.status === 'expired').length,
            
            // Activity by month (last 6 months)
            activityByMonth: this.generateActivityStats(contracts),
            
            // Contract types distribution
            typeDistribution: {}
        };
        
        // Calculate type distribution
        contracts.forEach(contract => {
            stats.typeDistribution[contract.type] = (stats.typeDistribution[contract.type] || 0) + 1;
        });
        
        return stats;
    }
    
    /**
     * Generate activity statistics from contracts
     * @param {Array} contracts - Array of contract objects
     * @returns {Array} Array of monthly activity data
     */
    generateActivityStats(contracts) {
        const months = [];
        const now = new Date();
        
        // Generate last 6 months
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                month: monthDate.toLocaleString('default', { month: 'short' }),
                year: monthDate.getFullYear(),
                created: 0,
                signed: 0,
                expired: 0
            });
        }
        
        // Count activities for each month
        contracts.forEach(contract => {
            const createdDate = new Date(contract.createdAt);
            const createdMonthIndex = months.findIndex(m => 
                m.month === createdDate.toLocaleString('default', { month: 'short' }) && 
                m.year === createdDate.getFullYear()
            );
            
            if (createdMonthIndex !== -1) {
                months[createdMonthIndex].created++;
            }
            
            if (contract.status === 'signed') {
                const signedEvent = contract.history.find(h => h.action === 'completed');
                if (signedEvent) {
                    const signedDate = new Date(signedEvent.timestamp);
                    const signedMonthIndex = months.findIndex(m => 
                        m.month === signedDate.toLocaleString('default', { month: 'short' }) && 
                        m.year === signedDate.getFullYear()
                    );
                    
                    if (signedMonthIndex !== -1) {
                        months[signedMonthIndex].signed++;
                    }
                }
            }
            
            if (contract.status === 'expired') {
                const expiredEvent = contract.history.find(h => h.action === 'expired');
                if (expiredEvent) {
                    const expiredDate = new Date(expiredEvent.timestamp);
                    const expiredMonthIndex = months.findIndex(m => 
                        m.month === expiredDate.toLocaleString('default', { month: 'short' }) && 
                        m.year === expiredDate.getFullYear()
                    );
                    
                    if (expiredMonthIndex !== -1) {
                        months[expiredMonthIndex].expired++;
                    }
                }
            }
        });
        
        return months;
    }
    
    /**
     * Add a new contract to the mock data
     * @param {Object} contract - The contract object to add
     * @returns {Object} The added contract
     */
    addContract(contract) {
        if (!contract.id) {
            throw new Error('Contract must have an ID');
        }
        
        // Validate required fields
        const requiredFields = ['title', 'type', 'status', 'createdBy', 'createdAt', 'updatedAt'];
        for (const field of requiredFields) {
            if (!contract[field]) {
                throw new Error(`Contract must have a ${field}`);
            }
        }
        
        // Add the contract to the list
        this.contracts.push(contract);
        
        // Add a notification for the new contract
        this.notifications.unshift({
            id: Date.now(),
            type: 'contract_created',
            title: 'New Contract Created',
            message: `Contract "${contract.title}" has been created`,
            createdAt: new Date().toISOString(),
            read: false,
            userId: contract.createdBy
        });
        
        return contract;
    }
}

// Create and export mock data instance
const mockData = new MockData();
window.mockData = mockData; 
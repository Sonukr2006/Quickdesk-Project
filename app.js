// QuickDesk Application JavaScript

class QuickDeskApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 1;
        this.ticketsPerPage = 5;
        this.currentFilters = {
            status: '',
            category: '',
            sort: 'newest'
        };
        this.isLoading = false;
        
        // Sample data from JSON
        this.users = [
            {id: 1, name: "Admin User", email: "admin@quickdesk.com", role: "admin", avatar: "👤"},
            {id: 2, name: "John Agent", email: "@quickdesk.com", role: "agent", avatar: "🛠️"},
            {id: 3, name: "Sarah Customer", email: "sarah@company.com", role: "user", avatar: "👩"},
            {id: 4, name: "Mike Support", email: "@quickdesk.com", role: "agent", avatar: "🎧"}
        ];

        this.categories = [
            {id: 1, name: "Technical Issue", color: "#e74c3c", description: "Hardware/Software problems"},
            {id: 2, name: "Billing", color: "#f39c12", description: "Payment and billing queries"},
            {id: 3, name: "General Inquiry", color: "#3498db", description: "General questions and information"},
            {id: 4, name: "Bug Report", color: "#e67e22", description: "Software bugs and issues"},
            {id: 5, name: "Feature Request", color: "#9b59b6", description: "New feature suggestions"}
        ];

        this.tickets = [
            {
                id: "TICK-001",
                subject: "Login issues with mobile app",
                description: "Unable to login using mobile app. Getting authentication error.",
                category: "Technical Issue",
                priority: "High",
                status: "Open",
                created_by: "Sarah Customer",
                assigned_to: "John Agent",
                created_date: "2025-01-15",
                last_updated: "2025-01-15",
                upvotes: 3,
                downvotes: 0,
                conversations: [
                    {author: "Sarah Customer", message: "Having trouble logging in on mobile app", timestamp: "2025-01-15 10:30 AM", type: "customer"},
                    {author: "John Agent", message: "Can you please try clearing app cache?", timestamp: "2025-01-15 11:15 AM", type: "agent"}
                ]
            },
            {
                id: "TICK-002", 
                subject: "Payment gateway not working",
                description: "Unable to process payments through the gateway",
                category: "Billing",
                priority: "Critical",
                status: "In Progress",
                created_by: "Mike User",
                assigned_to: "Mike Support",
                created_date: "2025-01-14",
                last_updated: "2025-01-15",
                upvotes: 5,
                downvotes: 1,
                conversations: [
                    {author: "Mike User", message: "Payment processing failed multiple times", timestamp: "2025-01-14 02:30 PM", type: "customer"},
                    {author: "Mike Support", message: "We are investigating the issue with our payment provider", timestamp: "2025-01-14 03:45 PM", type: "agent"},
                    {author: "Mike Support", message: "Issue has been escalated to development team", timestamp: "2025-01-15 09:30 AM", type: "agent"}
                ]
            },
            {
                id: "TICK-003",
                subject: "Feature request: Dark mode",
                description: "Would love to have dark mode option in the application",
                category: "Feature Request", 
                priority: "Low",
                status: "Resolved",
                created_by: "Sarah Customer",
                assigned_to: "John Agent",
                created_date: "2025-01-10",
                last_updated: "2025-01-13",
                upvotes: 12,
                downvotes: 2,
                conversations: [
                    {author: "Sarah Customer", message: "Dark mode would be great for night usage", timestamp: "2025-01-10 08:00 PM", type: "customer"},
                    {author: " Agent", message: "Thank you for the suggestion. Added to our roadmap", timestamp: "2025-01-11 10:00 AM", type: "agent"},
                    {author: " Agent", message: "Dark mode has been implemented in latest version", timestamp: "2025-01-13 02:00 PM", type: "agent"}
                ]
            }
        ];

        this.teams = [
            {id: 1, name: "Technical Support", members: ["John Agent"], tickets_assigned: 15},
            {id: 2, name: "Customer Service", members: ["Mike Support"], tickets_assigned: 8},
            {id: 3, name: "Development", members: ["Dev Team"], tickets_assigned: 3}
        ];

        this.stats = {
            total_tickets: 156,
            open_tickets: 23,
            in_progress: 12, 
            resolved: 98,
            closed: 23,
            average_response_time: "2.3 hours",
            customer_satisfaction: "92%"
        };

        this.init();
    }

    init() {
        console.log('Initializing QuickDesk App...');
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.showLoginScreen();
            });
        } else {
            this.setupEventListeners();
            this.showLoginScreen();
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Ensure loading overlay is hidden initially
        this.hideLoading();
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleLogin();
            });
        }

        // Demo login buttons - with more robust event handling
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const role = e.target.dataset.role;
                console.log('Demo button clicked for role:', role);
                this.handleDemoLogin(role);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleLogout();
            });
        }

        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = e.currentTarget.dataset.section;
                if (section) {
                    console.log('Navigating to section:', section);
                    this.showSection(section);
                }
            });
        });

        // Global search
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleGlobalSearch();
            });
        }

        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleGlobalSearch();
                }
            });
        }

        // Ticket filters
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.filterTickets();
            });
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.filterTickets();
            });
        }

        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.filterTickets();
            });
        }

        // Pagination
        const prevPage = document.getElementById('prevPage');
        if (prevPage) {
            prevPage.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderTicketsTable();
                }
            });
        }

        const nextPage = document.getElementById('nextPage');
        if (nextPage) {
            nextPage.addEventListener('click', (e) => {
                e.preventDefault();
                const totalPages = Math.ceil(this.getFilteredTickets().length / this.ticketsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderTicketsTable();
                }
            });
        }

        // Create ticket form
        const ticketForm = document.getElementById('ticketForm');
        if (ticketForm) {
            ticketForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleCreateTicket();
            });
        }

        // Modal events
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hideModal();
            });
        }

        const ticketModal = document.getElementById('ticketModal');
        if (ticketModal) {
            ticketModal.addEventListener('click', (e) => {
                if (e.target.id === 'ticketModal') {
                    this.hideModal();
                }
            });
        }

        // Modal actions
        const updateStatusBtn = document.getElementById('updateStatusBtn');
        if (updateStatusBtn) {
            updateStatusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.updateTicketStatus();
            });
        }

        const sendReply = document.getElementById('sendReply');
        if (sendReply) {
            sendReply.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.sendReply();
            });
        }

        const upvoteBtn = document.getElementById('upvoteBtn');
        if (upvoteBtn) {
            upvoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleVote('up');
            });
        }

        const downvoteBtn = document.getElementById('downvoteBtn');
        if (downvoteBtn) {
            downvoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleVote('down');
            });
        }
    }

    showLoginScreen() {
        console.log('Showing login screen');
        const loginScreen = document.getElementById('loginScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (appContainer) appContainer.classList.add('hidden');
        
        // Make sure loading is hidden
        this.hideLoading();
    }

    hideLoginScreen() {
        console.log('Hiding login screen');
        const loginScreen = document.getElementById('loginScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (loginScreen) loginScreen.classList.add('hidden');
        if (appContainer) appContainer.classList.remove('hidden');
    }

    handleLogin() {
        if (this.isLoading) return;
        
        const roleSelect = document.getElementById('userRole');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        const role = roleSelect ? roleSelect.value : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';
        
        console.log('Login attempt:', { role, email, password }); 
        
        if (!role || !email || !password) {
            this.showToast('Requied all fields', 'error');
            return;
        }

        // Find user by role for demo
        const user = this.users.find(u => u.role === role);
        if (user) {
            this.currentUser = user;
            this.loginUser(user);
        } else {
            this.showToast('Invalid credentials', 'error');
        }
    }

    handleDemoLogin(role) {
        if (this.isLoading) return;
        
        console.log('Demo login for role:', role); 
        
        const user = this.users.find(u => u.role === role);
        
        if (user) {
            // Fill the form fields for visual feedback
            const roleSelect = document.getElementById('userRole');
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            
            if (roleSelect) roleSelect.value = role;
            if (emailInput) emailInput.value = user.email;
            if (passwordInput) passwordInput.value = 'demo123';
            
            // Directly login the user
            this.currentUser = user;
            this.loginUser(user);
        } else {
            this.showToast('Demo user not found', 'error');
        }
    }

    loginUser(user) {
        if (this.isLoading) return;
        
        console.log('Logging in user:', user.name);
        this.showLoading();
        
        setTimeout(() => {
            try {
                this.hideLoading();
                this.hideLoginScreen();
                this.setupUserInterface(user);
                this.showToast(`Welcome ${user.name}!`, 'success');
            } catch (error) {
                console.error('Login error:', error);
                this.hideLoading();
                this.showToast('Login failed', 'error');
            }
        }, 500); // Reduced loading time for better UX
    }

    setupUserInterface(user) {
        console.log('Setting up UI for user:', user.name);
        
        // Set user info in header
        const currentUserName = document.getElementById('currentUserName');
        const roleBadge = document.getElementById('roleBadge');
        
        if (currentUserName) currentUserName.textContent = user.name;
        if (roleBadge) roleBadge.textContent = user.role.toUpperCase();
        
        // Set user avatar and details in profile
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileRole = document.getElementById('profileRole');
        
        if (profileAvatar) profileAvatar.textContent = user.avatar;
        if (profileName) profileName.textContent = user.name;
        if (profileEmail) profileEmail.textContent = user.email;
        if (profileRole) profileRole.textContent = user.role.toUpperCase();

        // Set body data-role for CSS styling
        document.body.dataset.role = user.role;

        // Load dashboard data and show it
        this.loadDashboard();
        this.showSection('dashboard');
    }

    handleLogout() {
        console.log('Logging out user');
        this.currentUser = null;
        document.body.removeAttribute('data-role');
        
        // Clear form fields
        const roleSelect = document.getElementById('userRole');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (roleSelect) roleSelect.value = '';
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        this.showLoginScreen();
        this.showToast('Logged out successfully', 'success');
    }

    showSection(sectionName) {
        console.log('Showing section:', sectionName);
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        const targetNavBtn = document.querySelector(`[data-section="${sectionName}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section activated:', sectionName);
        }
        if (targetNavBtn) targetNavBtn.classList.add('active');

        // Load section-specific data
        try {
            switch(sectionName) {
                case 'dashboard':
                    this.loadDashboard();
                    break;
                case 'tickets':
                    this.loadTickets();
                    break;
                case 'users':
                    this.loadUsers();
                    break;
                case 'analytics':
                    this.loadAnalytics();
                    break;
            }
        } catch (error) {
            console.error('Error loading section:', error);
        }
    }

    loadDashboard() {
        console.log('Loading dashboard...');
        
        // Update stats
        const totalTickets = document.getElementById('totalTickets');
        const openTickets = document.getElementById('openTickets');
        const inProgressTickets = document.getElementById('inProgressTickets');
        const resolvedTickets = document.getElementById('resolvedTickets');
        
        if (totalTickets) totalTickets.textContent = this.stats.total_tickets;
        if (openTickets) openTickets.textContent = this.stats.open_tickets;
        if (inProgressTickets) inProgressTickets.textContent = this.stats.in_progress;
        if (resolvedTickets) resolvedTickets.textContent = this.stats.resolved;

        // Load recent tickets
        this.renderRecentTickets();
    }

    renderRecentTickets() {
        const container = document.getElementById('recentTicketsList');
        if (!container) return;
        
        console.log('Rendering recent tickets...');
        const recentTickets = this.tickets.slice(0, 3);
        
        container.innerHTML = recentTickets.map(ticket => `
            <div class="ticket-item card" onclick="app.showTicketModal('${ticket.id}')" style="cursor: pointer;">
                <div class="ticket-header">
                    <span class="ticket-id">${ticket.id}</span>
                    <span class="ticket-subject">${ticket.subject}</span>
                </div>
                <div class="ticket-meta">
                    <span class="ticket-status ${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span>
                    <span class="ticket-priority ${ticket.priority.toLowerCase()}">${ticket.priority}</span>
                    <span class="text-secondary">${ticket.category}</span>
                    <span class="text-secondary">${ticket.created_date}</span>
                </div>
            </div>
        `).join('');
    }

    loadTickets() {
        console.log('Loading tickets...');
        this.renderTicketsTable();
    }

    getFilteredTickets() {
        let filtered = [...this.tickets];

        // Apply filters
        if (this.currentFilters.status) {
            filtered = filtered.filter(ticket => ticket.status === this.currentFilters.status);
        }

        if (this.currentFilters.category) {
            filtered = filtered.filter(ticket => ticket.category === this.currentFilters.category);
        }

        // Apply sorting
        switch(this.currentFilters.sort) {
            case 'oldest':
                filtered.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
                break;
            case 'most_replied':
                filtered.sort((a, b) => b.conversations.length - a.conversations.length);
                break;
            case 'priority':
                const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            default: // newest
                filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        }

        return filtered;
    }

    renderTicketsTable() {
        const tbody = document.getElementById('ticketsTableBody');
        if (!tbody) return;
        
        console.log('Rendering tickets table...');
        const filtered = this.getFilteredTickets();
        const startIndex = (this.currentPage - 1) * this.ticketsPerPage;
        const endIndex = startIndex + this.ticketsPerPage;
        const pageTickets = filtered.slice(startIndex, endIndex);

        tbody.innerHTML = pageTickets.map(ticket => `
            <tr>
                <td><strong>${ticket.id}</strong></td>
                <td>${ticket.subject}</td>
                <td>${ticket.category}</td>
                <td><span class="ticket-status ${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span></td>
                <td><span class="ticket-priority ${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
                <td>${ticket.created_by}</td>
                <td>${ticket.assigned_to}</td>
                <td>${ticket.created_date}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="app.showTicketModal('${ticket.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update pagination
        const totalPages = Math.ceil(filtered.length / this.ticketsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        
        if (pageInfo) pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        if (prevPage) prevPage.disabled = this.currentPage === 1;
        if (nextPage) nextPage.disabled = this.currentPage === totalPages;
    }

    filterTickets() {
        this.currentPage = 1;
        this.renderTicketsTable();
    }

    handleGlobalSearch() {
        const searchInput = document.getElementById('globalSearch');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            this.showToast('Please enter search term', 'error');
            return;
        }

        const results = this.tickets.filter(ticket => 
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.description.toLowerCase().includes(searchTerm) ||
            ticket.id.toLowerCase().includes(searchTerm)
        );

        this.showToast(`${results.length} tickets found`, 'success');
        
        // Show tickets section with filtered results
        this.showSection('tickets');
        
        // Apply search filter
        const tbody = document.getElementById('ticketsTableBody');
        if (tbody) {
            tbody.innerHTML = results.map(ticket => `
                <tr>
                    <td><strong>${ticket.id}</strong></td>
                    <td>${ticket.subject}</td>
                    <td>${ticket.category}</td>
                    <td><span class="ticket-status ${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span></td>
                    <td><span class="ticket-priority ${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
                    <td>${ticket.created_by}</td>
                    <td>${ticket.assigned_to}</td>
                    <td>${ticket.created_date}</td>
                    <td>
                        <div class="table-actions">
                            <button class="action-btn view" onclick="app.showTicketModal('${ticket.id}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    handleCreateTicket() {
        const subjectInput = document.getElementById('ticketSubject');
        const categorySelect = document.getElementById('ticketCategory');
        const prioritySelect = document.getElementById('ticketPriority');
        const descriptionInput = document.getElementById('ticketDescription');
        
        const subject = subjectInput ? subjectInput.value.trim() : '';
        const category = categorySelect ? categorySelect.value : '';
        const priority = prioritySelect ? prioritySelect.value : 'Medium';
        const description = descriptionInput ? descriptionInput.value.trim() : '';

        if (!subject || !category || !description) {
            this.showToast('All fields are required', 'error');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            const newTicket = {
                id: `TICK-${String(this.tickets.length + 1).padStart(3, '0')}`,
                subject,
                description,
                category,
                priority,
                status: 'Open',
                created_by: this.currentUser ? this.currentUser.name : 'Unknown User',
                assigned_to: 'Unassigned',
                created_date: new Date().toISOString().split('T')[0],
                last_updated: new Date().toISOString().split('T')[0],
                upvotes: 0,
                downvotes: 0,
                conversations: [
                    {
                        author: this.currentUser ? this.currentUser.name : 'Unknown User',
                        message: description,
                        timestamp: new Date().toLocaleString(),
                        type: this.currentUser && this.currentUser.role === 'user' ? 'customer' : 'agent'
                    }
                ]
            };

            this.tickets.unshift(newTicket);
            this.stats.total_tickets++;
            this.stats.open_tickets++;

            this.hideLoading();
            this.showToast('Ticket successfully created!', 'success');
            
            // Reset form
            const ticketForm = document.getElementById('ticketForm');
            if (ticketForm) ticketForm.reset();
            
            // Go to tickets section
            this.showSection('tickets');
        }, 800);
    }

    showTicketModal(ticketId) {
        console.log('Showing ticket modal for:', ticketId);
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        // Update modal content
        const modalTicketId = document.getElementById('modalTicketId');
        const modalTicketSubject = document.getElementById('modalTicketSubject');
        const modalTicketStatus = document.getElementById('modalTicketStatus');
        const modalTicketPriority = document.getElementById('modalTicketPriority');
        const modalTicketCategory = document.getElementById('modalTicketCategory');
        const modalTicketDescription = document.getElementById('modalTicketDescription');
        const statusUpdate = document.getElementById('statusUpdate');
        const upvoteCount = document.getElementById('upvoteCount');
        const downvoteCount = document.getElementById('downvoteCount');
        const ticketModal = document.getElementById('ticketModal');

        if (modalTicketId) modalTicketId.textContent = ticket.id;
        if (modalTicketSubject) modalTicketSubject.textContent = ticket.subject;
        if (modalTicketStatus) {
            modalTicketStatus.textContent = ticket.status;
            modalTicketStatus.className = `status ticket-status ${ticket.status.toLowerCase().replace(' ', '-')}`;
        }
        if (modalTicketPriority) {
            modalTicketPriority.textContent = ticket.priority;
            modalTicketPriority.className = `priority ticket-priority ${ticket.priority.toLowerCase()}`;
        }
        if (modalTicketCategory) modalTicketCategory.textContent = ticket.category;
        if (modalTicketDescription) modalTicketDescription.textContent = ticket.description;
        if (statusUpdate) statusUpdate.value = ticket.status;
        if (upvoteCount) upvoteCount.textContent = ticket.upvotes;
        if (downvoteCount) downvoteCount.textContent = ticket.downvotes;

        // Render conversation
        this.renderConversation(ticket.conversations);

        // Store current ticket ID for actions
        if (ticketModal) {
            ticketModal.dataset.ticketId = ticketId;
            ticketModal.classList.remove('hidden');
            console.log('Modal shown successfully');
        }
    }

    renderConversation(conversations) {
        const container = document.getElementById('conversationTimeline');
        if (!container) return;
        
        container.innerHTML = conversations.map(conv => `
            <div class="conversation-item ${conv.type}">
                <div class="conversation-header">
                    <span class="conversation-author">${conv.author}</span>
                    <span class="conversation-timestamp">${conv.timestamp}</span>
                </div>
                <div class="conversation-message">${conv.message}</div>
            </div>
        `).join('');
    }

    hideModal() {
        const ticketModal = document.getElementById('ticketModal');
        if (ticketModal) {
            ticketModal.classList.add('hidden');
        }
    }

    updateTicketStatus() {
        const ticketModal = document.getElementById('ticketModal');
        const statusUpdate = document.getElementById('statusUpdate');
        
        if (!ticketModal || !statusUpdate) return;
        
        const ticketId = ticketModal.dataset.ticketId;
        const newStatus = statusUpdate.value;
        const ticket = this.tickets.find(t => t.id === ticketId);

        if (ticket && ticket.status !== newStatus) {
            const oldStatus = ticket.status;
            ticket.status = newStatus;
            ticket.last_updated = new Date().toISOString().split('T')[0];

            ticket.conversations.push({
                author: this.currentUser ? this.currentUser.name : 'System',
                message: `Status changed from ${oldStatus} to ${newStatus}`,
                timestamp: new Date().toLocaleString(),
                type: 'agent'
            });

            this.updateStatsForStatusChange(oldStatus, newStatus);
            this.renderConversation(ticket.conversations);
            
            const modalTicketStatus = document.getElementById('modalTicketStatus');
            if (modalTicketStatus) {
                modalTicketStatus.textContent = newStatus;
                modalTicketStatus.className = `status ticket-status ${newStatus.toLowerCase().replace(' ', '-')}`;
            }

            this.showToast('Status updated successfully!', 'success');
            
            const ticketsSection = document.getElementById('tickets');
            if (ticketsSection && ticketsSection.classList.contains('active')) {
                this.renderTicketsTable();
            }
        }
    }

    updateStatsForStatusChange(oldStatus, newStatus) {
        switch(oldStatus) {
            case 'Open': this.stats.open_tickets--; break;
            case 'In Progress': this.stats.in_progress--; break;
            case 'Resolved': this.stats.resolved--; break;
            case 'Closed': this.stats.closed--; break;
        }

        switch(newStatus) {
            case 'Open': this.stats.open_tickets++; break;
            case 'In Progress': this.stats.in_progress++; break;
            case 'Resolved': this.stats.resolved++; break;
            case 'Closed': this.stats.closed++; break;
        }
    }

    sendReply() {
        const ticketModal = document.getElementById('ticketModal');
        const replyMessage = document.getElementById('replyMessage');
        
        if (!ticketModal || !replyMessage) return;
        
        const ticketId = ticketModal.dataset.ticketId;
        const message = replyMessage.value.trim();

        if (!message) {
            this.showToast('Please write reply message', 'error');
            return;
        }

        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket && this.currentUser) {
            ticket.conversations.push({
                author: this.currentUser.name,
                message: message,
                timestamp: new Date().toLocaleString(),
                type: this.currentUser.role === 'user' ? 'customer' : 'agent'
            });

            ticket.last_updated = new Date().toISOString().split('T')[0];
            this.renderConversation(ticket.conversations);
            replyMessage.value = '';
            this.showToast('Reply sent successfully!', 'success');
        }
    }

    handleVote(type) {
        const ticketModal = document.getElementById('ticketModal');
        if (!ticketModal) return;
        
        const ticketId = ticketModal.dataset.ticketId;
        const ticket = this.tickets.find(t => t.id === ticketId);

        if (ticket) {
            const upvoteCount = document.getElementById('upvoteCount');
            const downvoteCount = document.getElementById('downvoteCount');
            
            if (type === 'up') {
                ticket.upvotes++;
                if (upvoteCount) upvoteCount.textContent = ticket.upvotes;
            } else {
                ticket.downvotes++;
                if (downvoteCount) downvoteCount.textContent = ticket.downvotes;
            }

            this.showToast(`${type === 'up' ? 'Upvoted' : 'Downvoted'} successfully!`, 'success');
        }
    }

    loadUsers() {
        console.log('Loading users...');
        const container = document.getElementById('usersGrid');
        if (!container) return;
        
        container.innerHTML = this.users.map(user => `
            <div class="card user-card">
                <div class="user-info">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-details">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                        <span class="status status--info">${user.role.toUpperCase()}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn btn--outline btn--sm">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn--outline btn--sm">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadAnalytics() {
        console.log('Loading analytics...');
        const container = document.getElementById('teamsGrid');
        if (!container) return;
        
        container.innerHTML = this.teams.map(team => `
            <div class="card team-card">
                <div class="team-info">
                    <h4>${team.name}</h4>
                    <div class="team-stats">
                        <span class="team-members">${team.members.length} members</span>
                        <span class="team-tickets">${team.tickets_assigned} tickets</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showLoading() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        this.isLoading = false;
        
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('successToast');
        const messageEl = document.getElementById('toastMessage');
        
        if (toast && messageEl) {
            messageEl.textContent = message;
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        } else {
            console.log('Toast:', message);
        }
    }
}

// Initialize the application when DOM is ready
let app;

function initializeApp() {
    console.log('Document ready, initializing app...');
    app = new QuickDeskApp();
    window.app = app; // Make app globally available for onclick handlers
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
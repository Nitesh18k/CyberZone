/**
 * db.js - Simulated Local Database and Service Layer
 * Uses localStorage to persist data and simulate API calls.
 */

const DB_KEY = 'cyberzone_db';

// Initial Database Seed Data
const DEFAULT_DB_STATE = {
    users: [
        { id: '1', name: 'Admin User', email: 'admin@cyberzone.com', password: 'ef92b778bafe771e89245b89ecbc05a44a5e113b0956b978d7cd53fc2b146314', role: 'Admin', status: 'Active', created_at: '2026-01-01' },
        { id: '2', name: 'Editor Account', email: 'editor@cyberzone.com', password: 'ef92b778bafe771e89245b89ecbc05a44a5e113b0956b978d7cd53fc2b146314', role: 'Editor', status: 'Active', created_at: '2026-02-15' },
        { id: '3', name: 'Standard Visitor', email: 'user@cyberzone.com', password: 'ef92b778bafe771e89245b89ecbc05a44a5e113b0956b978d7cd53fc2b146314', role: 'Viewer', status: 'Active', created_at: '2026-03-20' }
    ],
    roles: [
        { name: 'Admin', permissions: { dashboard: true, users: true, roles: true, reports: true, logs: true, settings: true, upload: true } },
        { name: 'Editor', permissions: { dashboard: true, users: false, roles: false, reports: true, logs: true, settings: false, upload: true } },
        { name: 'Viewer', permissions: { dashboard: true, users: false, roles: false, reports: false, logs: false, settings: false, upload: false } }
    ],
    logs: [
        { id: 1, type: 'System', user: 'System', action: 'Database initialized successfully', timestamp: '2026-06-27T10:00:00Z' },
        { id: 2, type: 'Auth', user: 'admin@cyberzone.com', action: 'Administrator login successful', timestamp: '2026-06-27T10:15:00Z' }
    ],
    reports: [
        { id: 'REP-001', name: 'Q2 Cybersecurity Vulnerability Report', category: 'Security', date: '2026-06-15', author: 'Admin User', status: 'Completed' },
        { id: 'REP-002', name: 'Monthly Threat Intelligence Summary', category: 'Threats', date: '2026-06-20', author: 'Editor Account', status: 'Completed' },
        { id: 'REP-003', name: 'Public Wi-Fi Penetration Audit', category: 'Audit', date: '2026-06-25', author: 'Admin User', status: 'Pending' }
    ],
    settings: {
        siteName: 'Cyber Zone',
        maintenanceMode: false,
        allowRegistration: true,
        notifyOnNewUser: true,
        notifyOnSystemLog: true
    },
    notifications: [
        { id: 1, message: 'System update scheduled for July 1st, 2026.', read: false, type: 'info', date: '2026-06-26' },
        { id: 2, message: 'Malware prevention logs have been updated.', read: false, type: 'success', date: '2026-06-27' }
    ],
    files: [
        { id: 'f1', name: 'security_policy.pdf', size: 1024 * 350, type: 'application/pdf', preview: '', uploaded_at: '2026-06-26' },
        { id: 'f2', name: 'network_map.png', size: 1024 * 120, type: 'image/png', preview: 'assets/images/logo-im.png', uploaded_at: '2026-06-27' }
    ],
    visitorsCount: 12540
};

// Synchronous SHA-256 implementation
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j;
    var result = '';
    var words = [];
    var asciiLength = ascii[lengthProperty];
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = 1;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }
    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) {
        ascii += '\x00';
    }
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return '';
        words[i >> 2] |= j << ((3 - i % 4) * 8);
    }
    words[words[lengthProperty]] = ((asciiLength * 8) / maxWord) | 0;
    words[words[lengthProperty]] = (asciiLength * 8) | 0;
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16);
        var oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
            var w15 = w[i - 15], w2 = w[i - 2];
            var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
            var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
            var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
            var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
            var temp1 = hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0));
            var temp2 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj;
            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }
    for (i = 0; i < 8; i++) {
        var byteVal = hash[i];
        if (byteVal < 0) byteVal += maxWord;
        result += byteVal.toString(16).padStart(8, '0');
    }
    return result;
}

// Initialize DB if not present (Self-healing migration checks)
function initDB() {
    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DB_STATE));
        return;
    }
    try {
        const dbState = JSON.parse(existing);
        let migrated = false;
        dbState.users.forEach(u => {
            if (u.password && u.password.length !== 64) {
                u.password = sha256(u.password);
                migrated = true;
            }
        });
        if (migrated) {
            localStorage.setItem(DB_KEY, JSON.stringify(dbState));
        }
    } catch (e) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DB_STATE));
    }
}
initDB();

// Helper to retrieve database
function getDB() {
    initDB();
    try {
        return JSON.parse(localStorage.getItem(DB_KEY));
    } catch (e) {
        console.error('Error reading database, resetting to default', e);
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DB_STATE));
        return DEFAULT_DB_STATE;
    }
}

// Helper to save database
function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// SECURITY VALIDATION ENGINE (SQLi & XSS mitigation)
function containsSqlInjection(input) {
    if (typeof input !== 'string') return false;
    // Strict SQL keywords and special character sequence detection
    const sqliPattern = /(\b(select|insert|update|delete|drop|union|alter|create|truncate|where|or|and)\b)|(['"#;*])|(--)/i;
    return sqliPattern.test(input);
}

function sanitizeXSS(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

const db = {
    // Validate authorization scopes (IDOR check)
    validateAccess(targetUserId, requiredRole = null) {
        const activeUser = this.getCurrentUser();
        if (!activeUser) {
            return { success: false, error: 'Unauthorized: No active session context.' };
        }
        if (targetUserId && String(activeUser.id) === String(targetUserId)) {
            return { success: true };
        }
        if (activeUser.role === 'Admin') {
            return { success: true };
        }
        if (requiredRole && activeUser.role === requiredRole) {
            return { success: true };
        }
        return { success: false, error: 'Authorization Denied: IDOR validation failed.' };
    },

    // AUTHENTICATION & SESSIONS
    getCurrentUser() {
        const session = sessionStorage.getItem('cyberzone_session');
        if (session) {
            try {
                const parsed = JSON.parse(session);
                const database = getDB();
                const user = database.users.find(u => u.email === parsed.email);
                if (user && user.status === 'Active') {
                    return user;
                }
                sessionStorage.removeItem('cyberzone_session');
                return null;
            } catch (e) {
                sessionStorage.removeItem('cyberzone_session');
                return null;
            }
        }

        const demoUserEmail = localStorage.getItem('cyberzone_demo_user');
        if (demoUserEmail) {
            const database = getDB();
            const matchedUser = database.users.find(u => u.email.toLowerCase() === demoUserEmail.toLowerCase());
            if (matchedUser && matchedUser.status === 'Active') {
                return matchedUser;
            }
        }

        return null;
    },

    login(email, password) {
        if (!email || !password) {
            return { success: false, error: 'Email and password are required.' };
        }
        if (containsSqlInjection(email) || containsSqlInjection(password)) {
            this.addLog('SecurityAlert', email || 'unknown', 'SQL Injection attempt detected during login');
            return { success: false, error: 'Security Warning: Malicious input pattern detected. Request blocked.' };
        }
        const database = getDB();
        const user = database.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            this.addLog('Auth', email, 'Failed login attempt - User not found');
            return { success: false, error: 'Invalid email or password.' };
        }
        if (user.password !== sha256(password)) {
            this.addLog('Auth', email, 'Failed login attempt - Incorrect password');
            return { success: false, error: 'Invalid email or password.' };
        }
        if (user.status !== 'Active') {
            this.addLog('Auth', email, 'Failed login attempt - Account suspended');
            return { success: false, error: 'Your account is suspended. Please contact administrator.' };
        }

        // Save session
        const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
        sessionStorage.setItem('cyberzone_session', JSON.stringify(sessionUser));

        // Update visitor count on login
        database.visitorsCount += 1;
        saveDB(database);

        this.addLog('Auth', user.email, 'Logged in successfully');
        return { success: true, user: sessionUser };
    },

    logout() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            this.addLog('Auth', currentUser.email, 'Logged out successfully');
        }
        sessionStorage.removeItem('cyberzone_session');
        localStorage.removeItem('cyberzone_demo_user');
        localStorage.removeItem('cyberzone_demo_name');
        return true;
    },

    register(name, email, password) {
        if (!name || !email || !password) {
            return { success: false, error: 'All fields are required.' };
        }
        if (containsSqlInjection(name) || containsSqlInjection(email) || containsSqlInjection(password)) {
            this.addLog('SecurityAlert', email || 'unknown', 'SQL Injection attempt detected during registration');
            return { success: false, error: 'Security Warning: Malicious input pattern detected. Request blocked.' };
        }
        if (password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters.' };
        }

        const safeName = sanitizeXSS(name);
        const safeEmail = sanitizeXSS(email);

        const database = getDB();
        const emailExists = database.users.some(u => u.email.toLowerCase() === safeEmail.toLowerCase());
        if (emailExists) {
            return { success: false, error: 'Email already exists.' };
        }

        const newUser = {
            id: 'U-' + Date.now(),
            name: safeName,
            email: safeEmail,
            password: sha256(password),
            role: 'Viewer', // Default registered user role
            status: 'Active',
            created_at: new Date().toISOString().split('T')[0]
        };

        database.users.push(newUser);
        saveDB(database);

        this.addLog('Auth', email, `New user registered: ${name}`);

        if (database.settings.notifyOnNewUser) {
            this.addNotification(`New user registered: ${name} (${email})`, 'info');
        }

        return { success: true };
    },

    // USER MANAGEMENT
    getUsers() {
        const active = this.getCurrentUser();
        if (!active || (active.role !== 'Admin' && active.role !== 'Editor')) {
            this.addLog('SecurityAlert', active ? active.email : 'unknown', 'IDOR Attempt: Unauthorized user list retrieval blocked.');
            return [];
        }
        return getDB().users;
    },

    addUser(userData) {
        const auth = this.validateAccess(null, 'Admin');
        if (!auth.success) {
            this.addLog('SecurityAlert', this.getCurrentUser()?.email || 'unknown', 'IDOR Attempt: Unauthorized user creation blocked.');
            return auth;
        }

        if (containsSqlInjection(userData.name) || containsSqlInjection(userData.email) || containsSqlInjection(userData.password)) {
            this.addLog('SecurityAlert', this.getCurrentUser()?.email || 'unknown', 'SQL Injection attempt detected in user creation');
            return { success: false, error: 'Security Warning: Malicious input pattern detected. Request blocked.' };
        }

        const safeName = sanitizeXSS(userData.name);
        const safeEmail = sanitizeXSS(userData.email);

        const database = getDB();
        const emailExists = database.users.some(u => u.email.toLowerCase() === safeEmail.toLowerCase());
        if (emailExists) {
            return { success: false, error: 'User with this email already exists.' };
        }

        const newUser = {
            id: 'U-' + Date.now(),
            name: safeName,
            email: safeEmail,
            password: sha256(userData.password || 'password123'),
            role: userData.role || 'Viewer',
            status: userData.status || 'Active',
            created_at: new Date().toISOString().split('T')[0]
        };

        database.users.push(newUser);
        saveDB(database);

        const admin = this.getCurrentUser();
        this.addLog('Action', admin ? admin.email : 'Admin', `Created user account: ${safeEmail}`);
        return { success: true, user: newUser };
    },

    updateUser(id, updates) {
        const auth = this.validateAccess(id, 'Admin');
        if (!auth.success) {
            this.addLog('SecurityAlert', this.getCurrentUser()?.email || 'unknown', `IDOR Attempt: Unauthorized profile update on user ID ${id}`);
            return auth;
        }

        // Sanitize and check inputs
        if (updates.name) {
            if (containsSqlInjection(updates.name)) {
                return { success: false, error: 'Security Warning: Malicious input pattern detected.' };
            }
            updates.name = sanitizeXSS(updates.name);
        }
        if (updates.email) {
            if (containsSqlInjection(updates.email)) {
                return { success: false, error: 'Security Warning: Malicious input pattern detected.' };
            }
            updates.email = sanitizeXSS(updates.email);
        }
        if (updates.password && containsSqlInjection(updates.password)) {
            return { success: false, error: 'Security Warning: Malicious input pattern detected.' };
        }
        if (updates.password) {
            updates.password = sha256(updates.password);
        }

        const database = getDB();
        const index = database.users.findIndex(u => u.id === id);
        if (index === -1) return { success: false, error: 'User not found' };

        // Ensure not updating role or status of the only Admin
        if (database.users[index].role === 'Admin' && updates.role && updates.role !== 'Admin') {
            const adminCount = database.users.filter(u => u.role === 'Admin').length;
            if (adminCount <= 1) {
                return { success: false, error: 'Cannot demote the only administrator.' };
            }
        }

        database.users[index] = { ...database.users[index], ...updates };
        saveDB(database);

        const admin = this.getCurrentUser();
        this.addLog('Action', admin ? admin.email : 'Admin', `Updated user: ${database.users[index].email}`);
        return { success: true, user: database.users[index] };
    },

    deleteUser(id) {
        const auth = this.validateAccess(null, 'Admin');
        if (!auth.success) {
            this.addLog('SecurityAlert', this.getCurrentUser()?.email || 'unknown', `IDOR Attempt: Unauthorized delete request on user ID ${id}`);
            return auth;
        }

        const database = getDB();
        const index = database.users.findIndex(u => u.id === id);
        if (index === -1) return { success: false, error: 'User not found' };

        if (database.users[index].role === 'Admin') {
            const adminCount = database.users.filter(u => u.role === 'Admin').length;
            if (adminCount <= 1) {
                return { success: false, error: 'Cannot delete the only administrator.' };
            }
        }

        const email = database.users[index].email;
        database.users.splice(index, 1);
        saveDB(database);

        const admin = this.getCurrentUser();
        this.addLog('Action', admin ? admin.email : 'Admin', `Deleted user account: ${email}`);
        return { success: true };
    },

    // ROLE & PERMISSION MANAGEMENT
    getRoles() {
        return getDB().roles;
    },

    hasPermission(roleName, moduleName) {
        const database = getDB();
        const role = database.roles.find(r => r.name === roleName);
        if (!role) return false;
        return !!role.permissions[moduleName];
    },

    updateRolePermissions(roleName, permissions) {
        const database = getDB();
        const index = database.roles.findIndex(r => r.name === roleName);
        if (index === -1) return { success: false, error: 'Role not found' };

        // Do not lock Admin out of critical screens
        if (roleName === 'Admin') {
            permissions.dashboard = true;
            permissions.roles = true;
            permissions.settings = true;
        }

        database.roles[index].permissions = { ...database.roles[index].permissions, ...permissions };
        saveDB(database);

        const admin = this.getCurrentUser();
        this.addLog('Action', admin ? admin.email : 'Admin', `Updated permissions for role: ${roleName}`);
        return { success: true };
    },

    // REPORTS MANAGEMENT
    getReports() {
        return getDB().reports;
    },

    addReport(name, category, status = 'Completed') {
        const database = getDB();
        const author = this.getCurrentUser();
        const newReport = {
            id: 'REP-' + Math.floor(100 + Math.random() * 900),
            name,
            category,
            date: new Date().toISOString().split('T')[0],
            author: author ? author.name : 'System',
            status
        };
        database.reports.unshift(newReport);
        saveDB(database);

        this.addLog('Action', author ? author.email : 'System', `Generated new report: ${name}`);
        return { success: true, report: newReport };
    },

    deleteReport(id) {
        const database = getDB();
        const index = database.reports.findIndex(r => r.id === id);
        if (index === -1) return { success: false, error: 'Report not found' };

        const name = database.reports[index].name;
        database.reports.splice(index, 1);
        saveDB(database);

        const author = this.getCurrentUser();
        this.addLog('Action', author ? author.email : 'Admin', `Deleted report: ${name}`);
        return { success: true };
    },

    // LOGS & ACTIVITY HISTORY
    getLogs() {
        return getDB().logs;
    },

    addLog(type, user, action) {
        const database = getDB();
        const newLog = {
            id: database.logs.length + 1,
            type,
            user,
            action,
            timestamp: new Date().toISOString()
        };
        database.logs.unshift(newLog); // Prepend to show latest first

        // Limit log size to 200 items for performance
        if (database.logs.length > 200) {
            database.logs.pop();
        }

        saveDB(database);
        return newLog;
    },

    clearLogs() {
        const database = getDB();
        database.logs = [{ id: 1, type: 'System', user: 'System', action: 'Activity log cleared by admin', timestamp: new Date().toISOString() }];
        saveDB(database);
        return true;
    },

    // SETTINGS MODULE
    getSettings() {
        return getDB().settings;
    },

    updateSettings(newSettings) {
        const database = getDB();
        database.settings = { ...database.settings, ...newSettings };
        saveDB(database);

        const admin = this.getCurrentUser();
        this.addLog('Action', admin ? admin.email : 'Admin', 'Updated system configurations');
        return { success: true };
    },

    // NOTIFICATION MANAGEMENT
    getNotifications() {
        return getDB().notifications;
    },

    addNotification(message, type = 'info') {
        const database = getDB();
        const newNotification = {
            id: Date.now(),
            message,
            read: false,
            type,
            date: new Date().toISOString().split('T')[0]
        };
        database.notifications.unshift(newNotification);
        saveDB(database);
        return newNotification;
    },

    markNotificationRead(id) {
        const database = getDB();
        const index = database.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            database.notifications[index].read = true;
            saveDB(database);
        }
    },

    clearNotifications() {
        const database = getDB();
        database.notifications = [];
        saveDB(database);
    },

    // FILE UPLOAD MANAGEMENT
    getFiles() {
        return getDB().files;
    },

    uploadFile(name, size, type, previewBase64 = '') {
        const database = getDB();
        const newFile = {
            id: 'f-' + Date.now(),
            name,
            size,
            type,
            preview: previewBase64,
            uploaded_at: new Date().toISOString().split('T')[0]
        };
        database.files.unshift(newFile);
        saveDB(database);

        const user = this.getCurrentUser();
        this.addLog('Action', user ? user.email : 'System', `Uploaded file: ${name} (${Math.round(size / 1024)} KB)`);
        return { success: true, file: newFile };
    },

    deleteFile(id) {
        const database = getDB();
        const index = database.files.findIndex(f => f.id === id);
        if (index === -1) return { success: false, error: 'File not found' };

        const name = database.files[index].name;
        database.files.splice(index, 1);
        saveDB(database);

        const user = this.getCurrentUser();
        this.addLog('Action', user ? user.email : 'Admin', `Deleted file: ${name}`);
        return { success: true };
    },

    // BACKUP & RESTORE
    exportDatabase() {
        const data = localStorage.getItem(DB_KEY);
        const admin = this.getCurrentUser();
        this.addLog('Action', admin ? admin.email : 'Admin', 'Created system database backup');
        return data;
    },

    importDatabase(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (!parsed.users || !parsed.roles || !parsed.settings) {
                return { success: false, error: 'Invalid backup file structure.' };
            }
            localStorage.setItem(DB_KEY, jsonString);
            this.addLog('System', 'System', 'Database restored from backup');
            return { success: true };
        } catch (e) {
            return { success: false, error: 'Failed to parse database backup file. Ensure it is valid JSON.' };
        }
    },

    // ANALYTICS OVERVIEW
    getAnalytics() {
        const database = getDB();
        const users = database.users;
        const logs = database.logs;

        // Count totals
        const totalUsers = users.length;
        const visitorCount = database.visitorsCount;
        const totalReports = database.reports.length;
        const totalFiles = database.files.length;

        // Log types breakdown
        const systemLogs = logs.filter(l => l.type === 'System').length;
        const authLogs = logs.filter(l => l.type === 'Auth').length;
        const actionLogs = logs.filter(l => l.type === 'Action').length;

        return {
            totalUsers,
            visitorCount,
            totalReports,
            totalFiles,
            logsBreakdown: {
                System: systemLogs,
                Auth: authLogs,
                Action: actionLogs
            },
            recentActivities: logs.slice(0, 5),
            reportsByCategory: {
                Security: database.reports.filter(r => r.category === 'Security').length,
                Threats: database.reports.filter(r => r.category === 'Threats').length,
                Audit: database.reports.filter(r => r.category === 'Audit').length
            }
        };
    }
};

window.db = db; // Expose globally for website interaction

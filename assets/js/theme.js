
// Dynamic path resolver
const isSubpage = window.location.pathname.includes('/pages/');
const relativeRoot = isSubpage ? '../' : './';
const pagesFolder = isSubpage ? '' : 'pages/';

/**
 * theme.js - Global Interactive Logic
 * Manages sessions, responsive navigation, authentication modals, search, and toasts.
 */

function getStaticDemoDb() {
    if (window.db) return window.db;

    return {
        getCurrentUser() {
            const email = localStorage.getItem('cyberzone_demo_user');
            if (!email) return null;
            return {
                id: 'demo-user',
                name: localStorage.getItem('cyberzone_demo_name') || email.split('@')[0],
                email,
                role: 'Viewer'
            };
        },
        login(email, password) {
            if (!email || !password) return { success: false, error: 'Email and password are required.' };
            localStorage.setItem('cyberzone_demo_user', email);
            localStorage.setItem('cyberzone_demo_name', email.split('@')[0]);
            return { success: true, user: { id: 'demo-user', name: email.split('@')[0], email, role: 'Viewer' } };
        },
        register(name, email, password) {
            if (!name || !email || !password) return { success: false, error: 'Please complete the form.' };
            localStorage.setItem('cyberzone_demo_user', email);
            localStorage.setItem('cyberzone_demo_name', name);
            return { success: true, user: { id: 'demo-user', name, email, role: 'Viewer' } };
        },
        logout() {
            localStorage.removeItem('cyberzone_demo_user');
            localStorage.removeItem('cyberzone_demo_name');
            sessionStorage.removeItem('cyberzone_session');
            return true;
        },
        addLog() { }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Enforce authorization gate for subpages (Bypassed to allow access to all pages without login)
    /*
    const currentUser = window.db ? window.db.getCurrentUser() : null;
    if (isSubpage && !currentUser) {
        window.location.href = '../index.html?triggerLogin=true';
        return;
    }
    */

    // Auto trigger login modal if redirected from a subpage or first-time visitor
    const params = new URLSearchParams(window.location.search);
    const isHomePage = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    const hasActiveSession = Boolean(getStaticDemoDb().getCurrentUser() || (window.db && window.db.getCurrentUser()));

    if (!hasActiveSession && (params.get('triggerLogin') === 'true' || params.get('showLogin') === 'true' || isHomePage)) {
        setTimeout(() => {
            showModal();
        }, 300);
    }

    // Inject Toast Container if not present
    if (!document.getElementById('toast-container')) {
        const tc = document.createElement('div');
        tc.id = 'toast-container';
        tc.className = 'toast-container';
        document.body.appendChild(tc);
    }

    // Initialize Navbar & Session View
    syncNavbarSession();

    // Mobile Hamburger Menu Toggle
    setupMobileMenu();

    // Setup Auth Forms
    setupAuthListeners();

    // Intercept default Search inputs
    setupSearchListeners();
});

// Toast Alerts Engine
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'danger') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Auto remove after 4.5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(16px) scale(0.95)';
            toast.style.transition = 'opacity 0.3s, transform 0.3s';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4500);
}

// Synchronize navbar options based on login state
function syncNavbarSession() {
    const userArea = document.querySelector('.navbar-login') || document.querySelector('.navbar-user-area');
    if (!userArea) return;

    const currentUser = getStaticDemoDb().getCurrentUser();

    if (currentUser) {
        // Create user dropdown markup
        const userDropdownHTML = `
            <div class="user-profile-dropdown" id="user-dropdown">
                <div class="user-profile-trigger" id="user-trigger">
                    <img src="${relativeRoot}assets/images/profile.png" alt="Avatar" class="user-avatar">
                    <span class="user-name">${currentUser.name.split(' ')[0]}</span>
                    <i class="fa-solid fa-chevron-down" style="font-size: 11px; margin-left: 2px; color: #64748b;"></i>
                </div>
                <div class="user-dropdown-menu" id="dropdown-menu">
                    <div class="dropdown-header">Logged in as <b>${currentUser.role}</b></div>
                    <a href="${relativeRoot}${pagesFolder}dashboard.html" class="dropdown-item"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
                    <a href="${relativeRoot}${pagesFolder}dashboard.html?tab=profile" class="dropdown-item"><i class="fa-solid fa-user-gear"></i> Profile Settings</a>
                    <a href="${relativeRoot}${pagesFolder}dashboard.html?tab=settings" class="dropdown-item"><i class="fa-solid fa-sliders"></i> System Settings</a>
                    <a href="#" class="dropdown-item logout" id="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Log Out</a>
                </div>
            </div>
        `;

        // Replace container content
        if (document.querySelector('.navbar-login')) {
            const navLogin = document.querySelector('.navbar-login');
            navLogin.className = 'navbar-user-area';
            navLogin.innerHTML = userDropdownHTML;
        } else {
            userArea.innerHTML = userDropdownHTML;
        }

        // Toggle dropdown open/close
        const trigger = document.getElementById('user-trigger');
        const menu = document.getElementById('dropdown-menu');

        if (trigger && menu) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                menu.classList.remove('show');
            });
        }

        // Logout event
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const demoDb = getStaticDemoDb();
                if (demoDb) {
                    demoDb.logout();
                    showToast('Logged out successfully!', 'success');
                    setTimeout(() => {
                        window.location.href = relativeRoot + 'index.html';
                    }, 1000);
                }
            });
        }
    } else {
        // Guest user state
        if (isSubpage) {
            // Hide the login area on subpages (they will be redirected anyway, but keeps navbar clean)
            userArea.innerHTML = '';
        } else {
            const guestHTML = `<button class="btn-login-nav" onclick="showModal()">Log-in / sign-up</button>`;
            if (document.querySelector('.navbar-user-area')) {
                const userAreaDiv = document.querySelector('.navbar-user-area');
                userAreaDiv.className = 'navbar-login';
                userAreaDiv.innerHTML = guestHTML;
            } else {
                userArea.innerHTML = guestHTML;
            }
        }
    }
}

// Setup Hamburger Navigation drawer trigger
function setupMobileMenu() {
    // Add mobile toggle menu button if missing
    const nav = document.querySelector('.navbar');
    if (nav && !document.querySelector('.menu-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'menu-toggle';
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        nav.insertBefore(toggleBtn, nav.querySelector('.navbar-search') || nav.querySelector('.navbar-login') || nav.querySelector('.navbar-user-area'));

        const links = document.querySelector('.navbar-links');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            links.classList.toggle('show');
            toggleBtn.innerHTML = links.classList.contains('show')
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        document.addEventListener('click', () => {
            if (links) links.classList.remove('show');
            toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    }
}

// Global modal triggers
function showModal() {
    const overlay = document.querySelector('.overlay');
    const loginForm = document.querySelector('.loginform');
    if (overlay && loginForm) {
        overlay.classList.add('showoverlay');
        loginForm.classList.add('showloginform');
    }
}

function closeModal() {
    const overlay = document.querySelector('.overlay');
    const loginForm = document.querySelector('.loginform');
    if (overlay && loginForm) {
        overlay.classList.remove('showoverlay');
        loginForm.classList.remove('showloginform');
    }
}

// Connect auth listeners
function setupAuthListeners() {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (registerBtn && loginBtn && container) {
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });

        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }

    // Capture sign up submission
    const signupForm = document.querySelector('.form-container.sign-up form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[name="btn"]') || e.target.querySelector('button');
            const originalText = btn ? btn.innerHTML : 'Sign Up';
            if (btn) btn.innerHTML = 'Signing Up...';

            const name = e.target.name.value;
            const email = e.target.email.value;
            const password = e.target.password.value;

            const demoDb = getStaticDemoDb();
            if (demoDb) {
                const res = demoDb.register(name, email, password);
                if (btn) btn.innerHTML = originalText;

                if (res.success) {
                    showToast('Account created successfully! Switching to Sign In.', 'success');
                    signupForm.reset();
                    if (container) container.classList.remove("active");
                } else {
                    showToast(res.error, 'danger');
                }
            }

            // Signup completed
        });
    }

    // Capture sign in submission
    const signinForm = document.querySelector('.form-container.sign-in form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[name="btn"]') || e.target.querySelector('button');
            const originalText = btn ? btn.innerHTML : 'Sign In';
            if (btn) btn.innerHTML = 'Authenticating...';

            const email = e.target.email.value;
            const password = e.target.password.value;

            const demoDb = getStaticDemoDb();
            if (demoDb) {
                const res = demoDb.login(email, password);
                if (btn) btn.innerHTML = originalText;

                if (res.success) {
                    showToast(`Welcome back, ${res.user.name}!`, 'success');
                    closeModal();
                    signinForm.reset();
                    setTimeout(() => {
                        if (res.user.role === 'Admin' || res.user.role === 'Editor') {
                            window.location.href = pagesFolder + 'dashboard.html';
                        } else {
                            window.location.reload();
                        }
                    }, 1000);
                } else {
                    showToast(res.error, 'danger');
                }
            }
        });
    }
}

// Google Sheets integration removed

// Nav Search Bar listener
function setupSearchListeners() {
    const searchInput = document.querySelector('.navbar-search input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim().toLowerCase();
                if (query) {
                    performGlobalSearch(query);
                }
            }
        });
    }
}

function performGlobalSearch(query) {
    // If on blog page, filter the cards immediately
    if (window.location.pathname.includes('blog.html') || window.location.pathname.includes(relativeRoot + 'index.html')) {
        const posts = document.querySelectorAll('.post-box');
        let matches = 0;
        posts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const desc = post.querySelector('.post-decription').textContent.toLowerCase();
            const category = post.querySelector('.category').textContent.toLowerCase();

            if (title.includes(query) || desc.includes(query) || category.includes(query)) {
                post.style.display = 'block';
                matches++;
            } else {
                post.style.display = 'none';
            }
        });
        showToast(`Filtered: found ${matches} posts matching "${query}"`, 'info');
    } else {
        // Redirect to Blog with search parameter
        window.location.href = pagesFolder + `blog.html?q=${encodeURIComponent(query)}`;
    }
}

// Auto-run search filter if URL contains query parameter
if (window.location.search.includes('q=')) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
        setTimeout(() => {
            const searchInput = document.querySelector('.navbar-search input');
            if (searchInput) searchInput.value = query;
            performGlobalSearch(query.toLowerCase());
        }, 300);
    }
}

// Expose globally for overlay actions
window.showModal = showModal;
window.closeModal = closeModal;
window.showToast = showToast;

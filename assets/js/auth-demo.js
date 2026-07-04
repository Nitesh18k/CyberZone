document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const message = document.getElementById('formMessage');

    loginForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        localStorage.setItem('cyberzone_demo_user', email);
        window.location.href = 'dashboard.html';
    });

    signupForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        localStorage.setItem('cyberzone_demo_user', email);
        localStorage.setItem('cyberzone_demo_name', name);
        if (message) message.textContent = 'Account ready. Redirecting to your dashboard...';
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 900);
    });
});

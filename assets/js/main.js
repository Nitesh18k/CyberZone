document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
    }

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    document.querySelectorAll('.demo-action').forEach((button) => {
        button.addEventListener('click', () => {
            const label = button.dataset.label || 'Demo action';
            window.alert(`${label} is a static demo only.`);
        });
    });

    document.querySelectorAll('[data-modal]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.modal').forEach((modal) => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) modal.classList.remove('active');
        });
    });
});

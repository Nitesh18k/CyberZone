document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.demo-action').forEach((button) => {
        button.addEventListener('click', () => {
            window.alert('Demo admin action only.');
        });
    });
});

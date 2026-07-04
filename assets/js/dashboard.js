document.addEventListener('DOMContentLoaded', () => {
    const userEmail = localStorage.getItem('cyberzone_demo_user') || 'demo@cyberzone.dev';
    const name = localStorage.getItem('cyberzone_demo_name') || 'Analyst';
    const heroName = document.getElementById('dashboardName');
    if (heroName) heroName.textContent = `Welcome back, ${name}`;

    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) profileEmail.textContent = userEmail;

    const metrics = [
        { label: 'Completed Labs', value: '12' },
        { label: 'Saved Resources', value: '07' },
        { label: 'Current Streak', value: '24d' },
        { label: 'Threat Alerts', value: '03' }
    ];

    document.getElementById('metricCards')?.innerHTML = metrics.map((item) => `
    <article class="card stat-card">
      <strong>${item.value}</strong>
      <span>${item.label}</span>
    </article>
  `).join('');
});

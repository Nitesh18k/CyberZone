const resources = [
    { title: 'Security Foundations', category: 'Beginner', type: 'Learning Path', description: 'A guided route through the fundamentals of cyber hygiene and risk.' },
    { title: 'SOC Analyst Lab', category: 'SOC', type: 'Lab', description: 'Practice monitoring, triage, and alert handling in a sandboxed environment.' },
    { title: 'OWASP Top 10 Guide', category: 'Web Pentesting', type: 'Guide', description: 'Understand the most critical web app risks and how to test them.' },
    { title: 'Cisco Network Security', category: 'Network Security', type: 'Course', description: 'Hands-on pathway into routing, segmentation, and defense-in-depth.' },
    { title: 'CompTIA Security+', category: 'Certifications', type: 'Certification', description: 'A strong starting point for entering security operations and support roles.' },
    { title: 'Advanced Red Teaming', category: 'Advanced', type: 'Workshop', description: 'Explore offensive tradecraft with a focus on safe and ethical practice.' }
];

const resourceContainer = document.getElementById('resourceGrid');
const resourceSearch = document.getElementById('resourceSearch');
const resourceFilter = document.getElementById('resourceFilter');

function renderResources() {
    if (!resourceContainer) return;
    const query = (resourceSearch?.value || '').toLowerCase();
    const filtered = resources.filter((item) => {
        const matchesQuery = `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query);
        const matchesFilter = !resourceFilter || resourceFilter.value === 'All' || item.category === resourceFilter.value;
        return matchesQuery && matchesFilter;
    });

    resourceContainer.innerHTML = filtered.map((item) => `
    <article class="card">
      <div class="badge">${item.category}</div>
      <h3>${item.title}</h3>
      <p class="muted">${item.type}</p>
      <p>${item.description}</p>
      <div class="hero-actions">
        <button class="btn btn-secondary demo-action" data-label="Open ${item.title}">Preview</button>
      </div>
    </article>
  `).join('');
}

resourceSearch?.addEventListener('input', renderResources);
resourceFilter?.addEventListener('change', renderResources);
renderResources();

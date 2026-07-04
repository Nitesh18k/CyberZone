const blogPosts = [
    { title: 'Zero-Trust by Design', category: 'Web Security', date: '2026-06-28', description: 'A blueprint for securing modern SaaS products with identity-first architecture.', tag: 'Web Security' },
    { title: 'SOC Playbooks That Scale', category: 'SOC', date: '2026-06-21', description: 'How teams are turning incident response into repeatable automation loops.', tag: 'SOC' },
    { title: 'Threat Intel in 2026', category: 'Threat Intelligence', date: '2026-06-16', description: 'What CISOs should watch as ransomware and phishing tactics evolve.', tag: 'Threat Intelligence' },
    { title: 'Ethical Hacking Lab Setup', category: 'Ethical Hacking', date: '2026-06-08', description: 'A practical, safe route to building your first pentest lab at home.', tag: 'Ethical Hacking' },
    { title: 'Network Security Basics', category: 'Network Security', date: '2026-05-29', description: 'Learn which controls matter most for hardening internal networks.', tag: 'Network Security' },
    { title: 'Landing a Security Career', category: 'Career Guidance', date: '2026-05-18', description: 'Resume and portfolio tips that help early-career defenders stand out.', tag: 'Career Guidance' }
];

const blogContainer = document.getElementById('blogGrid');
const blogSearch = document.getElementById('blogSearch');
const blogFilters = document.querySelectorAll('[data-filter]');

let activeFilter = 'All';

function renderBlogs() {
    if (!blogContainer) return;
    const query = (blogSearch?.value || '').toLowerCase();
    const filtered = blogPosts.filter((post) => {
        const matchesFilter = activeFilter === 'All' || post.category === activeFilter;
        const matchesQuery = `${post.title} ${post.description} ${post.category}`.toLowerCase().includes(query);
        return matchesFilter && matchesQuery;
    });

    blogContainer.innerHTML = filtered.map((post) => `
    <article class="card">
      <div class="badge">${post.category}</div>
      <h3>${post.title}</h3>
      <p class="muted">${post.date}</p>
      <p>${post.description}</p>
      <div class="tag-row">
        <span class="tag">${post.tag}</span>
      </div>
    </article>
  `).join('');
}

blogFilters.forEach((button) => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        blogFilters.forEach((item) => item.classList.toggle('active', item === button));
        renderBlogs();
    });
});

blogSearch?.addEventListener('input', renderBlogs);
renderBlogs();

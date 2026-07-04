const internships = [
    { title: 'SOC Analyst Intern', location: 'Remote', type: 'Internship', skill: 'SIEM', description: 'Support alert triage and incident documentation in a fast-paced security team.' },
    { title: 'Threat Intelligence Researcher', location: 'London', type: 'Full-time', skill: 'OSINT', description: 'Build threat briefs and track emerging malware campaigns for enterprise clients.' },
    { title: 'Web App Security Intern', location: 'Singapore', type: 'Internship', skill: 'Pentesting', description: 'Assist with application security reviews and vulnerability validation.' },
    { title: 'Cloud Security Engineer', location: 'Dubai', type: 'Full-time', skill: 'Cloud', description: 'Secure cloud workloads with IAM reviews, logging, and posture management.' }
];

const jobsContainer = document.getElementById('jobsGrid');
const jobSearch = document.getElementById('jobSearch');
const locationFilter = document.getElementById('locationFilter');
const typeFilter = document.getElementById('typeFilter');
const skillFilter = document.getElementById('skillFilter');

function renderJobs() {
    if (!jobsContainer) return;
    const query = (jobSearch?.value || '').toLowerCase();
    const filtered = internships.filter((job) => {
        const matchesQuery = `${job.title} ${job.description} ${job.skill}`.toLowerCase().includes(query);
        const matchesLocation = !locationFilter || locationFilter.value === 'All' || job.location === locationFilter.value;
        const matchesType = !typeFilter || typeFilter.value === 'All' || job.type === typeFilter.value;
        const matchesSkill = !skillFilter || skillFilter.value === 'All' || job.skill === skillFilter.value;
        return matchesQuery && matchesLocation && matchesType && matchesSkill;
    });

    jobsContainer.innerHTML = filtered.map((job) => `
    <article class="card">
      <div class="badge">${job.type}</div>
      <h3>${job.title}</h3>
      <p class="muted">${job.location} • ${job.skill}</p>
      <p>${job.description}</p>
      <div class="hero-actions">
        <button class="btn btn-primary demo-action" data-label="Apply for ${job.title}">Apply Demo</button>
      </div>
    </article>
  `).join('');
}

[jobSearch, locationFilter, typeFilter, skillFilter].forEach((field) => field?.addEventListener('input', renderJobs));
[jobSearch, locationFilter, typeFilter, skillFilter].forEach((field) => field?.addEventListener('change', renderJobs));
renderJobs();

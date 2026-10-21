/* Renders the portfolio from data.js and wires up interactions. */
(function () {
    const D = (typeof PORTFOLIO !== 'undefined' && PORTFOLIO) || {};
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Stable colour per technology name
    const tagClass = (name) => {
        let h = 0;
        for (const ch of name.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
        return 't' + (h % 7);
    };
    const statusClass = (s = '') => s.toLowerCase().includes('live') ? 'status-live' : s.toLowerCase().includes('progress') ? 'status-progress'
        : s.toLowerCase().includes('hack') ? 'status-hackathon' : 'status-shipped';

    /* ---------- Render: stats ---------- */
    const projects = D.projects || [];
    const stats = [
        { num: projects.filter(p => (p.category || []).includes('hack')).length, label: 'Hackathons & AI Challenges' },
        { num: projects.length, label: 'Projects Built' },
        { num: (D.experience || []).length, label: 'Internships & Roles' },
        { num: (D.certifications || []).length, label: 'Certifications' },
        ...(D.extraStats || [])
    ];
    const statsRow = $('#statsRow');
    if (statsRow) statsRow.innerHTML = stats.map((s, i) =>
        `<div class="stat reveal-bottom delay-${Math.min(i, 5)}"><span class="stat-num" data-count="${esc(s.num)}">${esc(s.num)}</span><span class="stat-label">${esc(s.label)}</span></div>`
    ).join('');

    /* ---------- Render: services ---------- */
    const sg = $('#servicesGrid');
    if (sg) sg.innerHTML = (D.services || []).map((s, i) =>
        `<div class="service-card reveal-bottom delay-${Math.min(i, 5)}"><i class="fas ${esc(s.icon)}"></i><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`
    ).join('');

    /* ---------- Render: experience ---------- */
    const tl = $('#timeline');
    if (tl) tl.innerHTML = (D.experience || []).map((e, i) => `
        <div class="timeline-item reveal-right delay-${Math.min(i, 5)}">
            <span class="date"><i class="fas ${esc(e.icon || 'fa-briefcase')}"></i>${esc(e.date)}</span>
            <div class="timeln-content">
                <h3>${esc(e.title)} ${e.type ? `<span class="type-badge">${esc(e.type)}</span>` : ''}</h3>
                <h4>${esc(e.org)}</h4>
                ${(e.points || []).length ? `<ul>${e.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
            </div>
        </div>`).join('');

    /* ---------- Render: projects ---------- */
    const grid = $('#projectGrid');
    if (grid) grid.innerHTML = projects.map((p, i) => {
        const cats = [...(p.category || []), p.featured ? 'featured' : ''].join(' ');
        return `
        <button class="project-card reveal-bottom delay-${i % 3}" data-cats="${esc(cats)}" data-id="${esc(p.id)}" aria-label="Open case study: ${esc(p.title)}">
            <div class="card-top">
                <span class="event-label">${esc(p.event)}</span>
                ${p.status ? `<span class="status ${statusClass(p.status)}">${esc(p.status)}</span>` : ''}
            </div>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.summary)}</p>
            <div class="card-tags">${(p.stack || []).slice(0, 5).map(t => `<span class="tech-tag ${tagClass(t)}">${esc(t)}</span>`).join('')}</div>
            <span class="card-more">View case study<i class="fas fa-arrow-right"></i></span>
        </button>`;
    }).join('');

    /* ---------- Render: achievements & certs ---------- */
    const ag = $('#achieveGrid');
    if (ag) ag.innerHTML = (D.achievements || []).map((a, i) => `
        <div class="achieve-card reveal-bottom delay-${i % 3}">
            <div class="achieve-icon c-${esc(a.color || 'cyan')}"><i class="fas ${esc(a.icon)}"></i></div>
            <div>
                <span class="achieve-date">${esc(a.date)}</span>
                <h3>${esc(a.title)}</h3>
                <h4>${esc(a.org)}</h4>
                <p>${esc(a.text)}</p>
            </div>
        </div>`).join('');

    const cg = $('#certGrid');
    if (cg) cg.innerHTML = (D.certifications || []).map((c, i) => {
        const tag = c.image ? 'button' : 'div';
        return `<${tag} class="cert-item reveal-bottom delay-${i % 3}" ${c.image ? `data-img="${esc(c.image)}" aria-label="View certificate: ${esc(c.title)}"` : ''}>
            <i class="fas fa-certificate"></i>
            <div><strong>${esc(c.title)}</strong><span>${esc(c.org)}</span></div>
            ${c.image ? '<i class="fas fa-expand view"></i>' : ''}
        </${tag}>`;
    }).join('');

    /* ---------- Resume button ---------- */
    const resumeBtn = $('#resumeBtn');
    if (resumeBtn && D.resume) resumeBtn.setAttribute('href', D.resume);

    /* ---------- Theme toggle ---------- */
    const root = document.documentElement;
    const themeBtn = $('#themeToggle');
    const setThemeIcon = () => {
        if (themeBtn) themeBtn.innerHTML = root.getAttribute('data-theme') === 'light'
            ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };
    setThemeIcon();
    themeBtn && themeBtn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        setThemeIcon();
        document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', next === 'light' ? '#f6f8fb' : '#0d121c'));
    });

    /* ---------- Mobile nav ---------- */
    const menuToggle = $('#menuToggle');
    const navLinks = $('#navLinks');
    menuToggle && menuToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        menuToggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }));

    /* ---------- Header shadow, progress bar, active link ---------- */
    const header = $('#siteHeader');
    const bar = $('#scrollProgress');
    const sections = $$('section[id]');
    const onScroll = () => {
        const y = window.scrollY;
        header && header.classList.toggle('scrolled', y > 30);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
        let current = '';
        sections.forEach(s => { if (y >= s.offsetTop - 120) current = s.id; });
        $$('.nav-links a').forEach(a => a.classList.toggle('current', a.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Reveal on scroll + count-up ---------- */
    const countUp = (el) => {
        const raw = el.getAttribute('data-count');
        const n = parseInt(raw, 10);
        if (isNaN(n) || reduceMotion) return;
        const suffix = raw.replace(/^\d+/, '');
        const start = performance.now();
        const step = (t) => {
            const k = Math.min((t - start) / 1000, 1);
            el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + suffix;
            if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            const num = entry.target.querySelector('[data-count]');
            if (num) countUp(num);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    $$('.reveal-top, .reveal-bottom, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

    /* ---------- Typing hero ---------- */
    const typed = $('#typed');
    const roles = D.roles && D.roles.length ? D.roles : ['Information Engineering Student'];
    if (typed) {
        if (reduceMotion) {
            typed.textContent = roles[0];
        } else {
            let r = 0, c = 0, deleting = false;
            const tick = () => {
                const word = roles[r];
                c += deleting ? -1 : 1;
                typed.textContent = word.slice(0, c);
                let delay = deleting ? 40 : 80;
                if (!deleting && c === word.length) { deleting = true; delay = 1600; }
                else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
                setTimeout(tick, delay);
            };
            tick();
        }
    }

    /* ---------- Hero tilt ---------- */
    const hero = $('.hero');
    const heroContent = $('#heroMask');
    if (hero && heroContent && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 60;
            const y = (window.innerHeight / 2 - e.clientY) / 60;
            heroContent.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });
        hero.addEventListener('mouseleave', () => {
            heroContent.style.transition = 'transform 0.5s ease';
            heroContent.style.transform = 'none';
        });
        hero.addEventListener('mouseenter', () => { heroContent.style.transition = 'none'; });
    }

    /* ---------- Project filters ---------- */
    $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.getAttribute('data-filter');
        $$('#projectGrid .project-card').forEach(card => {
            const show = f === 'all' || card.getAttribute('data-cats').split(' ').includes(f);
            card.classList.toggle('hide', !show);
            if (show) card.classList.add('active');
        });
    }));

    /* ---------- Modals ---------- */
    let lastFocus = null;
    const openModal = (m) => {
        lastFocus = document.activeElement;
        m.classList.add('open');
        m.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const close = m.querySelector('[data-close]');
        close && close.focus();
    };
    const closeModal = (m) => {
        m.classList.remove('open');
        m.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lastFocus && lastFocus.focus();
    };
    $$('.modal').forEach(m => {
        m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) closeModal(m); });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') $$('.modal.open').forEach(closeModal);
    });

    // Project case study
    const pm = $('#projectModal');
    const pmBody = $('#pmBody');
    grid && grid.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        const p = projects.find(x => x.id === card.getAttribute('data-id'));
        if (!p) return;
        const links = p.links || {};
        const linkBtns = [
            links.github ? `<a class="btn btn-primary" href="${esc(links.github)}" target="_blank" rel="noopener"><i class="fab fa-github"></i> View Code</a>` : '',
            links.demo ? `<a class="btn btn-outline" href="${esc(links.demo)}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : '',
            links.video ? `<a class="btn btn-outline" href="${esc(links.video)}" target="_blank" rel="noopener"><i class="fas fa-play"></i> Watch Demo</a>` : ''
        ].join('');
        pmBody.innerHTML = `
            <div class="cs-head">
                <span class="event-label">${esc(p.event)}</span>
                <h2 id="pmTitle">${esc(p.title)}</h2>
                <div class="cs-meta">
                    ${p.role ? `<span><i class="fas fa-user"></i>${esc(p.role)}</span>` : ''}
                    ${p.status ? `<span class="status ${statusClass(p.status)}">${esc(p.status)}</span>` : ''}
                </div>
            </div>
            ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" style="border-radius:10px;margin-bottom:1.5rem">` : ''}
            <div class="cs-two">
                <div class="cs-block"><h4>The Problem</h4><p>${esc(p.problem || p.summary)}</p></div>
                <div class="cs-block"><h4>The Solution</h4><p>${esc(p.solution || '')}</p></div>
            </div>
            ${(p.highlights || []).length ? `<div class="cs-block"><h4>What I Did</h4><ul>${p.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul></div>` : ''}
            <div class="cs-block"><h4>Tech Stack</h4><div class="card-tags">${(p.stack || []).map(t => `<span class="tech-tag ${tagClass(t)}">${esc(t)}</span>`).join('')}</div></div>
            ${linkBtns ? `<div class="cs-links">${linkBtns}</div>` : `<p class="cs-note">Code and demo links coming soon.</p>`}
        `;
        openModal(pm);
    });

    // Certificates
    const cm = $('#certModal');
    const certImg = $('#imgCert');
    cg && cg.addEventListener('click', (e) => {
        const item = e.target.closest('[data-img]');
        if (!item) return;
        certImg.src = item.getAttribute('data-img');
        certImg.alt = 'Certificate: ' + item.querySelector('strong').textContent;
        openModal(cm);
    });

    /* ---------- Contact form (Formspree with email fallback) ---------- */
    const form = $('#contact-form');
    const status = $('#formStatus');
    form && form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let ok = true;
        $$('[required]', form).forEach(f => {
            const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
            f.classList.toggle('invalid', bad);
            if (bad) ok = false;
        });
        if (!ok) { status.className = 'form-status err'; status.textContent = 'Please fill in every field with a valid email.'; return; }

        const data = Object.fromEntries(new FormData(form));
        const id = D.formspreeId;
        if (!id || id === 'YOUR_FORM_ID') {
            // Not configured yet: open the visitor's email app instead
            const body = `${data.message}\n\n— ${data.name} (${data.email})`;
            window.location.href = `mailto:${D.email}?subject=${encodeURIComponent('[Portfolio] ' + data.topic)}&body=${encodeURIComponent(body)}`;
            status.className = 'form-status ok';
            status.textContent = 'Opening your email app…';
            return;
        }
        const btn = form.querySelector('button');
        btn.disabled = true;
        status.className = 'form-status'; status.textContent = 'Sending…';
        try {
            const res = await fetch(`https://formspree.io/f/${encodeURIComponent(id)}`, {
                method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form)
            });
            if (!res.ok) throw new Error();
            form.reset();
            status.className = 'form-status ok';
            status.textContent = 'Thanks! Your message was sent — I’ll get back to you soon.';
        } catch {
            status.className = 'form-status err';
            status.textContent = `Couldn't send right now. Please email me at ${D.email}.`;
        } finally {
            btn.disabled = false;
        }
    });

    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();
})();

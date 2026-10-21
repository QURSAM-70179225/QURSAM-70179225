/* =========================================================
   showcase.js — hero name scramble, orbiting tech, hero stats,
   highlights ticker, featured bento, CGPA ring, terminal dock.
   ========================================================= */
(function () {
    const D = (typeof PORTFOLIO !== 'undefined' && PORTFOLIO) || {};
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const projects = D.projects || [];

    /* ---------- Name scramble ---------- */
    const nameEl = $('#heroName');
    const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';
    function scramble(el, text) {
        if (!el || reduceMotion) return;
        let frame = 0;
        const queue = [...text].map((ch, i) => ({ ch, start: Math.floor(Math.random() * 12), end: 12 + i * 2 + Math.floor(Math.random() * 10) }));
        cancelAnimationFrame(el._raf);
        const tick = () => {
            let out = '', doneCount = 0;
            queue.forEach(q => {
                if (frame >= q.end) { out += esc(q.ch); doneCount++; }
                else if (frame >= q.start && q.ch !== ' ') out += `<span class="glyph">${esc(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}</span>`;
                else out += q.ch === ' ' ? ' ' : '<span class="glyph">·</span>';
            });
            el.innerHTML = out;
            frame++;
            if (doneCount < queue.length) el._raf = requestAnimationFrame(tick);
        };
        tick();
    }
    if (nameEl) {
        const txt = nameEl.textContent;
        setTimeout(() => scramble(nameEl, txt), 250);
        nameEl.addEventListener('mouseenter', () => scramble(nameEl, txt));
    }

    /* ---------- Hero stats ---------- */
    const hackCount = projects.filter(p => (p.category || []).includes('hack')).length;
    const heroStats = $('#heroStats');
    if (heroStats) {
        const items = [
            { n: D.cgpa || '3.89', l: 'CGPA' },
            { n: hackCount, l: 'Hackathons' },
            { n: projects.length + '+', l: 'Projects' },
            { n: (D.achievements || []).length, l: 'Honors' }
        ];
        heroStats.innerHTML = items.map(i => `<div class="hs"><b>${esc(i.n)}</b><span>${esc(i.l)}</span></div>`).join('');
    }

    /* ---------- Orbiting tech ---------- */
    const orbit = $('#orbit');
    if (orbit) {
        const tech = D.orbit || ['Python', 'React', 'FastAPI', 'Flutter', 'Gemini'];
        orbit.innerHTML = tech.map((t, i) =>
            `<span class="orb" style="--a:${(360 / tech.length) * i}deg"><span class="orb-in">${esc(t)}</span></span>`).join('');
    }

    /* ---------- Ticker ---------- */
    const track = $('#tickerTrack');
    if (track) {
        const items = (D.ticker || []).map(t => `<span class="tick">${esc(t)}</span>`).join('<span class="tick-sep">✦</span>');
        // duplicated so the loop is seamless
        track.innerHTML = `<div class="tick-group">${items}<span class="tick-sep">✦</span></div><div class="tick-group" aria-hidden="true">${items}<span class="tick-sep">✦</span></div>`;
    }

    /* ---------- Featured bento ---------- */
    const bento = $('#bento');
    if (bento) {
        const featured = projects.filter(p => p.featured);
        bento.innerHTML = featured.map((p, i) => {
            const links = p.links || {};
            return `
            <article class="bento-card b${i} reveal-bottom delay-${i}" data-id="${esc(p.id)}" tabindex="0" role="button" aria-label="Open case study: ${esc(p.title)}">
                <div class="bento-art"><span>${esc(p.art || '✨')}</span></div>
                <div class="bento-body">
                    <div class="bento-meta"><span class="event-label">${esc(p.event)}</span>${p.status ? `<span class="status ${/live/i.test(p.status) ? 'status-live' : /hack/i.test(p.status) ? 'status-hackathon' : 'status-shipped'}">${/live/i.test(p.status) ? '● ' : ''}${esc(p.status)}</span>` : ''}</div>
                    <h3>${esc(p.title)}</h3>
                    <p>${esc(p.tagline || p.summary)}</p>
                    <div class="card-tags">${(p.stack || []).slice(0, 5).map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}</div>
                    <div class="bento-actions">
                        <span class="card-more">Read the case study <i class="fas fa-arrow-right"></i></span>
                        ${links.demo ? `<a class="mini-btn" href="${esc(links.demo)}" target="_blank" rel="noopener">Live demo ↗</a>` : ''}
                        ${links.github ? `<a class="mini-btn ghost" href="${esc(links.github)}" target="_blank" rel="noopener">Code ↗</a>` : ''}
                    </div>
                </div>
            </article>`;
        }).join('');
        const openCase = (card) => {
            const target = document.querySelector(`#projectGrid .project-card[data-id="${card.getAttribute('data-id')}"]`);
            if (target) { target.classList.remove('hide'); target.click(); }
        };
        bento.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            const card = e.target.closest('.bento-card');
            card && openCase(card);
        });
        bento.addEventListener('keydown', (e) => {
            const card = e.target.closest('.bento-card');
            if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openCase(card); }
        });
    }

    /* ---------- CGPA ring ---------- */
    const ring = $('#cgpaRing');
    const cgpaNum = $('#cgpaNum');
    if (ring) {
        const val = parseFloat(D.cgpa || '3.89');
        const C = 2 * Math.PI * 52;
        ring.style.strokeDasharray = C;
        ring.style.strokeDashoffset = C;
        if (cgpaNum) cgpaNum.textContent = val.toFixed(2);
        new IntersectionObserver(([en], obs) => {
            if (!en.isIntersecting) return;
            ring.style.strokeDashoffset = C * (1 - val / 4);
            obs.disconnect();
        }, { threshold: 0.4 }).observe(ring);
    }

    /* ---------- Terminal dock ---------- */
    const dock = $('#termDock');
    const fab = $('#termFab');
    const termInput = $('#termInput');
    let lastFocus = null;
    function openTerm() {
        if (!dock) return;
        lastFocus = document.activeElement;
        dock.classList.add('open');
        dock.setAttribute('aria-hidden', 'false');
        fab && fab.classList.add('hidden');
        setTimeout(() => termInput && termInput.focus({ preventScroll: true }), 150);
    }
    function closeTerm() {
        if (!dock) return;
        dock.classList.remove('open');
        dock.setAttribute('aria-hidden', 'true');
        fab && fab.classList.remove('hidden');
        lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
    }
    $('#openTerminal') && $('#openTerminal').addEventListener('click', openTerm);
    fab && fab.addEventListener('click', openTerm);
    $('#termClose') && $('#termClose').addEventListener('click', closeTerm);
    dock && dock.addEventListener('click', (e) => { if (e.target === dock) closeTerm(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' && !e.target.matches('input, textarea, select')) { e.preventDefault(); dock.classList.contains('open') ? closeTerm() : openTerm(); }
        else if (e.key === 'Escape' && dock && dock.classList.contains('open')) closeTerm();
    });
    // Close the dock when a command navigates somewhere on the page
    window.QBTerm = { open: openTerm, close: closeTerm };
})();

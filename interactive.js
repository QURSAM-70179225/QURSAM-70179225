/* =========================================================
   interactive.js — terminal, neural background, XP game,
   skill → project filtering, cursor effects, easter eggs.
   Content comes from data.js (PORTFOLIO).
   ========================================================= */
(function () {
    const D = (typeof PORTFOLIO !== 'undefined' && PORTFOLIO) || {};
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const projects = D.projects || [];
    const store = {
        get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    };
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#06b6d4';

    /* =====================================================
       TOASTS
       ===================================================== */
    const toastStack = $('#toastStack');
    function toast(title, sub = '', icon = '🏆') {
        if (!toastStack) return;
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<span class="toast-icon">${icon}</span><div><strong>${esc(title)}</strong>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
        toastStack.appendChild(t);
        while (toastStack.children.length > 3) toastStack.firstElementChild.remove();
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3200);
    }

    /* =====================================================
       XP / ACHIEVEMENTS GAME
       ===================================================== */
    const SECTIONS = { work: 'Featured Work', about: 'About', services: 'Services', skills: 'Skills', experience: 'Experience', projects: 'Projects', achievements: 'Awards', contact: 'Contact' };
    const QUESTS = [
        ...Object.entries(SECTIONS).map(([id, name]) => ({ id: 'visit-' + id, name: `Visit ${name}`, xp: 10, icon: '🧭' })),
        { id: 'grand-tour', name: 'Grand Tour — see every section', xp: 30, icon: '🗺️' },
        { id: 'case', name: 'Case Cracker — open a case study', xp: 25, icon: '🔍' },
        { id: 'terminal', name: 'Hacker Mode — run a terminal command', xp: 25, icon: '💻' },
        { id: 'theme', name: 'Day & Night — switch the theme', xp: 15, icon: '🌗' },
        { id: 'skill', name: 'Skill Scout — click a skill', xp: 15, icon: '🎯' },
        { id: 'secret', name: 'Easter Egg Hunter — find a secret', xp: 50, icon: '🥚' }
    ];
    const TOTAL_XP = QUESTS.reduce((a, q) => a + q.xp, 0);
    const XP_PER_LEVEL = 60;
    let done = new Set(store.get('qb-quests', []));

    const xpEl = { level: $('#xpLevel'), fill: $('#xpFill'), num: $('#xpNum'), list: $('#questList'), pill: $('#xpPill'), panel: $('#xpPanel') };
    const currentXP = () => QUESTS.filter(q => done.has(q.id)).reduce((a, q) => a + q.xp, 0);

    function renderXP() {
        const xp = currentXP();
        const lvl = Math.floor(xp / XP_PER_LEVEL) + 1;
        if (xpEl.level) xpEl.level.textContent = xp >= TOTAL_XP ? '★ MAX' : `Lv ${lvl}`;
        if (xpEl.fill) xpEl.fill.style.width = Math.round((xp / TOTAL_XP) * 100) + '%';
        if (xpEl.num) xpEl.num.textContent = `${xp} XP`;
        if (xpEl.list) xpEl.list.innerHTML = QUESTS.map(q =>
            `<li class="${done.has(q.id) ? 'done' : ''}"><span>${done.has(q.id) ? '✅' : q.icon}</span>${esc(q.name)}<em>+${q.xp}</em></li>`).join('');
    }

    function award(id) {
        if (done.has(id)) return;
        const q = QUESTS.find(x => x.id === id);
        if (!q) return;
        const before = Math.floor(currentXP() / XP_PER_LEVEL);
        done.add(id);
        store.set('qb-quests', [...done]);
        renderXP();
        if (xpEl.pill) { xpEl.pill.classList.remove('bump'); void xpEl.pill.offsetWidth; xpEl.pill.classList.add('bump'); }
        // Section visits fill the bar quietly; only the very first one gets a toast
        const visits = [...done].filter(d => d.startsWith('visit-')).length;
        if (!id.startsWith('visit-')) toast('Achievement unlocked!', `${q.name}  +${q.xp} XP`, q.icon);
        else if (visits === 1) toast('Quest started! 🎮', 'Explore sections to fill your XP bar (bottom-left)', '🧭');
        const after = Math.floor(currentXP() / XP_PER_LEVEL);
        if (after > before) setTimeout(() => toast(`Level up! You're now Lv ${after + 1}`, 'Keep exploring…', '⬆️'), 700);
        if (currentXP() >= TOTAL_XP) setTimeout(() => { toast('100% complete!', 'You found everything. Let\'s talk!', '👑'); confetti(); }, 1400);
        // Grand tour check
        if (id.startsWith('visit-') && Object.keys(SECTIONS).every(s => done.has('visit-' + s))) setTimeout(() => award('grand-tour'), 900);
    }

    if (xpEl.pill) {
        xpEl.pill.addEventListener('click', () => {
            const open = xpEl.panel.hidden;
            xpEl.panel.hidden = !open;
            xpEl.pill.setAttribute('aria-expanded', String(open));
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#xpWidget') && xpEl.panel) { xpEl.panel.hidden = true; xpEl.pill.setAttribute('aria-expanded', 'false'); }
        });
    }
    const resetBtn = $('#xpReset');
    resetBtn && resetBtn.addEventListener('click', () => { done = new Set(); store.set('qb-quests', []); renderXP(); toast('Progress reset', 'Start the hunt again!', '🔄'); });
    renderXP();

    // Section visits
    const secObs = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting && SECTIONS[en.target.id]) award('visit-' + en.target.id); });
    }, { threshold: 0.35 });
    Object.keys(SECTIONS).forEach(id => { const s = document.getElementById(id); s && secObs.observe(s); });

    // Case studies, theme
    const grid = $('#projectGrid');
    grid && grid.addEventListener('click', (e) => { if (e.target.closest('.project-card')) award('case'); });
    const themeBtn = $('#themeToggle');
    themeBtn && themeBtn.addEventListener('click', () => { award('theme'); restartNeural(); });

    /* =====================================================
       SKILL → PROJECT FILTERING
       ===================================================== */
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9+#]/g, '');
    const ALIASES = { geminigemma: ['gemini', 'gemma'], openaiapi: ['openai'], openweightllmsollamagroq: ['ollama', 'groq', 'qwen'],
        nodeexpress: ['node'], htmlcss: ['html', 'css'], llmorchestration: ['llm', 'ai api', 'gemini', 'openai', 'groq', 'qwen'],
        promptengineering: ['prompt'], microcontrollers: ['microcontroller'], sensorsystems: ['sensor'], oop: ['oop'],
        algorithms: ['algorithm'], asyncmicroservices: ['fastapi'], restapis: ['fastapi', 'node'], dart: ['dart', 'flutter'],
        javascript: ['javascript', 'react', 'node'], roboticslogic: ['embedded', 'microcontroller'], huggingface: ['hugging face'] };
    function projectsForSkill(skill) {
        const key = norm(skill);
        const needles = (ALIASES[key] || [skill.toLowerCase()]).map(n => n.toLowerCase());
        return projects.filter(p => (p.stack || []).some(t => {
            const tl = t.toLowerCase();
            return needles.some(n => tl.includes(n) || (n.length > 2 && n.includes(tl)));
        }));
    }

    const note = $('#skillFilterNote');
    function filterBySkill(skill) {
        const matches = projectsForSkill(skill);
        const ids = new Set(matches.map(p => p.id));
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        $$('#projectGrid .project-card').forEach(c => {
            const show = ids.has(c.getAttribute('data-id'));
            c.classList.toggle('hide', !show);
            if (show) c.classList.add('active', 'spotlight');
            setTimeout(() => c.classList.remove('spotlight'), 1600);
        });
        if (note) {
            note.hidden = false;
            note.innerHTML = `Showing <b>${matches.length}</b> project${matches.length === 1 ? '' : 's'} built with <b>${esc(skill)}</b> <button id="clearSkill" aria-label="Clear skill filter">✕ Show all</button>`;
            $('#clearSkill').addEventListener('click', clearSkillFilter);
        }
        award('skill');
        const target = document.getElementById('projects');
        target && target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    function clearSkillFilter() {
        if (note) note.hidden = true;
        const all = $('.filter-btn[data-filter="all"]');
        all && all.click();
    }
    $$('.filter-btn').forEach(b => b.addEventListener('click', () => { if (note) note.hidden = true; }));

    $$('.skill-pills span').forEach(pill => {
        const skill = pill.textContent.trim();
        const n = projectsForSkill(skill).length;
        if (!n) return;
        pill.classList.add('has-proj');
        pill.setAttribute('role', 'button');
        pill.setAttribute('tabindex', '0');
        pill.setAttribute('title', `${n} project${n > 1 ? 's' : ''} — click to view`);
        pill.insertAdjacentHTML('beforeend', `<sup>${n}</sup>`);
        const go = () => filterBySkill(skill);
        pill.addEventListener('click', go);
        pill.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });

    /* =====================================================
       TERMINAL
       ===================================================== */
    const out = $('#termOut');
    const input = $('#termInput');
    const form = $('#termForm');
    const body = $('#termBody');
    const history = [];
    let hIdx = -1;

    const line = (html, cls = '') => {
        if (!out) return;
        const div = document.createElement('div');
        div.className = 'tl ' + cls;
        div.innerHTML = html;
        out.appendChild(div);
        body.scrollTop = body.scrollHeight;
    };
    const closeDock = () => window.QBTerm && window.QBTerm.close();
    const go = (id) => { const el = document.getElementById(id); if (!el) return; setTimeout(closeDock, 350); el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); };
    const link = (cmd, label) => `<a href="#" class="tcmd" data-cmd="${esc(cmd)}">${esc(label || cmd)}</a>`;

    const COMMANDS = {
        help: { desc: 'list all commands', run() {
            line('<span class="tc">Available commands:</span>');
            Object.entries(COMMANDS).filter(([, c]) => !c.hidden).forEach(([k, c]) =>
                line(`  ${link(k)}<span class="tdim"> — ${esc(c.desc)}</span>`));
            line('<span class="tdim">Tip: ↑/↓ for history, Tab to autocomplete. Some commands are secret 🤫</span>');
        }},
        whoami: { desc: 'who is Qursam?', run() {
            line('<span class="ts">Qursam Bibi</span> — AI Developer & Full-Stack Engineer');
            line('BS Information Engineering Technology @ University of Lahore · <span class="ts">CGPA 3.89</span> · Honhaar scholar');
            line(`Based in Lahore 🇵🇰 · open to internships, hackathons, scholarships & freelance`);
        }},
        projects: { desc: 'list my projects', run() {
            projects.forEach(p => line(`  ${link('open ' + p.id, p.id.padEnd(12, ' '))} <span class="tdim">${esc(p.title)}</span>${p.status === 'In Progress' ? ' <span class="tw">[wip]</span>' : ''}`));
            line('<span class="tdim">Run </span><span class="tc">open &lt;name&gt;</span><span class="tdim"> to read a case study.</span>');
        }},
        open: { desc: 'open a project case study (e.g. open safepath)', run(arg) {
            if (!arg) return line('usage: open &lt;project&gt; — try ' + link('projects'), 'terr');
            const q = arg.toLowerCase();
            const p = projects.find(x => x.id === q) || projects.find(x => x.title.toLowerCase().includes(q));
            if (!p) return line(`project not found: ${esc(arg)} — run ${link('projects')}`, 'terr');
            line(`Opening <span class="ts">${esc(p.title)}</span>…`);
            const card = $(`.project-card[data-id="${p.id}"]`);
            if (card) { card.classList.remove('hide'); setTimeout(() => { closeDock(); card.click(); }, 300); }
        }},
        skills: { desc: 'show my tech stack', run() {
            const groups = { 'Languages': 'Python · TypeScript · JavaScript · Dart · SQL · C++',
                'AI & ML': 'Gemini API · Gemma 4 · OpenAI · Ollama · Groq · prompt engineering',
                'Frontend': 'React · Flutter · Streamlit · Tailwind · Vite',
                'Backend': 'FastAPI · Pydantic · Node · WebSockets · MySQL · MongoDB',
                'Tools': 'Git · VS Code · PowerShell · VMware (Linux)' };
            Object.entries(groups).forEach(([g, s]) => line(`<span class="tc">${g.padEnd(11, ' ')}</span> ${esc(s)}`));
            line(`<span class="tdim">Jump to the</span> ${link('goto skills', 'skills section')}`);
        }},
        awards: { desc: 'scholarships, fellowships & wins', run() {
            (D.achievements || []).forEach(a => line(`🏅 <span class="ts">${esc(a.title)}</span> <span class="tdim">— ${esc(a.org)}</span>`));
        }},
        experience: { desc: 'where I have worked', run() {
            (D.experience || []).forEach(e => line(`<span class="tc">${esc(e.date.padEnd(20, ' '))}</span> ${esc(e.title)} <span class="tdim">@ ${esc(e.org)}</span>`));
        }},
        hire: { desc: 'let\'s work together', run() {
            line('<span class="ts">Great choice! 🎉</span> Taking you to the contact form…');
            line(`Or email directly: <a href="mailto:${esc(D.email)}">${esc(D.email)}</a>`);
            setTimeout(() => go('contact'), 500);
        }},
        resume: { desc: 'download my resume', run() {
            line('Downloading resume… 📄');
            const a = document.createElement('a'); a.href = D.resume || 'resume.pdf'; a.download = ''; document.body.appendChild(a); a.click(); a.remove();
        }},
        contact: { desc: 'how to reach me', run() {
            line(`📧 <a href="mailto:${esc(D.email)}">${esc(D.email)}</a>`);
            line('💼 <a href="https://www.linkedin.com/in/qursam-bibi-b3309b320/" target="_blank" rel="noopener">linkedin.com/in/qursam-bibi</a>');
            line('🐙 <a href="https://github.com/QURSAM-70179225" target="_blank" rel="noopener">github.com/QURSAM-70179225</a>');
        }},
        goto: { desc: 'scroll to a section (about, skills, projects…)', run(arg) {
            const id = (arg || '').toLowerCase().replace('awards', 'achievements');
            if (!document.getElementById(id)) return line(`unknown section. try: ${Object.keys(SECTIONS).map(s => link('goto ' + s, s)).join(' ')}`, 'terr');
            line(`cd ~/${esc(id)}`); go(id);
        }},
        theme: { desc: 'switch theme (theme light | theme dark)', run(arg) {
            const cur = document.documentElement.getAttribute('data-theme');
            const want = arg === 'light' || arg === 'dark' ? arg : (cur === 'light' ? 'dark' : 'light');
            if (want !== cur) themeBtn && themeBtn.click();
            line(`theme set to <span class="ts">${want}</span> ${want === 'light' ? '☀️' : '🌙'}`);
        }},
        xp: { desc: 'check your explorer progress', run() {
            line(`You have <span class="ts">${currentXP()} / ${TOTAL_XP} XP</span>`);
            QUESTS.forEach(q => line(`  ${done.has(q.id) ? '✅' : '⬜'} ${esc(q.name)}`));
        }},
        surprise: { desc: 'feeling lucky?', run() {
            const opts = ['joke', 'fact', 'confetti', 'matrix', 'open ' + (projects[Math.floor(Math.random() * projects.length)] || {}).id];
            const pick = opts[Math.floor(Math.random() * opts.length)];
            line(`<span class="tdim">🎲 rolled:</span> ${esc(pick)}`);
            run(pick, true);
        }},
        joke: { desc: 'an engineer joke', run() {
            const jokes = [
                'Why do programmers prefer dark mode? Because light attracts bugs. 🐛',
                'I told my microcontroller a joke. It didn\'t get it — no sense of humour, only sensors.',
                'There are 10 kinds of people: those who understand binary and those who don\'t.',
                'My LLM and I have a lot in common: we both answer confidently before checking the docs.',
                'Why did the hackathon team bring a ladder? To reach the next level of their stack.'
            ];
            line(jokes[Math.floor(Math.random() * jokes.length)]);
        }},
        fact: { desc: 'a random fact about me', run() {
            const facts = [
                'I built a full disaster-response platform solo for the Alibaba Cloud AI Hackathon. ⚡',
                'I\'m on the TEDx operations team at my university. 🎤',
                'I won 1st place in the Omecta Quiz Competition. 🥇',
                'I\'ve built with Gemini, Gemma, OpenAI and local Ollama models. 🤖',
                'My AI web app DreamVerse is live at dreamverseai.netlify.app. 🌌'
            ];
            line(facts[Math.floor(Math.random() * facts.length)]);
        }},
        clear: { desc: 'clear the screen', run() { out.innerHTML = ''; } },
        // ---- secret commands ----
        sudo: { hidden: true, run(arg) {
            if ((arg || '').startsWith('hire')) { line('<span class="ts">[sudo] access granted.</span> Qursam has been added to your team. 😎'); confetti(); award('secret'); }
            else line('Nice try 😏 — but you could try <span class="tc">sudo hire qursam</span>', 'terr');
        }},
        matrix: { hidden: true, run() { line('Wake up, Neo… 🐇'); matrixRain(); award('secret'); } },
        confetti: { hidden: true, run() { line('🎉🎉🎉'); confetti(); award('secret'); } },
        coffee: { hidden: true, run() { line('☕ Brewing… done. Productivity +200%.'); award('secret'); } },
        ls: { hidden: true, run() { line(Object.keys(SECTIONS).map(s => link('goto ' + s, s + '/')).join('  ') + '  resume.pdf  secrets.txt'); } },
        cat: { hidden: true, run(arg) {
            if (arg === 'secrets.txt') { line('🤫 Secret commands: <span class="tc">matrix</span>, <span class="tc">sudo hire qursam</span>, <span class="tc">coffee</span>, <span class="tc">confetti</span>. Also try the Konami code ↑↑↓↓←→←→BA'); award('secret'); }
            else line(`cat: ${esc(arg || '')}: No such file`, 'terr');
        }},
        echo: { hidden: true, run(arg) { line(esc(arg || '')); } },
        date: { hidden: true, run() { line(new Date().toString()); } },
        exit: { hidden: true, run() { line('There is no escape from a good portfolio. 😄'); } }
    };
    COMMANDS.cd = { hidden: true, run: (a) => COMMANDS.goto.run(a) };
    COMMANDS.about = { hidden: true, run: () => COMMANDS.whoami.run() };

    function run(raw, silent) {
        const cmdline = raw.trim();
        if (!cmdline) return;
        if (!silent) { line(`<span class="prompt">➜ <b>~</b></span> ${esc(cmdline)}`, 'tin'); history.unshift(cmdline); hIdx = -1; }
        const [name, ...rest] = cmdline.split(/\s+/);
        const c = COMMANDS[name.toLowerCase()];
        if (!c) return line(`command not found: ${esc(name)} — type ${link('help')}`, 'terr');
        c.run(rest.join(' '));
        award('terminal');
    }

    if (form && input) {
        form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') { e.preventDefault(); if (hIdx < history.length - 1) input.value = history[++hIdx]; }
            else if (e.key === 'ArrowDown') { e.preventDefault(); if (hIdx > 0) input.value = history[--hIdx]; else { hIdx = -1; input.value = ''; } }
            else if (e.key === 'Tab') {
                e.preventDefault();
                const v = input.value.toLowerCase();
                const parts = v.split(' ');
                if (parts.length === 1) {
                    const m = Object.keys(COMMANDS).filter(k => !COMMANDS[k].hidden && k.startsWith(v));
                    if (m.length === 1) input.value = m[0] + ' ';
                    else if (m.length > 1) line(m.join('  '), 'tdim');
                } else if (parts[0] === 'open') {
                    const m = projects.map(p => p.id).filter(id => id.startsWith(parts[1]));
                    if (m.length === 1) input.value = 'open ' + m[0];
                    else if (m.length > 1) line(m.join('  '), 'tdim');
                } else if (parts[0] === 'goto') {
                    const m = Object.keys(SECTIONS).filter(id => id.startsWith(parts[1]));
                    if (m.length === 1) input.value = 'goto ' + m[0];
                }
            }
        });
        $('#terminal').addEventListener('click', (e) => {
            const cmd = e.target.closest('[data-cmd]');
            if (cmd) { e.preventDefault(); run(cmd.getAttribute('data-cmd')); return; }
            if (!e.target.closest('a') && finePointer) input.focus({ preventScroll: true });
        });

        // Boot sequence
        const boot = [
            '<span class="tdim">Booting qursam-os v2.0…</span>',
            '<span class="ts">✔</span> loading projects <span class="tdim">(' + projects.length + ' found)</span>',
            '<span class="ts">✔</span> connecting creativity module',
            'Welcome! Type <span class="tc">help</span> or tap a command below 👇'
        ];
        if (reduceMotion) boot.forEach(b => line(b));
        else boot.forEach((b, i) => setTimeout(() => line(b), 350 + i * 380));
    }

    /* =====================================================
       NEURAL-NETWORK BACKGROUND
       ===================================================== */
    const canvas = $('#neuralBg');
    let neuralRAF = null, restartNeural = () => {};
    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext('2d');
        const hero = $('.hero');
        let nodes = [], W = 0, H = 0, mouse = { x: -999, y: -999 }, visible = true, color = accent();
        const hexToRgb = (h) => { const m = h.replace('#', '').match(/.{2}/g); return m ? m.map(x => parseInt(x, 16)).join(',') : '6,182,212'; };
        let rgb = hexToRgb(color);
        function size() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = hero.clientWidth; H = hero.clientHeight;
            canvas.width = W * dpr; canvas.height = H * dpr;
            canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(90, Math.floor((W * H) / 16000));
            nodes = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.8 + 0.8 }));
        }
        function frame() {
            ctx.clearRect(0, 0, W, H);
            const maxD = 130;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                a.x += a.vx; a.y += a.vy;
                if (a.x < 0 || a.x > W) a.vx *= -1;
                if (a.y < 0 || a.y > H) a.vy *= -1;
                // gentle pull toward the cursor
                const dxm = mouse.x - a.x, dym = mouse.y - a.y, dm = Math.hypot(dxm, dym);
                if (dm < 180) { a.x += dxm * 0.004; a.y += dym * 0.004; }
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < maxD) {
                        ctx.strokeStyle = `rgba(${rgb},${(1 - d / maxD) * 0.35})`;
                        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                    }
                }
                if (dm < 180) {
                    ctx.strokeStyle = `rgba(${rgb},${(1 - dm / 180) * 0.7})`;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
                ctx.fillStyle = `rgba(${rgb},0.8)`;
                ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
            }
            neuralRAF = visible ? requestAnimationFrame(frame) : null;
        }
        hero.addEventListener('mousemove', (e) => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
        hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
        hero.addEventListener('click', (e) => {
            if (e.target.closest('a, button, input, #terminal')) return;
            const r = hero.getBoundingClientRect();
            for (let k = 0; k < 6; k++) nodes.push({ x: e.clientX - r.left, y: e.clientY - r.top, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, r: 2 });
            if (nodes.length > 140) nodes.splice(0, nodes.length - 140);
        });
        new IntersectionObserver(([en]) => {
            visible = en.isIntersecting;
            if (visible && !neuralRAF) neuralRAF = requestAnimationFrame(frame);
        }).observe(hero);
        let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 200); });
        restartNeural = () => setTimeout(() => { color = accent(); rgb = hexToRgb(color); }, 50);
        size(); frame();
    }

    /* =====================================================
       CURSOR GLOW, MAGNETIC BUTTONS, CARD TILT
       ===================================================== */
    if (finePointer && !reduceMotion) {
        const glow = $('#cursorGlow');
        if (glow) {
            window.addEventListener('mousemove', (e) => { glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`; glow.style.opacity = '1'; }, { passive: true });
            document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
        }
        $$('.btn, .icon-btn, .back-top').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.25, y = (e.clientY - r.top - r.height / 2) * 0.35;
                btn.style.transform = `translate(${x}px, ${y}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
        $$('.project-card, .achieve-card, .service-card, .bento-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
                card.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 8}deg) rotateX(${(0.5 - py) * 8}deg) translateY(-6px)`;
                card.style.setProperty('--mx', px * 100 + '%');
                card.style.setProperty('--my', py * 100 + '%');
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    /* =====================================================
       EASTER EGGS: confetti, matrix, Konami, logo clicks
       ===================================================== */
    function confetti() {
        if (reduceMotion) return;
        const c = document.createElement('canvas');
        c.className = 'fx-canvas';
        document.body.appendChild(c);
        const x = c.getContext('2d');
        c.width = innerWidth; c.height = innerHeight;
        const colors = ['#06b6d4', '#a78bfa', '#4ade80', '#facc15', '#f87171', '#60a5fa'];
        const ps = Array.from({ length: 160 }, () => ({ x: innerWidth / 2, y: innerHeight / 2.5, vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4, s: Math.random() * 7 + 4, c: colors[Math.floor(Math.random() * colors.length)], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3 }));
        let t = 0;
        (function f() {
            x.clearRect(0, 0, c.width, c.height);
            ps.forEach(p => { p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
                x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
            if (++t < 170) requestAnimationFrame(f); else c.remove();
        })();
    }

    function matrixRain() {
        if (reduceMotion) return;
        const c = document.createElement('canvas');
        c.className = 'fx-canvas matrix';
        document.body.appendChild(c);
        const x = c.getContext('2d');
        c.width = innerWidth; c.height = innerHeight;
        const chars = 'アイウエオカキクケコ01QURSAMAI<>{}=+';
        const fs = 16, cols = Math.floor(c.width / fs), drops = Array(cols).fill(1);
        let t = 0;
        (function f() {
            x.fillStyle = 'rgba(0,0,0,0.08)'; x.fillRect(0, 0, c.width, c.height);
            x.fillStyle = '#22d3ee'; x.font = fs + 'px monospace';
            drops.forEach((y, i) => {
                x.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs);
                if (y * fs > c.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
            if (++t < 260) requestAnimationFrame(f);
            else { c.style.opacity = '0'; setTimeout(() => c.remove(), 600); }
        })();
    }

    // Konami code
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let kPos = 0;
    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea')) return;
        kPos = (e.key === KONAMI[kPos] || e.key.toLowerCase() === KONAMI[kPos]) ? kPos + 1 : (e.key === KONAMI[0] ? 1 : 0);
        if (kPos === KONAMI.length) { kPos = 0; toast('Konami code!', 'Old-school gamer detected 🕹️', '🕹️'); confetti(); award('secret'); }
    });

    // Click the logo 5 times
    let logoClicks = 0, logoTimer;
    const logo = $('.logo');
    logo && logo.addEventListener('click', () => {
        logoClicks++; clearTimeout(logoTimer);
        logoTimer = setTimeout(() => { logoClicks = 0; }, 1500);
        if (logoClicks === 5) { logoClicks = 0; logo.classList.add('spin'); setTimeout(() => logo.classList.remove('spin'), 900); toast('You found the logo secret!', 'Try typing "cat secrets.txt" in the terminal', '🥚'); award('secret'); }
    });

    // Friendly message for devs who open the console
    console.log('%c👋 Hey developer!', 'font-size:18px;font-weight:bold;color:#06b6d4');
    console.log('%cLike what you see? Type "sudo hire qursam" in the site terminal — or email ' + (D.email || ''), 'color:#94a3b8');

    // Expose for other scripts if needed
    window.QB = { award, toast, confetti, run };
})();

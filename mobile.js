/* =========================================================
   mobile.js — touch-first behaviour for phones & tablets
   (Android, iPhone, iPad). Safe to load on desktop too.
   ========================================================= */
(function () {
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
    const touch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const buzz = (ms = 12) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

    if (touch) document.documentElement.classList.add('is-touch');

    /* ---------- Full-screen menu: lock scroll, close on Escape ---------- */
    const navLinks = $('#navLinks');
    const menuToggle = $('#menuToggle');
    const header = $('#siteHeader');
    const syncMenu = () => {
        const open = navLinks && navLinks.classList.contains('active');
        document.body.classList.toggle('menu-open', !!open);
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', String(!!open));
            menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }
        if (header) header.style.backdropFilter = header.style.webkitBackdropFilter = open ? 'none' : '';
    };
    if (navLinks) new MutationObserver(syncMenu).observe(navLinks, { attributes: true, attributeFilter: ['class'] });
    menuToggle && menuToggle.addEventListener('click', () => buzz(8));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) menuToggle && menuToggle.click();
    });
    // Close menu if the screen grows to desktop size (e.g. tablet rotated)
    window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => {
        if (m.matches && navLinks && navLinks.classList.contains('active')) menuToggle && menuToggle.click();
    });

    /* ---------- Featured carousel: dots + swipe hint ---------- */
    const bento = $('#bento');
    if (bento) {
        const cards = $$('.bento-card', bento);
        const dots = document.createElement('div');
        dots.className = 'bento-dots';
        dots.setAttribute('role', 'tablist');
        dots.innerHTML = cards.map((c, i) => `<button role="tab" aria-label="Show project ${i + 1}" data-i="${i}"></button>`).join('');
        bento.after(dots);
        const hint = document.createElement('p');
        hint.className = 'swipe-hint';
        hint.textContent = '← swipe to see more →';
        dots.after(hint);
        const setActive = () => {
            const mid = bento.scrollLeft + bento.clientWidth / 2;
            let best = 0, bestD = Infinity;
            cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
            $$('button', dots).forEach((b, i) => b.classList.toggle('on', i === best));
            if (bento.scrollLeft > 30) hint.style.opacity = '0';
        };
        let t; bento.addEventListener('scroll', () => { cancelAnimationFrame(t); t = requestAnimationFrame(setActive); }, { passive: true });
        dots.addEventListener('click', (e) => {
            const b = e.target.closest('button'); if (!b) return;
            const c = cards[+b.dataset.i];
            bento.scrollTo({ left: c.offsetLeft - (bento.clientWidth - c.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        let lastActive = -1;
        bento.addEventListener('scroll', () => {
            const on = $$('button', dots).findIndex(b => b.classList.contains('on'));
            if (on !== lastActive && lastActive !== -1) buzz(6);
            lastActive = on;
        }, { passive: true });
        setActive();
        // a tiny "peek" nudge the first time the carousel scrolls into view on phones
        if (touch && !reduceMotion) {
            new IntersectionObserver(([en], obs) => {
                if (!en.isIntersecting || window.innerWidth > 700) return;
                obs.disconnect();
                setTimeout(() => { bento.scrollBy({ left: 60, behavior: 'smooth' }); setTimeout(() => bento.scrollBy({ left: -60, behavior: 'smooth' }), 450); }, 400);
            }, { threshold: 0.6 }).observe(bento);
        }
    }

    /* ---------- Swipe down to close sheets (case study, certificate, terminal) ---------- */
    function swipeToClose(handle, panel, onClose, canStart = () => true) {
        if (!handle || !panel) return;
        let y0 = null, dy = 0;
        handle.addEventListener('touchstart', (e) => {
            if (window.innerWidth > 700 || !canStart(e)) return;
            y0 = e.touches[0].clientY; dy = 0; panel.style.transition = 'none';
        }, { passive: true });
        handle.addEventListener('touchmove', (e) => {
            if (y0 === null) return;
            dy = Math.max(0, e.touches[0].clientY - y0);
            panel.style.transform = `translateY(${dy}px)`;
        }, { passive: true });
        handle.addEventListener('touchend', () => {
            if (y0 === null) return;
            panel.style.transition = 'transform 0.25s ease';
            if (dy > 90) { panel.style.transform = 'translateY(100%)'; buzz(10); setTimeout(() => { onClose(); panel.style.transform = ''; panel.style.transition = ''; }, 220); }
            else { panel.style.transform = ''; setTimeout(() => { panel.style.transition = ''; }, 260); }
            y0 = null;
        });
    }
    $$('.modal').forEach(m => {
        const panel = $('.modal-panel', m);
        // only start the swipe when the sheet is scrolled to the top
        swipeToClose(panel, panel, () => { const c = $('[data-close]', m); c && c.click(); }, () => panel.scrollTop <= 0);
    });
    const termPanel = $('#terminal');
    swipeToClose($('.term-bar', termPanel || document), termPanel, () => window.QBTerm && window.QBTerm.close());

    /* ---------- Keyboard-aware terminal (keeps input above the keyboard) ---------- */
    const dock = $('#termDock');
    if (window.visualViewport && dock) {
        const vv = window.visualViewport;
        const fit = () => {
            const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
            dock.style.setProperty('--kb', kb > 80 ? kb + 'px' : '0px');
            dock.classList.toggle('kb-open', kb > 80);
            if (kb > 80) { const body = $('#termBody'); body && (body.scrollTop = body.scrollHeight); }
        };
        vv.addEventListener('resize', fit);
        vv.addEventListener('scroll', fit);
    }

    /* ---------- Tap the orbit to give it a spin boost ---------- */
    const stage = $('#orbitStage');
    if (stage) {
        stage.addEventListener('click', () => {
            stage.classList.add('boost'); buzz(15);
            clearTimeout(stage._b); stage._b = setTimeout(() => stage.classList.remove('boost'), 1800);
            window.QB && window.QB.toast && !stage._told && (stage._told = true, window.QB.toast('Wheee! 🌀', 'You found the spin boost', '🌀'));
        });
    }

    /* ---------- Tilt your phone: the hero reacts (Android; iPhone asks once) ---------- */
    const visual = $('.hero-visual');
    const blobs = $$('.blob');
    let tiltOn = false;
    function onTilt(e) {
        if (e.gamma == null) return;
        const x = Math.max(-20, Math.min(20, e.gamma)) / 20;          // left/right
        const y = Math.max(-20, Math.min(20, (e.beta || 45) - 45)) / 20; // forward/back
        if (visual) visual.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0)`;
        blobs.forEach((b, i) => { b.style.translate = `${x * (i ? -30 : 30)}px ${y * 20}px`; });
    }
    function enableTilt() {
        if (tiltOn || reduceMotion) return;
        tiltOn = true;
        window.addEventListener('deviceorientation', onTilt, { passive: true });
    }
    if (touch && 'DeviceOrientationEvent' in window) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS: only ask after the visitor taps the orbit (a clear, playful gesture)
            stage && stage.addEventListener('click', () => {
                if (tiltOn) return;
                DeviceOrientationEvent.requestPermission().then(r => { if (r === 'granted') enableTilt(); }).catch(() => {});
            }, { once: true });
        } else {
            enableTilt();
        }
    }

    /* ---------- Tap the name to re-scramble it (hover does this on desktop) ---------- */
    const name = $('#heroName');
    name && name.addEventListener('click', () => { name.dispatchEvent(new Event('mouseenter')); buzz(10); });

    /* ---------- Light haptic tick on key buttons (Android) ---------- */
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn, .filter-btn, .term-chips button, .skill-pills .has-proj, .bento-dots button, .term-fab, .hire-btn')) buzz(8);
    });

    /* ---------- Pause heavy animations when the tab is hidden (saves battery) ---------- */
    document.addEventListener('visibilitychange', () => {
        document.documentElement.classList.toggle('tab-hidden', document.hidden);
    });
})();

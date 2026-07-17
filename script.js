document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Responsive Navbar Toggle Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });

    // --- 2. Advanced Staggered Scroll Reveals ---
    const reveals = document.querySelectorAll('.reveal-top, .reveal-bottom, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.10,
        rootMargin: "0px 0px -30px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(revealItem => {
        revealObserver.observe(revealItem);
    });

    // --- 3. Hero Section Cursor Mask Effect ---
    const heroContent = document.getElementById('heroMask');
    const hero = document.querySelector('.hero');

    if(hero && heroContent) {
        hero.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
            heroContent.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        hero.addEventListener('mouseleave', () => {
            heroContent.style.transition = 'transform 0.5s ease';
            heroContent.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });

        hero.addEventListener('mouseenter', () => {
            heroContent.style.transition = 'none';
        });
    }

    // --- 4. Dynamic Project Card Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#projectGrid .project-card');

    if(filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach((card, index) => {
                    card.style.transition = `opacity 0.3s ease, transform 0.3s ease`;
                    const shouldShow = filterValue === 'all' || card.classList.contains(`filt-${filterValue}`);
                    
                    if (shouldShow) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50 * (index % 3));
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8) translateY(20px)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // --- 5. 3D Project Card Hover Effect ---
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { offsetWidth: width, offsetHeight: height } = card;
            const { offsetX: x, offsetY: y } = e;
            const xAxis = (width / 2 - x) / 10;
            const yAxis = (height / 2 - y) / 10;
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0px)';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease';
        });
    });
});

// --- Global Scope Functions (Modal Handling) ---
const modal = document.getElementById('certModal');
const modalImg = document.getElementById('imgCert');

function openCert(certImageName) {
    if(!modal || !modalImg) return;
    modal.style.display = "block";
    modalImg.src = certImageName;
    modalImg.alt = "Certificate Viewer: " + certImageName;
    document.body.style.overflow = 'hidden';
}

function closeCert() {
    if(!modal) return;
    modal.style.display = "none";
    modalImg.src = "";
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeCert();
    }
}

document.addEventListener('keydown', (e) => {
    if(e.key === "Escape" && modal && modal.style.display === "block") {
        closeCert();
    }
});
// project.js — Immersive Project Page Scripts

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // NAV — Becomes opaque on scroll
    // =========================================
    const projectNav = document.getElementById('project-nav');
    if (projectNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                projectNav.classList.add('is-scrolled');
            } else {
                projectNav.classList.remove('is-scrolled');
            }
        }, { passive: true });
    }

    // =========================================
    // PARALLAX — Hero Image
    // =========================================
    const pfhBgImg = document.getElementById('pfh-img');
    if (pfhBgImg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight;
            if (scrollY < heroHeight) {
                // Image moves at 50% of scroll speed = parallax depth
                const offset = scrollY * 0.45;
                pfhBgImg.style.transform = `translateY(${offset}px)`;
            }
        }, { passive: true });
    }

    // =========================================
    // COUNT-UP — Animated Stats
    // =========================================
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    if (statValues.length > 0) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    const suffix = el.dataset.suffix || '';
                    let current = 0;
                    const duration = 1200; // ms
                    const steps = 40;
                    const increment = target / steps;
                    const stepTime = duration / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.round(current) + suffix;
                    }, stepTime);

                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(el => countObserver.observe(el));
    }

    // =========================================
    // DATA-REVEAL — Re-use same system as main
    // =========================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    revealElements.forEach(el => revealObserver.observe(el));

});

// project.js — Immersive Project Page Scripts (Lucas Le Calvez)

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================
    // 1. NAV — Becomes opaque on scroll
    // =========================================
    const projectNav = document.getElementById('project-nav');
    if (projectNav) {
        const handleNavScroll = () => {
            if (window.scrollY > 40) {
                projectNav.classList.add('is-scrolled');
            } else {
                projectNav.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        handleNavScroll();
    }

    // =========================================
    // 2. PARALLAX — Hero Media
    // =========================================
    const pfhBgMedia = document.getElementById('pfh-img');
    if (pfhBgMedia && !prefersReducedMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroHeight = window.innerHeight;
                    if (scrollY < heroHeight) {
                        const offset = scrollY * 0.35;
                        pfhBgMedia.style.transform = `translate3d(0, ${offset}px, 0)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // =========================================
    // 3. COUNT-UP — Animated Stats with Smooth Easing
    // =========================================
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    if (statValues.length > 0) {
        if ('IntersectionObserver' in window && !prefersReducedMotion) {
            const countObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseFloat(el.dataset.count);
                        const suffix = el.dataset.suffix || '';
                        const duration = 1400; // ms
                        const startTime = performance.now();

                        const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

                        const updateCounter = (currentTime) => {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const easedProgress = easeOutQuart(progress);
                            const currentVal = Math.round(easedProgress * target);

                            el.textContent = currentVal + suffix;

                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                el.textContent = target + suffix;
                            }
                        };

                        requestAnimationFrame(updateCounter);
                        countObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.3 });

            statValues.forEach(el => countObserver.observe(el));
        } else {
            // Fallback: display targets directly
            statValues.forEach(el => {
                el.textContent = (el.dataset.count || '') + (el.dataset.suffix || '');
            });
        }
    }

    // =========================================
    // 4. DATA-REVEAL — Scroll Observer
    // =========================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

});

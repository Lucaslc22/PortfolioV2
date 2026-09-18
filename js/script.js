// script.js — Portfolio Lucas Le Calvez
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Data System for Projects (EXACT Titles, Slugs, Categories & Awards Preserved)
    const PROJECTS = [
        { title: "Paysage naturel", slug: "paysage-cotier", cat: ["3d"], img: "img/0116.png", award: "Meilleure Animation — À l'West Fest (IUT Lannion)" },
        { title: "Ocean Arctique", slug: "ocean-arctique", cat: ["3d"], img: "img/glacierVFV2.png" },
        { title: "Intérieur abandonne", slug: "interieur-abandonne", cat: ["3d"], img: "img/int-VF.png" },
        { title: "Ile tropicale", slug: "ile-flottante", cat: ["3d"], img: "img/îleVF.png" },
        { title: "Court Metrage", slug: "court-metrage", cat: ["montage"], img: "img/Court-metrage.png" },
        { title: "Affiche À l'West Fest", slug: "a-l-west-fest", cat: ["affiche"], img: "img/affiche-ALWestFest.png" },
        { title: "Interview Lannion Coeur de Ville", slug: "interview-coeur-de-ville", cat: ["montage"], img: "img/miniature-ITW.png" },
        { title: "Iphone", slug: "concept-iphone", cat: ["3d"], img: "img/Iphone.png" },
        { title: "Interview deMMaIn", slug: "demmain", cat: ["montage"], img: "img/miniature-deMMaIn.png" },
        { title: "Diorama", slug: "diorama", cat: ["3d"], img: "img/Miniature-Diorama.png" },
        { title: "UrbanBall", slug: "urbanball", cat: ["3d", "article"], img: "img/Miniature-UrbanBall.png" }
    ];

    const grid = document.getElementById('projects-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Render Grid with smooth staggered fade
    function renderGrid(filter = 'all') {
        if (!grid) return;
        
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(8px)';
        
        setTimeout(() => {
            grid.innerHTML = '';
            
            const filtered = filter === 'all' 
                ? PROJECTS 
                : PROJECTS.filter(p => p.cat.includes(filter));

            filtered.forEach((p, index) => {
                const card = document.createElement('a');
                card.href = `projects/${p.slug}.html`;
                card.className = 'project-card';
                // Stagger cap at 8 cards (0.04s * index, max 0.32s)
                card.style.transitionDelay = `${Math.min(index * 0.045, 0.36)}s`;
                
                // Determine category label
                const categoryText = p.cat.map(c => {
                    if (c === '3d') return '3D';
                    if (c === 'montage') return 'Montage';
                    return c.charAt(0).toUpperCase() + c.slice(1);
                }).join(' • ');
                
                card.innerHTML = `
                    <div class="card-img-wrap">
                        <img src="${p.img}" alt="${p.title}" loading="lazy">
                        ${p.award ? `<div class="card-award"><span>🏆 ${p.award}</span></div>` : ''}
                    </div>
                    <div class="card-info">
                        <span class="card-category">${categoryText}</span>
                        <span class="card-title">${p.title}</span>
                    </div>
                `;
                
                grid.appendChild(card);
                
                // Double RAF ensures browser has painted the initial state before adding .is-visible
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        card.classList.add('is-visible');
                    });
                });
            });
            
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
            grid.style.transition = 'opacity 0.3s ease, transform 0.35s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1))';
        }, 200);
    }

    // Filter Buttons Interaction
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid(btn.dataset.filter);
        });
    });

    // Initial Grid Render
    renderGrid();

    // 2. Header Scroll Glassmorphism
    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
        const updateHeader = () => {
            if (window.scrollY > 40) {
                siteHeader.classList.add('is-scrolled');
            } else {
                siteHeader.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    // 3. Mobile Navigation Drawer / Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        const toggleMenu = (open) => {
            const isOpen = open !== undefined ? open : !navLinks.classList.contains('is-open');
            navLinks.classList.toggle('is-open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Menu');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        navToggle.addEventListener('click', () => toggleMenu());

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    }

    // 4. Reveal Animations Observer
    const revealElements = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // 5. Hero Parallax / Mouse Movement Smoothing
    const hero = document.getElementById('hero');
    const collage = document.querySelector('.collage-container');
    
    if (hero && collage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isMoving = false;

        const lerp = (start, end, factor) => start + (end - start) * factor;

        const animateParallax = () => {
            currentX = lerp(currentX, mouseX, 0.06);
            currentY = lerp(currentY, mouseY, 0.06);
            collage.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

            if (Math.abs(mouseX - currentX) > 0.05 || Math.abs(mouseY - currentY) > 0.05) {
                requestAnimationFrame(animateParallax);
            } else {
                isMoving = false;
            }
        };

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            mouseX = relX * 24;
            mouseY = relY * 24;

            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(animateParallax);
            }
        }, { passive: true });
    }

    // 6. Smooth Scroll for Anchor Links (accounting for sticky header)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            e.preventDefault();
            if (targetId === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

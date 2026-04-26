// script.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Data System for Projects (EXACT V1 Titles and Categories)
    const PROJECTS = [
        { title: "Ocean Arctique", slug: "ocean-arctique", cat: ["3d"], img: "img/glacierVF.jpg" },
        { title: "Intérieur abandonne", slug: "interieur-abandonne", cat: ["3d"], img: "img/int-VF.png" },
        { title: "Océan en 3D", slug: "profondeurs", cat: ["3d"], img: "img/ocean.png" },
        { title: "Ile tropicale", slug: "ile-flottante", cat: ["3d"], img: "img/îleVF.png" },
        { title: "Paysage naturel", slug: "paysage-cotier", cat: ["3d"], img: "img/0116.png", award: "Meilleure Animation — À l'West Fest (IUT Lannion)" },
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

    function renderGrid(filter = 'all') {
        if (!grid) return;
        
        grid.style.opacity = '0';
        
        setTimeout(() => {
            grid.innerHTML = '';
            
            const filtered = filter === 'all' 
                ? PROJECTS 
                : PROJECTS.filter(p => p.cat.includes(filter));

            filtered.forEach((p, index) => {
                const card = document.createElement('a');
                card.href = `projects/${p.slug}.html`;
                card.className = 'project-card';
                card.style.transitionDelay = `${index * 0.05}s`;
                
                // Determine display category text
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
                
                requestAnimationFrame(() => {
                    card.classList.add('is-visible');
                });
            });
            
            grid.style.opacity = '1';
        }, 300);
    }

    // Filter Click Events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid(btn.dataset.filter);
        });
    });

    // Initial Render
    renderGrid();

    // 2. Standard Intersection Observer for reveal animations
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Hero Parallax / Mouse Move effect
    const hero = document.getElementById('hero');
    const collage = document.querySelector('.collage-container');
    if (hero && collage) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            collage.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // 4. Smooth Scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

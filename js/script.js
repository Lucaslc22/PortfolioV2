// script.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Standard Intersection Observer
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

    // 2. 3D Tunnel Z-Axis Scroll Engine
    const tunnelContainer = document.querySelector('.tunnel-container');
    const tunnelScene = document.getElementById('tunnel-scene');
    const tunnelCards = document.querySelectorAll('.tunnel-card');
    
    if(!tunnelContainer || !tunnelScene || tunnelCards.length === 0) return;

    // Configuration
    const SCROLL_DURATION = 7000; // Distance physique à scroller (réduite pour accélérer)
    const Z_SPACING = 1500; // Distance between cards on Z axis
    const Z_START = 0; // Where the first card sits
    const TOTAL_Z = (tunnelCards.length - 1) * Z_SPACING;
    
    // The total scroll distance needed to traverse the tunnel
    // Adds some extra room at end to fully pass the last card
    tunnelContainer.style.height = `${window.innerHeight + SCROLL_DURATION}px`;

    // Position cards initially
    tunnelCards.forEach((card, index) => {
        let xOffset = 0;
        let yOffset = -50;
        let rotY = 0;
        let rotX = 0;

        // Premier proj au centre, les autres dispersés dans l'espace
        if (index > 0) {
            const isLeft = index % 2 !== 0;
            xOffset = (isLeft ? -1 : 1) * (20 + (index * 13) % 25);
            yOffset = -50 + ((index % 3 === 0 ? 1 : -1) * (10 + (index * 7) % 20));

            // Inclinaison radiale : la carte "regarde" vers le centre du tunnel
            rotY = isLeft ? 18 : -18;
            // Les cartes en haut penchent vers le bas, et vice versa
            rotX = (yOffset + 50) * -0.5;
        }
        
        const zPos = Z_START - (index * Z_SPACING);
        card.dataset.z = zPos;

        card.style.transform = `translate3d(-50%, ${yOffset}%, ${zPos}px) translateX(${xOffset}vw) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    });

    let currentZ = 0;
    let targetZ = 0;
    const ease = 0.08;

    function renderTunnel() {
        const rect = tunnelContainer.getBoundingClientRect();
        const topOfContainerToViewport = rect.top;
        
        // If container is within scroll focus (top <= 0)
        let scrollProgress = 0;
        
        if (topOfContainerToViewport <= 0) {
            // How far we have scrolled inside the container
            const maxScroll = rect.height - window.innerHeight;
            let scrolled = -topOfContainerToViewport;
            // Clamp scrolled
            scrolled = Math.max(0, Math.min(scrolled, maxScroll));
            scrollProgress = scrolled / maxScroll;
        }

        // Target Z goes from 0 to TOTAL_Z + 1500 (past the last card)
        targetZ = scrollProgress * (TOTAL_Z + 1500);

        // LERP Scroll
        currentZ += (targetZ - currentZ) * ease;

        // Move the scene forward without camera rotation
        tunnelScene.style.transform = `translateZ(${currentZ}px)`;

        // Calculate opacity based on relative distance to camera
        tunnelCards.forEach((card) => {
            const cardZ = parseFloat(card.dataset.z);
            // Current absolute position of card relative to camera:
            // Camera Z is currentZ. Card Z is cardZ.
            // When camera moves forward (+ currentZ), it approaches negative cardZ.
            // Distance = cardZ + currentZ
            const relativeZ = cardZ + currentZ;
            
            // If relativeZ > 0: Card is behind camera
            // If relativeZ < 0: Card is in front of camera
            
            let opacity = 0;
            // Visible range: up to 4000px ahead, fades out at 100px past camera
            if (relativeZ < 1000 && relativeZ > -6000) {
                // Fade in from distance
                const depthScale = Math.max(0, Math.min(1, (relativeZ + 6000) / 3000));
                // Fade out when passing through camera
                const pastScale = Math.max(0, Math.min(1, (1000 - relativeZ) / 1000));
                opacity = Math.min(depthScale, pastScale);
            }
            
            card.style.opacity = opacity;
            
            // Pointer events optimization: only clickable when somewhat close and in front
            if (relativeZ > -1500 && relativeZ < 200) {
                card.classList.add('is-active');
            } else {
                card.classList.remove('is-active');
            }
            
            // Slight blur for depth of field (costly in performance, use sparsely or simple approach)
            if(Math.abs(relativeZ) > 2500) {
                 card.style.filter = `blur(${Math.min(5, Math.abs(relativeZ) / 1000)}px)`;
            } else {
                 card.style.filter = `none`;
            }
        });

        requestAnimationFrame(renderTunnel);
    }
    
    renderTunnel();
});

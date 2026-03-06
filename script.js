document.addEventListener("DOMContentLoaded", () => {

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');

    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
            document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
        });

        mobileNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Initialize SplitType for typography reveals FIRST
    const splitTexts = new SplitType('.split-text', { types: 'words, chars' });

    // Remove loading class after a brief delay and run intro
    setTimeout(() => {
        document.body.classList.remove("loading");
        initIntroAnimation();
    }, 100);

    // 3. Intro Animation Sequence
    function initIntroAnimation() {
        const tlIntro = gsap.timeline();

        // Logo & Nav drop in
        tlIntro.from(".navbar", {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
            // Staggered character reveal for hero headline
            .from(".hero-headline .char", {
                y: '100%',
                opacity: 0,
                duration: 1,
                stagger: 0.02,
                ease: "power4.out"
            }, "-=0.5")
            // Fade up other hero elements
            .from(".hero-bottom-area .fade-up", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            }, "-=0.8");
    }

    // 4. Scroll Reveal Animations

    // Animate all titles and massive statements character by character
    const splitElements = document.querySelectorAll('.split-text:not(.hero-headline)');
    splitElements.forEach(elem => {
        const chars = elem.querySelectorAll('.char');
        if (chars.length === 0) return; // safety

        gsap.from(chars, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: '100%',
            opacity: 0,
            duration: 1,
            stagger: 0.015,
            ease: "power4.out"
        });
    });

    // Standard Fade-Ups
    const fadeUpElements = document.querySelectorAll('.fade-up:not(.hero-bottom-area .fade-up)');
    fadeUpElements.forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // 5. Parallax & Floating Elements

    // Jitter/Float effect on 3D simulated shapes simulating Reflektor WebGL behavior
    gsap.to(".gs-float .visual-shape", {
        y: 'random(-15, 15)',
        x: 'random(-10, 10)',
        rotation: 'random(-5, 5)',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".gs-float-alt .visual-shape", {
        y: 'random(-20, 20)',
        x: 'random(-15, 15)',
        rotation: 'random(-8, 8)',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Parallax numbers
    const parallaxModules = document.querySelectorAll('.parallax-module');
    parallaxModules.forEach(module => {
        const bigNumber = module.querySelector('.huge-number');
        if (bigNumber) {
            gsap.fromTo(bigNumber,
                { y: -100 },
                {
                    y: 100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: module,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }
    });

    // Sub-staggering the Nav links for character hover effect
    const splitNavs = new SplitType('.split-nav', { types: 'chars' });
    const navLinks = document.querySelectorAll('.split-nav');

    navLinks.forEach(link => {
        const chars = link.querySelectorAll('.char');
        link.addEventListener('mouseenter', () => {
            gsap.to(chars, {
                y: -5,
                stagger: 0.02,
                duration: 0.2,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
        });
    });
});

// --- MODAL LOGIC ---
const modal = document.getElementById('auditModal');
const openBtns = [document.getElementById('open-audit-modal-hero'), document.getElementById('open-audit-modal')];
const closeBtn = document.getElementById('close-audit-modal');
const form = document.getElementById('auditForm');

if (modal && closeBtn && form) {
    openBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.textContent;

        const name = document.getElementById('auditName').value || 'N/A';
        const email = document.getElementById('auditEmail').value || 'N/A';
        const company = document.getElementById('auditCompany').value || 'N/A';
        const service = document.getElementById('auditService').value || 'N/A';
        const msg = document.getElementById('auditMessage').value || '';

        btn.textContent = 'Launching...';
        btn.style.opacity = '0.7';

        fetch("https://formsubmit.co/ajax/founders@launchlords.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `New Audit Request from ${name} at ${company}`,
                Name: name,
                Email: email,
                Company: company,
                Service: service,
                Message: msg
            })
        })
            .then(response => response.json())
            .then(data => {
                btn.textContent = 'Audit Requested!';
                btn.style.background = '#47ff75';
                btn.style.color = '#000';

                setTimeout(() => {
                    window.location.href = 'success.html';
                }, 1000);
            })
            .catch(error => {
                console.error("Form submission error:", error);
                btn.textContent = 'Error. Try again.';
                btn.style.opacity = '1';
            });
    });
}

const inlineForm = document.getElementById('inlineAuditForm');
if (inlineForm) {
    inlineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = inlineForm.querySelector('.submit-btn');
        const originalText = btn.textContent;

        const name = document.getElementById('inlineName').value || 'N/A';
        const email = document.getElementById('inlineEmail').value || 'N/A';
        const company = document.getElementById('inlineCompany').value || 'N/A';
        const service = document.getElementById('inlineService').value || 'N/A';
        const msg = document.getElementById('inlineMessage').value || '';

        btn.textContent = 'Launching...';
        btn.style.opacity = '0.7';

        fetch("https://formsubmit.co/ajax/founders@launchlords.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `New Audit Request from ${name} at ${company}`,
                Name: name,
                Email: email,
                Company: company,
                Service: service,
                Message: msg
            })
        })
            .then(response => response.json())
            .then(data => {
                btn.textContent = 'Audit Requested!';
                btn.style.background = '#47ff75';
                btn.style.color = '#000';

                setTimeout(() => {
                    window.location.href = 'success.html';
                }, 1000);
            })
            .catch(error => {
                console.error("Form submission error:", error);
                btn.textContent = 'Error. Try again.';
                btn.style.opacity = '1';
            });
    });
}

// --- GLOBE VISUALIZATION ---
setTimeout(() => {
    const globeContainer = document.getElementById('globeViz');
    if (globeContainer && typeof Globe !== 'undefined') {
        const places = [
            { lat: 39.8283, lng: -98.5795, color: '#d4af37', name: 'USA' },
            { lat: 53.1424, lng: -7.6921, color: '#d4af37', name: 'Ireland' },
            { lat: 51.5074, lng: -0.1278, color: '#d4af37', name: 'London' },
            { lat: 50.5039, lng: 4.4699, color: '#d4af37', name: 'Belgium' },
            { lat: 51.1657, lng: 10.4515, color: '#d4af37', name: 'Germany' },
            { lat: 20.5937, lng: 78.9629, color: '#d4af37', name: 'India' }
        ];

        const globe = Globe()
            (globeContainer)
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
            .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundColor('rgba(0,0,0,0)')
            .width(globeContainer.clientWidth)
            .height(globeContainer.clientHeight || 400)
            .labelsData(places)
            .labelLat('lat')
            .labelLng('lng')
            .labelText('name')
            .labelSize(1.5)
            .labelDotRadius(0.8)
            .labelColor(() => 'rgba(255, 215, 0, 0.8)')
            .labelResolution(2);

        // Auto-rotation and controls
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 1.0;
        globe.controls().enableZoom = false; // Prevent size change on scroll

        // Set rotate speed to positive for proper drag controls mapping
        globe.controls().rotateSpeed = 1.0;

        // Initial view facing Atlantic/Europe
        globe.pointOfView({ lat: 40, lng: -20, altitude: 2 }, 1000);

        // Handle Resize
        window.addEventListener('resize', () => {
            if (globeContainer) {
                globe.width(globeContainer.clientWidth).height(globeContainer.clientHeight || 400);
            }
        });

        // Atmosphere tweaking after load
        setTimeout(() => {
            const globeMaterial = globe.globeMaterial();
            // Enhance the slight golden/warm glow effect requested implicitly from the theme
            // globeMaterial.emissive = new THREE.Color(0x222222);
            // globeMaterial.emissiveIntensity = 0.5;
        }, 100);
    }
}, 500);

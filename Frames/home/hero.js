document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded!');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // HERO ANIMATIONS ON LOAD
    // ============================================

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate hero tag
    tl.to('.hero-tag', {
        opacity: 1,
        y: 0,
        duration: 0.8
    });

    // Animate title words with stagger
    tl.to('.word', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2
    }, '-=0.4');

    // Animate description
    tl.to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.6');

    // Animate CTA buttons
    tl.to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.4');

    // Animate stats
    tl.to('.hero-stats', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.6');

    // Animate floating cards
    tl.to('.card-1', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1
    }, '-=0.8');

    tl.to('.card-2', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1
    }, '-=0.9');

    tl.to('.card-3', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1
    }, '-=0.9');

    // Animate scroll indicator
    tl.to('.scroll-indicator', {
        opacity: 1,
        duration: 0.8
    }, '-=0.5');

    // ============================================
    // PARALLAX EFFECT FOR FLOATING CARDS
    // ============================================

    const floatingCards = document.querySelectorAll('.product-card');
    
    floatingCards.forEach(card => {
        const speed = parseFloat(card.getAttribute('data-speed')) || 0.5;
        
        gsap.to(card, {
            scrollTrigger: {
                trigger: '.hero-wrapper',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: () => `-${100 * speed}px`,
            ease: 'none'
        });
    });

    // ============================================
    // MOUSE MOVE PARALLAX FOR HERO ELEMENTS
    // ============================================

    const heroWrapper = document.querySelector('.hero-wrapper');
    
    heroWrapper.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 20;
        const yPos = (clientY / innerHeight - 0.5) * 20;

        // Move floating cards with cursor
        gsap.to('.card-1', {
            x: xPos * 1.5,
            y: yPos * 1.5,
            duration: 0.5
        });

        gsap.to('.card-2', {
            x: xPos * 1,
            y: yPos * 1,
            duration: 0.7
        });

        gsap.to('.card-3', {
            x: xPos * 2,
            y: yPos * 2,
            duration: 0.4
        });

        // Move decorative circles
        gsap.to('.circle-1', {
            x: xPos * 0.5,
            y: yPos * 0.5,
            duration: 1
        });

        gsap.to('.circle-2', {
            x: -xPos * 0.3,
            y: -yPos * 0.3,
            duration: 1.2
        });
    });

    // ============================================
    // VIDEO FADE OUT ON SCROLL
    // ============================================

    gsap.to('.video-background', {
        scrollTrigger: {
            trigger: '.hero-wrapper',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        opacity: 0.3,
        scale: 1.1,
        ease: 'none'
    });

    // ============================================
    // FEATURES SECTION ANIMATION
    // ============================================

    const featureCards = document.querySelectorAll('.feature-card-modern');
    
    featureCards.forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 60%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // Animate section header
    gsap.to('.section-header-modern', {
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Set initial state
    gsap.set('.section-header-modern', { opacity: 0, y: 30 });

    // ============================================
    // FINAL CTA ANIMATION
    // ============================================

    gsap.to('.cta-content', {
        scrollTrigger: {
            trigger: '.final-cta-modern',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.set('.cta-content', { opacity: 0, y: 30 });

    // ============================================
    // BUTTON HOVER EFFECTS
    // ============================================

    const buttons = document.querySelectorAll('.primary-btn, .cta-button-large');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ============================================
    // STAT NUMBER COUNTER ANIMATION
    // ============================================

    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasStar = text.includes('★');
        const number = parseFloat(text.replace(/[^\d.]/g, ''));
        
        const obj = { value: 0 };
        
        gsap.to(obj, {
            scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            value: number,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                let displayValue = Math.floor(obj.value);
                
                if (text.includes('.')) {
                    displayValue = obj.value.toFixed(1);
                }
                
                if (text.includes('K')) {
                    element.textContent = displayValue + 'K' + (hasPlus ? '+' : '');
                } else if (hasStar) {
                    element.textContent = displayValue + '★';
                } else {
                    element.textContent = displayValue + (hasPlus ? '+' : '');
                }
            }
        });
    };
    
    statNumbers.forEach(animateCounter);

    // ============================================
    // SMOOTH SCROLL FOR INTERNAL LINKS
    // ============================================

    const scrollToElement = (target) => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: target,
                offsetY: 80
            },
            ease: 'power3.inOut'
        });
    };

    // ============================================
    // NAVBAR BACKGROUND ON SCROLL
    // ============================================

    const navbar = document.querySelector('nav');
    
    gsap.to(navbar, {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '100px top',
            scrub: true
        },
        backgroundColor: 'rgba(23, 21, 21, 0.95)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
        ease: 'none'
    });

    // ============================================
    // SCROLL INDICATOR FADE OUT
    // ============================================

    gsap.to('.scroll-indicator', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '200px top',
            scrub: true
        },
        opacity: 0,
        ease: 'none'
    });

    // ============================================
    // FOOTER ANIMATION
    // ============================================

    gsap.to('footer', {
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.set('footer', { opacity: 0, y: 30 });

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================

    // Disable animations on low-end devices
    const isLowEndDevice = () => {
        return navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    };

    if (isLowEndDevice()) {
        ScrollTrigger.config({ autoRefreshEvents: 'resize' });
    }

    // ============================================
    // REFRESH SCROLLTRIGGER
    // ============================================

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // Refresh on window resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    // ============================================
    // DEBUG INFO
    // ============================================

    console.log('Hero animations initialized');
    console.log('ScrollTrigger instances:', ScrollTrigger.getAll().length);
});
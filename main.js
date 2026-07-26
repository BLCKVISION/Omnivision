/* ═══════════════════════════════════════════════════════════
   OMNIVISION — MAIN JAVASCRIPT
   Flow:
     1. Loader: isotipo scale-in centrado
     2. Isotipo desliza izq + clip del logotipo-clip se abre
        y logotipo PNG hace fade-in simultáneo
     3. Hold → cortina wipe up
     4. Hero: navbar + heading clip-cut stagger + subtitle + dashboard
     5. Navbar: se oculta al bajar scroll, aparece al subir
     6. About: ScrollTrigger stagger al entrar al viewport
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── INIT LENIS SMOOTH SCROLL ──
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);

  /* ── Prevent scroll during load ────────────────────────── */
  document.body.style.overflow = 'hidden';

  /* ── Element refs ───────────────────────────────────────── */
  const loader        = document.getElementById('loader');
  const loaderLogo    = document.getElementById('loader-logo');
  const isotipo       = document.getElementById('loader-isotipo');
  const logotipoClip  = document.getElementById('loader-logotipo-clip');
  const logotipo      = document.getElementById('loader-logotipo');
  const site          = document.getElementById('site');
  const navbar        = document.getElementById('navbar');
  const lineInners    = document.querySelectorAll('#hero .line-inner');
  const wordInners    = document.querySelectorAll('.word-inner');
  const dashboard     = document.getElementById('dashboard-wrapper');
  const dashImg       = document.getElementById('dashboard-img');
  const glow          = document.getElementById('dashboard-glow');

  /* ═══════════════════════════════════════════════════════
     LOADER — initial states
  ═══════════════════════════════════════════════════════ */

  /* Center the group: isotipo is 52px, logotipo is 200px + 14px gap.
     At start, only isotipo is visible so we center on it:
     translate(-50%,-50%) on the flex container handles it. */
  gsap.set(loaderLogo,   { xPercent: -50, yPercent: -50 });
  gsap.set(isotipo,      { opacity: 0, scale: 0.65 });
  gsap.set(logotipoClip, { maxWidth: 0, opacity: 1 });  /* clip closed */
  gsap.set(logotipo,     { opacity: 0 });

  /* ═══════════════════════════════════════════════════════
     MASTER LOADER TIMELINE
  ═══════════════════════════════════════════════════════ */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  /* Step 1 — Isotipo scale-in centrado */
  tl.to(isotipo, {
    opacity: 1,
    scale: 1,
    duration: 0.9,
    ease: 'back.out(1.5)'
  }, 0.3);

  /* Step 2a — Isotipo se desliza a la izquierda dentro del flex row.
     Animamos el loaderLogo completo hacia la izquierda para que
     visualmente el isotipo se desplace dejando espacio al logotipo. */
  tl.to(loaderLogo, {
    xPercent: -65,    /* shift group left so logotipo has room */
    duration: 0.9,
    ease: 'power2.inOut'
  }, '+=0.5');

  /* Step 2b — Al mismo tiempo, abre el clip del logotipo */
  tl.to(logotipoClip, {
    maxWidth: 220,    /* abre hasta el ancho del logotipo */
    duration: 0.9,
    ease: 'power2.inOut'
  }, '<');

  /* Step 2c — Fade in del logotipo PNG mientras se abre el clip */
  tl.to(logotipo, {
    opacity: 1,
    duration: 0.75,
    ease: 'power2.out'
  }, '<0.1');

  /* Step 3 — Hold para que el usuario pueda leer */
  tl.to({}, { duration: 0.7 });

  /* Step 4 — Revelar el site antes del wipe */
  tl.call(() => {
    site.classList.remove('hidden');
    gsap.set(site, { visibility: 'visible', opacity: 1 });
  });

  /* Step 5 — Cortina negra sube como teatro */
  tl.to(loader, {
    yPercent: -100,
    duration: 1.05,
    ease: 'power4.inOut'
  });

  /* Step 6 — Cleanup */
  tl.call(() => {
    loader.style.display = 'none';
    document.body.style.overflow = '';
    runHeroAnimations();
    initAboutAnimations();
    initFeaturesAnimations();
    initNavScroll();
    initOmniboxAnimations();
    initSlider();

    // Fundamental: Refresh ScrollTrigger una vez que el DOM es visible
    // Esto corrige que las secciones de abajo se animen antes de tiempo
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });

  /* ═══════════════════════════════════════════════════════
     HERO ANIMATIONS
  ═══════════════════════════════════════════════════════ */
  function runHeroAnimations() {

    /* Navbar drop-in inicial */
    gsap.to(navbar, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
      delay: 0.08
    });

    /* Heading: clip cut line by line */
    gsap.to(lineInners, {
      y: 0,
      duration: 1.05,
      ease: 'power4.out',
      stagger: 0.2,
      delay: 0.22
    });

    /* Subtitle: word-by-word stagger */
    gsap.to(wordInners, {
      y: 0,
      duration: 0.65,
      ease: 'power3.out',
      stagger: 0.04,
      delay: 0.52
    });

    /* Dashboard fade-up */
    gsap.to(dashboard, {
      opacity: 1, y: 0, scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.65
    });

    /* Idle floating loop */
    gsap.to(dashImg, {
      y: -10,
      duration: 4.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.2
    });

    /* Top glow pulse */
    gsap.to(glow, {
      opacity: 0.55,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.8
    });
  }

  /* ═══════════════════════════════════════════════════════
     NAVBAR — HIDE ON SCROLL DOWN / SHOW ON SCROLL UP
     Usa la CSS transition que ya está definida en el navbar.
     Sólo cuando el navbar ya está visible (opacity: 1).
  ═══════════════════════════════════════════════════════ */
  function initNavScroll() {
    let lastScrollY    = 0;
    let navVisible     = true;
    let scrolledPast   = false;   /* true después de bajar 80px */

    /* Glass effect al pasar de 80px */
    ScrollTrigger.create({
      trigger: 'body',
      start: '80px top',
      onEnter: () => {
        scrolledPast = true;
        gsap.to(navbar, {
          backdropFilter: 'blur(20px)',
          background: 'rgba(0,0,0,0.65)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          duration: 0.4
        });
      },
      onLeaveBack: () => {
        scrolledPast = false;
        gsap.to(navbar, {
          backdropFilter: 'blur(0px)',
          background: 'transparent',
          borderBottom: '1px solid transparent',
          duration: 0.4
        });
      }
    });

    /* Hide / show basado en dirección del scroll */
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const delta    = currentY - lastScrollY;

      /* Solo actuar si pasamos el umbral */
      if (currentY < 80) {
        if (!navVisible) {
          navVisible = true;
          navbar.style.transform = 'translateY(0)';
          navbar.style.opacity   = '1';
        }
        lastScrollY = currentY;
        return;
      }

      if (delta > 4 && navVisible) {
        /* Scrolling DOWN → ocultar */
        navVisible = false;
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.opacity   = '0';
      } else if (delta < -4 && !navVisible) {
        /* Scrolling UP → mostrar */
        navVisible = true;
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity   = '1';
      }

      lastScrollY = currentY;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════
     ABOUT / NOSOTROS SCROLL ANIMATIONS
  ═══════════════════════════════════════════════════════ */
  function initAboutAnimations() {

    /* Tags — stagger fade+up */
    gsap.from('.tag', {
      opacity: 0,
      y: 18,
      duration: 0.7,
      stagger: 0.14,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#nosotros',
        start: 'top 80%',
      }
    });

    /* Title: clip-reveal.
       IMPORTANTE: el CSS ya tiene translateY(110%) en .line-inner.
       Usamos gsap.to() para animar DESDE ese estado CSS hacia y:0.
       gsap.from() no funciona correctamente cuando el CSS ya define el estado. */
    const aboutLines = document.querySelectorAll('#nosotros .line-inner');
    gsap.to(aboutLines, {
      y: 0,
      duration: 1.0,
      stagger: 0.18,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.nosotros-title',
        start: 'top 82%',
      }
    });

    /* Description fade */
    gsap.from('.nosotros-desc', {
      opacity: 0,
      y: 20,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.nosotros-desc',
        start: 'top 85%',
      }
    });

    /* Marquee fade in */
    gsap.from('.marquee-wrapper', {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.marquee-wrapper',
        start: 'top 90%',
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     HERO PARALLAX ON SCROLL
  ═══════════════════════════════════════════════════════ */
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(dashboard, {
        y: p * 55,
        rotationX: p * 4,
        transformPerspective: 1000
      });
      gsap.set('.hero-content', {
        y: p * -35,
        opacity: 1 - p * 0.5
      });
    }
  });

  /* ═══════════════════════════════════════════════════════
     FEATURES — SCROLLTRIGGER STAGGER
     Cards animate in per row as they enter the viewport.
     Inside each card, elements stagger: image -> title -> desc.
  ═══════════════════════════════════════════════════════ */
  function initFeaturesAnimations() {
    const cards = document.querySelectorAll('.feat-card');

    cards.forEach((card, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      const img = card.querySelector('.feat-img-wrap');
      const title = card.querySelector('.feat-desc strong');
      const text = card.querySelector('.feat-text');

      tl.to(img, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(title, { opacity: 1, duration: 0.7, ease: 'power2.out' }, "-=0.4")
        .to(text, { opacity: 1, duration: 0.7, ease: 'power2.out' }, "-=0.45");
    });
  }
  /* ═══════════════════════════════════════════════════════
     OMNIBOX — SCROLLTRIGGER
  ═══════════════════════════════════════════════════════ */
  function initOmniboxAnimations() {
    gsap.to('#omnibox .line-inner', {
      scrollTrigger: {
        trigger: '#omnibox',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 0,
      duration: 1.05,
      ease: 'power4.out',
      stagger: 0.15
    });
  }

  /* ═══════════════════════════════════════════════════════
     ACCORDION SLIDER
  ═══════════════════════════════════════════════════════ */
  function initSlider() {
    const cards = document.querySelectorAll('.slide-card');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    if (!cards.length) return;

    let currentIndex = 0;
    let sliderInterval;
    let isPaused = false;

    // Entrada animada del slider con ScrollTrigger (stagger)
    gsap.from('#slider-section .slider-header, #slider-section .slide-card', {
      scrollTrigger: {
        trigger: '#slider-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.15
    });

    function goToSlide(index) {
      cards[currentIndex].classList.remove('active');
      currentIndex = index;
      if (currentIndex >= cards.length) currentIndex = 0;
      if (currentIndex < 0) currentIndex = cards.length - 1;
      cards[currentIndex].classList.add('active');
    }

    function nextSlide() {
      if (!isPaused) {
        goToSlide(currentIndex + 1);
      }
    }

    function resetInterval() {
      clearInterval(sliderInterval);
      sliderInterval = setInterval(nextSlide, 5000);
    }

    cards.forEach((card, i) => {
      // Click manually activates slide
      card.addEventListener('click', () => {
        if (currentIndex !== i) {
          goToSlide(i);
          resetInterval();
        }
      });
      
      // Pause auto-rotation on hover
      card.addEventListener('mouseenter', () => isPaused = true);
      card.addEventListener('mouseleave', () => isPaused = false);
    });

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetInterval();
      });
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetInterval();
      });
    }

    // Start auto-rotation
    resetInterval();
  }

});


document.addEventListener("DOMContentLoaded", () => {
    // ─── CURSOR ───
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = -200, my = -200, rx = -200, ry = -200, clicking = false;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mousedown', () => { clicking = true; });
    document.addEventListener('mouseup', () => { clicking = false; });
    (function loop() {
        rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        dot.style.transform = `translate(-50%,-50%) scale(${clicking ? 0.8 : 1})`;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        ring.style.transform = `translate(-50%,-50%) scale(${clicking ? 1.5 : 1})`;
        requestAnimationFrame(loop);
    })();


    gsap.registerPlugin(ScrollTrigger);


    window.lenis = new Lenis();

    window.lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        window.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const nav = document.querySelector("nav");
    const header = document.querySelector(".header");
    const heroImg = document.querySelector(".hero-img");
    const heroBgReveal = document.querySelector(".hero-bg-reveal");
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    

    const setcanvassize = () => {
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        context.scale(pixelRatio, pixelRatio);
    };

    setcanvassize();
    
    const frameCount = 200;
    const currentFrame = (index) => {
        return `img/${index.toString().padStart(3, "0")}.jpg`;
    };

    let images = [];
    let videoFrames = { frame: 0};
    let imageToLoad = frameCount;

    const onLoad = () => {
        imageToLoad--;
        if (!imageToLoad) {
            render();
            imagesReady = true;
            checkReady();
        }
    };

    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.onload = onLoad;
        img.onerror = function () {
            onLoad.call(this);
        };
        img.src = currentFrame(i);
        images.push(img);
    }



    // ─── FLAGS (loader + images must both complete before scroll setup) ───
    let imagesReady = false;
    let loaderReady = false;

    function checkReady() {
        if (imagesReady && loaderReady) animateHeroIn();
    }

    // ─── INITIAL STATES (hidden — entrance animation takes over) ───
    // nav uses class-based reveal (#navbar.nav-in)
    gsap.set(".header > *",{ opacity: 0, y: 28, filter: "blur(6px)" });
    gsap.set(heroImg,      { scale: 1.8, opacity: 0, transformOrigin: "center bottom" });
    gsap.set(heroBgReveal,  { yPercent: 100 });

    // ─── LOADER TIMELINE ───
    gsap.timeline({
        onComplete: () => { loaderReady = true; checkReady(); }
    })
    // Isotipo appears centered
    .to("#loader-isotipo", { opacity: 1, duration: 0.8, ease: "power2.out" })
    // Mantiene visible briefly
    .to({}, { duration: 0.4 })
    // Move Isotipo and reveal Logotipo
    .to("#loader-logotipo-wrapper", { maxWidth: 500, duration: 0.8, ease: "power3.inOut" }, "reveal")
    .to("#loader-logotipo", { opacity: 1, duration: 0.8, ease: "power3.inOut" }, "reveal")
    // Keep final logo visible for a bit
    .to({}, { duration: 0.7 })
    // Loader slides UP and disappears
    .to("#loader", { yPercent: -100, duration: 0.8, ease: "power3.inOut" })
    .set("#loader", { display: "none" });

    // ─── HERO ENTRANCE (se ejecuta cuando loader + imágenes están listos) ───
    function animateHeroIn() {
        const navbar = document.getElementById('navbar');
        const links  = document.querySelectorAll('.nb-link');

        gsap.timeline({ onComplete: setupScrollTrigger })
            // 1. Navbar pill drops in
            .add(() => {
                navbar.classList.add('nav-in');
                navbar.style.transition = 'opacity 0.65s cubic-bezier(0.34,1.4,0.64,1), transform 0.65s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.4s ease, border-color 0.4s ease';
            })
            // 2. Links stagger in
            .add(() => {
                links.forEach((l, i) => {
                    setTimeout(() => {
                        l.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s`;
                        l.classList.add('link-in');
                    }, 300 + i * 60);
                });
            })
            // 3. Header elements
            .to(".header > *", {
                opacity: 1, y: 0, filter: "blur(0px)",
                duration: 0.7, stagger: 0.13, ease: "power3.out"
            }, 0.2);
    }

    const render = () => {
        const canvasWidth  = window.innerWidth;
        const canvasHeight = window.innerHeight;

        context.clearRect(0, 0, canvasWidth, canvasHeight);

        const img = images[videoFrames.frame];
        if (img && img.complete && img.naturalWidth > 0) {
            const imageAspect  = img.naturalWidth / img.naturalHeight;
            const canvasAspect = canvasWidth / canvasHeight;
            let drawWidth, drawHeight, drawX, drawY;

            if (imageAspect > canvasAspect) {
                drawHeight = canvasHeight;
                drawWidth  = canvasHeight * imageAspect;
                drawX      = (canvasWidth - drawWidth) / 2;
                drawY      = 0;
            } else {
                drawWidth  = canvasWidth;
                drawHeight = canvasWidth / imageAspect;
                drawX      = 0;
                drawY      = (canvasHeight - drawHeight) / 2;
            }
            context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        }
    };

    const setupScrollTrigger = () => {
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: `+=${window.innerHeight * 24}px`,   // suficiente para los 200 frames completos (más lento)
            pin: true,
            pinSpacing: true,
            scrub: 0.6,                               // más suave y progresivo
            onUpdate: (self) => {
                const p = self.progress;

                // ── FRAMES: usa el rango completo (0→1) ──
                const targetFrame = Math.min(Math.round(p * (frameCount - 1)), frameCount - 1);
                videoFrames.frame = targetFrame;
                render();

                // ── NAV / LOGO: baja y desaparece (0→0.18) — está en la parte inferior ──
                /*
                if (p <= 0.18) {
                    const t = p / 0.18;
                    gsap.set(nav, { opacity: 1 - t, y: t * 40 });
                } else {
                    gsap.set(nav, { opacity: 0, y: 40 });
                }
                */

                // ── HEADER: sube y desaparece (0→0.28) ──
                if (p <= 0.28) {
                    const t = p / 0.28;
                    gsap.set(header, { opacity: 1 - t, y: -t * 100 });
                } else {
                    gsap.set(header, { opacity: 0, y: -100 });
                }

                // ── DASHBOARD: black bg first, then image ──
                // Phase 1 (0.45→0.60): Black bg reveals (slides up from bottom)
                // Phase 2 (0.60→0.95): Image appears and scales down
                if (p < 0.45) {
                    gsap.set(heroBgReveal, { yPercent: 100 });
                    gsap.set(heroImg, { scale: 1.8, opacity: 0, transformOrigin: "center bottom" });
                } else if (p >= 0.45 && p < 0.60) {
                    const t = (p - 0.45) / 0.15;
                    gsap.set(heroBgReveal, { yPercent: 100 - (t * 100) });
                    gsap.set(heroImg, { scale: 1.8, opacity: 0, transformOrigin: "center bottom" });
                } else if (p >= 0.60 && p <= 0.95) {
                    gsap.set(heroBgReveal, { yPercent: 0 });
                    const t = (p - 0.60) / 0.35;
                    const scale = 1.8 - t * 0.8;
                    const opacity = Math.max(0, Math.min(1, 1.2 * t * t - 0.2 * t));
                    gsap.set(heroImg, { scale, opacity, transformOrigin: "center bottom" });
                    // Fade out black bg as image becomes visible
                    const bgOpacity = Math.max(0, 1 - t * 1.5);
                    gsap.set(heroBgReveal, { yPercent: 0, opacity: bgOpacity });
                } else {
                    gsap.set(heroBgReveal, { yPercent: 0, opacity: 0 });
                    gsap.set(heroImg, { scale: 1, opacity: 1, transformOrigin: "center bottom" });
                }
            },
        });

        // ── SCROLL REVEAL (.sr) with stagger ──
        gsap.set(".sr", { y: 36, opacity: 0, filter: "blur(4px)" });
        ScrollTrigger.batch(".sr", {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    overwrite: true,
                    onStart: function() {
                        batch.forEach(el => el.classList.add('sr-visible'));
                    }
                });
            },
            start: "top 85%",
            once: true
        });

        // ── NAVBAR HIDE/SHOW ON SCROLL DIRECTION ──
        let lastScrollY = window.scrollY;
        let navHidden = false;
        const navEl = document.querySelector('nav');

        ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
                const currentY = window.scrollY;
                const delta = currentY - lastScrollY;

                // Add scrolled class for glassmorphism
                if (currentY > 50) {
                    navEl.classList.add('scrolled');
                } else {
                    navEl.classList.remove('scrolled');
                }

                // Only hide if scrolled past first viewport
                if (currentY > window.innerHeight * 0.5) {
                    if (delta > 5 && !navHidden) {
                        // Scrolling down — hide
                        navEl.classList.add('nav-hidden');
                        navHidden = true;
                    } else if (delta < -5 && navHidden) {
                        // Scrolling up — show
                        navEl.classList.remove('nav-hidden');
                        navHidden = false;
                    }
                } else if (navHidden) {
                    navEl.classList.remove('nav-hidden');
                    navHidden = false;
                }

                lastScrollY = currentY;
            }
        });
        /* ScrollTrigger.create({
            trigger: "#deck-trigger-zone",
            start: "top 80%",
            onEnter: () => {
                setTimeout(() => window.startDeck(), 300);
            },
            once: true
        }); */

        // ── STAT COUNTER ANIMATION ──
        const statCounters = document.querySelectorAll('.stat-counter');
        statCounters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            counter.textContent = isDecimal
                                ? obj.val.toFixed(1)
                                : Math.round(obj.val);
                        }
                    });
                }
            });
        });
    };

    // ─── FAQ ACCORDION ───
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.faq-content');
                        if (otherContent) otherContent.style.maxHeight = null;
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // ─── ARCHITECTURE INTERACTIVE CARDS WITH AUTO-PLAY ───
    const pipelineCards = document.querySelectorAll('.pipeline-card');
    if (pipelineCards.length) {
        let currentIndex = 0;
        let autoplayTimer = null;
        const intervalTime = 4000; // 4 seconds

        function setActiveCard(index) {
            pipelineCards.forEach((c, idx) => {
                if (idx === index) {
                    c.classList.add('active');
                } else {
                    c.classList.remove('active');
                }
            });
            currentIndex = index;
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                let nextIndex = (currentIndex + 1) % pipelineCards.length;
                setActiveCard(nextIndex);
            }, intervalTime);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        pipelineCards.forEach((card, idx) => {
            card.addEventListener('mouseenter', () => {
                stopAutoplay();
                setActiveCard(idx);
            });
            card.addEventListener('mouseleave', () => {
                startAutoplay();
            });
        });

        // Start autoplay on load
        startAutoplay();
    }

    window.addEventListener("resize", () => {
        setcanvassize();
        render();
        ScrollTrigger.refresh();
    });
});



// --- DECK TRANSITION ---
window.deckActive = false;

window.startDeck = function() {
    if (window.lenis) window.lenis.destroy();
    window.scrollTo(0, 0);
    const deckEl = document.getElementById('deck');
    const dotsEl = document.getElementById('dots');
    const hintEl = document.getElementById('hint');
    const counterEl = document.getElementById('counter');
    const introEl = document.getElementById('omni-view');

    gsap.to(introEl, { opacity: 0, duration: 1, onComplete: () => {
        introEl.style.display = 'none';
        window.deckActive = true;
        deckEl.style.visibility = 'visible';
        gsap.to(deckEl, { opacity: 1, duration: 0.6, ease: 'power2.out' });
        gsap.to([dotsEl, hintEl, counterEl], { opacity: 1, duration: 0.6, delay: 0.3 });
        setTimeout(() => window.staggerIn(window.slides[0], 1), 350);
        window.updateHUD(0);
        const hide = () => gsap.to(hintEl, { opacity: 0, duration: 0.4 });
        window.addEventListener('wheel', hide, { once: true });
        window.addEventListener('keydown', hide, { once: true });
        window.addEventListener('touchend', hide, { once: true });
    }});
};



  /* ─ SLIDES ─ */
  gsap.registerPlugin(ScrollTrigger);
  const TOTAL=11;
  window.cur=0; window.busy=false;

  window.slides=Array.from(document.querySelectorAll('.slide'));
  const deckEl=document.getElementById('deck');
  const dotsEl=document.getElementById('dots');
  const hintEl=document.getElementById('hint');
  const counterEl=document.getElementById('counter');

  window.slides.forEach((s,i)=>gsap.set(s,{y:i===0?'0%':'100%',zIndex:TOTAL-i}));
  window.slides.forEach(s=>{
    const items=Array.from(s.querySelectorAll('.e'));
    gsap.set(items,{opacity:0,y:20,filter:'blur(4px)'});
  });
  window.slides.forEach((_,i)=>{
    const d=document.createElement('div');
    d.className='dot'+(i===0?' active':'');
    d.addEventListener('click',()=>goTo(i));
    dotsEl.appendChild(d);
  });

  window.updateHUD = function(i){
    document.querySelectorAll('.dot').forEach((d,j)=>d.classList.toggle('active',j===i));
    counterEl.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b> / ${String(TOTAL).padStart(2,'0')}`;
  }

  window.staggerIn = function(slide,dir){
    const fromY=(dir>=0)?22:-22;
    const items=Array.from(slide.querySelectorAll('.e'));
    gsap.killTweensOf(items);
    gsap.set(items,{opacity:0,y:fromY,filter:'blur(4px)'});
    gsap.to(items,{opacity:1,y:0,filter:'blur(0px)',duration:.65,stagger:.08,ease:'power3.out'});
    slide.querySelectorAll('.gantt-bar').forEach((bar,idx)=>{
      gsap.set(bar,{scaleX:0,transformOrigin:'left center'});
      gsap.to(bar,{scaleX:1,duration:.7,ease:'power3.out',delay:.5+idx*.07});
    });
  }

  function staggerOut(slide,dir){
    const items=Array.from(slide.querySelectorAll('.e'));
    gsap.killTweensOf(items);
    gsap.to(items,{opacity:0,y:dir>0?-16:16,filter:'blur(3px)',duration:.28,stagger:.02,ease:'power2.in'});
  }

  function goTo(next){
    if(!window.deckActive || window.busy||next===window.cur||next<0||next>=TOTAL)return;
    window.busy=true;
    const dir=next>window.cur?1:-1;
    const entering=window.slides[next],leaving=window.slides[window.cur];
    const enterItems=Array.from(entering.querySelectorAll('.e'));
    gsap.set(enterItems,{opacity:0,y:dir>0?22:-22,filter:'blur(4px)'});
    gsap.set(entering,{y:dir>0?'100%':'-100%',zIndex:TOTAL-next});
    gsap.set(leaving,{zIndex:TOTAL-window.cur});
    staggerOut(leaving,dir);
    gsap.to(entering,{
      y:'0%',duration:.82,ease:'expo.inOut',
      onComplete:()=>{
        window.staggerIn(entering,dir);
        gsap.set(leaving,{y:dir>0?'-100%':'100%'});
        window.cur=next;window.busy=false;window.updateHUD(window.cur);
      }
    });
  }

  let wt=null,lastDelta=0;
  window.addEventListener('wheel',e=>{
    if(!window.deckActive || wt)return;
    lastDelta=e.deltaY;
    wt=setTimeout(()=>{
      if(lastDelta>0) goTo(window.cur+1);
      else if(lastDelta<0) goTo(window.cur-1);
      wt=null;
    },80);
  },{passive:true});

  let ty=0;
  window.addEventListener('touchstart',e=>{ if(!window.deckActive) return; ty=e.touches[0].clientY;},{passive:true});
  window.addEventListener('touchend',e=>{ if(!window.deckActive) return; 
    const d=ty-e.changedTouches[0].clientY;
    if(Math.abs(d)>42){if(d>0)goTo(window.cur+1);else goTo(window.cur-1);}
  },{passive:true});

  window.addEventListener('keydown',e=>{ if(!window.deckActive) return; 
    if(['ArrowDown','ArrowRight','PageDown'].includes(e.key)){e.preventDefault();goTo(window.cur+1);}
    if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();goTo(window.cur-1);}
  });

// --- OUTRO HOVER DELEGATION ---
let currentHoverImg = null;

document.addEventListener('mouseover', e => {
    const icon = e.target.closest('.oc-center-icon');
    if (icon) {
        const card = icon.closest('.outro-card');
        const hoverPreview = document.getElementById('outro-hover-preview');
        const previewImg = hoverPreview?.querySelector('img');
        const imgSrc = card?.getAttribute('data-img');
        
        if (imgSrc && previewImg && imgSrc !== currentHoverImg) {
            currentHoverImg = imgSrc;
            
            // Si ya está visible, fade out rápido para limpiar la imagen anterior
            const isVisible = gsap.getProperty(hoverPreview, "opacity") > 0.1;
            
            gsap.to(hoverPreview, {
                opacity: 0,
                scale: isVisible ? 0.98 : 0.9,
                duration: isVisible ? 0.15 : 0,
                overwrite: true,
                onComplete: () => {
                    previewImg.src = imgSrc;
                    // Pequeño delay para asegurar que el navegador empiece a procesar la nueva imagen
                    requestAnimationFrame(() => {
                        gsap.to(hoverPreview, {
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                            duration: 0.9,
                            ease: "power2.out",
                            xPercent: -50,
                            yPercent: -50
                        });
                    });
                }
            });
        }
    }
});

document.addEventListener('mouseout', e => {
    const icon = e.target.closest('.oc-center-icon');
    if (icon) {
        // Evitamos el parpadeo si nos movemos entre elementos del mismo icono
        if (!e.relatedTarget || !e.relatedTarget.closest('.oc-center-icon')) {
            const hoverPreview = document.getElementById('outro-hover-preview');
            currentHoverImg = null;
            if (hoverPreview) {
                gsap.to(hoverPreview, {
                    opacity: 0,
                    scale: 1.05,
                    filter: "blur(20px)",
                    duration: 0.7,
                    ease: "power2.inOut",
                    xPercent: -50,
                    yPercent: -50,
                    overwrite: true
                });
            }
        }
    }
});

// --- PYRAMID INFO BOX LOGIC ---
document.addEventListener('mouseover', e => {
    const level = e.target.closest('.pyr-level');
    if (level) {
        const infoBox = document.getElementById('pyr-info-box');
        const infoText = level.getAttribute('data-info');
        if (infoBox && infoText) {
            infoBox.textContent = infoText;
            infoBox.classList.add('active');
        }
    }
});
document.addEventListener('mouseout', e => {
    const level = e.target.closest('.pyr-level');
    if (level) {
        const infoBox = document.getElementById('pyr-info-box');
        if (infoBox) infoBox.classList.remove('active');
    }
});





// ─── ACTIVE NAV LINK ON SCROLL ───
(function() {
    const sections = ['nosotros', 'arquitectura', 'vision-box', 'caracteristicas', 'consultas'];
    const links = document.querySelectorAll('.nb-link');
    if (!links.length) return;

    function setActive() {
        let current = '';
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 140) current = id;
        });
        links.forEach(l => {
            const href = l.getAttribute('href');
            l.classList.toggle('active', href === '#' + current);
        });
    }
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
})();

document.addEventListener('mouseout', e => {
    const level = e.target.closest('.pyr-level');
    if (level) {
        const infoBox = document.getElementById('pyr-info-box');
        if (infoBox) infoBox.classList.remove('active');
    }
});

// ─── STEP SLIDER AUTO-PLAY ───
(function() {
    const tabs = document.querySelectorAll('.step-tab');
    const panels = document.querySelectorAll('.step-visual-panel');
    const contents = document.querySelectorAll('.step-content');
    if (!tabs.length) return;

    let currentStep = 0;
    let intervalId = null;
    const DURATION = 4000; // 4 seconds per step

    function goToStep(index) {
        // Remove active from all
        tabs.forEach(t => {
            t.classList.remove('active');
            // Reset fill animation
            const fill = t.querySelector('.step-tab-fill');
            if (fill) {
                fill.style.animation = 'none';
                fill.offsetHeight; // force reflow
                fill.style.animation = '';
            }
        });
        panels.forEach(p => p.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Activate target
        tabs[index].classList.add('active');
        panels[index].classList.add('active');
        contents[index].classList.add('active');

        const columns = document.querySelectorAll('.step-column');
        columns.forEach((col, i) => {
            col.classList.toggle('active', i === index);
        });

        // Update tab label format
        tabs.forEach((t, i) => {
            const label = t.querySelector('.step-tab-label');
            const dataLabel = t.getAttribute('data-label');
            if (label && dataLabel) {
                label.textContent = dataLabel;
            }
        });

        currentStep = index;
    }

    function nextStep() {
        goToStep((currentStep + 1) % tabs.length);
    }

    function startAutoPlay() {
        stopAutoPlay();
        intervalId = setInterval(nextStep, DURATION);
    }

    function stopAutoPlay() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Click handlers
    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            goToStep(i);
            startAutoPlay(); // restart timer
        });
    });

    // Start auto-play
    goToStep(0);
    startAutoPlay();
})();

// ─── ARCH LIGHTBOX ───
(function() {
    const overlay = document.getElementById('arch-lightbox');
    const closeBtn = document.getElementById('arch-lb-close');
    if (!overlay) return;

    const lbNum = document.getElementById('arch-lb-num');
    const lbTitle = document.getElementById('arch-lb-title');
    const lbDesc = document.getElementById('arch-lb-desc');

    const cardData = [
        {
            num: '01.',
            title: 'Cámara IP',
            desc: 'Ingreso de la señal de vídeo en vivo (24/7) mediante protocolo RTSP. Soporte para hasta 4 canales simultáneos en resolución HD.',
            tags: ['RTSP', '24/7', 'HD', '4 canales']
        },
        {
            num: '02.',
            title: 'OmniBox (Edge)',
            desc: 'Decodifica el video localmente con la NPU de la SBC D-Robotics RDK X5 sin enviar datos a internet. Procesamiento 100% soberano.',
            tags: ['RDK X5', 'NPU', 'Local', 'Fanless']
        },
        {
            num: '03.',
            title: 'Motor de Visión',
            desc: 'Procesamiento paralelo con OpenCV y YOLOv8 detectando personas y objetos en tiempo real con 99.7% de precisión.',
            tags: ['YOLOv8', 'OpenCV', 'Tiempo Real', '99.7%']
        },
        {
            num: '04.',
            title: 'Gemini LLM',
            desc: 'Un modelo de lenguaje describe y contextualiza la escena de las alertas para dar más información al operador.',
            tags: ['Gemini', 'LLM', 'Contexto', 'NLP']
        },
        {
            num: '05.',
            title: 'API + BFF',
            desc: 'Orquestación y distribución segura de datos a través de FastAPI y NestJS. Comunicación vía WebSocket en < 3ms.',
            tags: ['FastAPI', 'NestJS', 'WebSocket', '< 3ms']
        },
        {
            num: '06.',
            title: 'Panel Next.js',
            desc: 'Visualización en vivo de KPIs y clips de alertas con bounding boxes para el operador. Interfaz responsiva y en tiempo real.',
            tags: ['Next.js', 'KPIs', 'Alertas', 'Live']
        }
    ];

    function openLightbox(index) {
        const d = cardData[index];
        if (!d) return;
        lbNum.textContent = d.num;
        lbTitle.textContent = d.title;
        lbDesc.textContent = d.desc;

        // Update tags
        const tagsEl = overlay.querySelector('.arch-lb-tags');
        tagsEl.innerHTML = d.tags.map(t => `<span class="arch-lb-tag">${t}</span>`).join('');

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Pipeline cards open lightbox on click
    document.querySelectorAll('.pipeline-card').forEach((card, idx) => {
        card.addEventListener('click', () => openLightbox(idx));
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
    });
})();

// ─── FEATURES SLIDER ───
(function() {
    const slides = document.querySelectorAll('.feat-slide');
    const tabs = document.querySelectorAll('.feat-tab');
    const prevBtn = document.getElementById('featPrev');
    const nextBtn = document.getElementById('featNext');
    const progressFill = document.getElementById('featProgressFill');
    if (!slides.length) return;

    let current = 0;
    let autoTimer = null;
    let progressTimer = null;
    const DURATION = 5000;

    function goTo(idx, fromAuto) {
        if (idx === current && !fromAuto) return;
        const prev = current;
        current = (idx + slides.length) % slides.length;

        slides[prev].classList.remove('active');
        slides[prev].classList.add('exit');
        setTimeout(() => slides[prev].classList.remove('exit'), 700);

        slides[current].classList.add('active');

        tabs.forEach((t, i) => t.classList.toggle('active', i === current));

        // Update progress
        if (progressFill) {
            progressFill.style.transition = 'none';
            progressFill.style.width = ((current + 1) / slides.length * 100) + '%';
        }
    }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => goTo(current + 1, true), DURATION);
    }

    function stopAuto() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            goTo(i);
            startAuto();
        });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    // Init
    goTo(0, true);
    startAuto();
})();

// ─── CONSULTAS ACCORDION (BLCK style) ───
(function() {
    const items = document.querySelectorAll('.consulta-item');
    items.forEach(item => {
        const btn = item.querySelector('.consulta-btn');
        const body = item.querySelector('.consulta-body');
        if (!btn || !body) return;

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            items.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    const b = other.querySelector('.consulta-body');
                    if (b) b.style.maxHeight = null;
                }
            });

            if (isActive) {
                item.classList.remove('active');
                body.style.maxHeight = null;
            } else {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
})();

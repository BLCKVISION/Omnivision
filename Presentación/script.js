
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


    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const nav = document.querySelector("nav");
    const header = document.querySelector(".header");
    const heroImg = document.querySelector(".hero-img");
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
    gsap.set(nav,          { opacity: 0, y: 20 });
    gsap.set(".header > *",{ opacity: 0, y: 28, filter: "blur(6px)" });
    gsap.set(heroImg,      { scale: 1.8, opacity: 0, transformOrigin: "center center" });

    // ─── LOADER TIMELINE ───
    gsap.timeline({
        onComplete: () => { loaderReady = true; checkReady(); }
    })
    // Logo aparece
    .to("#loader-logo", { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
    // Mantiene visible
    .to({}, { duration: 0.9 })
    // Logo se desvanece
    .to("#loader-logo", { opacity: 0, y: -10, duration: 0.3, ease: "power2.in" })
    // Cortina sube de abajo hacia arriba cubriendo todo
    .to("#loader-curtain", { yPercent: -100, duration: 0.75, ease: "power3.inOut" }, "-=0.05")
    // Oculta loader
    .set("#loader", { display: "none" });

    // ─── HERO ENTRANCE (se ejecuta cuando loader + imágenes están listos) ───
    function animateHeroIn() {
        gsap.timeline({ onComplete: setupScrollTrigger })
            // 1. Logo (nav) sube
            .to(nav, {
                opacity: 1, y: 0,
                duration: 0.65, ease: "power3.out"
            })
            // 2. Elementos del header en stagger: h1 → sub → cta
            .to(".header > *", {
                opacity: 1, y: 0, filter: "blur(0px)",
                duration: 0.7, stagger: 0.13, ease: "power3.out"
            }, "-=0.3");
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
            end: `+=${window.innerHeight * 15}px`,   // suficiente para los 200 frames completos
            pin: true,
            pinSpacing: true,
            scrub: 0.2,                               // rápido, llega al frame 200
            onUpdate: (self) => {
                const p = self.progress;

                // ── FRAMES: usa el rango completo (0→1) ──
                const targetFrame = Math.min(Math.round(p * (frameCount - 1)), frameCount - 1);
                videoFrames.frame = targetFrame;
                render();

                // ── NAV / LOGO: baja y desaparece (0→0.18) — está en la parte inferior ──
                if (p <= 0.18) {
                    const t = p / 0.18;
                    gsap.set(nav, { opacity: 1 - t, y: t * 40 });
                } else {
                    gsap.set(nav, { opacity: 0, y: 40 });
                }

                // ── HEADER: sube y desaparece (0→0.28) ──
                if (p <= 0.28) {
                    const t = p / 0.28;
                    gsap.set(header, { opacity: 1 - t, y: -t * 100 });
                } else {
                    gsap.set(header, { opacity: 0, y: -100 });
                }

                // ── DASHBOARD: empieza GRANDE (1.8x) → llega a 1x ──
                // Opacity lenta: ~20% a mitad del recorrido, 100% al final
                // Curva: opacity = clamp(1.2·t² − 0.2·t, 0, 1)
                if (p < 0.55) {
                    gsap.set(heroImg, { scale: 1.8, opacity: 0, transformOrigin: "center center" });
                } else if (p >= 0.55 && p <= 0.95) {
                    const t       = (p - 0.55) / 0.4;                  // 0→1 en ese tramo
                    const scale   = 1.8 - t * 0.8;                      // 1.8→1.0
                    const opacity = Math.max(0, Math.min(1, 1.2 * t * t - 0.2 * t));
                    gsap.set(heroImg, { scale, opacity, transformOrigin: "center center" });
                } else {
                    gsap.set(heroImg, { scale: 1, opacity: 1, transformOrigin: "center center" });
                }
            },
        });

        // ── OUTRO STAGGER ──
        gsap.set(".ot", { y: 30, opacity: 0, filter: "blur(4px)" });
        ScrollTrigger.create({
            trigger: ".outro",
            start: "top 70%", // starts when the top of the outro hits 70% of the viewport height
            onEnter: () => {
                gsap.to(".ot", {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out"
                });
            },
            once: true // animate only once
        });
    };

    window.addEventListener("resize", () => {
        setcanvassize();
        render();
        ScrollTrigger.refresh();
    });
});
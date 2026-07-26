const fs = require('fs');

const omniHTML = fs.readFileSync('Omni.html', 'utf8');
const omniCSS = fs.readFileSync('style.css', 'utf8');
const omniJS = fs.readFileSync('script.js', 'utf8');

const pageHTML = fs.readFileSync('page.html', 'utf8');

// --- 1. HTML ---
// Get the Omni body (without script tags)
const omniBody = omniHTML.match(/<body>([\s\S]*?)<!-- CDN Dependencies -->/)[1];

// Get page deck, dots, counter, hint
const deckMatch = pageHTML.match(/<div id="deck">([\s\S]*?)<\/div><!-- \/#deck -->/)[1];
const dotsHUD = pageHTML.match(/<div id="dots">[\s\S]*?<div id="counter">.*?<\/div>/)[0];

// Remove slide 0 from deck Match
let newDeck = deckMatch.replace(/<!-- 0 · PORTADA -->[\s\S]*?(?=<!-- 1 · DESCRIPCIÓN Y PROPÓSITO -->)/, '');

// Since we removed slide 0, let's just keep data-i as is or rewrite them? 
// It's cleaner to let JS just grab them by array index, page JS uses array indices for goTo so data-i doesn't actually matter for JS logic.

let visionHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OmniVision — Presentation</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="vision.css">
</head>
<body>
    <div id="omni-view">
${omniBody}
    </div>

    <!-- PAGE VIEW -->
    <div id="deck">
${newDeck}
    </div><!-- /#deck -->
${dotsHUD}

    <!-- CDN Dependencies -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>

    <script src="vision.js"></script>
</body>
</html>`;
fs.writeFileSync('vision.html', visionHTML);

// --- 2. CSS ---
let pageCSS = pageHTML.match(/<style>([\s\S]*?)<\/style>/)[1];

// We ONLY want the slide components from pageCSS, avoiding global body conflicts and Intro/Loader
// Easiest is to keep exactly what's needed.
pageCSS = pageCSS.replace(/\*,[^}]+\{[^}]+\}/g, ''); // no resets
pageCSS = pageCSS.replace(/:root\s*\{([^}]+)\}/g, ''); // no root
pageCSS = pageCSS.replace(/@font-face\s*\{([^}]+)\}/g, ''); // no local fonts
pageCSS = pageCSS.replace(/html\s*\{[^}]+\}/g, ''); 
// remove body carefully
pageCSS = pageCSS.replace(/body\s*\{[^}]+\}/g, ''); 

// remove Intro and Loader
pageCSS = pageCSS.replace(/#intro[^{]*\{[^}]+\}/g, '');
pageCSS = pageCSS.replace(/\.intro-logo[^{]*\{[^}]+\}/g, '');
pageCSS = pageCSS.replace(/#click-prompt[^{]*\{[^}]+\}/g, '');
pageCSS = pageCSS.replace(/#loader[^{]*\{[^}]+\}/g, '');
pageCSS = pageCSS.replace(/\.loader-track[^{]*\{[^}]+\}/g, '');
pageCSS = pageCSS.replace(/\.loader-fill[^{]*\{[^}]+\}/g, '');

let combinedCSS = omniCSS + "\n/* --- PAGE STYLES --- */\n" + pageCSS;
// Replace fonts
combinedCSS = combinedCSS.replace(/font-family:\s*"Inter",.*?;/g, 'font-family: "Host Grotesk", sans-serif;');
combinedCSS = combinedCSS.replace(/font-family:\s*'MR',\s*sans-serif;/g, 'font-family: "Host Grotesk", sans-serif; font-weight: 500;');
combinedCSS = combinedCSS.replace(/font-family:\s*MR,\s*sans-serif;/g, 'font-family: "Host Grotesk", sans-serif; font-weight: 500;');
combinedCSS = combinedCSS.replace(/font-family:\s*'ML',\s*sans-serif;/g, 'font-family: "Host Grotesk", sans-serif; font-weight: 400;');
combinedCSS = combinedCSS.replace(/font-family:\s*ML,\s*sans-serif;/g, 'font-family: "Host Grotesk", sans-serif; font-weight: 400;');

fs.writeFileSync('vision.css', combinedCSS);


// --- 3. JS ---
let pageJS = pageHTML.match(/<script>([\s\S]*?)<\/script>/)[1];

// Strip IIFE
pageJS = pageJS.replace(/\(function\(\)\{/g, '').replace(/\}\)\(\);/g, ''); 
// Strip page cursor (omni already has cursor)
pageJS = pageJS.replace(/\/\* ─ CURSOR ─ \*\/[\s\S]*?(?=\/\* ─ Intro ─ \*\/)/m, '');
// Strip page Intro
pageJS = pageJS.replace(/\/\* ─ Intro ─ \*\/[\s\S]*?(?=\/\* ─ SLIDES ─ \*\/)/m, '');

// Adjust logic to wait for Omni to finish
let deckLogic = `

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
`;

// Modify pageJS logic to expose functions to window and gate behind deckActive
pageJS = pageJS.replace('const TOTAL=12;', 'const TOTAL=11;');
pageJS = pageJS.replace('let cur=0,busy=false;', 'window.cur=0; window.busy=false;');
pageJS = pageJS.replace('const slides=Array.from', 'window.slides=Array.from');
pageJS = pageJS.replace(/slides\.forEach/g, 'window.slides.forEach');
pageJS = pageJS.replace('function updateHUD', 'window.updateHUD = function');
pageJS = pageJS.replace('function staggerIn', 'window.staggerIn = function');
pageJS = pageJS.replace('if(busy', 'if(!window.deckActive || window.busy');
pageJS = pageJS.replace(/busy=/g, 'window.busy=');
pageJS = pageJS.replace('const entering=slides', 'const entering=window.slides');
pageJS = pageJS.replace(/cur=/g, 'window.cur=');
pageJS = pageJS.replace(/updateHUD\(/g, 'window.updateHUD(');
pageJS = pageJS.replace(/staggerIn\(/g, 'window.staggerIn(');
pageJS = pageJS.replace(/next===cur/g, 'next===window.cur');
pageJS = pageJS.replace(/next>cur/g, 'next>window.cur');
pageJS = pageJS.replace(/slides\[cur\]/g, 'window.slides[window.cur]');
pageJS = pageJS.replace(/TOTAL-cur/g, 'TOTAL-window.cur');
pageJS = pageJS.replace(/goTo\(cur/g, 'goTo(window.cur');
pageJS = pageJS.replace('if(wt)return;', 'if(!window.deckActive || wt)return;');
pageJS = pageJS.replace("window.addEventListener('touchstart',e=>{", "window.addEventListener('touchstart',e=>{ if(!window.deckActive) return; ");
pageJS = pageJS.replace("window.addEventListener('touchend',e=>{", "window.addEventListener('touchend',e=>{ if(!window.deckActive) return; ");
pageJS = pageJS.replace("window.addEventListener('keydown',e=>{", "window.addEventListener('keydown',e=>{ if(!window.deckActive) return; ");

let modifiedOmniJS = omniJS.replace('const lenis = new Lenis();', 'window.lenis = new Lenis();');
modifiedOmniJS = modifiedOmniJS.replace('lenis.on', 'window.lenis.on').replace('lenis.raf', 'window.lenis.raf');
modifiedOmniJS = modifiedOmniJS.replace(/once:\s*true\s*\/\/\s*animate only once/g, 'once: true');

// Add the intersection transition to Omni
modifiedOmniJS = modifiedOmniJS.replace(
    'window.addEventListener("resize", () => {', 
    `// ── TRANSITION TO DECK ──
    ScrollTrigger.create({
        trigger: ".outro",
        start: "bottom bottom",
        onEnter: () => {
            setTimeout(() => window.startDeck(), 300);
        },
        once: true
    });

    window.addEventListener("resize", () => {`
);

let combinedJS = modifiedOmniJS + "\\n\\n" + deckLogic + "\\n\\n" + pageJS;

// Fix counter HTML
combinedJS = combinedJS.replace('/ 12', '/ 11');

fs.writeFileSync('vision.js', combinedJS);
console.log('Build complete');

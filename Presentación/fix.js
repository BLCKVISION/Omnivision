const fs = require('fs');

let js = fs.readFileSync('vision.js', 'utf8');

const regex = /    };\r?\n\r?\n    \/\/ ── TRANSITION TO DECK ──\r?\n    ScrollTrigger\.create\({[\s\S]*?once: true\r?\n    }\);\r?\n\r?\n    window\.addEventListener\("resize", \(\) => {/;

const replacement = `        // ── TRANSITION TO DECK ──
        ScrollTrigger.create({
            trigger: ".outro",
            start: "bottom bottom",
            onEnter: () => {
                setTimeout(() => window.startDeck(), 300);
            },
            once: true
        });
    };

    window.addEventListener("resize", () => {`;

js = js.replace(regex, replacement);

fs.writeFileSync('vision.js', js);
console.log('Fixed ScrollTrigger position');

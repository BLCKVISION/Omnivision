'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import Image from 'next/image';

// ─── Fuente ────────────────────────────────────────────────────────────────────
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

// ─────────────────────────────────────────────────────────────────────────────
// 📁 IMAGEN DE FONDO — INSTRUCCIONES
//
//   1. Coloca tu imagen en:
//        omnivision-frontend/public/login-bg.jpg
//      (también acepta .png, .webp, .avif)
//
//   2. Dimensiones recomendadas: 900×1200 px o más alta que ancha (portrait)
//      para que llene bien la tarjeta vertical.
//
//   3. Nombres válidos:
//        /login-bg.jpg   → NEXT_PUBLIC_LOGIN_BG no requerida (default)
//        /login-bg.webp  → cambia la constante BG_SRC abajo
//
//   Si NO hay imagen, el panel muestra el gradiente oscuro cinematográfico.
// ─────────────────────────────────────────────────────────────────────────────
const BG_SRC = '/login-bg.jpg'; // ← Cambia esto si usas otro nombre/formato

// ─── Íconos SVG ───────────────────────────────────────────────────────────────
const CameraIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const WarningIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: '1px' }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ─── Input con label flotante ─────────────────────────────────────────────────
function FloatingInput({ id, label, type, value, onChange, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <label htmlFor={id} style={{
        position: 'absolute',
        left: '16px',
        top: isActive ? '8px' : '50%',
        transform: isActive ? 'translateY(0)' : 'translateY(-50%)',
        fontSize: isActive ? '10px' : '13px',
        color: focused ? '#888' : '#444',
        letterSpacing: isActive ? '1.5px' : '0.3px',
        transition: 'all 0.2s ease',
        pointerEvents: 'none',
        zIndex: 1,
        fontFamily: 'inherit',
        lineHeight: 1,
      }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          background: focused ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '22px 16px 8px 16px',
          color: '#f7f8f8',
          fontSize: '14px',
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
        }}
      />
    </div>
  );
}

// ─── Input contraseña con ojo ──────────────────────────────────────────────────
function PasswordInput({ id, label, value, onChange, showPassword, onToggle }) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <label htmlFor={id} style={{
        position: 'absolute',
        left: '16px',
        top: isActive ? '8px' : '50%',
        transform: isActive ? 'translateY(0)' : 'translateY(-50%)',
        fontSize: isActive ? '10px' : '13px',
        color: focused ? '#888' : '#444',
        letterSpacing: isActive ? '1.5px' : '0.3px',
        transition: 'all 0.2s ease',
        pointerEvents: 'none',
        zIndex: 1,
        fontFamily: 'inherit',
        lineHeight: 1,
      }}>
        {label}
      </label>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="new-password"
        style={{
          width: '100%',
          background: focused ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '22px 48px 8px 16px',
          color: '#f7f8f8',
          fontSize: '14px',
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
        }}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        style={{
          position: 'absolute', right: '14px', top: '50%',
          transform: 'translateY(-50%)', background: 'none', border: 'none',
          cursor: 'pointer', color: '#444', display: 'flex',
          alignItems: 'center', padding: '4px', transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#888'}
        onMouseLeave={e => e.currentTarget.style.color = '#444'}
      >
        <EyeIcon open={showPassword} />
      </button>
    </div>
  );
}

// ─── Página LoginPage ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [hasImage, setHasImage] = useState(true);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [exitAnim, setExitAnim] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [splash, setSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let rafId;
    const updateTrail = () => {
      setTrailPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.15,
        y: prev.y + (mousePos.y - prev.y) * 0.15,
      }));
      rafId = requestAnimationFrame(updateTrail);
    };
    rafId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [mousePos]);

  useEffect(() => {
    const token = localStorage.getItem('omnivision_token');
    if (token) { 
      router.push('/dashboard'); 
    }
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    // --- MOCK LOGIN BYPASS ---
    // Como aún no tienes base de datos, entra directamente con estas credenciales:
    if (email.trim().toLowerCase() === 'admin' && password.trim() === 'admin') {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify({ name: "Administrador AI", email: "admin@omnivision.net", sub: "admin" }));
      const token = `${header}.${payload}.mocksignature`;
      localStorage.setItem('omnivision_token', token);
      document.cookie = `omnivision_token=${token}; path=/`;
      setExitAnim(true);
      setTimeout(() => setShowOverlay(true), 150);
      setTimeout(() => { router.push('/dashboard'); }, 200);
      return;
    }
    // -------------------------

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { name, email, password };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        localStorage.setItem('omnivision_token', data.access_token);
        document.cookie = `omnivision_token=${data.access_token}; path=/`;
        setExitAnim(true);
        setTimeout(() => setShowOverlay(true), 150);
        setTimeout(() => { router.push('/dashboard'); }, 200);
      } else {
        setError(data.detail || 'Credenciales incorrectas. Verifica e intenta de nuevo.');
      }
    } catch {
      setError('Error de conexión. Comprueba que el servidor esté activo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @font-face { font-family: 'MR'; src: url('/fonts/MR.otf') format('opentype'); }
        @font-face { font-family: 'ML'; src: url('/fonts/ML.otf') format('opentype'); }
        @font-face { font-family: 'MB'; src: url('/fonts/MB.otf') format('opentype'); }
        @keyframes gridPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes scanLine  { 0%{top:-2px} 100%{top:100%} }
        * { box-sizing: border-box; cursor: none !important; }
        .custom-cursor {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.1s ease-out, opacity 0.2s ease;
        }
        @keyframes loadingBar {
          0% { width: 0%; left: 0; }
          50% { width: 60%; left: 20%; }
          100% { width: 100%; left: 0%; }
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .anim-left    { animation: fadeInLeft  0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .anim-form    { animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 150ms both; }
        .anim-field-1 { animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 200ms both; }
        .anim-field-2 { animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 250ms both; }
        .anim-field-3 { animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 300ms both; }
        .anim-btn     { animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 350ms both; }

        @keyframes formExit {
          from { opacity:1; transform:translateY(0) scale(1); }
          to   { opacity:0; transform:translateY(-10px) scale(0.97); }
        }
        @keyframes overlayIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes splashLogo {
          0% { transform: scale(0.95); opacity: 0; }
          20% { transform: scale(1); opacity: 1; }
          80% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.05); opacity: 0; }
        }
      `}</style>

      {/* ── SPLASH INICIAL (4s) ── */}
      {splash && (
        <div style={{
          position: 'fixed', inset: 0, background: '#08090a', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src="/logos/Isotipo 2.png" alt="Logotipo" style={{
            width: '64px', height: '64px', objectFit: 'contain',
            animation: 'splashLogo 4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }} />
        </div>
      )}

      {/* ── OVERLAY DE TRANSICIÓN HACIA DASHBOARD ── */}
      {showOverlay && (
        <div style={{
          position:'fixed',inset:0,background:'#08090a',zIndex:9999,
          animation:'overlayIn 0.4s ease forwards',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src="/logos/Isotipo 2.png" alt="Cargando" style={{
            width: '64px', height: '64px', objectFit: 'contain',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      )}

      {/* ── LOADER DE AUTENTICACIÓN (fallback antiguo) ── */}
      {false && (
        <div style={{
          height: '100vh', width: '100vw', background: '#0a0a0a',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'inherit', position: 'fixed', top: 0, left: 0, zIndex: 1000
        }}>
          {/* Logo Placeholder */}
          <div style={{ marginBottom: '24px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="11" r="3" fill="#fff" />
            </svg>
          </div>
          
          <div style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#666', marginBottom: '20px' }}>
            Estableciendo conexión segura...
          </div>
          
          {/* Barra de progreso */}
          <div style={{ width: '220px', height: '1px', background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, background: '#fff',
              animation: 'loadingBar 2.5s ease-in-out infinite'
            }} />
          </div>
        </div>
      )}

      {!splash && (
        <div style={{
          minHeight: '100vh',
          width: '100vw',
          background: '#08090a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: inter.style.fontFamily,
          overflow: 'hidden',
          position: 'relative',
        }}>

          {/* ════════════════════════════════════════════════════════════════════
              LAYOUT PRINCIPAL — dos columnas centradas
          ════════════════════════════════════════════════════════════════════ */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1100px',
            padding: '0 24px',
            gap: '0',
            height: '100vh',
          }}>

            {/* ══════════════════════════════════════════════════════════════
                COLUMNA IZQUIERDA — Tarjeta flotante (estilo referencia)
                Oculta en mobile
            ══════════════════════════════════════════════════════════════ */}
            <div
              className="hidden md:block anim-left"
              style={{
                // La tarjeta flota con márgenes verticales (igual que la referencia)
                width: '480px',
                minWidth: '400px',
                height: 'calc(100vh - 48px)',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                // Sombra exterior sutil y mejorada
                boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)',
              }}
            >
              {/* ── Fondo: imagen o gradiente de fallback ── */}
              {hasImage ? (
                <Image
                  src={BG_SRC}
                  alt="OmniVision background"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  priority
                  unoptimized={true}
                  onError={() => setHasImage(false)}
                />
              ) : (
                // Fallback: gradiente cinematográfico oscuro
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(160deg, #141414 0%, #1e1e1e 45%, #0d0d0d 100%)',
                }} />
              )}

              {/* ── Overlay oscuro base para el contenido siempre legible (arriba y abajo) ── */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.85) 100%)',
                pointerEvents: 'none',
              }} />

              {/* ── Degradado derecho: se "derrama" hacia el fondo ── */}
              {/* Este es el efecto clave de la referencia: el borde derecho */}
              {/* se disuelve en el negro del fondo exterior */}
              <div style={{
                position: 'absolute',
                top: 0, right: 0, bottom: 0,
                width: '120px',
                background: 'linear-gradient(to right, transparent, #08090a)',
                pointerEvents: 'none',
              }} />

              {/* ── Grid HUD sutil encima ── */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                animation: 'gridPulse 8s ease-in-out infinite',
              }} />

              {/* ── Línea de escaneo ── */}
              <div style={{
                position: 'absolute', left: 0, right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                animation: 'scanLine 10s linear infinite',
              }} />

              {/* ── Indicador Superior ── */}
              <div style={{
                position: 'absolute', top: '24px', left: '24px', right: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                zIndex: 3,
              }}>
                <p style={{
                  margin: 0, color: 'rgba(255,255,255,0.4)',
                  fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                }}>
                  Computer Vision &amp; AI
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: '#2ecc71',
                    boxShadow: '0 0 6px rgba(46,204,113,0.7)',
                  }} />
                  <span style={{
                    color: 'rgba(255,255,255,0.4)', fontSize: '9px',
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                  }}>ONLINE</span>
                </div>
              </div>

              {/* ── Slogan Inferior ── */}
              <div style={{
                position: 'absolute', bottom: '40px', left: '0', right: '0',
                display: 'flex', justifyContent: 'center', textAlign: 'center',
                zIndex: 3,
              }}>
                <div style={{ 
                  fontSize: '14px', color: '#f7f8f8', letterSpacing:'0.5px', lineHeight: 1.1, fontFamily: 'ML, sans-serif',
                  textShadow: '0 0 12px rgba(255,255,255,0.7), 0 0 32px rgba(255,255,255,0.4)'
                }}>
                  La <span style={{ fontFamily: 'MR, sans-serif' }}>Mirada</span> que,
                  <span style={{ fontFamily: 'MR, sans-serif' }}> Nunca Duerme</span>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                COLUMNA DERECHA — Formulario (espacio restante)
            ══════════════════════════════════════════════════════════════ */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 48px 0 60px',
              height: '100vh',
              overflowY: 'auto',
            }}>

              {/* Bloque animado del formulario */}
              <div className="anim-form" style={{
                width: '100%',
                maxWidth: '400px',
                animation: exitAnim ? 'formExit 0.3s ease forwards' : undefined,
              }}>

                {/* ── Logo ── */}
                <div style={{ marginBottom: '64px' }}>
                  <img src="/logos/Logotipo 3.png" alt="Logotipo" style={{ height: '36px', objectFit: 'contain' }} />
                </div>
                {/* ── Título ── */}
                <h1 style={{
                  margin: '0 0 10px 0', fontSize: '43px', fontWeight: 500,
                  color: '#f7f8f8', letterSpacing: '-0.5px', lineHeight: 1.2,
                  fontFamily: 'MR, sans-serif'
                }}>
                  {isLogin ? 'Bienvenido' : 'Nuevo Acceso'}
                </h1>

                {/* ── Subtítulo ── */}
                <p style={{
                  margin: '0 0 40px 0', fontSize: '12px', color: '#8a8f98',
                  letterSpacing: '0.3px', fontWeight: 400,
                  fontFamily: 'ML, sans-serif'
                }}>
                  {isLogin ? 'Crea tu acceso al sistema de monitoreo inteligente' : 'Registra un nuevo usuario para operar el sistema'}
                </p>

                {/* ── Formulario ── */}
                <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {!isLogin && (
                    <div className="anim-field-1">
                      <FloatingInput
                        id="login-name" label="Nombre completo" type="text"
                        value={name} onChange={e => setName(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  )}

                  <div className={isLogin ? "anim-field-1" : "anim-field-2"}>
                    <FloatingInput
                      id="login-username" label="Usuario / Correo" type="text"
                      value={email} onChange={e => setEmail(e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div className={isLogin ? "anim-field-2" : "anim-field-3"}>
                    <PasswordInput
                      id="login-password" label="Contraseña"
                      value={password} onChange={e => setPassword(e.target.value)}
                      showPassword={showPassword}
                      onToggle={() => setShowPassword(p => !p)}
                    />
                  </div>

                  {/* Separador */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    margin: '6px 0 2px',
                  }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                  </div>

                  {/* Error */}
                  {error && (
                    <div role="alert" style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '8px', padding: '11px 14px',
                      fontSize: '11px', color: '#ef4444',
                      letterSpacing: '0.3px', lineHeight: 1.5,
                    }}>
                      <WarningIcon />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Botón principal */}
                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    style={{
                      width: '100%', background: '#f7f8f8', color: '#08090a', border: 'none',
                      borderRadius: '8px', padding: '16px 18px',
                      fontSize: '11px', fontWeight: 700,
                      letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'none',
                      opacity: loading ? 0.7 : 1,
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: btnHover && !loading ? '0 8px 24px rgba(255,255,255,0.1)' : 'none',
                      transform: btnHover && !loading ? 'translateY(-1px)' : 'translateY(0)',
                      marginTop: '4px',
                    }}
                    className="anim-btn"
                  >
                    <span>{loading ? 'VERIFICANDO...' : isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}</span>
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" onClick={() => setIsLogin(!isLogin)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '10px', color: '#8a8f98', letterSpacing: '1px',
                      fontFamily: 'inherit', textTransform: 'uppercase',
                      transition: 'color 0.2s', padding: '4px',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f7f8f8'}
                      onMouseLeave={e => e.currentTarget.style.color = '#8a8f98'}
                    >
                      {isLogin ? 'Crear nueva cuenta' : 'Ya tengo cuenta'}
                    </button>
                    {isLogin && (
                      <button type="button" style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '10px', color: '#62666d', letterSpacing: '1px',
                        fontFamily: 'inherit', textTransform: 'uppercase',
                        transition: 'color 0.2s', padding: '4px',
                      }}
                        onMouseEnter={e => e.currentTarget.style.color = '#8a8f98'}
                        onMouseLeave={e => e.currentTarget.style.color = '#62666d'}
                      >
                        Olvidé mi contraseña
                      </button>
                    )}
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cursor Personalizado ── */}
      <div 
        className="custom-cursor"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: '8px',
          height: '8px',
          background: '#fff',
          borderRadius: '50%',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
          opacity: mounted ? 1 : 0,
          zIndex: 10000
        }}
      />
      <div 
        className="custom-cursor"
        style={{
          left: trailPos.x,
          top: trailPos.y,
          width: '32px',
          height: '32px',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '50%',
          transform: `translate(-50%, -50%) scale(${isClicking ? 1.5 : 1})`,
          opacity: mounted ? 1 : 0,
          zIndex: 9999
        }}
      />
    </>
  );
}

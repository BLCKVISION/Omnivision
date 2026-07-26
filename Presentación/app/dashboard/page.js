'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700'] });

// ═══════════════════════════════════════════════════════════════════════════════
//  Función de títulos espaciados: "Hola" → "H O L A"
// ═══════════════════════════════════════════════════════════════════════════════
const spaced = (text) => text.toUpperCase().split('').join(' ');

// ═══════════════════════════════════════════════════════════════════════════════
//  Íconos SVG — strokeWidth 1.5 unificado con Login
// ═══════════════════════════════════════════════════════════════════════════════
const Icons = {
  layers: (s=20,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  grid: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>,
  video: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="3"/></svg>,
  chart: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  bell: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  shield: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  shieldCheck: (s=32,c='#1a1a1a') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  settings: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  key: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  moon: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  user: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: (s=18,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  camera: (s=13,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  camOff: (s=28,c='rgba(255,255,255,0.12)') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 7v10M3 7V5a2 2 0 0 1 2-2h12M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/></svg>,
  eye: (s=14,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  x: (s=16,c='currentColor') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ─── Decodificador JWT ───────────────────────────────────────────────────────
function decodeToken(t){try{const b=t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(decodeURIComponent(atob(b).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')));}catch{return null;}}

// ─── NavIcon con tooltip ─────────────────────────────────────────────────────
function NavIcon({icon,active,onClick,tip}){
  const[h,setH]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      position:'relative',width:42,height:42,borderRadius:10,
      display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
      background:active?'rgba(255,255,255,0.06)':h?'rgba(255,255,255,0.03)':'transparent',
      border:active?'1px solid rgba(255,255,255,0.08)':'1px solid transparent',
      color:active?'#fff':h?'#888':'#444',transition:'all 0.2s',
    }}>
      {icon}
      {tip ? <div style={{
        position:'absolute',left:54,top:'50%',transform:'translateY(-50%)',
        background:'rgba(10,10,10,0.92)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',
        border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,
        padding:'6px 12px',fontSize:10,color:'#ccc',letterSpacing:'0.3px',
        whiteSpace:'nowrap',zIndex:100,pointerEvents:'none',
        opacity:h?1:0,transition:'opacity 0.15s',
        boxShadow:'0 4px 20px rgba(0,0,0,0.5)',
      }}>{tip}</div> : null}
    </div>
  );
}

// ─── GlassCard ───────────────────────────────────────────────────────────────
function GCard({children,style={},onClick}){
  const[h,setH]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      background:h?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.015)',
      border:`1px solid ${h?'rgba(255,255,255,0.18)':'rgba(255,255,255,0.08)'}`,
      borderRadius:12,
      backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
      transition:'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      transform:h?'translateY(-1px)':'none',
      boxShadow: h
        ? '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
        : '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)',
      ...style,
    }}>{children}</div>
  );
}

// ─── Gráfico de área ─────────────────────────────────────────────────────────
function AreaChart(){
  const pts=[[0,82],[30,76],[60,85],[95,58],[130,66],[160,40],[195,52],[225,28],[260,42],[310,16]];
  let d=`M ${pts[0][0]},${pts[0][1]}`;
  for(let i=1;i<pts.length;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i],cx=(x0+x1)/2;d+=` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;}
  return(
    <svg width="100%" height="100%" viewBox="0 0 310 100" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="#f7f8f8" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="310" cy="16" r="4" fill="#08090a" stroke="#f7f8f8" strokeWidth="1.5"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Vista: Panel Principal (Dashboard) — Layout jerarquizado
// ═══════════════════════════════════════════════════════════════════════════════
function ViewDashboard({stats,videoOnline,setVideoOnline,systemOnline,apiUrl,alerts}){
  const mockAlerts = alerts.length>0?alerts:[
    {type:'Movimiento sospechoso',severity:'critical',timestamp:'Hace 2 min'},
    {type:'Cámara desconectada',severity:'critical',timestamp:'Hace 15 min'},
    {type:'Persona no identificada',severity:'warning',timestamp:'Hace 8 min'},
    {type:'Acceso fuera de horario',severity:'warning',timestamp:'Hace 23 min'},
    {type:'Objeto abandonado',severity:'info',timestamp:'Hace 45 min'},
  ];
  const disp=alerts.length>0?alerts:mockAlerts;
  const crit=disp.filter(a=>a.severity==='critical');
  const warn=disp.filter(a=>a.severity==='warning');
  const inf=disp.filter(a=>a.severity==='info');
  const CAMS=Array.from({length:6},(_,i)=>({
    id:i+1,name:`CAM-${String(i+1).padStart(2,'0')}`,
    loc:['Entrada Principal','Estacionamiento','Pasillo Norte','Sala Servidores','Recepción','Perímetro Sur'][i],
    active:i<Math.min(stats.cameras_active||4,6),
  }));
  const totalCams=CAMS.length;
  const activeCams=CAMS.filter(c=>c.active).length;
  const[selCam,setSelCam]=useState(0);
  const cam=CAMS[selCam];
  return(<div style={{height:'100%',display:'flex',flexDirection:'column',justifyContent:'center'}}>
    {/* ── BARRA STATS UNIFICADA ── */}
    <div className="anim-1" style={{
      background:'rgba(255,255,255,0.015)',
      backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:12,padding:'20px 28px',marginBottom:24,
      display:'flex',alignItems:'center',justifyContent:'space-between',
      boxShadow:'0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)',
    }}>
      {/* Nodo */}
      <div>
        <div style={{fontSize:9,color:'#62666d',letterSpacing:1,marginBottom:4}}>NODO ACTIVO</div>
        <div style={{display:'flex',alignItems:'baseline',gap:6}}>
          <span style={{fontSize:24,fontWeight:600,letterSpacing:'-1px',color:'#f7f8f8'}}>{activeCams}</span>
          <span style={{fontSize:12,color:'#8a8f98'}}>/</span>
          <span style={{fontSize:16,fontWeight:400,color:'#62666d'}}>{totalCams}</span>
          <span style={{fontSize:12,color:'#8a8f98'}}>cámaras activas</span>
          <span style={{color:'#333',margin:'0 6px',fontSize:18,fontWeight:300}}>·</span>
          <span className={stats.alerts_today>0?'grad-red':''}  style={{fontSize:24,fontWeight:600,letterSpacing:'-1px',color:stats.alerts_today>0?undefined:'#22c55e'}}>{stats.alerts_today}</span>
          <span style={{fontSize:12,color:'#8a8f98'}}>alertas hoy</span>
        </div>
      </div>
      <div style={{width:1,height:36,background:'rgba(255,255,255,0.08)',flexShrink:0}}/>
      {/* Métricas */}
      {[{l:'PERSONAS',v:stats.persons_detected,c:'#f7f8f8'},{l:'RIESGOS',v:stats.risk_events,c:stats.risk_events>0?'#ef4444':'#8a8f98'},{l:'CRÍTICAS',v:crit.length,c:crit.length>0?'#ef4444':'#8a8f98'}].map((m,i)=>(
        <div key={i} style={{textAlign:'center'}}>
          <div style={{fontSize:9,color:'#62666d',letterSpacing:1.5,marginBottom:4}}>{m.l}</div>
          <div className={m.c==='#ef4444'?'grad-red':''} style={{fontSize:22,fontWeight:600,color:m.c==='#ef4444'?undefined:m.c}}>{m.v}</div>
        </div>
      ))}
      <div style={{width:1,height:36,background:'rgba(255,255,255,0.08)',flexShrink:0}}/>
      {/* Estado */}
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{width:8,height:8,borderRadius:'50%',
          background:systemOnline?'#22c55e':'#ef4444',
          animation:'pulseDot 2s infinite',flexShrink:0}}/>
        <div>
          <div style={{fontSize:9,color:'#62666d',letterSpacing:1,marginBottom:3}}>ESTADO GLOBAL</div>
          <div className={systemOnline?'grad-green':'grad-red'} style={{fontSize:15,fontWeight:600}}>{systemOnline?'EN LÍNEA':'OFFLINE'}</div>
        </div>
      </div>
    </div>

    {/* ── CUERPO: sidebar + feed/grid + alertas ── */}
    <div style={{display:'grid',gridTemplateColumns:'152px 1fr 340px',gap:10,flex:1,minHeight:0,height:'calc(100vh - 218px)'}}>

      {/* SIDEBAR CÁMARAS */}
      <div style={{
        background:'rgba(255,255,255,0.025)',
        backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:12,display:'flex',flexDirection:'column',overflow:'hidden',
        boxShadow:'0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>
        <div style={{padding:'12px 14px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
          <div style={{fontSize:9,color:'#62666d',letterSpacing:2}}>{spaced('Cámaras')}</div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:6}}>
          {CAMS.map((c,i)=>{
            const sel=selCam===i;
            return(
              <div key={c.id} onClick={()=>setSelCam(i)} style={{padding:'8px 10px',borderRadius:8,marginBottom:2,cursor:'pointer',background:sel?'rgba(255,255,255,0.05)':'transparent',border:`1px solid ${sel?'rgba(255,255,255,0.1)':'transparent'}`,transition:'all 0.15s',display:'flex',alignItems:'center',gap:8}}>
                <span style={{width:5,height:5,borderRadius:'50%',
                  background:c.active?'#22c55e':'#ef4444',
                  flexShrink:0,animation:'pulseDot 2s infinite'}}/>
                <div>
                  <div style={{fontSize:11,fontWeight:500,color:sel?'#f7f8f8':'#8a8f98',lineHeight:1}}>{c.name}</div>
                  <div style={{fontSize:9,color:sel?'#d0d6e0':'#62666d',marginTop:2}}>{c.active?'En línea':'Sin señal'}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{padding:'9px 14px',borderTop:'1px solid rgba(255,255,255,0.04)',fontSize:9,color:'#62666d'}}>
          {CAMS.filter(c=>c.active).length} activas · {CAMS.filter(c=>!c.active).length} sin señal
        </div>
      </div>

      {/* FEED + GRID */}
      <div className="anim-2" style={{display:'flex',flexDirection:'column',gap:8,overflow:'hidden',minHeight:0}}>
        {/* Feed expandido — ocupa todo el espacio disponible */}
        <div style={{
          flex:1,background:'#000',borderRadius:8,overflow:'hidden',
          border:'1px solid rgba(255,255,255,0.05)',position:'relative',
          boxShadow:'inset 0 0 40px rgba(0,0,0,0.6)', minHeight: 560
        }}>
          <div style={{position:'absolute',top:0,left:0,right:0,zIndex:2,padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(to bottom,rgba(0,0,0,0.72),transparent)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:10,fontWeight:600,color:'#f7f8f8'}}>{cam.name}</span>
              <span style={{fontSize:9,color:'#8a8f98'}}>· {cam.loc}</span>
            </div>
            {videoOnline?<span style={{fontSize:9,color:'#ef4444',display:'flex',alignItems:'center',gap:4,animation:'pulseRec 1.5s infinite'}}><span>●</span> REC</span>:<span style={{fontSize:9,color:'#62666d',display:'flex',alignItems:'center',gap:4}}><span>●</span> SIN SEÑAL</span>}
          </div>
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
            {videoOnline?<img src={`${apiUrl}/video/stream`} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={()=>setVideoOnline(false)} alt=""/>:<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>{Icons.camOff(24,'#62666d')}<span style={{fontSize:9,color:'#62666d',letterSpacing:3}}>SIN SEÑAL</span><img src={`${apiUrl}/video/stream`} style={{display:'none'}} onLoad={()=>setVideoOnline(true)} alt=""/></div>}
          </div>
          <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:2,padding:'10px 14px',display:'flex',gap:14,background:'linear-gradient(to top,rgba(0,0,0,0.65),transparent)',fontSize:9,color:'#8a8f98',letterSpacing:1}}>
            <span>1920×1080</span><span>MJPEG</span><span>30 FPS</span>
          </div>
        </div>

        {/* Grid 1×6 thumbnails — altura fija, fila única */}
        <div style={{flexShrink:0,display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:5,height:72}}>
          {CAMS.map((c,i)=>(
            <div key={c.id} onClick={()=>setSelCam(i)} style={{
              background: selCam===i ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
              backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',
              borderRadius:7,overflow:'hidden',cursor:'pointer',
              border:`1.5px solid ${selCam===i?'rgba(255,255,255,0.22)':'rgba(255,255,255,0.06)'}`,
              position:'relative',transition:'all 0.15s',height:'100%',
              display:'flex',alignItems:'center',justifyContent:'center',
            }}>
              {c.active?<img src={`${apiUrl}/video/stream`} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} onError={()=>{}} alt=""/>:Icons.camOff(12,'#62666d')}
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'4px 5px',fontSize:8,color:c.active?'#d0d6e0':'#ef4444',background:'linear-gradient(to top,rgba(0,0,0,0.88),transparent)',display:'flex',alignItems:'center',gap:3}}>
                <span style={{width:3,height:3,borderRadius:'50%',background:c.active?'#22c55e':'#ef4444',flexShrink:0}}/>{c.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL ALERTAS */}
      <div className="anim-3" style={{
        background:'rgba(255,255,255,0.015)',
        backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
        border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:12,display:'flex',flexDirection:'column',overflow:'hidden',
        boxShadow:'0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)',
      }}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{fontSize:10,color:'#8a8f98',letterSpacing:2,marginBottom:12}}>{spaced('Alertas')}</div>
          <div style={{display:'flex',gap:14}}>
            <span style={{fontSize:11,display:'flex',alignItems:'center',gap:5,color:crit.length>0?'#ef4444':'#62666d'}}><span style={{width:7,height:7,borderRadius:'50%',background:crit.length>0?'#ef4444':'#333'}}/><strong>{crit.length}</strong> críticas</span>
            <span style={{fontSize:11,display:'flex',alignItems:'center',gap:5,color:warn.length>0?'#eab308':'#62666d'}}><span style={{width:7,height:7,borderRadius:'50%',background:warn.length>0?'#eab308':'#333'}}/><strong>{warn.length}</strong> avisos</span>
            <span style={{fontSize:11,display:'flex',alignItems:'center',gap:5,color:'#62666d'}}><span style={{width:7,height:7,borderRadius:'50%',background:'#333'}}/>{inf.length} info</span>
          </div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'8px',display:'flex',flexDirection:'column',gap:5}}>
          {crit.length>0&&<>{crit.map((a,i)=><div key={`c${i}`} style={{padding:'12px 14px',borderRadius:2,borderLeft:'2px solid #991b1b',background:'rgba(153,27,27,0.15)',display:'flex',alignItems:'center',gap:16}}><div style={{fontSize:12,color:'#ef4444',fontFamily:'monospace',opacity:0.9}}>0{i+1}</div><div style={{fontSize:12,color:'#f7f8f8',fontWeight:400,letterSpacing:'0.2px'}}>{a.type}</div></div>)}</>}
          {warn.length>0&&<>{warn.map((a,i)=><div key={`w${i}`} style={{padding:'12px 14px',borderRadius:2,borderLeft:'2px solid #854d0e',background:'rgba(133,77,14,0.15)',display:'flex',alignItems:'center',gap:16}}><div style={{fontSize:12,color:'#eab308',fontFamily:'monospace',opacity:0.8}}>0{i+1}</div><div style={{fontSize:12,color:'#f7f8f8',fontWeight:400,letterSpacing:'0.2px'}}>{a.type}</div></div>)}</>}
          {inf.length>0&&<>{inf.map((a,i)=><div key={`i${i}`} style={{padding:'12px 14px',borderRadius:2,borderLeft:'2px solid #333',background:'rgba(255,255,255,0.02)',display:'flex',alignItems:'center',gap:16}}><div style={{fontSize:12,color:'#62666d',fontFamily:'monospace',opacity:0.8}}>0{i+1}</div><div style={{fontSize:12,color:'#f7f8f8',fontWeight:400,letterSpacing:'0.2px'}}>{a.type}</div></div>)}</>}
          {disp.length===0&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',padding:32}}><span style={{fontSize:12,color:'#62666d'}}>Sin amenazas activas</span></div>}
        </div>
        <div style={{padding:'10px 16px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
          <span style={{fontSize:10,color:'#333'}}>● actualización cada 3s</span>
        </div>
      </div>
    </div>
  </div>);
}


// ═══════════════════════════════════════════════════════════════════════════════
//  Vista: Cámaras
// ═══════════════════════════════════════════════════════════════════════════════
function ViewCameras({stats,apiUrl}){
  const[lbCam,setLbCam]=useState(null);
  const cams=Array.from({length:6},(_,i)=>({id:i+1,name:`CAM-${String(i+1).padStart(2,'0')}`,loc:['Entrada Principal','Estacionamiento','Pasillo Norte','Sala de Servidores','Recepción','Perímetro Sur'][i],active:i<(stats.cameras_active||4)}));
  return(<div style={{paddingTop:40}}>
    <div className="anim-0" style={{marginBottom:36}}>
      <h2 className="section-title" style={{fontSize:20,fontWeight:600,margin:'0 0 6px', color:'#f7f8f8'}}>C A M A R A S</h2>
      <p style={{margin:0,fontSize:14,color:'#d0d6e0'}}>Administración y monitoreo de todos los nodos de video</p>
    </div>
    <div className="anim-1" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
      {cams.map((cam,idx)=>(
        <GCard key={cam.id} style={{overflow:'hidden',cursor:'pointer'}} onClick={()=>setLbCam(idx)}>
          <div style={{aspectRatio:'16/9',background:'#0a0a0a',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {cam.active?<img src={`${apiUrl}/video/stream`} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} onError={()=>{}} alt=""/>:Icons.camOff(32,'#333')}
            <div style={{position:'absolute',top:10,left:10,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(8px)',borderRadius:6,padding:'3px 10px',fontSize:9,letterSpacing:1,color:cam.active?'#8a8f98':'#ef4444',display:'flex',alignItems:'center',gap:5,border:'1px solid rgba(255,255,255,0.06)'}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:cam.active?'#22c55e':'#ef4444',animation:'pulseDot 2s infinite'}}/>{cam.active?'EN VIVO':'DESCONECTADO'}
            </div>
          </div>
          <div style={{padding:'14px 16px'}}><div style={{fontSize:12,fontWeight:500,marginBottom:3,color:'#f7f8f8'}}>{cam.name}</div><div style={{fontSize:10,color:'#62666d'}}>{cam.loc}</div></div>
        </GCard>))}
    </div>
    {lbCam!==null&&typeof window!=='undefined'&&createPortal(
      <div onClick={()=>setLbCam(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(8,9,10,0.4)',backdropFilter:'blur(48px)',WebkitBackdropFilter:'blur(48px)',display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.3s ease-out forwards'}}>
        <div onClick={()=>setLbCam(null)} style={{position:'absolute',top:24,right:32,cursor:'pointer',color:'#d0d6e0',zIndex:10000}}>{Icons.x(32)}</div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'90%',maxWidth:1000,animation:'zoomIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards'}}>
          
          <div onClick={(e)=>e.stopPropagation()} style={{width:'100%',aspectRatio:'16/9',background:'#000',borderRadius:16,overflow:'hidden',position:'relative',boxShadow:'0 24px 64px rgba(0,0,0,0.8)',border:'1px solid rgba(255,255,255,0.08)'}}>
            {cams[lbCam].active?<img src={`${apiUrl}/video/stream`} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={()=>{}} alt=""/>:Icons.camOff(80,'#333')}
            <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'40px 30px 20px',background:'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',pointerEvents:'none'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:cams[lbCam].active?'#22c55e':'#ef4444',animation:'pulseDot 2s infinite'}}/>
                <div>
                  <div style={{fontSize:20,fontWeight:600,color:'#f7f8f8'}}>{cams[lbCam].name}</div>
                  <div style={{fontSize:14,color:'#d0d6e0',marginTop:4}}>{cams[lbCam].loc}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div onClick={(e)=>e.stopPropagation()} style={{display:'flex',gap:12,maxWidth:'100%',overflowX:'auto',padding:'24px 0 10px',marginTop:12}}>
            {cams.map((cam,idx)=>(
               <div key={cam.id} onClick={(e)=>{e.stopPropagation();setLbCam(idx);}} style={{width:120,flexShrink:0,aspectRatio:'16/9',background:'#000',borderRadius:8,border:`2px solid ${lbCam===idx?'#f7f8f8':'transparent'}`,cursor:'pointer',opacity:lbCam===idx?1:0.5,transition:'all 0.2s',overflow:'hidden',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {cam.active?<img src={`${apiUrl}/video/stream`} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={()=>{}} alt=""/>:Icons.camOff(16,'#333')}
                  <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'4px 6px',background:'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',fontSize:8,color:'#f7f8f8'}}>{cam.name}</div>
               </div>
            ))}
          </div>
        </div>
      </div>
    ,document.body)}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Vista: Análisis
// ═══════════════════════════════════════════════════════════════════════════════
function ViewAnalysis(){
  const[lbStat,setLbStat]=useState(null);
  const statsList = [{l:'Detecciones',v:'1,248',d:'+12%'},{l:'Alertas Críticas',v:'23',d:'-5%'},{l:'Tiempo Activo',v:'99.7%',d:'+0.2%'},{l:'Latencia Promedio',v:'42ms',d:'-8ms'}];

  return(<div style={{paddingTop:40}}>
    <div className="anim-0" style={{marginBottom:36}}>
      <h2 className="section-title" style={{fontSize:20,fontWeight:600,margin:'0 0 6px', color:'#f7f8f8'}}>A N A L I S I S</h2>
      <p style={{margin:0,fontSize:14,color:'#d0d6e0'}}>Métricas históricas y tendencias de detección</p>
    </div>
    <div className="anim-1" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
      {statsList.map((x,i)=>(
        <GCard key={i} style={{padding:20,cursor:'pointer'}} onClick={()=>setLbStat(x)}>
          <div style={{fontSize:12,color:'#62666d',letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>{x.l}</div>
          <div style={{fontSize:28,fontWeight:300,marginBottom:4,color:'#f7f8f8'}}>{x.v}</div>
          <div style={{fontSize:10,color:'#8a8f98'}}>{x.d} vs semana pasada</div>
        </GCard>))}
    </div>
    <div className="anim-2">
      <GCard style={{padding:24,position:'relative',overflow:'hidden', background: 'transparent'}}>
        <div style={{position:'relative',zIndex:1}}>
          <h3 style={{margin:'0 0 4px',fontSize:14,fontWeight:500,color:'#f7f8f8'}}>Detecciones en el tiempo</h3>
          <p style={{margin:'0 0 16px',fontSize:10,color:'#62666d'}}>Actividad de los últimos 6 meses</p>
          <div style={{height:160}}><AreaChart/></div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:9,color:'#62666d',marginTop:8}}>{['Ene','Feb','Mar','Abr','May','Jun'].map(m=><span key={m}>{m}</span>)}</div>
        </div>
      </GCard>
    </div>
    {lbStat!==null&&typeof window!=='undefined'&&createPortal(
      <div onClick={()=>setLbStat(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(8,9,10,0.4)',backdropFilter:'blur(48px)',WebkitBackdropFilter:'blur(48px)',display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.3s ease-out forwards'}}>
        <div onClick={()=>setLbStat(null)} style={{position:'absolute',top:24,right:32,cursor:'pointer',color:'#d0d6e0'}}>{Icons.x(32)}</div>
        <GCard onClick={(e)=>e.stopPropagation()} style={{padding:'40px 48px',width:'100%',maxWidth:600,textAlign:'center',animation:'zoomIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards'}}>
          <div style={{fontSize:14,color:'#8a8f98',letterSpacing:2,textTransform:'uppercase',marginBottom:24}}>{lbStat.l}</div>
          <div style={{fontSize:64,fontWeight:300,marginBottom:8,color:'#f7f8f8',lineHeight:1}}>{lbStat.v}</div>
          <div style={{fontSize:14,color:lbStat.d.startsWith('+')?(lbStat.l==='Detecciones'||lbStat.l==='Alertas Críticas'?'#ef4444':'#22c55e'):(lbStat.l==='Detecciones'||lbStat.l==='Alertas Críticas'?'#22c55e':'#ef4444')}}>
            {lbStat.d} vs media del mes anterior
          </div>
          <div style={{marginTop:48,height:180,background:'rgba(255,255,255,0.015)',borderRadius:12,border:'1px solid rgba(255,255,255,0.05)',display:'flex',alignItems:'flex-end',padding:'20px 20px 0',gap:8}}>
            {[...Array(7)].map((_,i)=><div key={i} style={{flex:1,background:'rgba(255,255,255,0.08)',borderRadius:'4px 4px 0 0',height:`${Math.random()*70+30}%`,transition:'height 0.5s ease'}}/>)}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#62666d',marginTop:12,padding:'0 10px'}}>{['Lun','Mar','Mie','Jue','Vie','Sab','Dom'].map(m=><span key={m}>{m}</span>)}</div>
        </GCard>
      </div>
    ,document.body)}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Vista: Alertas
// ═══════════════════════════════════════════════════════════════════════════════
function ViewAlerts({alerts}){
  const[filter,setFilter]=useState('Todas');
  const mock=alerts.length?alerts:[
    {type:'Movimiento sospechoso',severity:'critical',description:'Zona restringida — CAM-04',timestamp:'Hace 2 min'},
    {type:'Persona no identificada',severity:'warning',description:'Entrada principal — CAM-01',timestamp:'Hace 8 min'},
    {type:'Cámara desconectada',severity:'critical',description:'Perímetro sur — CAM-06',timestamp:'Hace 15 min'},
    {type:'Acceso fuera de horario',severity:'warning',description:'Sala de servidores — CAM-04',timestamp:'Hace 23 min'},
    {type:'Objeto abandonado',severity:'info',description:'Recepción — CAM-05',timestamp:'Hace 45 min'},
    {type:'Vehículo desconocido',severity:'info',description:'Estacionamiento — CAM-02',timestamp:'Hace 1h'},
  ];
  const map={ 'Todas':null, 'Críticas':'critical', 'Advertencias':'warning', 'Información':'info' };
  const filtered=map[filter]?mock.filter(a=>a.severity===map[filter]):mock;

  return(<div style={{paddingTop:40}}>
    <div className="anim-0" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:36}}>
      <div>
        <h2 className="section-title" style={{fontSize:20,fontWeight:600,margin:'0 0 6px', color:'#f7f8f8'}}>A L E R T A S</h2>
        <p style={{margin:0,fontSize:14,color:'#d0d6e0'}}>Centro de notificaciones de incidentes</p>
      </div>
      <div style={{display:'flex',gap:8}}>{['Todas','Críticas','Advertencias','Información'].map((f,i)=>{
        const sel=filter===f;
        return(
        <button key={i} onClick={()=>setFilter(f)} style={{
          background:sel?'rgba(255,255,255,0.06)':'transparent',
          border:`1px solid ${sel?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.06)'}`,
          color:sel?'#f7f8f8':'#62666d',fontSize:10,padding:'6px 14px',borderRadius:8,cursor:'pointer',backdropFilter:'blur(8px)',transition:'all 0.2s'
        }}>{f}</button>);})}</div>
    </div>
    <div className="anim-1" style={{display:'flex',flexDirection:'column',gap:8}}>
      {filtered.map((a,i)=>{
        const isCrit = a.severity==='critical';
        const isWarn = a.severity==='warning';
        const bg = isCrit ? 'rgba(214, 48, 61, 0.1)' : isWarn ? 'rgba(133, 77, 14, 0.12)' : 'rgba(255,255,255,0.01)';
        const bord = isCrit ? 'rgba(214, 48, 61, 0.2)' : isWarn ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.05)';
        const sev=isCrit?{col:'#d6303d',label:'AMENAZA CRÍTICA'}:isWarn?{col:'#eab308',label:'ADVERTENCIA'}:{col:'#62666d',label:'INFORMACIÓN'};
        return(
        <GCard key={i} style={{padding:'14px 20px',display:'flex',alignItems:'center',gap:14, background:bg, border:`1px solid ${bord}`}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:sev.col,flexShrink:0,animation:a.severity==='critical'?'pulseDot 2s infinite':'none'}}/>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,marginBottom:3,color:'#f7f8f8'}}>{a.type}</div><div style={{fontSize:11,color:'#8a8f98'}}>{a.description}</div></div>
          <div style={{fontSize:10,color:'#62666d',whiteSpace:'nowrap'}}>{a.timestamp}</div>
          <span style={{fontSize:8,padding:'3px 9px',borderRadius:6,background:sev.col+'15',border:`1px solid ${sev.col}30`,color:sev.col,letterSpacing:1}}>{sev.label}</span>
        </GCard>);})
      }
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Vista: Seguridad
// ═══════════════════════════════════════════════════════════════════════════════
function ViewSecurity(){
  return(<div style={{paddingTop:40}}>
    <div className="anim-0" style={{marginBottom:36}}>
      <h2 className="section-title" style={{fontSize:20,fontWeight:600,margin:'0 0 6px', color:'#f7f8f8'}}>S E G U R I D A D</h2>
      <p style={{margin:0,fontSize:14,color:'#d0d6e0'}}>Políticas de protección y monitoreo de amenazas</p>
    </div>
    <div className="anim-1" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
      {[{t:'Nivel de amenaza',v:'BAJO'},{t:'Cortafuegos',v:'ACTIVO'},{t:'Detección de intrusión',v:'ACTIVO'}].map((x,i)=>(
        <GCard key={i} style={{padding:22,textAlign:'center'}}>
          <div style={{fontSize:12,color:'#62666d',letterSpacing:1,textTransform:'uppercase',marginBottom:12}}>{x.t}</div>
          <div style={{color:'#22c55e',fontSize:22,fontWeight:600,letterSpacing:3,animation:'pulseRec 2s infinite'}}>{x.v}</div>
        </GCard>))}
    </div>
    <div className="anim-2">
      <GCard style={{padding:22}}>
        <h3 style={{margin:'0 0 16px',fontSize:14,fontWeight:500,color:'#f7f8f8'}}>Registro de eventos</h3>
        {['Escaneo de perímetro completado — sin amenazas','Cortafuegos bloqueó 14 intentos de acceso','Certificados SSL renovados automáticamente','Copia de seguridad de configuración realizada'].map((t,i)=>(
          <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#62666d'}}/>
            <span style={{fontSize:12,color:'#8a8f98',flex:1}}>{t}</span>
            <span style={{fontSize:10,color:'#333'}}>Hace {(i+1)*2}h</span>
          </div>))}
      </GCard>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Vista: Configuración (cuando se navega a ella desde el sidebar)
// ═══════════════════════════════════════════════════════════════════════════════
function ViewSettingsPage({userInfo}){
  const[settings,setSettings]=useState({notif:true,dark:true,sound:false,auto:true});
  const[saving,setSaving]=useState(false);
  const handleSave=()=>{setSaving(true);setTimeout(()=>setSaving(false),2000);};
  
  const sys=[
    {l:'Notificaciones',k:'notif'},
    {l:'Modo oscuro',k:'dark'},
    {l:'Sonido de alertas',k:'sound'},
    {l:'Auto-refresh',k:'auto'}
  ];

  return(<div style={{paddingTop:40}}>
    <div className="anim-0" style={{marginBottom:36}}>
      <h2 className="section-title" style={{fontSize:20,fontWeight:600,margin:'0 0 6px', color:'#f7f8f8'}}>C O N F I G U R A C I O N</h2>
      <p style={{margin:0,fontSize:14,color:'#d0d6e0'}}>Preferencias del sistema y gestión de accesos corporativos</p>
    </div>
    <div className="anim-1" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
      <GCard style={{padding:22}}>
        <h3 style={{margin:'0 0 18px',fontSize:14,fontWeight:500,color:'#f7f8f8'}}>Perfil</h3>
        {[{l:'Nombre',v:userInfo.name},{l:'Correo',v:userInfo.email},{l:'Rol',v:'Administrador'},{l:'Última sesión',v:'Ahora'}].map((x,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',fontSize:12}}>
            <span style={{color:'#62666d'}}>{x.l}</span><span style={{color:'#d0d6e0'}}>{x.v}</span></div>))}
        <button onClick={handleSave} style={{
          marginTop:20,width:'100%',
          background:saving?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.05)',
          border:`1px solid ${saving?'#22c55e':'rgba(255,255,255,0.12)'}`,
          color:saving?'#22c55e':'#f7f8f8',fontSize:10,letterSpacing:1,padding:'10px',
          borderRadius:8,cursor:'pointer',backdropFilter:'blur(8px)',transition:'all 0.2s'
        }}>{saving?'PREFERENCIAS ACTUALIZADAS':'ACTUALIZAR PERFIL'}</button>
      </GCard>
      <GCard style={{padding:22}}>
        <h3 style={{margin:'0 0 18px',fontSize:14,fontWeight:500,color:'#f7f8f8'}}>Sistema</h3>
        {sys.map((x,i)=>{
          const val=settings[x.k];
          return(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',fontSize:12}}>
            <span style={{color:'#62666d'}}>{x.l}</span>
            <div onClick={()=>setSettings(prev=>({...prev,[x.k]:!prev[x.k]}))}
              style={{width:38,height:20,borderRadius:10,background:val?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.05)',position:'relative',cursor:'pointer',border:`1px solid ${val?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.06)'}`,transition:'all 0.2s'}}>
              <div style={{width:14,height:14,borderRadius:'50%',background:val?'#f7f8f8':'#62666d',position:'absolute',top:2,left:val?20:2,transition:'all 0.2s'}}/>
            </div></div>);})}
      </GCard>
    </div>
    <div className="anim-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:14}}>
      <GCard style={{padding:22}}>
        <h3 style={{margin:'0 0 16px',fontSize:14,fontWeight:500,color:'#f7f8f8'}}>Claves API</h3>
        {['Clave de producción','Clave de desarrollo'].map((k,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              {Icons.key(14,'#62666d')}
              <div><div style={{fontSize:12,marginBottom:3,color:'#d0d6e0'}}>{k}</div><div style={{fontSize:10,color:'#62666d'}}>sk-••••••••{String(Math.random()).slice(-4)}</div></div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:9,padding:'3px 10px',borderRadius:6,background:i===0?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.02)',border:`1px solid ${i===0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)'}`,color:i===0?'#8a8f98':'#62666d',letterSpacing:1}}>{i===0?'ACTIVA':'INACTIVA'}</span>
              <div style={{cursor:'pointer',color:'#62666d'}}>{Icons.eye(14)}</div>
            </div>
          </div>))}
      </GCard>
      <GCard style={{padding:22}}>
        <h3 style={{margin:'0 0 16px',fontSize:14,fontWeight:500,color:'#f7f8f8'}}>Sesiones activas</h3>
        {['Chrome — Windows 11 — Ahora','Firefox — macOS — Hace 2h'].map((s,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',fontSize:12}}>
            <span style={{color:'#8a8f98'}}>{s}</span>
            <span style={{fontSize:9,padding:'3px 10px',borderRadius:6,background:i===0?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.02)',border:`1px solid ${i===0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)'}`,color:i===0?'#8a8f98':'#62666d'}}>{i===0?'ACTUAL':'ACTIVA'}</span>
          </div>))}
      </GCard>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Vista: Perfil (nuevo)
// ═══════════════════════════════════════════════════════════════════════════════
function ViewProfile({userInfo}){
  const[saving,setSaving]=useState(false);
  const handleSave=()=>{setSaving(true);setTimeout(()=>setSaving(false),2000);};
  return(<div style={{paddingTop:40}}>
    <div className="anim-0" style={{marginBottom:36}}>
      <h2 className="section-title" style={{fontSize:20,fontWeight:600,margin:'0 0 6px', color:'#f7f8f8'}}>P E R F I L</h2>
      <p style={{margin:0,fontSize:14,color:'#d0d6e0'}}>Gestión de credenciales y datos de usuario</p>
    </div>
    <div className="anim-1" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
      {/* Datos Principales */}
      <GCard style={{padding:24}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,borderBottom:'1px solid rgba(255,255,255,0.05)',paddingBottom:20}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,color:'#f7f8f8',fontWeight:600}}>
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:500,color:'#f7f8f8',marginBottom:4}}>{userInfo.name}</div>
            <div style={{fontSize:11,color:'#62666d'}}>{userInfo.email}</div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div>
            <label style={{fontSize:9,color:'#62666d',letterSpacing:1,textTransform:'uppercase',display:'block',marginBottom:6}}>Nombre Completo</label>
            <input type="text" defaultValue={userInfo.name} style={{width:'100%',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 14px',color:'#f7f8f8',fontSize:13,outline:'none',fontFamily:'inherit'}} />
          </div>
          <div>
            <label style={{fontSize:9,color:'#62666d',letterSpacing:1,textTransform:'uppercase',display:'block',marginBottom:6}}>Correo Electrónico</label>
            <input type="email" defaultValue={userInfo.email} style={{width:'100%',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 14px',color:'#f7f8f8',fontSize:13,outline:'none',fontFamily:'inherit'}} />
          </div>
          <button onClick={handleSave} style={{
            background:saving?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.05)',
            border:`1px solid ${saving?'#22c55e':'rgba(255,255,255,0.12)'}`,
            color:saving?'#22c55e':'#f7f8f8',fontSize:10,letterSpacing:1,padding:'10px 20px',
            borderRadius:8,cursor:'pointer',backdropFilter:'blur(8px)',transition:'all 0.2s'
          }}
          onMouseEnter={e=>{if(!saving){e.target.style.background='rgba(255,255,255,0.1)';e.target.style.borderColor='rgba(255,255,255,0.2)'}}}
          onMouseLeave={e=>{if(!saving){e.target.style.background='rgba(255,255,255,0.05)';e.target.style.borderColor='rgba(255,255,255,0.12)'}}}
          >{saving?'CAMBIOS GUARDADOS':'GUARDAR CAMBIOS'}</button>
        </div>
      </GCard>
      {/* Seguridad */}
      <div className="anim-2" style={{display:'flex',flexDirection:'column',gap:20}}>
        <GCard style={{padding:24}}>
          <h3 style={{margin:'0 0 16px',fontSize:13,fontWeight:500,textTransform:'uppercase',letterSpacing:1,color:'#f7f8f8'}}>Seguridad de la Cuenta</h3>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <input type="password" placeholder="Contraseña actual" style={{width:'100%',background:'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 14px',color:'#f7f8f8',fontSize:13,outline:'none',fontFamily:'inherit'}} />
            <input type="password" placeholder="Nueva contraseña" style={{width:'100%',background:'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 14px',color:'#f7f8f8',fontSize:13,outline:'none',fontFamily:'inherit'}} />
            <input type="password" placeholder="Confirmar contraseña" style={{width:'100%',background:'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 14px',color:'#f7f8f8',fontSize:13,outline:'none',fontFamily:'inherit'}} />
            <button style={{
              background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:8,padding:'10px 16px',fontSize:10,letterSpacing:1,
              color:'#f7f8f8',cursor:'pointer',transition:'all 0.2s',backdropFilter:'blur(8px)'
            }}
            onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,0.1)';e.target.style.borderColor='rgba(255,255,255,0.2)'}}
            onMouseLeave={e=>{e.target.style.background='rgba(255,255,255,0.05)';e.target.style.borderColor='rgba(255,255,255,0.1)'}}
            >ACTUALIZAR CONTRASEÑA</button>
          </div>
        </GCard>
        <GCard style={{padding:24}}>
          <h3 style={{margin:'0 0 16px',fontSize:13,fontWeight:500,color:'#ef4444',textTransform:'uppercase',letterSpacing:1}}>Zona de Riesgo</h3>
          <p style={{fontSize:11,color:'#62666d',marginBottom:16,lineHeight:1.5}}>Desvincular este nodo del sistema principal. Requiere reautenticación manual y validación física.</p>
          <button style={{background:'rgba(239,68,68,0.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'10px 16px',fontSize:11,fontWeight:600,cursor:'pointer',width:'100%'}}>REVOCAR ACCESO GLOBAL</button>
        </GCard>
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Panel lateral de Configuración (drawer)
// ═══════════════════════════════════════════════════════════════════════════════
function ConfigDrawer({show,onClose,userInfo,apiUrl,setApiUrl,pollInterval,setPollInterval,onLogout}){
  const[logoutHover,setLogoutHover]=useState(false);
  return(<>
    {/* Overlay */}
    {show && <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:99}}/>}
    {/* Panel */}
    <div style={{
      position:'fixed',top:0,right:0,bottom:0,width:320,
      background:'#08090a',borderLeft:'1px solid rgba(255,255,255,0.07)',
      zIndex:100,transform:show?'translateX(0)':'translateX(320px)',
      transition:'transform 0.3s ease',
      display:'flex',flexDirection:'column',overflow:'hidden',
    }}>
      {/* Header */}
      <div style={{padding:'20px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <span style={{fontSize:10,letterSpacing:3,color:'#8a8f98',fontWeight:500}}>{spaced('Configuración')}</span>
        <div onClick={onClose} style={{cursor:'pointer',color:'#62666d',padding:4}}>{Icons.x()}</div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'20px 24px'}}>
        {/* Sección: Sistema */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:9,letterSpacing:3,color:'#62666d',marginBottom:14,fontWeight:500}}>{spaced('Sistema')}</div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:10,color:'#62666d',display:'block',marginBottom:6}}>URL del Backend</label>
            <input value={apiUrl} onChange={e=>setApiUrl(e.target.value)} placeholder="http://localhost:8000" style={{
              width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:6,padding:'8px 12px',color:'#f7f8f8',fontSize:12,outline:'none',fontFamily:'inherit',
              boxSizing:'border-box',transition:'border-color 0.2s',
            }} onFocus={e=>e.target.style.borderColor='rgba(255,255,255,0.22)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.08)'}/>
          </div>
          <div>
            <label style={{fontSize:10,color:'#62666d',display:'block',marginBottom:6}}>Intervalo de actualización</label>
            <select value={pollInterval} onChange={e=>setPollInterval(Number(e.target.value))} style={{
              width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:6,padding:'8px 12px',color:'#f7f8f8',fontSize:12,outline:'none',fontFamily:'inherit',
              boxSizing:'border-box',cursor:'pointer',appearance:'none',
            }}>
              <option value={1000} style={{background:'#08090a'}}>1 segundo</option>
              <option value={3000} style={{background:'#08090a'}}>3 segundos</option>
              <option value={5000} style={{background:'#08090a'}}>5 segundos</option>
              <option value={10000} style={{background:'#08090a'}}>10 segundos</option>
            </select>
          </div>
        </div>

        {/* Sección: Sesión */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:9,letterSpacing:3,color:'#62666d',marginBottom:14,fontWeight:500}}>{spaced('Sesión')}</div>
          <div style={{fontSize:13,color:'#f7f8f8',marginBottom:4}}>{userInfo.name}</div>
          <div style={{fontSize:11,color:'#62666d',marginBottom:16}}>{userInfo.email}</div>
          <button
            onClick={onLogout}
            onMouseEnter={()=>setLogoutHover(true)} onMouseLeave={()=>setLogoutHover(false)}
            style={{
              width:'100%',background:logoutHover?'rgba(239,68,68,0.08)':'transparent',
              border:'1px solid rgba(239,68,68,0.3)',color:'#ef4444',
              padding:10,borderRadius:6,fontSize:10,letterSpacing:2,
              cursor:'pointer',fontFamily:'inherit',transition:'background 0.2s',
            }}
          >{spaced('Cerrar sesión')}</button>
        </div>

        {/* Sección: Acerca de */}
        <div>
          <div style={{fontSize:9,letterSpacing:3,color:'#62666d',marginBottom:14,fontWeight:500}}>{spaced('Acerca de')}</div>
          <div style={{fontSize:11,color:'#8a8f98',marginBottom:4}}>OmniVision v1.0.0</div>
          <div style={{fontSize:10,color:'#62666d',marginBottom:4}}>Sistema de Vigilancia Inteligente</div>
          <div style={{fontSize:10,color:'#333'}}>Desarrollado con Next.js + FastAPI</div>
        </div>
      </div>
    </div>
  </>);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Dropdown de usuario
// ═══════════════════════════════════════════════════════════════════════════════
function DropdownItem({it}){
  const[h,setH]=useState(false);
  return(
    <div onClick={it.action} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:'8px 12px',borderRadius:6,fontSize:10,letterSpacing:1.5,
        color:it.danger?'#ef4444':(h?'#f7f8f8':'#8a8f98'),
        background:h?'rgba(255,255,255,0.04)':'transparent',
        cursor:'pointer',transition:'all 0.15s',
      }}>{it.label}</div>
  );
}
function UserDropdown({show,onClose,userInfo,onOpenConfig,onLogout}){
  const items=[
    {label:spaced('Configuración'),action:()=>{onClose();onOpenConfig();}},
    {label:spaced('Cerrar sesión'),action:onLogout,danger:true},
  ];
  if(!show) return null;
  return(<>
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:9000}}/>
    <div style={{
      position:'absolute',top:52,right:0,minWidth:200,
      background:'rgba(10,10,10,0.96)',
      backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
      border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:6,zIndex:9001,
      boxShadow:'0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      <div style={{padding:'12px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',marginBottom:4}}>
        <div style={{fontSize:12,color:'#f7f8f8',marginBottom:3,fontWeight:500}}>{userInfo.name}</div>
        <div style={{fontSize:10,color:'#62666d'}}>{userInfo.email}</div>
      </div>
      {items.map((it,i)=><DropdownItem key={i} it={it}/>)}
    </div>
  </>);
}

// ══════════════════════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export default function DashboardPage(){
  const[activeNav,setActiveNav]=useState('dashboard');
  const[stats,setStats]=useState({cameras_active:12,alerts_today:3,persons_detected:47,risk_events:1});
  const[alerts,setAlerts]=useState([]);
  const[videoOnline,setVideoOnline]=useState(false);
  const[systemOnline,setSystemOnline]=useState(false);
  const[currentTime,setCurrentTime]=useState(null);
  const[userInfo,setUserInfo]=useState({name:'Administrador AI',email:'admin@omnivision.net'});
  const[mounted,setMounted]=useState(false);
  const[pageLoading,setPageLoading]=useState(true);
  const[revealed,setRevealed]=useState(false);
  const[transitioning,setTransitioning]=useState(false);

  // Estados nuevos
  const[showConfig,setShowConfig]=useState(false);
  const[showUserMenu,setShowUserMenu]=useState(false);
  const[apiUrl,setApiUrl]=useState(process.env.NEXT_PUBLIC_API_URL||'http://localhost:8000');
  const[pollInterval,setPollInterval]=useState(3000);

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);

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

  // Refs para los intervalos (para reiniciar al cambiar apiUrl/pollInterval)
  const statsIntervalRef=useRef(null);
  const alertsIntervalRef=useRef(null);

  const handleLogout=useCallback(()=>{
    localStorage.removeItem('omnivision_token');
    document.cookie='omnivision_token=;path=/;expires=Thu,01 Jan 1970 00:00:01 GMT;';
    window.location.href='/login';
  },[]);

  // Efecto principal: autenticación y carga de datos
  useEffect(()=>{
    const token=localStorage.getItem('omnivision_token');
    if(!token){window.location.href='/login';return;}
    const d=decodeToken(token);
    if(d)setUserInfo({name:d.name||'Operador',email:d.email||'admin@omnivision.local'});
    setTimeout(()=>setMounted(true),10);
    setTimeout(()=>setPageLoading(false),1400);
    setTimeout(()=>setRevealed(true),1800);

    const timeInterval=setInterval(()=>setCurrentTime(new Date()),1000);
    return()=>clearInterval(timeInterval);
  },[]);

  // Efecto de polling: se reinicia al cambiar apiUrl o pollInterval
  useEffect(()=>{
    const token=localStorage.getItem('omnivision_token');
    if(!token)return;

    const fetchStats=async()=>{
      try{const r=await fetch(`${apiUrl}/stats`,{headers:{Authorization:`Bearer ${token}`}});if(r.ok){setStats(await r.json());setSystemOnline(true);}else setSystemOnline(false);}catch{setSystemOnline(false);}
    };
    const fetchAlerts=async()=>{
      try{const r=await fetch(`${apiUrl}/alerts`,{headers:{Authorization:`Bearer ${token}`}});if(r.ok){setAlerts(await r.json());setSystemOnline(true);}else setSystemOnline(false);}catch{setSystemOnline(false);}
    };

    fetchStats();fetchAlerts();
    if(statsIntervalRef.current)clearInterval(statsIntervalRef.current);
    if(alertsIntervalRef.current)clearInterval(alertsIntervalRef.current);
    statsIntervalRef.current=setInterval(fetchStats,10000);
    alertsIntervalRef.current=setInterval(fetchAlerts,pollInterval);

    return()=>{
      if(statsIntervalRef.current)clearInterval(statsIntervalRef.current);
      if(alertsIntervalRef.current)clearInterval(alertsIntervalRef.current);
    };
  },[apiUrl,pollInterval]);

  const ts=currentTime ? currentTime.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) : '--:--:--';

  const handleNavigation=(section)=>{
    if(section===activeNav)return;
    setTransitioning(true);
    setTimeout(()=>{setActiveNav(section);setTransitioning(false);},250);
  };

  const navItems=[
    {id:'dashboard',icon:Icons.grid(),tip:'Panel'},
    {id:'cameras',icon:Icons.video(),tip:'Cámaras'},
    {id:'analysis',icon:Icons.chart(),tip:'Análisis'},
    {id:'alerts',icon:Icons.bell(),tip:'Alertas'},
    {id:'security',icon:Icons.shield(),tip:'Seguridad'},
    {id:'settings',icon:Icons.settings(),tip:'Configuración'},
  ];

  const titles={
    dashboard:'Descripción general',cameras:'Cámaras',analysis:'Análisis',
    alerts:'Alertas',security:'Seguridad',settings:'Configuración',access:'Accesos',
    profile:'Mi Perfil',
  };

  const renderView=()=>{
    switch(activeNav){
      case'cameras':return<ViewCameras stats={stats} apiUrl={apiUrl}/>;
      case'analysis':return<ViewAnalysis/>;
      case'alerts':return<ViewAlerts alerts={alerts}/>;
      case'security':return<ViewSecurity/>;
      case'settings':return<ViewSettingsPage userInfo={userInfo}/>;
      case'profile':return<ViewProfile userInfo={userInfo}/>;
      default:return<ViewDashboard stats={stats} videoOnline={videoOnline} setVideoOnline={setVideoOnline} systemOnline={systemOnline} apiUrl={apiUrl} alerts={alerts}/>;
    }
  };

  const titlesSpaced={
    dashboard:spaced('General'),
    cameras:spaced('Camaras'),
    analysis:spaced('Analisis'),
    alerts:spaced('Alertas'),
    security:spaced('Seguridad'),
    settings:spaced('Config'),
    access:spaced('Accesos'),
    profile:spaced('Perfil'),
  };

  return(<>
    <style>{`
      *{box-sizing:border-box; cursor: none !important;}
      .custom-cursor {
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.1s ease-out, opacity 0.2s ease;
      }
      body{margin:0;background:#08090a;}
      @keyframes pulseRec{0%,100%{opacity:1}50%{opacity:0.3}}
      @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.35}}
      @keyframes pageReveal{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
      @keyframes blobDrift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-15px) scale(1.06)}}
      @keyframes blobDrift2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,22px) scale(0.94)}}
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:10px}
      select option{background:#08090a;color:#f7f8f8;}
      input::placeholder{color:#62666d;}

      .text-primary { color: #f7f8f8; }
      .text-secondary { color: #d0d6e0; }
      .text-tertiary { color: #8a8f98; }
      .text-quaternary { color: #62666d; }

      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateY(20px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes fadeSlideLeft {
        from { opacity:0; transform:translateX(-20px); }
        to   { opacity:1; transform:translateX(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes zoomIn {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes pulse {
        0%,100% { opacity:1; }
        50%     { opacity:0.2; }
      }
      @keyframes loaderBar {
        from { width:0%; }
        to   { width:100%; }
      }
      @keyframes loaderFadeOut {
        from { opacity:1; pointer-events:all; }
        to   { opacity:0; pointer-events:none; }
      }

      .anim-sidebar { animation: fadeSlideLeft 0.5s cubic-bezier(0.4,0,0.2,1) 0ms both; }
      .anim-0 { animation: fadeSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) 0ms   both; }
      .anim-1 { animation: fadeSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) 120ms both; }
      .anim-2 { animation: fadeSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) 240ms both; }
      .anim-3 { animation: fadeSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) 360ms both; }

      .section-title {
        font-size: 15px;
        font-weight: 400;
        letter-spacing: 10px;
        text-transform: uppercase;
        color: #f7f8f8;
        user-select: none;
      }
      .grad-red {
        background: linear-gradient(to top, #ef4444 0%, #ef4444 20%, #991b1b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .grad-green {
        background: linear-gradient(to top, #22c55e 0%, #22c55e 20%, #166534 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .grad-yellow {
        background: linear-gradient(to top, #eab308 0%, #eab308 20%, #854d0e 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .dot-grid {
        background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0);
        background-size: 24px 24px;
      }
      @font-face { font-family: 'MR'; src: url('/fonts/MR.otf') format('opentype'); }
      @font-face { font-family: 'ML'; src: url('/fonts/ML.otf') format('opentype'); }
      @font-face { font-family: 'MB'; src: url('/fonts/MB.otf') format('opentype'); }
    `}</style>

    {/* ── LOADER UNIFICADO (Viene del Login) ── */}
    <div style={{
      position:'fixed',inset:0,background:'#08090a',zIndex:9999,
      display:'flex',alignItems:'center',justifyContent:'center',
      animation: pageLoading ? 'none' : 'loaderFadeOut 0.4s ease forwards',
      pointerEvents: pageLoading ? 'all' : 'none',
    }}>
      <img src="/logos/Isotipo 2.png" alt="Cargando" style={{ width: 64, height: 64, objectFit: 'contain', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>


    {/* ── FONDO CON BLOBS OSCUROS (estilo foto) ── */}
    <div style={{
      position:'fixed',inset:0,background:'#08090a',zIndex:0,overflow:'hidden',pointerEvents:'none'
    }}>
      {/* Blob 1 — esquina superior derecha */}
      <div style={{
        position:'absolute',top:'-8%',right:'-4%',
        width:'55vw',height:'60vh',
        background:'radial-gradient(ellipse at top right, rgba(44,44,44,0.92) 0%, rgba(24,24,24,0.58) 32%, rgba(12,12,12,0.2) 58%, transparent 78%)',
        filter:'blur(52px)',
        animation:'blobDrift 20s ease-in-out infinite',
      }}/>
      {/* Blob 2 — esquina inferior-izquierda */}
      <div style={{
        position:'absolute',bottom:'-5%',left:'-5%',
        width:'42vw',height:'50vh',
        background:'radial-gradient(ellipse at 20% 80%, rgba(38,38,38,0.8) 0%, rgba(20,20,20,0.45) 35%, transparent 68%)',
        filter:'blur(55px)',
        animation:'blobDrift2 25s ease-in-out infinite',
      }}/>

      {/* Grain overlay sutil (muy tenue) */}
      <div style={{
        position:'absolute',inset:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize:'200px 200px',
        opacity:0.05,mixBlendMode:'overlay',
      }}/>
    </div>

    {revealed && (
    <div style={{
      position:'relative',zIndex:1,
      display:'flex',height:'100vh',
      color:'#fff',fontFamily:inter.style.fontFamily,overflow:'hidden',
    }}>

      {/* ═══ SIDEBAR ═══ */}
      <div className="anim-sidebar" style={{
        width:72,height:'100vh',
        background:'transparent',
        display:'flex',flexDirection:'column',alignItems:'center',
        padding:'24px 0',flexShrink:0,position:'relative',zIndex:20,
      }}>
        <div onClick={() => handleNavigation('dashboard')} style={{
          width:36,height:36,borderRadius:10,
          background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',
          display:'flex',alignItems:'center',justifyContent:'center',
          color:'#fff',marginBottom:36,cursor:'pointer',
          backdropFilter:'blur(8px)',
        }}><img src="/logos/Isotipo 2.png" alt="Logotipo" style={{width: 20, height: 20, objectFit: 'contain'}} /></div>

        <div style={{flex:1,display:'flex',flexDirection:'column',gap:4}}>
          {navItems.map(n=><NavIcon key={n.id} icon={n.icon} active={activeNav===n.id} onClick={()=>handleNavigation(n.id)} tip={n.tip}/>)}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'center'}}>
          <NavIcon icon={Icons.logout()} active={false} onClick={handleLogout} tip="Cerrar sesión"/>
        </div>
      </div>

      {/* ═══ PANEL PRINCIPAL ═══ */}
      <div style={{
        flex:1,
        position: 'relative',
        background:'rgba(0,0,0,0.3)',
        backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)',
        borderTopLeftRadius:20,
        borderLeft:'1px solid rgba(255,255,255,0.05)',
        borderTop:'1px solid rgba(255,255,255,0.05)',
        display:'flex',flexDirection:'column',overflow:'hidden',
      }}>

        {/* ── HEADER SUPERIOR DERECHO (User pegado a la derecha) ── */}
        <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 100 }}>
          <div style={{ position: 'relative' }}>
            <NavIcon 
              icon={Icons.user()} 
              active={showUserMenu || activeNav==='profile'} 
              onClick={() => setShowUserMenu(v => !v)} 
              tip="" 
            />
            <UserDropdown show={showUserMenu} onClose={() => setShowUserMenu(false)} userInfo={userInfo}
              onOpenConfig={() => setActiveNav('settings')} onLogout={handleLogout} />
          </div>
        </div>

        {/* Contenido */}
        <div style={{
          flex:1,overflowY:'auto',padding:'40px 132px 64px 60px',
          display:'flex',flexDirection:'column',
          alignItems: 'center',
          justifyContent: activeNav==='dashboard'?'center':'flex-start',
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}>
          <div key={activeNav} style={{ width: '100%', maxWidth: 1440, animation:'fadeSlideUp 0.45s cubic-bezier(0.4,0,0.2,1) both'}}>
            {renderView()}
          </div>
        </div>
      </div>
      
      {/* ── DOT GRID LAYER (Fondo Moleskine sutil) ── */}
      <div className="dot-grid" style={{
        position:'fixed',inset:0,zIndex:1,pointerEvents:'none',opacity:0.4
      }}/>

      {/* ═══ DRAWER DE CONFIGURACIÓN ═══ */}
      <ConfigDrawer show={showConfig} onClose={()=>setShowConfig(false)} userInfo={userInfo}
        apiUrl={apiUrl} setApiUrl={setApiUrl} pollInterval={pollInterval} setPollInterval={setPollInterval}
        onLogout={handleLogout}/>
    </div>
    )}

    {/* ── Cursor Personalizado ── */}
    <div 
      className="custom-cursor"
      style={{
        left: mousePos.x, top: mousePos.y,
        width: '8px', height: '8px',
        background: '#fff', borderRadius: '50%',
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
        opacity: 1, zIndex: 10000
      }}
    />
    <div 
      className="custom-cursor"
      style={{
        left: trailPos.x, top: trailPos.y,
        width: '32px', height: '32px',
        border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%',
        transform: `translate(-50%, -50%) scale(${isClicking ? 1.5 : 1})`,
        opacity: 1, zIndex: 9999
      }}
    />
  </>);
}

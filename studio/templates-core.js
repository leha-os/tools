/* ============================================================================
   LEHA Studio — shared template helpers.
   Load BEFORE templates-photo-1.js / templates-photo-2.js / templates-vector.js
   and BEFORE templates-index.js. Classic scripts: top-level functions are global.
   No external assets. No emojis.
   ============================================================================ */

/* seeded RNG (stable thumbnails) */
function srand(seed){ var s=seed>>>0; return function(){ s=(s*9301+49297)%233280; return s/233280; }; }

/* rounded rect path */
function rr(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);     ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

/* star path data (SVG) */
function starD(cx,cy,ro,ri,n,rot){
  var d='',i,a,rad;
  for(i=0;i<n*2;i++){ a=(rot==null?-Math.PI/2:rot)+i*Math.PI/n; rad=(i%2)?ri:ro;
    d+=(i?'L':'M')+(cx+rad*Math.cos(a)).toFixed(1)+' '+(cy+rad*Math.sin(a)).toFixed(1); }
  return d+'Z';
}

/* regular polygon path data (SVG) */
function polyD(cx,cy,r,n,rot){
  var d='',i,a;
  for(i=0;i<n;i++){ a=(rot==null?-Math.PI/2:rot)+i*2*Math.PI/n;
    d+=(i?'L':'M')+(cx+r*Math.cos(a)).toFixed(1)+' '+(cy+r*Math.sin(a)).toFixed(1); }
  return d+'Z';
}

/* subtle film grain overlay */
function grain(ctx,w,h,seed,alpha,n){
  var R=srand(seed==null?7:seed),i; n=n||1400;
  ctx.save(); ctx.globalAlpha=(alpha==null?0.05:alpha); ctx.fillStyle='#ffffff';
  for(i=0;i<n;i++){ ctx.fillRect(R()*w,R()*h,1.6,1.6); }
  ctx.restore();
}

/* soft edge vignette */
function vignette(ctx,w,h,a){
  a=(a==null?0.32:a);
  var rg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*0.36,w/2,h/2,Math.max(w,h)*0.72);
  rg.addColorStop(0,'rgba(0,0,0,0)'); rg.addColorStop(1,'rgba(0,0,0,'+a+')');
  ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
}

/* double thin frame (premium border) */
function frame2(ctx,w,h,m,c1,c2){
  ctx.save();
  ctx.strokeStyle=c1; ctx.lineWidth=2.5; ctx.strokeRect(m,m,w-2*m,h-2*m);
  ctx.strokeStyle=c2; ctx.lineWidth=1; ctx.strokeRect(m+12,m+12,w-2*m-24,h-2*m-24);
  ctx.restore();
}

/* letterspaced eyebrow label, centered at x,y */
function eyebrow(ctx,txt,x,y,color,size){
  size=size||30;
  ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
  try{ ctx.letterSpacing=Math.round(size*0.28)+'px'; }catch(e){}
  ctx.fillStyle=color; ctx.font='600 '+size+'px Arial,sans-serif';
  ctx.fillText(txt,x,y); ctx.restore();
}

/* mesh gradient: base fill + soft radial color blobs.
   stops = [[x,y,radius,color], ...] */
function meshGlow(ctx,w,h,base,stops){
  var i,s,rg;
  ctx.fillStyle=base; ctx.fillRect(0,0,w,h);
  for(i=0;i<stops.length;i++){ s=stops[i];
    rg=ctx.createRadialGradient(s[0],s[1],10,s[0],s[1],s[2]);
    rg.addColorStop(0,s[3]); rg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
  }
}

/* soft elliptical drop shadow */
function softShadow(ctx,x,y,rx,ry,alpha){
  ctx.save();
  var rg=ctx.createRadialGradient(x,y,4,x,y,Math.max(rx,ry));
  rg.addColorStop(0,'rgba(0,0,0,'+(alpha==null?0.35:alpha)+')');
  rg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg;
  ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,6.3); ctx.fill();
  ctx.restore();
}

/* glassmorphism card: translucent panel + top highlight */
function glassCard(ctx,x,y,w,h,r){
  ctx.save();
  ctx.fillStyle='rgba(255,255,255,0.14)';
  rr(ctx,x,y,w,h,r); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=2;
  rr(ctx,x,y,w,h,r); ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(x+r,y+2); ctx.lineTo(x+w-r,y+2); ctx.stroke();
  ctx.restore();
}

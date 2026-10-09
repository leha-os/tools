/* ============================================================================
   LEHA Studio — photo templates, batch 2: events, Tet, mockups (16 templates).
   Loads AFTER templates-core.js (uses srand, rr, grain, vignette, frame2,
   eyebrow, meshGlow, softShadow, glassCard). IIFE; registers into the shared
   window.__LEHA_PHOTO_TPL__ object. No external assets. No emojis.
   Layer order = draw order (bg first, polish last).
   ============================================================================ */
(function(){
'use strict';
window.__LEHA_PHOTO_TPL__ = window.__LEHA_PHOTO_TPL__ || {};
var P = window.__LEHA_PHOTO_TPL__;

/* ---------------- local helpers (not global) ---------------- */
function _serif(ctx,size,weight){ ctx.font=(weight||'400')+' '+size+'px Georgia,"Times New Roman",serif'; }
function _sans(ctx,size,weight){ ctx.font=(weight||'400')+' '+size+'px Arial,Helvetica,sans-serif'; }

/* hanging paper lantern */
function _lantern(ctx,x,y,s){
  ctx.save();
  ctx.strokeStyle='rgba(120,40,20,0.85)'; ctx.lineWidth=Math.max(2,s*0.03);
  ctx.beginPath(); ctx.moveTo(x,y-s*1.15); ctx.lineTo(x,y-s*0.60); ctx.stroke();
  var bw=s*0.62, bh=s*0.72;
  var g=ctx.createRadialGradient(x-bw*0.25,y-bh*0.2,4,x,y,bw*1.15);
  g.addColorStop(0,'#d63a2f'); g.addColorStop(0.6,'#b3221a'); g.addColorStop(1,'#7d130e');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.ellipse(x,y,bw,bh,0,0,6.3); ctx.fill();
  ctx.strokeStyle='rgba(255,190,120,0.35)'; ctx.lineWidth=Math.max(1.5,s*0.02);
  var i,rx;
  for(i=1;i<5;i++){ rx=bw*i/5;
    ctx.beginPath(); ctx.ellipse(x,y,rx,bh*Math.sqrt(1-(rx*rx)/(bw*bw)),0,0,6.3); ctx.stroke(); }
  ctx.fillStyle='#d4af37';
  rr(ctx,x-bw*0.42,y-bh-s*0.16,bw*0.84,s*0.16,4); ctx.fill();
  rr(ctx,x-bw*0.42,y+bh,bw*0.84,s*0.16,4); ctx.fill();
  ctx.strokeStyle='#d4af37'; ctx.lineWidth=Math.max(2,s*0.035);
  ctx.beginPath(); ctx.moveTo(x,y+bh+s*0.16); ctx.lineTo(x,y+bh+s*0.55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-s*0.08,y+bh+s*0.55); ctx.lineTo(x+s*0.08,y+bh+s*0.55); ctx.stroke();
  ctx.restore();
}

/* 5-petal blossom: petals are ellipses rotated around the center */
function _blossom(ctx,x,y,r,c1,c2){
  var i;
  ctx.save();
  for(i=0;i<5;i++){
    ctx.save(); ctx.translate(x,y); ctx.rotate(i*Math.PI*2/5-Math.PI/2);
    var g=ctx.createRadialGradient(0,-r*0.5,2,0,-r*0.5,r*0.8);
    g.addColorStop(0,c2||'#fff3d6'); g.addColorStop(1,c1||'#e9b949');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.ellipse(0,-r*0.55,r*0.40,r*0.62,0,0,6.3); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle='#c98a1e';
  ctx.beginPath(); ctx.arc(x,y,r*0.20,0,6.3); ctx.fill();
  ctx.restore();
}

/* smooth branch through points */
function _branch(ctx,pts,color,lw){
  ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
  var i;
  for(i=1;i<pts.length-1;i++){
    ctx.quadraticCurveTo(pts[i][0],pts[i][1],(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2);
  }
  ctx.lineTo(pts[pts.length-1][0],pts[pts.length-1][1]); ctx.stroke();
  ctx.restore();
}

/* firework burst */
function _firework(ctx,x,y,r,seed){
  var R=srand(seed),i,a,l;
  ctx.save();
  for(i=0;i<14;i++){ a=R()*6.3; l=r*(0.5+R()*0.5);
    ctx.strokeStyle='rgba(243,210,122,'+(0.35+R()*0.35)+')'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(x+Math.cos(a)*r*0.25,y+Math.sin(a)*r*0.25);
    ctx.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); ctx.stroke();
    ctx.fillStyle='rgba(255,235,180,0.8)';
    ctx.beginPath(); ctx.arc(x+Math.cos(a)*l,y+Math.sin(a)*l,3,0,6.3); ctx.fill(); }
  ctx.restore();
}

/* gold confetti dots */
function _confetti(ctx,w,h,n,seed,cols){
  var R=srand(seed),i;
  ctx.save();
  for(i=0;i<n;i++){ ctx.globalAlpha=0.20+R()*0.55; ctx.fillStyle=cols[i%cols.length];
    ctx.beginPath(); ctx.arc(R()*w,R()*h,2+R()*6,0,6.3); ctx.fill(); }
  ctx.restore();
}

/* radial sunburst from (cx,cy) */
function _sunburst(ctx,cx,cy,r1,r2,n,color,lw){
  var i,a;
  ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=lw;
  for(i=0;i<n;i++){ a=i*2*Math.PI/n;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);
    ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2); ctx.stroke(); }
  ctx.restore();
}

/* ================= 1. wedding-invitation — 1080x1350 — event ================= */
P['wedding-invitation']={ w:1080,h:1350,cat:'event',nameKey:'tpl_wedding_invitation',descKey:'tpl_wedding_invitation_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#f6eee2',[
      [w*0.5,h*0.30,w*0.62,'rgba(219,164,150,0.55)'],
      [w*0.88,h*0.82,w*0.60,'rgba(186,148,96,0.38)'],
      [w*0.10,h*0.88,w*0.55,'rgba(238,205,190,0.55)'],
      [w*0.5,h*0.02,w*0.50,'rgba(255,248,236,0.70)']
    ]);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var m=w*0.05,i,c;
    frame2(ctx,w,h,m,'rgba(178,141,84,0.95)','rgba(178,141,84,0.50)');
    var cs=[[m,m,1,1],[w-m,m,-1,1],[m,h-m,1,-1],[w-m,h-m,-1,-1]];
    ctx.save();
    for(i=0;i<4;i++){ c=cs[i];
      ctx.save(); ctx.translate(c[0],c[1]); ctx.scale(c[2],c[3]);
      ctx.strokeStyle='rgba(178,141,84,0.85)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(w*0.115,w*0.115,w*0.105,Math.PI,Math.PI*1.5); ctx.stroke();
      ctx.beginPath(); ctx.arc(w*0.175,w*0.175,w*0.05,Math.PI,Math.PI*1.5); ctx.stroke();
      ctx.fillStyle='rgba(178,141,84,0.9)';
      ctx.beginPath(); ctx.arc(w*0.115,w*0.115,7,0,6.3); ctx.fill();
      ctx.beginPath(); ctx.arc(w*0.24,w*0.05,5,0,6.3); ctx.fill();
      ctx.beginPath(); ctx.arc(w*0.05,w*0.24,5,0,6.3); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    _confetti(ctx,w,h,42,5,['#c9a05a','#e8c98a','#b28d54']);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var cx=w/2;
    eyebrow(ctx,(lang==='vi'?'LỄ THÀNH HÔN':'THE WEDDING OF'),cx,h*0.235,'#a07d3c',Math.round(w*0.027));
    ctx.save();
    ctx.strokeStyle='rgba(178,141,84,0.7)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(w*0.32,h*0.30); ctx.lineTo(w*0.68,h*0.30); ctx.stroke();
    ctx.fillStyle='#b28d54';
    ctx.translate(cx,h*0.30); ctx.rotate(Math.PI/4); ctx.fillRect(-9,-9,18,18);
    ctx.restore();
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _serif(ctx,Math.round(w*0.105),'400'); ctx.fillStyle='#4a382c';
    ctx.fillText('Anh Thư',cx,h*0.40);
    ctx.font='italic '+Math.round(w*0.06)+'px Georgia,serif'; ctx.fillStyle='#a07d3c';
    ctx.fillText('&',cx,h*0.475);
    _serif(ctx,Math.round(w*0.105),'400'); ctx.fillStyle='#4a382c';
    ctx.fillText('Minh Quân',cx,h*0.55);
    eyebrow(ctx,'26 · 12 · 2026',cx,h*0.635,'#8a6d35',Math.round(w*0.034));
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.028),'400'); ctx.fillStyle='#6b5a48';
    ctx.fillText(lang==='vi'?'TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH':'TOGETHER WITH THEIR FAMILIES',cx,h*0.715);
    _sans(ctx,Math.round(w*0.030),'600'); ctx.fillStyle='#4a382c';
    ctx.fillText('GEM CENTER · TP. HỒ CHÍ MINH',cx,h*0.76);
    _sans(ctx,Math.round(w*0.028),'400'); ctx.fillStyle='#6b5a48';
    ctx.fillText(lang==='vi'?'Đón khách 17:30 — Khai tiệc 18:30':'Reception 5:30 PM — Dinner 6:30 PM',cx,h*0.805);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.16); grain(ctx,w,h,21,0.045,1100);
  }}
 ]};

/* ================= 2. grand-opening — 1080x1350 — event ================= */
P['grand-opening']={ w:1080,h:1350,cat:'event',nameKey:'tpl_grand_opening',descKey:'tpl_grand_opening_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#7e1016',[
      [w*0.5,h*0.34,w*0.72,'rgba(228,180,62,0.55)'],
      [w*0.5,h*1.05,w*0.85,'rgba(24,5,7,0.78)'],
      [w*0.06,h*0.06,w*0.42,'rgba(170,40,40,0.55)']
    ]);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    _sunburst(ctx,w/2,h*0.36,w*0.10,w*0.78,40,'rgba(230,190,90,0.10)',6);
    ctx.save();
    ctx.strokeStyle='rgba(230,190,90,0.50)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(w/2,h*0.36,w*0.30,0,6.3); ctx.stroke();
    ctx.strokeStyle='rgba(230,190,90,0.25)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(w/2,h*0.36,w*0.34,0,6.3); ctx.stroke();
    ctx.restore();
    _confetti(ctx,w,h,70,12,['#f3d27a','#e8b84e','#fff3d6','#d43a2f']);
    frame2(ctx,w,h,w*0.045,'rgba(230,190,90,0.95)','rgba(230,190,90,0.45)');
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var cx=w/2;
    eyebrow(ctx,(lang==='vi'?'KHAI TRƯƠNG HỒNG PHÁT':'GRAND OPENING'),cx,h*0.185,'#f3d27a',Math.round(w*0.032));
    ctx.textAlign='center'; ctx.textBaseline='middle';
    try{ ctx.letterSpacing='10px'; }catch(e){}
    _serif(ctx,Math.round(w*0.135),'400'); ctx.fillStyle='#fbf3df';
    ctx.fillText('LUMIÈRE',cx,h*0.345);
    try{ ctx.letterSpacing='0px'; }catch(e){}
    eyebrow(ctx,'SPA & BEAUTY',cx,h*0.44,'rgba(251,243,223,0.85)',Math.round(w*0.028));
    ctx.save();
    ctx.fillStyle='#e6b84e';
    rr(ctx,w*0.31,h*0.50,w*0.38,h*0.075,Math.round(h*0.037)); ctx.fill();
    _sans(ctx,Math.round(w*0.040),'700'); ctx.fillStyle='#7e1016';
    ctx.fillText('21 · 01 · 2026',cx,h*0.50+h*0.0375);
    ctx.restore();
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.034),'600'); ctx.fillStyle='#fbf3df';
    ctx.fillText(lang==='vi'?'Ưu đãi 50% trong ngày khai trương':'50% off on opening day',cx,h*0.65);
    _sans(ctx,Math.round(w*0.028),'400'); ctx.fillStyle='rgba(251,243,223,0.8)';
    ctx.fillText('123 Nguyễn Huệ, Quận 1, TP. HCM',cx,h*0.70);
    ctx.fillText('09:00 — 22:00',cx,h*0.745);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.32); grain(ctx,w,h,22,0.05,1300);
  }}
 ]};

/* ================= 3. event-ticket — 1600x640 — event ================= */
P['event-ticket']={ w:1600,h:640,cat:'event',nameKey:'tpl_event_ticket',descKey:'tpl_event_ticket_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#0d2430',[
      [w*0.5,h*0.5,w*0.60,'rgba(60,130,160,0.35)'],
      [w*0.85,h*0.10,w*0.40,'rgba(212,175,55,0.25)'],
      [w*0.08,h*0.95,w*0.45,'rgba(10,40,55,0.60)']
    ]);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var tx=w*0.055, ty=h*0.10, tw=w*0.89, th=h*0.80;
    ctx.save();
    ctx.fillStyle='#f7f1e1';
    rr(ctx,tx,ty,tw,th,26); ctx.fill();
    ctx.strokeStyle='#d4af37'; ctx.lineWidth=3;
    rr(ctx,tx+10,ty+10,tw-20,th-20,18); ctx.stroke();
    var px1=tx+tw*0.20, px2=tx+tw*0.80;
    ctx.strokeStyle='rgba(90,70,40,0.55)'; ctx.lineWidth=3; ctx.setLineDash([12,10]);
    ctx.beginPath(); ctx.moveTo(px1,ty+16); ctx.lineTo(px1,ty+th-16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px2,ty+16); ctx.lineTo(px2,ty+th-16); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#0d2430';
    var ns=[[px1,ty],[px1,ty+th],[px2,ty],[px2,ty+th]],i;
    for(i=0;i<4;i++){ ctx.beginPath(); ctx.arc(ns[i][0],ns[i][1],22,0,6.3); ctx.fill(); }
    ctx.restore();
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var tx=w*0.055, ty=h*0.10, tw=w*0.89, th=h*0.80;
    var px1=tx+tw*0.20, px2=tx+tw*0.80;
    ctx.save();
    ctx.textAlign='center'; ctx.textBaseline='middle';
    /* left stub: vertical label */
    ctx.save(); ctx.translate(tx+tw*0.10,ty+th/2); ctx.rotate(-Math.PI/2);
    try{ ctx.letterSpacing='8px'; }catch(e){}
    _sans(ctx,40,'700'); ctx.fillStyle='#8a6d35';
    ctx.fillText(lang==='vi'?'VÉ MỜI':'ADMIT ONE',0,0);
    try{ ctx.letterSpacing='0px'; }catch(e){}
    ctx.restore();
    /* main zone */
    var cx=(px1+px2)/2;
    eyebrow(ctx,(lang==='vi'?'LỄ HỘI ÂM NHẠC MÙA HÈ · 2026':'SUMMER MUSIC FEST · 2026'),cx,ty+th*0.26,'#8a6d35',30);
    _serif(ctx,104,'700'); ctx.fillStyle='#14313d';
    ctx.fillText(lang==='vi'?'ĐÊM HỘI MÙA HÈ':'SUMMER FEST',cx,ty+th*0.52);
    /* right stub: serial + barcode */
    var sx=(px2+tx+tw)/2;
    _sans(ctx,44,'700'); ctx.fillStyle='#14313d';
    ctx.fillText('A-0482',sx,ty+th*0.24);
    var R=srand(9),bx=sx-110,i,bw2;
    ctx.fillStyle='#14313d';
    for(i=0;i<26;i++){ bw2=2+R()*6;
      ctx.fillRect(bx,ty+th*0.40,bw2,th*0.26); bx+=bw2+3+R()*4; }
    _sans(ctx,22,'400'); ctx.fillStyle='#8a6d35';
    ctx.fillText(lang==='vi'?'QUÉT TẠI CỔNG':'SCAN AT GATE',sx,ty+th*0.80);
    ctx.restore();
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var tx=w*0.055, ty=h*0.10, tw=w*0.89, th=h*0.80;
    var cx=(tx+tw*0.20+tx+tw*0.80)/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,30,'600'); ctx.fillStyle='#14313d';
    ctx.fillText('SAT 15.08.2026 · 19:00',cx,ty+th*0.74);
    _sans(ctx,26,'400'); ctx.fillStyle='#5a6a72';
    ctx.fillText(lang==='vi'?'SVĐ MỸ ĐÌNH — HÀ NỘI · KHU A · GHẾ 0482':'MY DINH STADIUM — HANOI · ZONE A · SEAT 0482',cx,ty+th*0.85);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.22); grain(ctx,w,h,23,0.04,900);
  }}
 ]};

/* ================= 4. travel-poster — 1080x1350 — event ================= */
P['travel-poster']={ w:1080,h:1350,cat:'event',nameKey:'tpl_travel_poster',descKey:'tpl_travel_poster_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#2b3a67'); g.addColorStop(0.42,'#7a5a8a');
    g.addColorStop(0.60,'#e08e6d'); g.addColorStop(0.74,'#f6c98f'); g.addColorStop(1,'#332a4c');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    var sx=w*0.62, sy=h*0.52, sr=w*0.15;
    var sg=ctx.createRadialGradient(sx,sy,sr*0.2,sx,sy,sr*2.8);
    sg.addColorStop(0,'rgba(255,222,150,0.9)'); sg.addColorStop(1,'rgba(255,222,150,0)');
    ctx.fillStyle=sg; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#ffe6b0';
    ctx.beginPath(); ctx.arc(sx,sy,sr,0,6.3); ctx.fill();
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    function ridge(y,amp,color,seed){
      var R=srand(seed),x,xx;
      ctx.fillStyle=color; ctx.beginPath(); ctx.moveTo(-4,h+4); ctx.lineTo(-4,y);
      xx=0;
      for(x=0;x<=8;x++){ xx=x*w/8;
        ctx.lineTo(xx,y-amp*(0.35+0.65*R())*(x%2?1:0.55)); }
      ctx.lineTo(w+4,h+4); ctx.closePath(); ctx.fill();
    }
    ridge(h*0.60,h*0.11,'rgba(150,110,150,0.55)',31);
    ridge(h*0.66,h*0.10,'rgba(110,85,130,0.80)',32);
    ridge(h*0.74,h*0.09,'#4a3a5e',33);
    /* water + sun reflection */
    ctx.fillStyle='#332a4c'; ctx.fillRect(0,h*0.80,w,h*0.20);
    var sx=w*0.62, sr=w*0.15;
    var rg=ctx.createLinearGradient(0,h*0.80,0,h);
    rg.addColorStop(0,'rgba(255,200,130,0.55)'); rg.addColorStop(1,'rgba(255,200,130,0)');
    ctx.fillStyle=rg; ctx.fillRect(sx-sr*0.7,h*0.80,sr*1.4,h*0.20);
    ctx.strokeStyle='rgba(255,220,170,0.25)'; ctx.lineWidth=2;
    var R2=srand(34),i,yy;
    for(i=0;i<7;i++){ yy=h*0.83+i*h*0.024;
      ctx.beginPath(); ctx.moveTo(sx-sr*(0.8+R2()*0.4),yy); ctx.lineTo(sx+sr*(0.8+R2()*0.4),yy); ctx.stroke(); }
    ridge(h*0.87,h*0.05,'#241d38',35);
    /* clouds */
    ctx.fillStyle='rgba(255,225,195,0.30)';
    var cl=[[w*0.25,h*0.30,w*0.16],[w*0.70,h*0.22,w*0.12],[w*0.45,h*0.38,w*0.10]],k;
    for(k=0;k<3;k++){ ctx.beginPath(); ctx.ellipse(cl[k][0],cl[k][1],cl[k][2],cl[k][2]*0.35,0,0,6.3); ctx.fill(); }
    /* birds */
    ctx.strokeStyle='rgba(40,30,50,0.85)'; ctx.lineWidth=3; ctx.lineCap='round';
    var R3=srand(36),b,bx,by;
    for(b=0;b<6;b++){ bx=w*(0.15+R3()*0.6); by=h*(0.18+R3()*0.22);
      ctx.beginPath(); ctx.moveTo(bx-13,by); ctx.quadraticCurveTo(bx-6,by-9,bx,by);
      ctx.quadraticCurveTo(bx+6,by-9,bx+13,by); ctx.stroke(); }
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var cx=w/2;
    eyebrow(ctx,(lang==='vi'?'BỘ SƯU TẬP DU LỊCH':'RETRO TRAVEL SERIES'),cx,h*0.115,'rgba(255,240,220,0.9)',Math.round(w*0.027));
    ctx.textAlign='center'; ctx.textBaseline='middle';
    try{ ctx.letterSpacing='14px'; }catch(e){}
    _serif(ctx,Math.round(w*0.165),'400'); ctx.fillStyle='#fdf3e0';
    ctx.fillText('ĐÀ LẠT',cx,h*0.20);
    try{ ctx.letterSpacing='0px'; }catch(e){}
    ctx.save(); ctx.strokeStyle='rgba(253,243,224,0.7)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(w*0.30,h*0.265); ctx.lineTo(w*0.70,h*0.265); ctx.stroke();
    ctx.restore();
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font='italic '+Math.round(w*0.032)+'px Georgia,serif'; ctx.fillStyle='rgba(253,243,224,0.95)';
    ctx.fillText(lang==='vi'?'Thành phố ngàn hoa · 1962':'City of a thousand flowers · 1962',cx,h*0.945);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.30); grain(ctx,w,h,24,0.06,1500);
  }}
 ]};

/* ================= 5. movie-poster — 1080x1600 — event ================= */
P['movie-poster']={ w:1080,h:1600,cat:'event',nameKey:'tpl_movie_poster',descKey:'tpl_movie_poster_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#0a0a10',[
      [w*0.5,h*0.28,w*0.60,'rgba(160,25,30,0.55)'],
      [w*0.5,h*0.95,w*0.80,'rgba(15,15,35,0.85)'],
      [w*0.10,h*0.60,w*0.40,'rgba(40,40,80,0.40)']
    ]);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var mx=w*0.5,my=h*0.28,mr=w*0.19;
    var sg=ctx.createRadialGradient(mx,my,mr*0.3,mx,my,mr*2.6);
    sg.addColorStop(0,'rgba(230,60,50,0.55)'); sg.addColorStop(1,'rgba(230,60,50,0)');
    ctx.fillStyle=sg; ctx.fillRect(0,0,w,h);
    var mg=ctx.createRadialGradient(mx-mr*0.3,my-mr*0.3,mr*0.1,mx,my,mr);
    mg.addColorStop(0,'#ff6a55'); mg.addColorStop(1,'#a31621');
    ctx.fillStyle=mg;
    ctx.beginPath(); ctx.arc(mx,my,mr,0,6.3); ctx.fill();
    ctx.save(); ctx.strokeStyle='rgba(224,50,44,0.5)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(mx,my,mr*1.35,0,6.3); ctx.stroke(); ctx.restore();
    /* light beams */
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.045)';
    var b;
    for(b=0;b<3;b++){ ctx.beginPath();
      ctx.moveTo(w*(0.15+b*0.3),0); ctx.lineTo(w*(0.25+b*0.3),0);
      ctx.lineTo(w*(0.45+b*0.3),h*0.7); ctx.lineTo(w*(0.30+b*0.3),h*0.7);
      ctx.closePath(); ctx.fill(); }
    ctx.restore();
    /* skyline silhouette */
    var R=srand(77),x,bw2,bh2,base=h*0.80,i,j;
    ctx.fillStyle='#050508';
    for(i=0,x=0;i<14;i++){ bw2=w/14; bh2=h*(0.07+R()*0.17);
      ctx.fillRect(x,base-bh2,bw2-3,bh2); x+=bw2; }
    var R2=srand(78);
    ctx.fillStyle='rgba(240,200,110,0.75)';
    for(j=0;j<46;j++){ ctx.fillRect(R2()*w,base-h*0.24+R2()*h*0.20,4,6); }
    ctx.fillStyle='#050508'; ctx.fillRect(0,base,w,h-base);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var cx=w/2;
    eyebrow(ctx,(lang==='vi'?'SẮP KHỞI CHIẾU':'COMING SOON'),cx,h*0.545,'#e0322c',Math.round(w*0.030));
    ctx.textAlign='center'; ctx.textBaseline='middle';
    try{ ctx.letterSpacing='10px'; }catch(e){}
    _sans(ctx,Math.round(w*0.155),'800'); ctx.fillStyle='#f2ead9';
    ctx.fillText(lang==='vi'?'BÓNG ĐÊM':'NIGHTFALL',cx,h*0.635);
    try{ ctx.letterSpacing='0px'; }catch(e){}
    ctx.fillStyle='#e0322c';
    ctx.fillRect(cx-w*0.15,h*0.70,w*0.30,7);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.030),'600'); ctx.fillStyle='rgba(242,234,217,0.95)';
    ctx.fillText(lang==='vi'?'KHỞI CHIẾU 30.10.2026':'IN CINEMAS 30.10.2026',cx,h*0.755);
    _sans(ctx,Math.round(w*0.022),'400'); ctx.fillStyle='rgba(200,195,185,0.7)';
    ctx.fillText(lang==='vi'?'MỘT BỘ PHIM HÀNH ĐỘNG · 120 PHÚT':'AN ACTION THRILLER · 120 MIN',cx,h*0.795);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.45); grain(ctx,w,h,25,0.08,2200);
  }}
 ]};

/* ================= 6. tet-poster — 1080x1350 — tet ================= */
P['tet-poster']={ w:1080,h:1350,cat:'tet',nameKey:'tpl_tet_poster',descKey:'tpl_tet_poster_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#a31621',[
      [w*0.5,h*0.20,w*0.62,'rgba(255,190,90,0.35)'],
      [w*0.5,h*1.05,w*0.85,'rgba(58,5,8,0.72)'],
      [w*0.08,h*0.50,w*0.35,'rgba(200,60,50,0.40)']
    ]);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var i;
    ctx.save();
    ctx.strokeStyle='rgba(212,175,55,0.35)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(w/2,h*0.52,w*0.34,0,6.3); ctx.stroke();
    ctx.strokeStyle='rgba(212,175,55,0.20)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(w/2,h*0.52,w*0.385,0,6.3); ctx.stroke();
    ctx.restore();
    var lx=[0.14,0.32,0.50,0.68,0.86],ls=[0.10,0.13,0.11,0.13,0.10];
    for(i=0;i<5;i++){ var s=w*ls[i];
      _lantern(ctx,w*lx[i],h*0.015+s*1.15,s); }
    _branch(ctx,[[-20,h*0.99],[w*0.16,h*0.90],[w*0.30,h*0.965],[w*0.44,h*0.875]],'#5a3a22',9);
    _branch(ctx,[[w+20,h*0.99],[w*0.84,h*0.90],[w*0.70,h*0.965],[w*0.56,h*0.875]],'#5a3a22',9);
    var bp=[[0.09,0.925],[0.20,0.885],[0.31,0.945],[0.42,0.872],[0.91,0.925],[0.80,0.885],[0.69,0.945],[0.58,0.872]];
    for(i=0;i<bp.length;i++) _blossom(ctx,w*bp[i][0],h*bp[i][1],w*0.032,'#e9b949','#fff3d6');
    _firework(ctx,w*0.16,h*0.30,w*0.07,51);
    _firework(ctx,w*0.85,h*0.26,w*0.055,52);
    _firework(ctx,w*0.72,h*0.68,w*0.05,53);
    _confetti(ctx,w,h,50,54,['#f3d27a','#ffd98a','#fff3d6']);
    frame2(ctx,w,h,w*0.045,'rgba(212,175,55,0.95)','rgba(212,175,55,0.45)');
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var cx=w/2;
    eyebrow(ctx,(lang==='vi'?'TẾT BÍNH NGỌ · 2026':'LUNAR NEW YEAR · 2026'),cx,h*0.395,'#f3d27a',Math.round(w*0.030));
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _serif(ctx,Math.round(w*0.115),'400'); ctx.fillStyle='#f3d27a';
    ctx.fillText(lang==='vi'?'Chúc Mừng':'Happy',cx,h*0.495);
    ctx.fillText(lang==='vi'?'Năm Mới':'New Year',cx,h*0.60);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font='italic '+Math.round(w*0.034)+'px Georgia,serif'; ctx.fillStyle='#fbeed3';
    ctx.fillText(lang==='vi'?'An khang thịnh vượng · Vạn sự như ý':'Health, prosperity and luck to you and yours',cx,h*0.705);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.30); grain(ctx,w,h,26,0.05,1300);
  }}
 ]};

/* ================= 7. tet-card — 1080x1080 — tet ================= */
P['tet-card']={ w:1080,h:1080,cat:'tet',nameKey:'tpl_tet_card',descKey:'tpl_tet_card_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#f7ead6',[
      [w*0.5,h*0.5,w*0.72,'rgba(228,168,88,0.42)'],
      [w*0.08,h*0.92,w*0.45,'rgba(190,110,70,0.30)'],
      [w*0.92,h*0.08,w*0.45,'rgba(220,150,90,0.30)']
    ]);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var m=w*0.07,i,x,y;
    /* diamond pattern border */
    ctx.save(); ctx.fillStyle='rgba(190,140,60,0.65)';
    for(x=m+20;x<w-m-20;x+=52){ diamond(x,m+8,9); diamond(x,h-m-8,9); }
    for(y=m+20;y<h-m-20;y+=52){ diamond(m+8,y,9); diamond(w-m-8,y,9); }
    ctx.restore();
    function diamond(dx,dy,r){ ctx.save(); ctx.translate(dx,dy); ctx.rotate(Math.PI/4);
      ctx.fillRect(-r,-r,2*r,2*r); ctx.restore(); }
    /* medallion */
    var cx=w/2, cy=h*0.40, r=w*0.29;
    var mg=ctx.createRadialGradient(cx-r*0.3,cy-r*0.3,r*0.1,cx,cy,r);
    mg.addColorStop(0,'#c22420'); mg.addColorStop(1,'#7d130e');
    ctx.fillStyle=mg;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,6.3); ctx.fill();
    ctx.save();
    ctx.strokeStyle='#d4af37'; ctx.lineWidth=6;
    ctx.beginPath(); ctx.arc(cx,cy,r-4,0,6.3); ctx.stroke();
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(cx,cy,r-22,0,6.3); ctx.stroke();
    ctx.restore();
    _blossom(ctx,cx,cy,r*0.42,'#e9b949','#fff3d6');
    ctx.save(); ctx.fillStyle='rgba(243,210,122,0.9)';
    for(i=0;i<12;i++){ var a=i*Math.PI/6;
      ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*0.72,cy+Math.sin(a)*r*0.72,6,0,6.3); ctx.fill(); }
    ctx.restore();
    /* corner peach blossoms */
    var cs=[[m+30,m+30],[w-m-30,m+30],[m+30,h-m-30],[w-m-30,h-m-30]];
    for(i=0;i<4;i++){ _blossom(ctx,cs[i][0],cs[i][1],w*0.042,'#e88aa0','#f7c8d4'); }
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    try{ ctx.letterSpacing='8px'; }catch(e){}
    _serif(ctx,Math.round(w*0.078),'400'); ctx.fillStyle='#a31621';
    ctx.fillText(lang==='vi'?'TẾT AN KHANG':'A PEACEFUL TET',cx,h*0.775);
    try{ ctx.letterSpacing='0px'; }catch(e){}
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.030),'400'); ctx.fillStyle='#7a5a3a';
    ctx.fillText(lang==='vi'?'Chúc mừng năm mới · Vạn sự như ý':'Happy Lunar New Year · May all your wishes come true',cx,h*0.855);
    eyebrow(ctx,'2026',cx,h*0.915,'#b28d54',Math.round(w*0.030));
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.15); grain(ctx,w,h,27,0.04,1000);
  }}
 ]};

/* ================= 8. tet-sale — 1080x1350 — tet ================= */
P['tet-sale']={ w:1080,h:1350,cat:'tet',nameKey:'tpl_tet_sale',descKey:'tpl_tet_sale_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#9c1218',[
      [w*0.5,h*0.35,w*0.72,'rgba(255,172,64,0.50)'],
      [w*0.5,h*1.02,w*0.85,'rgba(48,5,8,0.78)'],
      [w*0.90,h*0.08,w*0.40,'rgba(200,60,50,0.45)']
    ]);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    _sunburst(ctx,w/2,h*0.42,w*0.12,w*0.80,36,'rgba(255,200,100,0.10)',7);
    _confetti(ctx,w,h,80,61,['#f3d27a','#ffd98a','#fff3d6','#ff8a5a']);
    _lantern(ctx,w*0.10,h*0.02+w*0.09*1.15,w*0.09);
    _lantern(ctx,w*0.90,h*0.02+w*0.09*1.15,w*0.09);
    /* SALE badge */
    ctx.save(); ctx.translate(w*0.80,h*0.20); ctx.rotate(0.18);
    var br=w*0.115;
    var bg2=ctx.createRadialGradient(-br*0.3,-br*0.3,br*0.1,0,0,br);
    bg2.addColorStop(0,'#ffe9b0'); bg2.addColorStop(1,'#e6b84e');
    ctx.fillStyle=bg2;
    ctx.beginPath(); ctx.arc(0,0,br,0,6.3); ctx.fill();
    ctx.strokeStyle='#a31621'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.arc(0,0,br-8,0,6.3); ctx.stroke();
    _sans(ctx,Math.round(w*0.055),'800'); ctx.fillStyle='#a31621';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('SALE',0,4);
    ctx.restore();
    frame2(ctx,w,h,w*0.045,'rgba(243,210,122,0.95)','rgba(243,210,122,0.45)');
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var cx=w/2;
    eyebrow(ctx,(lang==='vi'?'KHUYẾN MÃI TẾT':'TET PROMOTION'),cx,h*0.22,'#f3d27a',Math.round(w*0.032));
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.14),'800'); ctx.fillStyle='#fdf3df';
    ctx.fillText(lang==='vi'?'SALE TẾT':'TET SALE',cx,h*0.35);
    _serif(ctx,Math.round(w*0.22),'700'); ctx.fillStyle='#f3d27a';
    ctx.fillText('-50%',cx,h*0.56);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.032),'600'); ctx.fillStyle='#fdf3df';
    ctx.fillText(lang==='vi'?'Giảm đến 50% · Lì xì may mắn mỗi đơn':'Up to 50% off · Lucky gift with every order',cx,h*0.71);
    eyebrow(ctx,'01 — 15.02.2026',cx,h*0.775,'#f3d27a',Math.round(w*0.030));
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.30); grain(ctx,w,h,28,0.05,1300);
  }}
 ]};

/* ================= 9. tet-banner — 1920x640 — tet ================= */
P['tet-banner']={ w:1920,h:640,cat:'tet',nameKey:'tpl_tet_banner',descKey:'tpl_tet_banner_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,w,0);
    g.addColorStop(0,'#8d1219'); g.addColorStop(0.5,'#c22420'); g.addColorStop(1,'#8d1219');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    meshGlow(ctx,w,h,'rgba(0,0,0,0)',[
      [w*0.5,h*0.30,w*0.45,'rgba(255,190,90,0.28)'],
      [w*0.5,h*1.05,w*0.70,'rgba(50,5,8,0.55)']
    ]);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var i;
    /* gold wave along the bottom */
    ctx.save(); ctx.fillStyle='rgba(212,175,55,0.16)';
    ctx.beginPath(); ctx.moveTo(0,h);
    for(i=0;i<=w;i+=40){ ctx.lineTo(i,h*0.78+Math.sin(i/w*Math.PI*3)*h*0.05); }
    ctx.lineTo(w,h); ctx.closePath(); ctx.fill(); ctx.restore();
    /* wavy gold lines */
    ctx.save(); ctx.strokeStyle='rgba(212,175,55,0.5)'; ctx.lineWidth=3;
    var k;
    for(k=0;k<2;k++){ ctx.beginPath();
      for(i=0;i<=w;i+=40){ var yy=h*(0.86+k*0.06)+Math.sin(i/w*Math.PI*3+k)*h*0.02;
        if(i===0) ctx.moveTo(i,yy); else ctx.lineTo(i,yy); }
      ctx.stroke(); }
    ctx.restore();
    /* hanging lanterns */
    var s=w*0.032;
    for(i=0;i<6;i++){ _lantern(ctx,w*(0.08+i*0.168),s*1.15+6,s); }
    /* blossom clusters, bottom corners */
    _branch(ctx,[[-10,h*0.98],[w*0.07,h*0.86],[w*0.13,h*0.95]],'#5a3a22',7);
    _branch(ctx,[[w+10,h*0.98],[w*0.93,h*0.86],[w*0.87,h*0.95]],'#5a3a22',7);
    _blossom(ctx,w*0.05,h*0.88,w*0.028,'#e9b949','#fff3d6');
    _blossom(ctx,w*0.11,h*0.93,w*0.024,'#e9b949','#fff3d6');
    _blossom(ctx,w*0.95,h*0.88,w*0.028,'#e9b949','#fff3d6');
    _blossom(ctx,w*0.89,h*0.93,w*0.024,'#e9b949','#fff3d6');
    _confetti(ctx,w,h,40,62,['#f3d27a','#ffd98a']);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var cx=w/2;
    eyebrow(ctx,(lang==='vi'?'TẾT BÍNH NGỌ · 2026':'LUNAR NEW YEAR · 2026'),cx,h*0.30,'#f3d27a',Math.round(w*0.017));
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _serif(ctx,Math.round(w*0.072),'400'); ctx.fillStyle='#f6dc8e';
    ctx.fillText(lang==='vi'?'Chúc Mừng Năm Mới':'Happy Lunar New Year',cx,h*0.47);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var cx=w/2;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.020),'600'); ctx.fillStyle='#fbeed3';
    ctx.fillText(lang==='vi'?'Khuyến mãi Tết · Giảm đến 50% · 01 — 15.02.2026':'Tet promotions · Up to 50% off · Feb 01 — 15, 2026',cx,h*0.66);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    vignette(ctx,w,h,0.25); grain(ctx,w,h,29,0.045,1100);
  }}
 ]};

/* ================= 10. mockup-phone — 1200x1200 — mockup ================= */
P['mockup-phone']={ w:1200,h:1200,cat:'mockup',nameKey:'tpl_mockup_phone',descKey:'tpl_mockup_phone_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#3d434f'); g.addColorStop(0.62,'#23262e'); g.addColorStop(1,'#14161c');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    var rg=ctx.createRadialGradient(w*0.5,h*0.30,40,w*0.5,h*0.30,w*0.55);
    rg.addColorStop(0,'rgba(150,180,230,0.28)'); rg.addColorStop(1,'rgba(150,180,230,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(0,h*0.80,w,h*0.20);
    ctx.fillStyle='rgba(255,255,255,0.10)'; ctx.fillRect(0,h*0.80,w,2);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    softShadow(ctx,w*0.52,h*0.845,w*0.26,h*0.055,0.50);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    ctx.save(); ctx.translate(w*0.5,h*0.46); ctx.rotate(-0.07);
    var pw=w*0.34, ph=h*0.64;
    ctx.fillStyle='#0f1013';
    rr(ctx,-pw/2,-ph/2,pw,ph,pw*0.13); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.22)'; ctx.lineWidth=3;
    rr(ctx,-pw/2,-ph/2,pw,ph,pw*0.13); ctx.stroke();
    var sx0=-pw/2+pw*0.055, sy0=-ph/2+ph*0.055, sw=pw*0.89, sh=ph*0.89;
    var sg=ctx.createLinearGradient(0,sy0,0,sy0+sh);
    sg.addColorStop(0,'#12263f'); sg.addColorStop(1,'#0a1626');
    ctx.fillStyle=sg; rr(ctx,sx0,sy0,sw,sh,pw*0.08); ctx.fill();
    ctx.fillStyle='#0f1013';
    rr(ctx,-pw*0.16,-ph/2+ph*0.02,pw*0.32,ph*0.045,12); ctx.fill();
    ctx.fillStyle='#2a2d33';
    ctx.fillRect(-pw/2-6,-ph*0.18,6,ph*0.07);
    ctx.fillRect(-pw/2-6,-ph*0.06,6,ph*0.11);
    ctx.fillRect(pw/2,-ph*0.10,6,ph*0.14);
    ctx.restore();
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    ctx.save(); ctx.translate(w*0.5,h*0.46); ctx.rotate(-0.07);
    var pw=w*0.34, ph=h*0.64;
    var sx0=-pw/2+pw*0.055, sy0=-ph/2+ph*0.055, sw=pw*0.89, sh=ph*0.89;
    var ag=ctx.createLinearGradient(sx0,sy0,sx0+sw,sy0+sh);
    ag.addColorStop(0,'#2b6cb0'); ag.addColorStop(1,'#6b46c1');
    ctx.fillStyle=ag; rr(ctx,sx0,sy0,sw,sh,pw*0.08); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.16)';
    ctx.beginPath(); ctx.arc(sx0+sw*0.70,sy0+sh*0.30,sw*0.22,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(sx0+sw*0.25,sy0+sh*0.75,sw*0.14,0,6.3); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.80)'; ctx.lineWidth=3; ctx.setLineDash([14,10]);
    rr(ctx,sx0+18,sy0+18,sw-36,sh-36,pw*0.06); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.026),'700'); ctx.fillStyle='#ffffff';
    ctx.fillText(lang==='vi'?'THIẾT KẾ CỦA BẠN':'YOUR DESIGN HERE',0,0);
    _sans(ctx,Math.round(w*0.018),'400'); ctx.fillStyle='rgba(255,255,255,0.75)';
    ctx.fillText(lang==='vi'?'(Thay layer này bằng thiết kế của bạn)':'(Replace this layer with your design)',0,Math.round(w*0.042));
    ctx.restore();
  }}
 ]};

/* ================= 11. mockup-cards — 1400x1000 — mockup ================= */
P['mockup-cards']={ w:1400,h:1000,cat:'mockup',nameKey:'tpl_mockup_cards',descKey:'tpl_mockup_cards_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    ctx.fillStyle='#8a5a33'; ctx.fillRect(0,0,w,h);
    ctx.save(); ctx.strokeStyle='rgba(60,35,15,0.5)'; ctx.lineWidth=3;
    var y;
    for(y=h/6;y<h;y+=h/6){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    ctx.restore();
    var R=srand(41),i;
    ctx.save(); ctx.strokeStyle='rgba(255,220,170,0.07)'; ctx.lineWidth=2;
    for(i=0;i<60;i++){ y=R()*h; var x0=R()*w;
      ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x0+80+R()*160,y+(R()-0.5)*8); ctx.stroke(); }
    ctx.restore();
    vignette(ctx,w,h,0.35);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    softShadow(ctx,w*0.5,h*0.60,w*0.36,h*0.07,0.40);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var cw=w*0.44, ch=cw*2/3.5;
    function card(x,y,rot,fill){
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
      ctx.fillStyle='rgba(0,0,0,0.25)';
      rr(ctx,-cw/2+8,-ch/2+10,cw,ch,14); ctx.fill();
      ctx.fillStyle=fill;
      rr(ctx,-cw/2,-ch/2,cw,ch,14); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=2;
      rr(ctx,-cw/2,-ch/2,cw,ch,14); ctx.stroke();
      ctx.restore();
    }
    card(w*0.40,h*0.52,-0.14,'#c9bda6');
    card(w*0.57,h*0.47,0.10,'#ddd3bf');
    card(w*0.50,h*0.45,-0.03,'#f8f3e8');
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cw=w*0.44, ch=cw*2/3.5;
    ctx.save(); ctx.translate(w*0.50,h*0.45); ctx.rotate(-0.03);
    var ag=ctx.createLinearGradient(-cw/2,0,cw/2,0);
    ag.addColorStop(0,'#f8f3e8'); ag.addColorStop(1,'#eee4cf');
    ctx.fillStyle=ag; rr(ctx,-cw/2,-ch/2,cw,ch,14); ctx.fill();
    ctx.fillStyle='#d4af37';
    ctx.beginPath(); ctx.arc(-cw/2+64,0,32,0,6.3); ctx.fill();
    ctx.fillStyle='#f8f3e8';
    ctx.beginPath(); ctx.arc(-cw/2+64,0,20,0,6.3); ctx.fill();
    ctx.strokeStyle='rgba(120,100,70,0.80)'; ctx.lineWidth=3; ctx.setLineDash([14,10]);
    rr(ctx,-cw/2+24,-ch/2+24,cw-48,ch-48,10); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.021),'700'); ctx.fillStyle='#6b5a3a';
    ctx.fillText(lang==='vi'?'THIẾT KẾ CỦA BẠN':'YOUR DESIGN HERE',cw*0.08,ch*0.10);
    _sans(ctx,Math.round(w*0.014),'400'); ctx.fillStyle='rgba(107,90,58,0.75)';
    ctx.fillText(lang==='vi'?'(Thay layer này bằng thiết kế của bạn)':'(Replace this layer with your design)',cw*0.08,ch*0.10+Math.round(w*0.028));
    ctx.restore();
  }}
 ]};

/* ================= 12. mockup-posterwall — 1400x1000 — mockup ================= */
P['mockup-posterwall']={ w:1400,h:1000,cat:'mockup',nameKey:'tpl_mockup_posterwall',descKey:'tpl_mockup_posterwall_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    ctx.fillStyle='#d9d3c7'; ctx.fillRect(0,0,w,h*0.68);
    ctx.fillStyle='#9a6b42'; ctx.fillRect(0,h*0.68,w,h*0.32);
    ctx.save(); ctx.strokeStyle='rgba(70,45,25,0.45)'; ctx.lineWidth=2;
    var y;
    for(y=h*0.68+h*0.08;y<h;y+=h*0.08){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle='#f2ede2'; ctx.fillRect(0,h*0.68-14,w,14);
    var rg=ctx.createRadialGradient(w*0.12,h*0.18,40,w*0.12,h*0.18,w*0.55);
    rg.addColorStop(0,'rgba(255,250,235,0.55)'); rg.addColorStop(1,'rgba(255,250,235,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
    vignette(ctx,w,h,0.22);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    var pw=w*0.34, ph=h*0.52, px=w*0.15, py=h*0.09;
    ctx.fillStyle='rgba(0,0,0,0.20)';
    ctx.fillRect(px+18,py+22,pw,ph);
    softShadow(ctx,w*0.82,h*0.90,w*0.10,h*0.035,0.35);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var pw=w*0.34, ph=h*0.52, px=w*0.15, py=h*0.09;
    ctx.save();
    ctx.translate(px+pw/2,py+ph/2); ctx.transform(1,0,-0.06,1,0,0);
    ctx.fillStyle='#1d1d1f'; ctx.fillRect(-pw/2,-ph/2,pw,ph);
    ctx.fillStyle='#f4efe4'; ctx.fillRect(-pw/2+14,-ph/2+14,pw-28,ph-28);
    ctx.restore();
    /* plant for depth */
    var potX=w*0.82, potY=h*0.88, potW=w*0.09;
    ctx.save();
    ctx.fillStyle='#a3552f';
    ctx.beginPath();
    ctx.moveTo(potX-potW/2,potY-h*0.10); ctx.lineTo(potX+potW/2,potY-h*0.10);
    ctx.lineTo(potX+potW*0.38,potY); ctx.lineTo(potX-potW*0.38,potY);
    ctx.closePath(); ctx.fill();
    var i;
    var greens=['#3f6b3a','#4c7d45','#578a4e'];
    for(i=0;i<7;i++){ var a=-Math.PI/2+(i-3)*0.32;
      ctx.save(); ctx.translate(potX,potY-h*0.10); ctx.rotate(a);
      ctx.fillStyle=greens[i%3];
      ctx.beginPath(); ctx.ellipse(0,-h*0.11,w*0.022,h*0.11,0,0,6.3); ctx.fill();
      ctx.restore(); }
    ctx.restore();
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var pw=w*0.34, ph=h*0.52, px=w*0.15, py=h*0.09;
    ctx.save();
    ctx.translate(px+pw/2,py+ph/2); ctx.transform(1,0,-0.06,1,0,0);
    var ix=-pw/2+14, iy=-ph/2+14, iw=pw-28, ih=ph-28;
    var ag=ctx.createLinearGradient(0,iy,0,iy+ih);
    ag.addColorStop(0,'#f8e9c8'); ag.addColorStop(0.55,'#f0c98f'); ag.addColorStop(1,'#8a6a7a');
    ctx.fillStyle=ag; ctx.fillRect(ix,iy,iw,ih);
    ctx.fillStyle='#fff3d6';
    ctx.beginPath(); ctx.arc(ix+iw*0.68,iy+ih*0.34,iw*0.11,0,6.3); ctx.fill();
    ctx.fillStyle='rgba(110,80,110,0.85)';
    ctx.beginPath(); ctx.moveTo(ix,iy+ih*0.72); ctx.lineTo(ix+iw*0.35,iy+ih*0.42);
    ctx.lineTo(ix+iw*0.62,iy+ih*0.72); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(70,50,80,0.9)';
    ctx.beginPath(); ctx.moveTo(ix+iw*0.35,iy+ih*0.78); ctx.lineTo(ix+iw*0.72,iy+ih*0.50);
    ctx.lineTo(ix+iw,iy+ih*0.78); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(40,28,50,0.95)'; ctx.fillRect(ix,iy+ih*0.78,iw,ih*0.22);
    ctx.strokeStyle='rgba(90,70,50,0.85)'; ctx.lineWidth=3; ctx.setLineDash([14,10]);
    ctx.strokeRect(ix+26,iy+26,iw-52,ih-52); ctx.setLineDash([]);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.020),'700'); ctx.fillStyle='#4a3a52';
    ctx.fillText(lang==='vi'?'THIẾT KẾ CỦA BẠN':'YOUR DESIGN HERE',0,iy+ih*0.16);
    ctx.restore();
  }}
 ]};

/* ================= 13. mockup-laptop — 1600x1000 — mockup ================= */
P['mockup-laptop']={ w:1600,h:1000,cat:'mockup',nameKey:'tpl_mockup_laptop',descKey:'tpl_mockup_laptop_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,0,h*0.62);
    g.addColorStop(0,'#ece5d4'); g.addColorStop(1,'#cfc4ac');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h*0.62);
    ctx.fillStyle='#7c5a38'; ctx.fillRect(0,h*0.62,w,h*0.38);
    ctx.save(); ctx.strokeStyle='rgba(50,32,16,0.5)'; ctx.lineWidth=2;
    var y;
    for(y=h*0.62+h*0.09;y<h;y+=h*0.09){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle='rgba(60,40,20,0.35)'; ctx.fillRect(0,h*0.62,w,4);
    var rg=ctx.createRadialGradient(w*0.15,h*0.15,40,w*0.15,h*0.15,w*0.5);
    rg.addColorStop(0,'rgba(255,252,240,0.6)'); rg.addColorStop(1,'rgba(255,252,240,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
    /* coffee cup */
    var cupX=w*0.85, cupY=h*0.76, cupR=w*0.035;
    ctx.fillStyle='rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(cupX,cupY+cupR*1.5,cupR*1.3,cupR*0.35,0,0,6.3); ctx.fill();
    ctx.fillStyle='#f5f2ea';
    ctx.beginPath(); ctx.ellipse(cupX,cupY,cupR,cupR*0.42,0,0,6.3); ctx.fill();
    ctx.fillRect(cupX-cupR,cupY,cupR*2,cupR*1.4);
    ctx.beginPath(); ctx.ellipse(cupX,cupY+cupR*1.4,cupR,cupR*0.42,0,0,6.3); ctx.fill();
    ctx.strokeStyle='#f5f2ea'; ctx.lineWidth=10;
    ctx.beginPath(); ctx.arc(cupX+cupR*1.05,cupY+cupR*0.7,cupR*0.55,-1.2,1.2); ctx.stroke();
    ctx.fillStyle='#4a2c14';
    ctx.beginPath(); ctx.ellipse(cupX,cupY,cupR*0.82,cupR*0.32,0,0,6.3); ctx.fill();
    vignette(ctx,w,h,0.20);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    softShadow(ctx,w*0.5,h*0.74,w*0.36,h*0.055,0.40);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var sw=w*0.56, sh=h*0.34, sx=w*0.22, sy=h*0.28;
    ctx.save();
    ctx.fillStyle='#1b1d21';
    rr(ctx,sx,sy,sw,sh,18); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.14)'; ctx.lineWidth=2;
    rr(ctx,sx,sy,sw,sh,18); ctx.stroke();
    ctx.fillStyle='#0e1420';
    rr(ctx,sx+18,sy+18,sw-36,sh-36,10); ctx.fill();
    /* base */
    var by=sy+sh;
    ctx.fillStyle='#2a2d33';
    ctx.beginPath();
    ctx.moveTo(sx-40,by); ctx.lineTo(sx+sw+40,by);
    ctx.lineTo(sx+sw+95,by+56); ctx.lineTo(sx-95,by+56);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='#34373d';
    ctx.fillRect(sx-95,by+50,sw+190,6);
    /* keyboard hint */
    ctx.strokeStyle='rgba(255,255,255,0.10)'; ctx.lineWidth=2;
    var i;
    for(i=0;i<4;i++){ ctx.beginPath();
      ctx.moveTo(sx+sw*0.18,by+16+i*9); ctx.lineTo(sx+sw*0.82,by+16+i*9); ctx.stroke(); }
    ctx.restore();
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var sw=w*0.56, sh=h*0.34, sx=w*0.22, sy=h*0.28;
    var ix=sx+18, iy=sy+18, iw=sw-36, ih=sh-36;
    ctx.save();
    rr(ctx,ix,iy,iw,ih,10); ctx.clip();
    var ag=ctx.createLinearGradient(ix,iy,ix+iw,iy+ih);
    ag.addColorStop(0,'#1d4e89'); ag.addColorStop(1,'#7b2d8e');
    ctx.fillStyle=ag; ctx.fillRect(ix,iy,iw,ih);
    /* browser chrome */
    ctx.fillStyle='rgba(245,245,245,0.95)'; ctx.fillRect(ix,iy,iw,ih*0.11);
    var dc=['#e05a4e','#e8b84e','#5ac85a'],d;
    for(d=0;d<3;d++){ ctx.fillStyle=dc[d];
      ctx.beginPath(); ctx.arc(ix+26+d*26,iy+ih*0.055,8,0,6.3); ctx.fill(); }
    ctx.fillStyle='rgba(180,180,180,0.9)';
    rr(ctx,ix+110,iy+ih*0.028,iw-140,ih*0.055,ih*0.027); ctx.fill();
    /* abstract content blocks */
    ctx.fillStyle='rgba(255,255,255,0.18)';
    rr(ctx,ix+iw*0.08,iy+ih*0.30,iw*0.38,ih*0.34,12); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.12)';
    rr(ctx,ix+iw*0.54,iy+ih*0.30,iw*0.38,ih*0.16,12); ctx.fill();
    rr(ctx,ix+iw*0.54,iy+ih*0.52,iw*0.38,ih*0.12,12); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,0.80)'; ctx.lineWidth=3; ctx.setLineDash([14,10]);
    rr(ctx,ix+22,iy+ih*0.11+22,iw-44,ih-ih*0.11-44,8); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.020),'700'); ctx.fillStyle='#ffffff';
    ctx.fillText(lang==='vi'?'THIẾT KẾ CỦA BẠN':'YOUR DESIGN HERE',ix+iw/2,iy+ih*0.62);
    _sans(ctx,Math.round(w*0.014),'400'); ctx.fillStyle='rgba(255,255,255,0.75)';
    ctx.fillText(lang==='vi'?'(Thay layer này bằng thiết kế của bạn)':'(Replace this layer with your design)',ix+iw/2,iy+ih*0.62+Math.round(w*0.026));
    ctx.restore();
  }}
 ]};

/* ================= 14. mockup-tshirt — 1200x1200 — mockup ================= */
P['mockup-tshirt']={ w:1200,h:1200,cat:'mockup',nameKey:'tpl_mockup_tshirt',descKey:'tpl_mockup_tshirt_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#f3eee7'); g.addColorStop(1,'#d6cfbf');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    var rg=ctx.createRadialGradient(w*0.5,h*0.42,40,w*0.5,h*0.42,w*0.55);
    rg.addColorStop(0,'rgba(255,255,255,0.55)'); rg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
    vignette(ctx,w,h,0.18);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    softShadow(ctx,w*0.5,h*0.80,w*0.30,h*0.06,0.35);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var cx=w/2, top=h*0.20, bw=w*0.40, bh=h*0.50, slW=w*0.14, slH=h*0.17;
    function shirtPath(){
      ctx.beginPath();
      ctx.moveTo(cx-bw*0.13,top);
      ctx.lineTo(cx-bw/2,top+h*0.015);
      ctx.lineTo(cx-bw/2-slW,top+slH*0.55);
      ctx.lineTo(cx-bw/2-slW*0.82,top+slH*1.35);
      ctx.lineTo(cx-bw/2,top+slH*1.25);
      ctx.lineTo(cx-bw/2,top+bh);
      ctx.lineTo(cx+bw/2,top+bh);
      ctx.lineTo(cx+bw/2,top+slH*1.25);
      ctx.lineTo(cx+bw/2+slW*0.82,top+slH*1.35);
      ctx.lineTo(cx+bw/2+slW,top+slH*0.55);
      ctx.lineTo(cx+bw/2,top+h*0.015);
      ctx.lineTo(cx+bw*0.13,top);
      ctx.quadraticCurveTo(cx,top+h*0.045,cx-bw*0.13,top);
      ctx.closePath();
    }
    ctx.save();
    var g=ctx.createLinearGradient(cx-bw/2,0,cx+bw/2,0);
    g.addColorStop(0,'#c3c9cf'); g.addColorStop(0.5,'#dde1e5'); g.addColorStop(1,'#c3c9cf');
    ctx.fillStyle=g; shirtPath(); ctx.fill();
    ctx.strokeStyle='rgba(90,95,105,0.25)'; ctx.lineWidth=2; shirtPath(); ctx.stroke();
    /* fold shading */
    ctx.strokeStyle='rgba(90,95,105,0.18)'; ctx.lineWidth=5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(cx-bw*0.28,top+bh*0.35);
    ctx.quadraticCurveTo(cx-bw*0.20,top+bh*0.60,cx-bw*0.26,top+bh*0.85); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+bw*0.28,top+bh*0.35);
    ctx.quadraticCurveTo(cx+bw*0.20,top+bh*0.60,cx+bw*0.26,top+bh*0.85); ctx.stroke();
    /* collar */
    ctx.strokeStyle='#a9b0b8'; ctx.lineWidth=11;
    ctx.beginPath(); ctx.ellipse(cx,top,bw*0.13,h*0.028,0,0.15,Math.PI-0.15); ctx.stroke();
    ctx.strokeStyle='rgba(90,95,105,0.30)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.ellipse(cx,top+4,bw*0.13,h*0.028,0,0.15,Math.PI-0.15); ctx.stroke();
    ctx.restore();
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cx=w/2, top=h*0.20, bw=w*0.40, bh=h*0.50;
    var ax=cx-bw*0.27, ay=top+bh*0.24, aw=bw*0.54, ah=bh*0.32;
    ctx.save();
    ctx.strokeStyle='rgba(90,95,105,0.85)'; ctx.lineWidth=3; ctx.setLineDash([14,10]);
    rr(ctx,ax,ay,aw,ah,8); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.024),'700'); ctx.fillStyle='#5a6068';
    ctx.fillText(lang==='vi'?'THIẾT KẾ CỦA BẠN':'YOUR DESIGN HERE',cx,ay+ah*0.42);
    _sans(ctx,Math.round(w*0.016),'400'); ctx.fillStyle='rgba(90,96,104,0.75)';
    ctx.fillText(lang==='vi'?'(Thay layer này bằng thiết kế của bạn)':'(Replace this layer with your design)',cx,ay+ah*0.42+Math.round(w*0.034));
    ctx.restore();
  }}
 ]};

/* ================= 15. mockup-tote — 1200x1200 — mockup ================= */
P['mockup-tote']={ w:1200,h:1200,cat:'mockup',nameKey:'tpl_mockup_tote',descKey:'tpl_mockup_tote_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#f0e8d8'); g.addColorStop(1,'#d4c5a8');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    var rg=ctx.createRadialGradient(w*0.5,h*0.45,40,w*0.5,h*0.45,w*0.55);
    rg.addColorStop(0,'rgba(255,252,240,0.55)'); rg.addColorStop(1,'rgba(255,252,240,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
    vignette(ctx,w,h,0.18);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    softShadow(ctx,w*0.5,h*0.825,w*0.28,h*0.055,0.35);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var cx=w/2, topY=h*0.34, botY=h*0.78, topW=w*0.44, botW=w*0.36;
    ctx.save();
    var g=ctx.createLinearGradient(cx-topW/2,0,cx+topW/2,0);
    g.addColorStop(0,'#d5c8a8'); g.addColorStop(0.5,'#ece2c9'); g.addColorStop(1,'#d5c8a8');
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(cx-topW/2,topY); ctx.lineTo(cx+topW/2,topY);
    ctx.lineTo(cx+botW/2,botY); ctx.lineTo(cx-botW/2,botY);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(110,85,55,0.30)'; ctx.lineWidth=2; ctx.stroke();
    /* fabric weave hint */
    var R=srand(91),i;
    ctx.strokeStyle='rgba(120,95,60,0.08)'; ctx.lineWidth=1.5;
    for(i=0;i<26;i++){ var yy=topY+R()*(botY-topY);
      ctx.beginPath(); ctx.moveTo(cx-topW/2+8,yy); ctx.lineTo(cx+topW/2-8,yy); ctx.stroke(); }
    /* stitch near top */
    ctx.strokeStyle='rgba(120,95,60,0.6)'; ctx.lineWidth=3; ctx.setLineDash([8,6]);
    ctx.beginPath(); ctx.moveTo(cx-topW/2+14,topY+h*0.035); ctx.lineTo(cx+topW/2-14,topY+h*0.035); ctx.stroke();
    ctx.setLineDash([]);
    /* handles */
    ctx.strokeStyle='#c4b183'; ctx.lineWidth=Math.max(8,w*0.020); ctx.lineCap='round';
    var hx=topW*0.28, hr=w*0.075;
    ctx.beginPath(); ctx.arc(cx-hx,topY,hr,Math.PI,0); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+hx,topY,hr,Math.PI,0); ctx.stroke();
    ctx.fillStyle='#b39c6e';
    ctx.beginPath(); ctx.arc(cx-hx-hr,topY,7,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(cx-hx+hr,topY,7,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+hx-hr,topY,7,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+hx+hr,topY,7,0,6.3); ctx.fill();
    ctx.restore();
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cx=w/2, topY=h*0.34, botY=h*0.78, topW=w*0.44;
    var aw=topW*0.62, ah=(botY-topY)*0.42;
    var ax=cx-aw/2, ay=topY+(botY-topY)*0.30;
    ctx.save();
    ctx.strokeStyle='rgba(110,85,55,0.85)'; ctx.lineWidth=3; ctx.setLineDash([14,10]);
    rr(ctx,ax,ay,aw,ah,8); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.024),'700'); ctx.fillStyle='#6b5a3a';
    ctx.fillText(lang==='vi'?'THIẾT KẾ CỦA BẠN':'YOUR DESIGN HERE',cx,ay+ah*0.40);
    _sans(ctx,Math.round(w*0.016),'400'); ctx.fillStyle='rgba(107,90,58,0.75)';
    ctx.fillText(lang==='vi'?'(Thay layer này bằng thiết kế của bạn)':'(Replace this layer with your design)',cx,ay+ah*0.40+Math.round(w*0.034));
    ctx.restore();
  }}
 ]};

/* ================= 16. mockup-box — 1200x1200 — mockup ================= */
P['mockup-box']={ w:1200,h:1200,cat:'mockup',nameKey:'tpl_mockup_box',descKey:'tpl_mockup_box_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#eef0f3'); g.addColorStop(1,'#c6c9d1');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    var rg=ctx.createRadialGradient(w*0.5,h*0.40,40,w*0.5,h*0.40,w*0.55);
    rg.addColorStop(0,'rgba(255,255,255,0.6)'); rg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
    vignette(ctx,w,h,0.18);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    softShadow(ctx,w*0.52,h*0.79,w*0.30,h*0.06,0.40);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var bx=w*0.30, by=h*0.40, bw=w*0.36, bh=h*0.32, dx=w*0.075, dy=h*0.095;
    ctx.save();
    /* top face */
    ctx.fillStyle='#e0d6bd';
    ctx.beginPath();
    ctx.moveTo(bx,by); ctx.lineTo(bx+dx,by-dy);
    ctx.lineTo(bx+bw+dx,by-dy); ctx.lineTo(bx+bw,by);
    ctx.closePath(); ctx.fill();
    /* side face */
    ctx.fillStyle='#c9bc9c';
    ctx.beginPath();
    ctx.moveTo(bx+bw,by); ctx.lineTo(bx+bw+dx,by-dy);
    ctx.lineTo(bx+bw+dx,by+bh-dy); ctx.lineTo(bx+bw,by+bh);
    ctx.closePath(); ctx.fill();
    /* front face */
    var fg=ctx.createLinearGradient(0,by,0,by+bh);
    fg.addColorStop(0,'#f6efdd'); fg.addColorStop(1,'#e9dfc6');
    ctx.fillStyle=fg; ctx.fillRect(bx,by,bw,bh);
    /* tape on top */
    ctx.fillStyle='rgba(178,148,108,0.85)';
    ctx.beginPath();
    ctx.moveTo(bx+bw*0.44,by); ctx.lineTo(bx+bw*0.44+dx,by-dy);
    ctx.lineTo(bx+bw*0.56+dx,by-dy); ctx.lineTo(bx+bw*0.56,by);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(178,148,108,0.85)';
    ctx.fillRect(bx+bw*0.44,by,bw*0.12,bh);
    /* edges */
    ctx.strokeStyle='rgba(110,90,60,0.35)'; ctx.lineWidth=2;
    ctx.strokeRect(bx,by,bw,bh);
    ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+dx,by-dy);
    ctx.lineTo(bx+bw+dx,by-dy); ctx.lineTo(bx+bw,by); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+bw+dx,by-dy); ctx.lineTo(bx+bw+dx,by+bh-dy);
    ctx.lineTo(bx+bw,by+bh); ctx.stroke();
    ctx.restore();
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var bx=w*0.30, by=h*0.40, bw=w*0.36, bh=h*0.32;
    ctx.save();
    ctx.strokeStyle='rgba(110,90,60,0.85)'; ctx.lineWidth=3; ctx.setLineDash([14,10]);
    ctx.strokeRect(bx+28,by+28,bw-56,bh-56); ctx.setLineDash([]);
    ctx.fillStyle='#d4af37';
    ctx.beginPath(); ctx.arc(bx+bw/2,by+bh*0.30,Math.round(w*0.028),0,6.3); ctx.fill();
    ctx.fillStyle='#f6efdd';
    ctx.beginPath(); ctx.arc(bx+bw/2,by+bh*0.30,Math.round(w*0.017),0,6.3); ctx.fill();
    ctx.textAlign='center'; ctx.textBaseline='middle';
    _sans(ctx,Math.round(w*0.024),'700'); ctx.fillStyle='#6b5a3a';
    ctx.fillText(lang==='vi'?'THIẾT KẾ CỦA BẠN':'YOUR DESIGN HERE',bx+bw/2,by+bh*0.62);
    _sans(ctx,Math.round(w*0.016),'400'); ctx.fillStyle='rgba(107,90,58,0.75)';
    ctx.fillText(lang==='vi'?'(Thay layer này bằng thiết kế của bạn)':'(Replace this layer with your design)',bx+bw/2,by+bh*0.62+Math.round(w*0.034));
    ctx.restore();
  }}
 ]};

})();

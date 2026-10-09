/* ============================================================================
   LEHA Studio — photo templates batch 1 (14 premium templates).
   Requires templates-core.js loaded BEFORE this file
   (srand, rr, grain, vignette, frame2, eyebrow, meshGlow, softShadow, glassCard).
   All geometry is proportional to (w,h): safe to render at any scale.
   Text is bilingual via (lang==='vi' ? ... : ...). No emojis, no external assets.
   ============================================================================ */
(function(){
'use strict';
window.__LEHA_PHOTO_TPL__ = window.__LEHA_PHOTO_TPL__ || {};
var P = window.__LEHA_PHOTO_TPL__;

/* ---------------- file-local helpers ---------------- */

/* left-aligned letterspaced eyebrow (eyebrow() in core is centered) */
function eyL(ctx,txt,x,y,color,size){
  size=size||30;
  ctx.save(); ctx.textAlign='left'; ctx.textBaseline='middle';
  try{ ctx.letterSpacing=Math.round(size*0.28)+'px'; }catch(e){}
  ctx.fillStyle=color; ctx.font='600 '+size+'px Arial,sans-serif';
  ctx.fillText(txt,x,y); ctx.restore();
}

/* shrink font until text fits maxW; returns final px size */
function fitFont(ctx,txt,base,maxW,weight,family){
  var s=base, guard=0, tw;
  weight=weight||'900'; family=family||'Arial,sans-serif';
  do{
    ctx.font=weight+' '+s+'px '+family;
    tw=ctx.measureText(txt).width;
    if(tw<=maxW) break;
    s*=0.94; guard++;
  }while(guard<28);
  return s;
}

/* 4-point sparkle (curved diamond star) */
function spark(ctx,x,y,r,color,alpha){
  ctx.save(); ctx.globalAlpha=(alpha==null?0.9:alpha); ctx.fillStyle=color;
  ctx.beginPath();
  ctx.moveTo(x,y-r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.quadraticCurveTo(x,y,x,y+r);
  ctx.quadraticCurveTo(x,y,x-r,y); ctx.quadraticCurveTo(x,y,x,y-r);
  ctx.fill(); ctx.restore();
}

/* dotted price leader line */
function dotsRow(ctx,x1,x2,y,color,lw){
  if(x2<=x1) return;
  ctx.save();
  ctx.strokeStyle=color; ctx.lineWidth=lw||3; ctx.lineCap='round';
  ctx.setLineDash([0.1,(lw||3)*3.4]);
  ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();
  ctx.restore();
}

/* ================= REDESIGN 1. Poster sale 1080x1350 — Noir Gold ================= */
P['poster-sale']={ w:1080,h:1350,cat:'social',nameKey:'tpl_poster_sale',descKey:'tpl_poster_sale_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#0d0d10',[
      [w*0.50,h*0.24,w*0.55,'rgba(212,175,55,0.34)'],
      [w*0.12,h*0.88,w*0.42,'rgba(150,90,30,0.30)'],
      [w*0.92,h*0.72,w*0.40,'rgba(184,115,51,0.22)'],
      [w*0.50,h*1.05,w*0.60,'rgba(60,30,10,0.35)']
    ]);
    vignette(ctx,w,h,0.42);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    softShadow(ctx,w/2,h*0.78,w*0.33,h*0.05,0.5);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var R=srand(12),i,x,y,r;
    frame2(ctx,w,h,w*0.055,'rgba(212,175,55,0.75)','rgba(212,175,55,0.35)');
    for(i=0;i<26;i++){ x=R()*w; y=R()*h; r=w*(0.004+R()*0.010);
      spark(ctx,x,y,r,'#f0d98c',0.25+R()*0.55); }
    ctx.save();
    ctx.strokeStyle='rgba(212,175,55,0.6)'; ctx.lineWidth=Math.max(1.5,w*0.002);
    var ry=h*0.60;
    ctx.beginPath(); ctx.moveTo(w*0.14,ry); ctx.lineTo(w*0.36,ry);
    ctx.moveTo(w*0.64,ry); ctx.lineTo(w*0.86,ry); ctx.stroke();
    ctx.restore();
    spark(ctx,w/2,ry,w*0.012,'#d4af37',0.95);
    grain(ctx,w,h,12,0.05,1200);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,lang==='vi'?'NGÀY HỘI MUA SẮM':'SHOPPING FESTIVAL',w/2,h*0.225,'#d4af37',w*0.030);
    var t1=lang==='vi'?'SIÊU SALE':'MEGA SALE';
    var s1=fitFont(ctx,t1,w*0.19,w*0.84,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#f5f1e6'; ctx.font='900 '+s1+'px "Arial Black",Arial,sans-serif';
    ctx.fillText(t1,w/2,h*0.40);
    var t2=lang==='vi'?'GIẢM ĐẾN 50%':'UP TO 50% OFF';
    var s2=fitFont(ctx,t2,w*0.085,w*0.84,'900','Arial,sans-serif');
    ctx.fillStyle='#d4af37'; ctx.font='900 '+s2+'px Arial,sans-serif';
    ctx.fillText(t2,w/2,h*0.505);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    var cw=w*0.62, ch=h*0.075, cx=w/2-cw/2, cy=h*0.70;
    glassCard(ctx,cx,cy,cw,ch,w*0.02);
    ctx.fillStyle='#f5f1e6'; ctx.font='700 '+(w*0.034)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'MÃ: LEHA12':'CODE: LEHA12',w/2,cy+ch/2);
    ctx.fillStyle='rgba(245,241,230,0.55)'; ctx.font='400 '+(w*0.026)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Áp dụng đến 12/12/2026':'Valid until Dec 12, 2026',w/2,h*0.83);
    ctx.save();
    try{ctx.letterSpacing=Math.round(w*0.008)+'px';}catch(e){}
    ctx.fillStyle='rgba(212,175,55,0.9)'; ctx.font='600 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText('LEHA STUDIO',w/2,h*0.885);
    ctx.restore();
  }}
 ]};

/* ================= REDESIGN 2. Card visit 1050x600 — navy/gold ================= */
P['business-card']={ w:1050,h:600,cat:'business',nameKey:'tpl_business_card',descKey:'tpl_business_card_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#0c1524',[
      [w*0.18,h*0.30,w*0.40,'rgba(38,70,120,0.55)'],
      [w*0.85,h*0.85,w*0.45,'rgba(201,162,39,0.20)'],
      [w*0.95,h*0.10,w*0.30,'rgba(60,90,150,0.30)']
    ]);
    vignette(ctx,w,h,0.35);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    frame2(ctx,w,h,w*0.035,'rgba(201,162,39,0.55)','rgba(201,162,39,0.25)');
    ctx.save(); ctx.strokeStyle='#c9a227'; ctx.lineWidth=Math.max(2,w*0.004);
    var m=w*0.035, c=w*0.05;
    [[m,m,1,1],[w-m,m,-1,1],[m,h-m,1,-1],[w-m,h-m,-1,-1]].forEach(function(k){
      ctx.beginPath();
      ctx.moveTo(k[0]+c*k[2],k[1]); ctx.lineTo(k[0],k[1]); ctx.lineTo(k[0],k[1]+c*k[3]);
      ctx.stroke();
    });
    ctx.restore();
    grain(ctx,w,h,21,0.04,700);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cx=w*0.185, cy=h*0.5, r=w*0.105;
    ctx.save();
    ctx.strokeStyle='#c9a227'; ctx.lineWidth=Math.max(2,w*0.004);
    ctx.beginPath(); ctx.arc(cx,cy,r,0,6.3); ctx.stroke();
    ctx.lineWidth=Math.max(1,w*0.0018);
    ctx.beginPath(); ctx.arc(cx,cy,r*0.82,0,6.3); ctx.stroke();
    ctx.fillStyle='#c9a227'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font='700 '+(w*0.085)+'px Georgia,serif';
    ctx.fillText('L',cx,cy+w*0.006);
    ctx.restore();
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var x=w*0.345;
    ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    eyL(ctx,'LEHA STUDIO',x,h*0.30,'#c9a227',w*0.026);
    var nm=lang==='vi'?'NGUYỄN VĂN AN':'NGUYEN VAN AN';
    var s=fitFont(ctx,nm,w*0.052,w*0.60,'700','Arial,sans-serif');
    ctx.fillStyle='#f5f1e6'; ctx.font='700 '+s+'px Arial,sans-serif';
    ctx.fillText(nm,x,h*0.44);
    ctx.fillStyle='#c9a227'; ctx.fillRect(x,h*0.50,w*0.06,Math.max(2,h*0.008));
    ctx.fillStyle='rgba(245,241,230,0.85)'; ctx.font='400 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Giám đốc sáng tạo':'Creative Director',x,h*0.60);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var x=w*0.345;
    ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    ctx.fillStyle='rgba(245,241,230,0.75)'; ctx.font='400 '+(w*0.026)+'px Arial,sans-serif';
    ctx.fillText('0901 234 567',x,h*0.74);
    ctx.fillText('hello@leha.studio',x,h*0.82);
    ctx.fillStyle='rgba(201,162,39,0.9)'; ctx.font='600 '+(w*0.026)+'px Arial,sans-serif';
    ctx.fillText('leha.studio',x,h*0.90);
  }}
 ]};

/* ================= REDESIGN 3. Bài đăng vuông 1080x1080 — cà phê tối giản ấm ================= */
P['post-square']={ w:1080,h:1080,cat:'social',nameKey:'tpl_post_square',descKey:'tpl_post_square_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#faf3e8',[
      [w*0.20,h*0.18,w*0.45,'rgba(224,150,90,0.28)'],
      [w*0.85,h*0.82,w*0.45,'rgba(201,111,73,0.20)'],
      [w*0.50,h*0.55,w*0.60,'rgba(255,255,255,0.50)']
    ]);
    vignette(ctx,w,h,0.18);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    frame2(ctx,w,h,w*0.05,'rgba(122,78,45,0.45)','rgba(122,78,45,0.22)');
    ctx.save();
    ctx.strokeStyle='rgba(122,78,45,0.28)'; ctx.lineWidth=Math.max(1.5,w*0.002);
    ctx.beginPath(); ctx.arc(w/2,h*0.52,w*0.30,0,6.3); ctx.stroke();
    ctx.strokeStyle='rgba(122,78,45,0.16)';
    ctx.beginPath(); ctx.arc(w/2,h*0.52,w*0.345,0,6.3); ctx.stroke();
    var R=srand(33),i;
    ctx.fillStyle='#a0764a';
    for(i=0;i<30;i++){ ctx.globalAlpha=0.15+R()*0.25;
      ctx.beginPath(); ctx.arc(R()*w,R()*h,w*0.004+R()*w*0.004,0,6.3); ctx.fill(); }
    ctx.globalAlpha=1; ctx.restore();
    grain(ctx,w,h,33,0.04,900);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cx=w/2, cy=h*0.52, cw=w*0.30, chh=h*0.20, lw=Math.max(3,w*0.011);
    var br='#5a3d2b';
    ctx.save();
    softShadow(ctx,cx,cy+chh*0.62,cw*0.55,chh*0.10,0.25);
    ctx.strokeStyle=br; ctx.lineWidth=lw; ctx.lineCap='round';
    rr(ctx,cx-cw/2,cy-chh/2,cw,chh,w*0.035); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+cw/2+w*0.035,cy,w*0.055,-1.2,1.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-cw*0.42,cy+chh*0.68); ctx.lineTo(cx+cw*0.42,cy+chh*0.68); ctx.stroke();
    var sx=[cx-cw*0.16,cx,cx+cw*0.16],i;
    ctx.lineWidth=lw*0.7;
    for(i=0;i<3;i++){
      ctx.beginPath(); ctx.moveTo(sx[i],cy-chh*0.72);
      ctx.bezierCurveTo(sx[i]-w*0.02,cy-chh*0.95,sx[i]+w*0.02,cy-chh*1.05,sx[i],cy-chh*1.28);
      ctx.stroke();
    }
    ctx.fillStyle=br;
    ctx.beginPath(); ctx.ellipse(cx,cy-chh*0.32,cw*0.40,chh*0.09,0,0,6.3); ctx.fill();
    ctx.restore();
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,lang==='vi'?'CÀ PHÊ MỖI SÁNG':'MORNING COFFEE',w/2,h*0.155,'#a0764a',w*0.028);
    var t=lang==='vi'?'MUA 1 TẶNG 1':'BUY 1 GET 1';
    var s=fitFont(ctx,t,w*0.085,w*0.84,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#4a3226'; ctx.font='900 '+s+'px "Arial Black",Arial,sans-serif';
    ctx.fillText(t,w/2,h*0.245);
    ctx.fillStyle='rgba(74,50,38,0.65)'; ctx.font='400 '+(w*0.030)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Áp dụng đến 31/10/2026':'Valid until Oct 31, 2026',w/2,h*0.315);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    var bx=w*0.82, by=h*0.13, br=w*0.075;
    ctx.save();
    ctx.fillStyle='#c96f4a';
    ctx.beginPath(); ctx.arc(bx,by,br,0,6.3); ctx.fill();
    ctx.strokeStyle='#faf3e8'; ctx.lineWidth=Math.max(2,w*0.005);
    ctx.setLineDash([w*0.012,w*0.010]);
    ctx.beginPath(); ctx.arc(bx,by,br*0.80,0,6.3); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#ffffff'; ctx.font='900 '+(w*0.036)+'px Arial,sans-serif';
    ctx.fillText('-30%',bx,by);
    ctx.restore();
    ctx.fillStyle='#c96f4a'; ctx.font='700 '+(w*0.038)+'px Georgia,serif';
    ctx.fillText(lang==='vi'?'Hương vị đậm đà, giá yêu thương':'Bold flavor, friendly price',w/2,h*0.845);
    ctx.fillStyle='rgba(74,50,38,0.5)'; ctx.font='400 '+(w*0.026)+'px Arial,sans-serif';
    ctx.fillText('LEHA Studio',w/2,h*0.905);
  }}
 ]};

/* ================= REDESIGN 4. Thumbnail YouTube 1280x720 ================= */
P['youtube-thumbnail']={ w:1280,h:720,cat:'social',nameKey:'tpl_youtube_thumbnail',descKey:'tpl_youtube_thumbnail_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#0b0e1c',[
      [w*0.20,h*0.25,w*0.42,'rgba(150,60,160,0.45)'],
      [w*0.82,h*0.75,w*0.45,'rgba(40,120,200,0.50)'],
      [w*0.80,h*0.15,w*0.25,'rgba(250,204,21,0.30)'],
      [w*0.10,h*0.90,w*0.35,'rgba(200,40,80,0.35)']
    ]);
    vignette(ctx,w,h,0.40);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    ctx.save();
    ctx.fillStyle='#facc15';
    ctx.save(); ctx.translate(w*0.86,h*0.10); ctx.rotate(0.5);
    ctx.fillRect(-w*0.012,-h*0.30,w*0.024,h*0.60); ctx.restore();
    var R=srand(44),i;
    ctx.fillStyle='#ffffff';
    for(i=0;i<24;i++){ ctx.globalAlpha=0.10+R()*0.25;
      ctx.beginPath(); ctx.arc(w*0.06+R()*w*0.20,h*0.62+R()*h*0.28,w*0.005,0,6.3); ctx.fill(); }
    ctx.globalAlpha=1; ctx.restore();
    grain(ctx,w,h,44,0.05,800);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cx=w*0.80, cy=h*0.52, r=w*0.085;
    softShadow(ctx,cx,cy+r*0.15,r*1.05,r*0.35,0.5);
    ctx.save();
    ctx.fillStyle='#facc15';
    ctx.beginPath(); ctx.arc(cx,cy,r,0,6.3); ctx.fill();
    ctx.fillStyle='#0b0e1c';
    ctx.beginPath();
    ctx.moveTo(cx-r*0.18,cy-r*0.30); ctx.lineTo(cx-r*0.18,cy+r*0.30); ctx.lineTo(cx+r*0.34,cy);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(250,204,21,0.5)'; ctx.lineWidth=Math.max(2,w*0.003);
    ctx.beginPath(); ctx.arc(cx,cy,r*1.22,0,6.3); ctx.stroke();
    ctx.restore();
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='left'; ctx.textBaseline='middle';
    var x=w*0.075;
    eyL(ctx,lang==='vi'?'MẸO YOUTUBE':'YOUTUBE TIPS',x,h*0.20,'#facc15',w*0.026);
    var t=lang==='vi'?'BÍ KÍP 100K SUB':'100K SUB SECRETS';
    var s=fitFont(ctx,t,w*0.082,w*0.60,'900','"Arial Black",Arial,sans-serif');
    ctx.font='900 '+s+'px "Arial Black",Arial,sans-serif';
    ctx.lineWidth=Math.max(3,s*0.10); ctx.strokeStyle='#0a0a0c'; ctx.lineJoin='round';
    ctx.strokeText(t,x,h*0.42);
    ctx.fillStyle='#ffffff'; ctx.fillText(t,x,h*0.42);
    var t2=lang==='vi'?'TRONG 30 NGÀY':'IN 30 DAYS';
    var s2=fitFont(ctx,t2,w*0.050,w*0.60,'900','Arial,sans-serif');
    ctx.fillStyle='#facc15'; ctx.font='900 '+s2+'px Arial,sans-serif';
    ctx.fillText(t2,x,h*0.60);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var pw=w*0.20, ph=h*0.095, px=w*0.075, py=h*0.76;
    ctx.save();
    ctx.fillStyle='#e62e2e'; rr(ctx,px,py,pw,ph,ph/2); ctx.fill();
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#ffffff'; ctx.font='700 '+(w*0.024)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'XEM NGAY':'WATCH NOW',px+pw/2,py+ph/2);
    ctx.restore();
  }}
 ]};

/* ================= REDESIGN 5. Cover Facebook 1640x924 — teal/gold ================= */
P['facebook-cover']={ w:1640,h:924,cat:'social',nameKey:'tpl_facebook_cover',descKey:'tpl_facebook_cover_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#06333b',[
      [w*0.50,h*0.30,w*0.55,'rgba(20,120,130,0.55)'],
      [w*0.15,h*0.85,w*0.40,'rgba(10,70,80,0.50)'],
      [w*0.88,h*0.70,w*0.38,'rgba(201,162,39,0.22)']
    ]);
    vignette(ctx,w,h,0.38);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    frame2(ctx,w,h,w*0.028,'rgba(201,162,39,0.50)','rgba(201,162,39,0.22)');
    var waves=[['rgba(255,255,255,0.05)',0],['rgba(255,255,255,0.07)',1],['rgba(201,162,39,0.12)',2]];
    waves.forEach(function(wv,k){
      ctx.fillStyle=wv[0]; ctx.beginPath(); ctx.moveTo(0,h);
      ctx.bezierCurveTo(w*0.30,h*0.86-k*18, w*0.62,h*0.98-k*18, w,h*0.80-k*18);
      ctx.lineTo(w,h); ctx.closePath(); ctx.fill();
    });
    var R=srand(21),i;
    for(i=0;i<34;i++){ spark(ctx,R()*w,R()*h*0.6,w*(0.003+R()*0.006),'#e8c15a',0.20+R()*0.45); }
    grain(ctx,w,h,21,0.04,1000);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,lang==='vi'?'SÁNG TẠO NỘI DUNG':'CONTENT CREATION',w/2,h*0.30,'#e8c15a',w*0.020);
    var t='LEHA STUDIO';
    var s=fitFont(ctx,t,w*0.085,w*0.80,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#f5f1e6'; ctx.font='900 '+s+'px "Arial Black",Arial,sans-serif';
    ctx.fillText(t,w/2,h*0.47);
    ctx.fillStyle='#c9a227'; ctx.fillRect(w*0.44,h*0.60,w*0.12,Math.max(2,h*0.006));
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#e8c15a'; ctx.font='italic 600 '+(w*0.028)+'px Georgia,serif';
    ctx.fillText(lang==='vi'?'Sáng tạo không giới hạn':'Create without limits',w/2,h*0.70);
    ctx.fillStyle='rgba(245,241,230,0.55)'; ctx.font='400 '+(w*0.018)+'px Arial,sans-serif';
    ctx.fillText('leha.studio',w/2,h*0.78);
  }}
 ]};

/* ================= 6. Banner kênh YouTube 2560x1440 (chữ trong vùng an toàn) ================= */
P['youtube-banner']={ w:2560,h:1440,cat:'social',nameKey:'tpl_youtube_banner',descKey:'tpl_youtube_banner_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#0c0c10',[
      [w*0.50,h*0.42,w*0.42,'rgba(212,175,55,0.30)'],
      [w*0.12,h*0.75,w*0.35,'rgba(140,80,30,0.30)'],
      [w*0.88,h*0.70,w*0.35,'rgba(120,70,40,0.28)'],
      [w*0.50,h*1.02,w*0.50,'rgba(50,25,10,0.35)']
    ]);
    vignette(ctx,w,h,0.45);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    ctx.save();
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font='700 '+(w*0.30)+'px Georgia,serif';
    ctx.strokeStyle='rgba(212,175,55,0.10)'; ctx.lineWidth=Math.max(2,w*0.002);
    ctx.strokeText('LS',w/2,h*0.46);
    ctx.restore();
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    frame2(ctx,w,h,w*0.022,'rgba(212,175,55,0.55)','rgba(212,175,55,0.25)');
    var R=srand(60),i;
    for(i=0;i<40;i++){ spark(ctx,R()*w,R()*h,w*(0.002+R()*0.004),'#f0d98c',0.15+R()*0.4); }
    grain(ctx,w,h,60,0.04,1600);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,'LEHA STUDIO',w/2,h*0.40,'#d4af37',w*0.016);
    var t=lang==='vi'?'SÁNG TẠO MỖI NGÀY':'CREATE EVERY DAY';
    var s=fitFont(ctx,t,w*0.052,w*0.56,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#f5f1e6'; ctx.font='900 '+s+'px "Arial Black",Arial,sans-serif';
    ctx.fillText(t,w/2,h*0.475);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='rgba(245,241,230,0.75)'; ctx.font='400 '+(w*0.017)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Video mới mỗi tuần':'New videos every week',w/2,h*0.55);
    var pw=w*0.115, ph=h*0.049, px=w/2-pw/2, py=h*0.575;
    ctx.save();
    ctx.fillStyle='#d4af37'; rr(ctx,px,py,pw,ph,ph/2); ctx.fill();
    ctx.fillStyle='#0c0c10'; ctx.font='700 '+(w*0.016)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'ĐĂNG KÝ':'SUBSCRIBE',w/2,py+ph/2);
    ctx.restore();
  }}
 ]};

/* ================= 7. Story Instagram 1080x1920 — hoàng hôn, CTA pill ================= */
P['ig-story']={ w:1080,h:1920,cat:'social',nameKey:'tpl_ig_story',descKey:'tpl_ig_story_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#2b1535',[
      [w*0.50,h*0.10,w*0.55,'rgba(255,140,66,0.55)'],
      [w*0.85,h*0.35,w*0.45,'rgba(255,93,143,0.50)'],
      [w*0.15,h*0.55,w*0.45,'rgba(255,197,61,0.35)'],
      [w*0.50,h*0.95,w*0.60,'rgba(90,30,80,0.60)']
    ]);
    vignette(ctx,w,h,0.35);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var R=srand(70),i,x,y,r;
    for(i=0;i<22;i++){ x=R()*w; y=R()*h; r=w*(0.02+R()*0.05);
      ctx.save(); ctx.globalAlpha=0.06+R()*0.10; ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(x,y,r,0,6.3); ctx.fill(); ctx.restore(); }
    for(i=0;i<14;i++){ spark(ctx,R()*w,R()*h,w*(0.005+R()*0.008),'#ffe9c4',0.3+R()*0.5); }
    grain(ctx,w,h,70,0.05,1300);
  }},
  {nameKey:'tpl_layer_shadow',draw:function(ctx,w,h,lang){
    softShadow(ctx,w/2,h*0.60,w*0.36,h*0.045,0.45);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,'FLASH SALE',w/2,h*0.235,'#ffe9c4',w*0.032);
    var t=lang==='vi'?'GIẢM ĐẾN':'UP TO';
    var s=fitFont(ctx,t,w*0.070,w*0.80,'900','Arial,sans-serif');
    ctx.fillStyle='#ffffff'; ctx.font='900 '+s+'px Arial,sans-serif';
    ctx.fillText(t,w/2,h*0.315);
    var s2=fitFont(ctx,'70%',w*0.34,w*0.86,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#ffd166'; ctx.font='900 '+s2+'px "Arial Black",Arial,sans-serif';
    ctx.fillText('70%',w/2,h*0.50);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    var pw=w*0.62, ph=h*0.052, px=w/2-pw/2, py=h*0.665;
    ctx.save();
    ctx.fillStyle='#ffffff'; rr(ctx,px,py,pw,ph,ph/2); ctx.fill();
    ctx.fillStyle='#2b1535'; ctx.font='900 '+(w*0.038)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'MUA NGAY':'SHOP NOW',w/2,py+ph/2);
    ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='400 '+(w*0.030)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Chỉ hôm nay · Số lượng có hạn':'Today only · Limited stock',w/2,h*0.755);
    ctx.save();
    try{ctx.letterSpacing=Math.round(w*0.008)+'px';}catch(e){}
    ctx.fillStyle='rgba(255,233,196,0.85)'; ctx.font='600 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText('LEHA STUDIO',w/2,h*0.90);
    ctx.restore();
  }}
 ]};

/* ================= 8. Poster Flash Sale 1080x1350 — rực rỡ có kiểm soát ================= */
P['sale-flash']={ w:1080,h:1350,cat:'social',nameKey:'tpl_sale_flash',descKey:'tpl_sale_flash_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#200a24',[
      [w*0.50,h*0.20,w*0.55,'rgba(255,80,60,0.55)'],
      [w*0.15,h*0.55,w*0.45,'rgba(255,160,40,0.45)'],
      [w*0.88,h*0.60,w*0.45,'rgba(220,40,120,0.50)'],
      [w*0.50,h*1.00,w*0.60,'rgba(120,20,60,0.55)']
    ]);
    vignette(ctx,w,h,0.40);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cx=w*0.78, cy=h*0.22, s=w*0.16;
    ctx.save();
    ctx.fillStyle='rgba(255,209,102,0.92)';
    ctx.beginPath();
    ctx.moveTo(cx+s*0.15,cy-s); ctx.lineTo(cx-s*0.45,cy+s*0.15); ctx.lineTo(cx-s*0.02,cy+s*0.15);
    ctx.lineTo(cx-s*0.15,cy+s); ctx.lineTo(cx+s*0.45,cy-s*0.15); ctx.lineTo(cx+s*0.02,cy-s*0.15);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=Math.max(2,w*0.004);
    var i,a;
    for(i=0;i<9;i++){ a=Math.PI*(0.15+0.0875*i);
      ctx.beginPath(); ctx.moveTo(w/2+Math.cos(a)*w*0.10,h*0.10+Math.sin(a)*w*0.10);
      ctx.lineTo(w/2+Math.cos(a)*w*0.42,h*0.10+Math.sin(a)*w*0.42); ctx.stroke(); }
    ctx.restore();
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    frame2(ctx,w,h,w*0.05,'rgba(255,209,102,0.7)','rgba(255,209,102,0.3)');
    var R=srand(80),i;
    for(i=0;i<20;i++){ spark(ctx,R()*w,R()*h,w*(0.005+R()*0.008),'#ffe9a8',0.3+R()*0.5); }
    grain(ctx,w,h,80,0.05,1100);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,lang==='vi'?'CHỈ 24 GIỜ':'24 HOURS ONLY',w/2,h*0.20,'#ffe9a8',w*0.032);
    var t='FLASH SALE';
    var s=fitFont(ctx,t,w*0.135,w*0.84,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#ffffff'; ctx.font='900 '+s+'px "Arial Black",Arial,sans-serif';
    ctx.fillText(t,w/2,h*0.35);
    var s2=fitFont(ctx,'-50%',w*0.30,w*0.84,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#ffd166'; ctx.font='900 '+s2+'px "Arial Black",Arial,sans-serif';
    ctx.fillText('-50%',w/2,h*0.56);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    var pw=w*0.58, ph=h*0.070, px=w/2-pw/2, py=h*0.70;
    ctx.save();
    glassCard(ctx,px,py,pw,ph,w*0.02);
    ctx.fillStyle='#ffffff'; ctx.font='700 '+(w*0.034)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'MÃ: FLASH50':'CODE: FLASH50',w/2,py+ph/2);
    ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='400 '+(w*0.030)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Kết thúc lúc 23:59 hôm nay':'Ends tonight at 23:59',w/2,h*0.815);
    ctx.save();
    try{ctx.letterSpacing=Math.round(w*0.008)+'px';}catch(e){}
    ctx.fillStyle='rgba(255,209,102,0.9)'; ctx.font='600 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText('LEHA STUDIO',w/2,h*0.885);
    ctx.restore();
  }}
 ]};

/* ================= 9. Thông báo Livestream 1080x1080 — badge LIVE ================= */
P['livestream']={ w:1080,h:1080,cat:'social',nameKey:'tpl_livestream',descKey:'tpl_livestream_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#100f16',[
      [w*0.50,h*0.30,w*0.55,'rgba(200,40,70,0.45)'],
      [w*0.15,h*0.80,w*0.45,'rgba(120,50,180,0.40)'],
      [w*0.88,h*0.75,w*0.40,'rgba(60,120,220,0.35)']
    ]);
    vignette(ctx,w,h,0.42);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var bx=w/2, by=h*0.17, bw=w*0.30, bh=h*0.075;
    ctx.save();
    var i;
    for(i=3;i>=1;i--){
      ctx.strokeStyle='rgba(230,46,46,'+(0.35-0.10*i)+')';
      ctx.lineWidth=Math.max(2,w*0.004);
      ctx.beginPath(); ctx.arc(bx,by,bh*(0.9+0.45*i),0,6.3); ctx.stroke();
    }
    ctx.fillStyle='#e62e2e'; rr(ctx,bx-bw/2,by-bh/2,bw,bh,bh/2); ctx.fill();
    ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(bx-bw/2+bh*0.42,by,bh*0.16,0,6.3); ctx.fill();
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font='900 '+(w*0.040)+'px Arial,sans-serif';
    ctx.fillText('LIVE',bx+bw*0.08,by);
    ctx.restore();
    grain(ctx,w,h,90,0.05,900);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,lang==='vi'?'TRỰC TIẾP TỐI NAY':'GOING LIVE TONIGHT',w/2,h*0.33,'#ff8f8f',w*0.030);
    var t=lang==='vi'?'LIVE BÁN HÀNG':'LIVE SHOPPING';
    var s=fitFont(ctx,t,w*0.115,w*0.84,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#ffffff'; ctx.font='900 '+s+'px "Arial Black",Arial,sans-serif';
    ctx.fillText(t,w/2,h*0.47);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cw=w*0.52, ch=h*0.13, cx=w/2-cw/2, cy=h*0.60;
    softShadow(ctx,w/2,cy+ch,w*0.24,ch*0.3,0.4);
    glassCard(ctx,cx,cy,cw,ch,w*0.025);
    ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#ffd166'; ctx.font='900 '+(w*0.075)+'px Arial,sans-serif';
    ctx.fillText('20:00',w/2,cy+ch*0.38);
    ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.font='400 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Giờ Việt Nam':'Vietnam time',w/2,cy+ch*0.72);
    ctx.restore();
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    var pw=w*0.52, ph=h*0.075, px=w/2-pw/2, py=h*0.795;
    ctx.save();
    ctx.fillStyle='#e62e2e'; rr(ctx,px,py,pw,ph,ph/2); ctx.fill();
    ctx.fillStyle='#ffffff'; ctx.font='900 '+(w*0.036)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'XEM NGAY':'WATCH NOW',w/2,py+ph/2);
    ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.font='400 '+(w*0.026)+'px Arial,sans-serif';
    ctx.fillText('LEHA Studio',w/2,h*0.925);
  }}
 ]};

/* ================= 10. Menu cà phê 1080x1520 — món + giá có đường chấm ================= */
P['cafe-menu']={ w:1080,h:1520,cat:'business',nameKey:'tpl_cafe_menu',descKey:'tpl_cafe_menu_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#f7f0e1',[
      [w*0.50,h*0.12,w*0.55,'rgba(200,150,90,0.25)'],
      [w*0.10,h*0.90,w*0.45,'rgba(160,110,60,0.18)'],
      [w*0.90,h*0.85,w*0.40,'rgba(200,150,90,0.20)']
    ]);
    vignette(ctx,w,h,0.15);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    frame2(ctx,w,h,w*0.05,'rgba(110,70,40,0.55)','rgba(110,70,40,0.28)');
    var cx=w/2, cy=h*0.115, s=w*0.05;
    ctx.save(); ctx.strokeStyle='#8a5a33'; ctx.lineWidth=Math.max(2.5,w*0.006); ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(cx-s*0.9,cy-s*0.5); ctx.lineTo(cx+s*0.9,cy-s*0.5);
    ctx.lineTo(cx+s*0.62,cy+s*0.75); ctx.lineTo(cx-s*0.62,cy+s*0.75); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+s*1.12,cy,w*0.028,-1.2,1.2); ctx.stroke();
    ctx.restore();
    grain(ctx,w,h,100,0.035,1000);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,'LEHA COFFEE',w/2,h*0.185,'#8a5a33',w*0.030);
    var s=fitFont(ctx,'MENU',w*0.14,w*0.80,'700','Georgia,serif');
    ctx.fillStyle='#4a3226'; ctx.font='700 '+s+'px Georgia,serif';
    ctx.fillText('MENU',w/2,h*0.26);
    ctx.fillStyle='#8a5a33'; ctx.font='italic 400 '+(w*0.032)+'px Georgia,serif';
    ctx.fillText(lang==='vi'?'Cà phê & Trà':'Coffee & Tea',w/2,h*0.315);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var items=[
      {sec:lang==='vi'?'CÀ PHÊ':'COFFEE'},
      {n:lang==='vi'?'Đen đá':'Black coffee',p:'25.000'},
      {n:lang==='vi'?'Sữa đá':'Milk coffee',p:'30.000'},
      {n:lang==='vi'?'Bạc xỉu':'White coffee',p:'35.000'},
      {n:'Espresso',p:'40.000'},
      {n:'Cappuccino',p:'45.000'},
      {n:'Latte',p:'45.000'},
      {sec:lang==='vi'?'TRÀ':'TEA'},
      {n:lang==='vi'?'Trà đào':'Peach tea',p:'35.000'},
      {n:lang==='vi'?'Trà chanh dây':'Passion tea',p:'30.000'},
      {n:lang==='vi'?'Trà sữa':'Milk tea',p:'38.000'}
    ];
    var x0=w*0.14, x1=w*0.86, y=h*0.40, i, it;
    ctx.textBaseline='middle';
    for(i=0;i<items.length;i++){ it=items[i];
      if(it.sec){
        ctx.save();
        try{ctx.letterSpacing=Math.round(w*0.006)+'px';}catch(e){}
        ctx.textAlign='center'; ctx.fillStyle='#4a3226';
        ctx.font='700 '+(w*0.040)+'px Georgia,serif';
        ctx.fillText(it.sec,w/2,y);
        ctx.restore();
        y+=h*0.048;
      }else{
        ctx.textAlign='left'; ctx.fillStyle='#4a3226';
        ctx.font='400 '+(w*0.034)+'px Arial,sans-serif';
        ctx.fillText(it.n,x0,y);
        var nw=ctx.measureText(it.n).width;
        ctx.textAlign='right'; ctx.fillStyle='#8a5a33';
        ctx.font='700 '+(w*0.034)+'px Arial,sans-serif';
        ctx.fillText(it.p+'đ',x1,y);
        var pw2=ctx.measureText(it.p+'đ').width;
        dotsRow(ctx,x0+nw+w*0.03,x1-pw2-w*0.03,y,'rgba(138,90,51,0.55)',Math.max(2,w*0.004));
        y+=h*0.042;
      }
    }
    ctx.textAlign='center';
    ctx.fillStyle='rgba(74,50,38,0.6)'; ctx.font='400 '+(w*0.026)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Mở cửa 7:00 – 22:00 mỗi ngày':'Open daily 7:00 AM – 10:00 PM',w/2,h*0.925);
  }}
 ]};

/* ================= 11. Voucher giảm giá 1080x680 — viền đục lỗ ================= */
P['voucher']={ w:1080,h:680,cat:'business',nameKey:'tpl_voucher',descKey:'tpl_voucher_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#12203a',[
      [w*0.25,h*0.30,w*0.45,'rgba(60,100,170,0.45)'],
      [w*0.70,h*0.75,w*0.40,'rgba(201,162,39,0.25)'],
      [w*0.95,h*0.15,w*0.30,'rgba(80,130,200,0.30)']
    ]);
    vignette(ctx,w,h,0.35);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    var px=w*0.72;
    ctx.save();
    ctx.fillStyle='#070c16';
    ctx.beginPath(); ctx.arc(px,0,w*0.038,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(px,h,w*0.038,0,6.3); ctx.fill();
    ctx.strokeStyle='rgba(245,241,230,0.5)'; ctx.lineWidth=Math.max(2,w*0.003);
    ctx.setLineDash([w*0.014,w*0.012]);
    ctx.beginPath(); ctx.moveTo(px,w*0.055); ctx.lineTo(px,h-w*0.055); ctx.stroke();
    ctx.setLineDash([]);
    var R=srand(110),i;
    for(i=0;i<16;i++){ spark(ctx,R()*px,R()*h,w*(0.004+R()*0.006),'#e8c15a',0.2+R()*0.4); }
    ctx.restore();
    grain(ctx,w,h,110,0.04,700);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    ctx.save();
    ctx.translate(w*0.86,h/2); ctx.rotate(-Math.PI/2);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    try{ctx.letterSpacing=Math.round(w*0.006)+'px';}catch(e){}
    ctx.fillStyle='rgba(232,193,90,0.85)'; ctx.font='600 '+(w*0.030)+'px Arial,sans-serif';
    ctx.fillText('LEHA STUDIO',0,0);
    ctx.restore();
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var x=w*0.09;
    ctx.textAlign='left'; ctx.textBaseline='middle';
    eyL(ctx,'VOUCHER',x,h*0.22,'#e8c15a',w*0.028);
    var s=fitFont(ctx,'-30%',w*0.15,w*0.52,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#f5f1e6'; ctx.font='900 '+s+'px "Arial Black",Arial,sans-serif';
    ctx.fillText('-30%',x,h*0.47);
    ctx.fillStyle='rgba(245,241,230,0.8)'; ctx.font='600 '+(w*0.030)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'GIẢM GIÁ MỌI DỊCH VỤ':'DISCOUNT ON ALL SERVICES',x,h*0.66);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var x=w*0.09;
    ctx.textBaseline='middle';
    var bw=w*0.30, bh=h*0.115, by=h*0.76;
    ctx.save();
    ctx.strokeStyle='#e8c15a'; ctx.lineWidth=Math.max(2,w*0.003);
    ctx.setLineDash([w*0.010,w*0.008]);
    rr(ctx,x,by,bw,bh,w*0.012); ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign='center';
    ctx.fillStyle='#e8c15a'; ctx.font='700 '+(w*0.032)+'px Arial,sans-serif';
    ctx.fillText('LEHA30',x+bw/2,by+bh/2);
    ctx.restore();
    ctx.textAlign='right';
    ctx.fillStyle='rgba(245,241,230,0.55)'; ctx.font='400 '+(w*0.024)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'HSD: 31/12/2026':'Valid until Dec 31, 2026',w*0.66,h*0.845);
  }}
 ]};

/* ================= 12. Giấy chứng nhận 1600x1131 — trang trọng ================= */
P['certificate']={ w:1600,h:1131,cat:'business',nameKey:'tpl_certificate',descKey:'tpl_certificate_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#f7f1e1',[
      [w*0.50,h*0.40,w*0.55,'rgba(255,255,255,0.65)'],
      [w*0.12,h*0.15,w*0.40,'rgba(212,175,55,0.18)'],
      [w*0.90,h*0.90,w*0.40,'rgba(212,175,55,0.15)']
    ]);
    vignette(ctx,w,h,0.12);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    frame2(ctx,w,h,w*0.035,'rgba(150,110,40,0.8)','rgba(150,110,40,0.4)');
    var m=w*0.035, d=w*0.012, i;
    var cs=[[m,m],[w-m,m],[m,h-m],[w-m,h-m]];
    ctx.save(); ctx.fillStyle='#b98a1e';
    for(i=0;i<4;i++){
      ctx.save(); ctx.translate(cs[i][0],cs[i][1]); ctx.rotate(Math.PI/4);
      ctx.fillRect(-d/2,-d/2,d,d); ctx.restore();
    }
    ctx.restore();
    grain(ctx,w,h,120,0.03,1200);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cx=w*0.80, cy=h*0.72, r=w*0.055;
    ctx.save();
    ctx.fillStyle='#b01e28';
    ctx.beginPath();
    ctx.moveTo(cx-r*0.35,cy+r*0.55); ctx.lineTo(cx-r*0.75,cy+r*1.5); ctx.lineTo(cx-r*0.42,cy+r*1.32);
    ctx.lineTo(cx-r*0.20,cy+r*1.55); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx+r*0.35,cy+r*0.55); ctx.lineTo(cx+r*0.75,cy+r*1.5); ctx.lineTo(cx+r*0.42,cy+r*1.32);
    ctx.lineTo(cx+r*0.20,cy+r*1.55); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#d4af37'; ctx.beginPath(); ctx.arc(cx,cy,r,0,6.3); ctx.fill();
    ctx.fillStyle='#b98a1e'; ctx.beginPath(); ctx.arc(cx,cy,r*0.80,0,6.3); ctx.fill();
    ctx.fillStyle='#f7f1e1'; ctx.beginPath(); ctx.arc(cx,cy,r*0.62,0,6.3); ctx.fill();
    ctx.fillStyle='#b98a1e';
    ctx.font='700 '+(r*0.55)+'px Georgia,serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('LS',cx,cy);
    ctx.restore();
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    eyebrow(ctx,lang==='vi'?'GIẤY CHỨNG NHẬN':'CERTIFICATE OF ACHIEVEMENT',w/2,h*0.175,'#8a6d1a',w*0.024);
    var t=lang==='vi'?'Vinh danh':'Honoring';
    var s=fitFont(ctx,t,w*0.075,w*0.70,'700','Georgia,serif');
    ctx.fillStyle='#3d2f1a'; ctx.font='italic 700 '+s+'px Georgia,serif';
    ctx.fillText(t,w/2,h*0.30);
    ctx.fillStyle='rgba(61,47,26,0.65)'; ctx.font='400 '+(w*0.020)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Được trao tặng cho':'This certificate is presented to',w/2,h*0.40);
    var nm=lang==='vi'?'NGUYỄN VĂN AN':'NGUYEN VAN AN';
    var s2=fitFont(ctx,nm,w*0.055,w*0.78,'900','"Arial Black",Arial,sans-serif');
    ctx.fillStyle='#7a5c17'; ctx.font='900 '+s2+'px "Arial Black",Arial,sans-serif';
    ctx.fillText(nm,w/2,h*0.50);
    ctx.fillStyle='#b98a1e'; ctx.fillRect(w*0.42,h*0.555,w*0.16,Math.max(2,h*0.004));
    ctx.fillStyle='rgba(61,47,26,0.8)'; ctx.font='400 '+(w*0.021)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Đã hoàn thành xuất sắc khóa học Thiết kế đồ họa':'Has successfully completed the Graphic Design course',w/2,h*0.615);
    ctx.fillStyle='rgba(61,47,26,0.55)';
    ctx.fillText(lang==='vi'?'Ngày 10 tháng 10 năm 2026':'October 10, 2026',w/2,h*0.665);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    var y=h*0.85, lw=Math.max(1.5,w*0.0016);
    [[w*0.22,'Giám đốc','Director'],[w*0.50,'Người nhận','Recipient']].forEach(function(sg){
      ctx.strokeStyle='rgba(61,47,26,0.6)'; ctx.lineWidth=lw;
      ctx.beginPath(); ctx.moveTo(sg[0]-w*0.09,y); ctx.lineTo(sg[0]+w*0.09,y); ctx.stroke();
      ctx.fillStyle='rgba(61,47,26,0.7)'; ctx.font='400 '+(w*0.018)+'px Arial,sans-serif';
      ctx.fillText(lang==='vi'?sg[1]:sg[2],sg[0],y+h*0.035);
    });
  }}
 ]};

/* ================= 13. Báo giá 1080x1520 ================= */
P['quotation']={ w:1080,h:1520,cat:'business',nameKey:'tpl_quotation',descKey:'tpl_quotation_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#fbfaf6',[
      [w*0.50,h*0.50,w*0.70,'rgba(255,255,255,0.6)'],
      [w*0.10,h*0.95,w*0.40,'rgba(180,190,210,0.20)']
    ]);
    vignette(ctx,w,h,0.10);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    ctx.fillStyle='#101d33'; ctx.fillRect(0,0,w,h*0.175);
    ctx.fillStyle='#c9a227'; ctx.fillRect(0,h*0.175,w,h*0.008);
    ctx.fillStyle='rgba(16,29,51,0.08)'; ctx.fillRect(0,h*0.94,w,h*0.06);
    grain(ctx,w,h,130,0.03,1000);
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    ctx.textBaseline='middle';
    eyL(ctx,'LEHA STUDIO',w*0.085,h*0.065,'#c9a227',w*0.028);
    var t=lang==='vi'?'BÁO GIÁ':'QUOTATION';
    var s=fitFont(ctx,t,w*0.085,w*0.70,'900','"Arial Black",Arial,sans-serif');
    ctx.textAlign='left';
    ctx.fillStyle='#ffffff'; ctx.font='900 '+s+'px "Arial Black",Arial,sans-serif';
    ctx.fillText(t,w*0.085,h*0.125);
    ctx.textAlign='right';
    ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.font='400 '+(w*0.026)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Số: BG-2026-001':'No: BG-2026-001',w*0.915,h*0.075);
    ctx.fillText(lang==='vi'?'Ngày: 10/10/2026':'Date: Oct 10, 2026',w*0.915,h*0.115);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    var x0=w*0.085, x1=w*0.915, tw=x1-x0;
    ctx.textBaseline='middle';
    ctx.textAlign='left'; ctx.fillStyle='#33415c';
    ctx.font='400 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Khách hàng: Công ty ABC':'Client: ABC Company',x0,h*0.245);
    var rows=[
      ['1',lang==='vi'?'Thiết kế logo':'Logo design','1','15.000.000','15.000.000'],
      ['2',lang==='vi'?'Bộ nhận diện thương hiệu':'Brand identity kit','1','25.000.000','25.000.000'],
      ['3',lang==='vi'?'Thiết kế website':'Website design','1','35.000.000','35.000.000'],
      ['4',lang==='vi'?'In ấn (200 bộ)':'Printing (200 sets)','200','50.000','10.000.000']
    ];
    var head=[lang==='vi'?'STT':'NO',lang==='vi'?'NỘI DUNG':'DESCRIPTION',lang==='vi'?'SL':'QTY',
              lang==='vi'?'ĐƠN GIÁ':'UNIT PRICE',lang==='vi'?'THÀNH TIỀN':'AMOUNT'];
    var cx=[x0+tw*0.04, x0+tw*0.10, x0+tw*0.59, x0+tw*0.83, x0+tw*1.00];
    var al=['center','left','center','right','right'];
    var y=h*0.30, rh=h*0.048, i, j;
    ctx.fillStyle='#101d33'; rr(ctx,x0,y-rh*0.55,tw,rh*1.1,w*0.012); ctx.fill();
    ctx.fillStyle='#c9a227'; ctx.font='700 '+(w*0.026)+'px Arial,sans-serif';
    for(j=0;j<5;j++){ ctx.textAlign=al[j]; ctx.fillText(head[j],cx[j],y); }
    y+=rh;
    ctx.font='400 '+(w*0.027)+'px Arial,sans-serif';
    for(i=0;i<rows.length;i++){
      if(i%2===1){ ctx.fillStyle='rgba(16,29,51,0.05)'; ctx.fillRect(x0,y-rh/2,tw,rh); }
      ctx.fillStyle='#22304a';
      for(j=0;j<5;j++){ ctx.textAlign=al[j]; ctx.fillText(rows[i][j],cx[j],y); }
      ctx.strokeStyle='rgba(16,29,51,0.15)'; ctx.lineWidth=Math.max(1,w*0.0012);
      ctx.beginPath(); ctx.moveTo(x0,y+rh/2); ctx.lineTo(x1,y+rh/2); ctx.stroke();
      y+=rh;
    }
    ctx.fillStyle='#c9a227'; rr(ctx,x0,y-rh*0.45,tw,rh*1.05,w*0.012); ctx.fill();
    ctx.fillStyle='#101d33'; ctx.font='900 '+(w*0.030)+'px Arial,sans-serif';
    ctx.textAlign='left'; ctx.fillText(lang==='vi'?'TỔNG CỘNG':'TOTAL',cx[1],y+rh*0.05);
    ctx.textAlign='right'; ctx.fillText('85.000.000đ',cx[4],y+rh*0.05);
    ctx.textAlign='left'; ctx.fillStyle='rgba(34,48,74,0.65)';
    ctx.font='400 '+(w*0.024)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Ghi chú: Giá chưa bao gồm VAT 8%.':'Note: Prices exclude 8% VAT.',x0,h*0.80);
    ctx.fillText(lang==='vi'?'Hiệu lực báo giá: 30 ngày.':'Valid for 30 days.',x0,h*0.83);
    ctx.textAlign='center'; ctx.fillStyle='#101d33'; ctx.font='700 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Cảm ơn quý khách!':'Thank you!',w/2,h*0.895);
  }}
 ]};

/* ================= 14. Thẻ thành viên 1050x600 — tích điểm ================= */
P['loyalty-card']={ w:1050,h:600,cat:'business',nameKey:'tpl_loyalty_card',descKey:'tpl_loyalty_card_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    meshGlow(ctx,w,h,'#0e0e13',[
      [w*0.20,h*0.25,w*0.45,'rgba(120,70,160,0.35)'],
      [w*0.80,h*0.75,w*0.45,'rgba(212,175,55,0.28)'],
      [w*0.50,h*0.95,w*0.50,'rgba(60,30,90,0.40)']
    ]);
    vignette(ctx,w,h,0.40);
  }},
  {nameKey:'tpl_layer_decor',draw:function(ctx,w,h,lang){
    frame2(ctx,w,h,w*0.04,'rgba(212,175,55,0.6)','rgba(212,175,55,0.28)');
    ctx.save();
    ctx.strokeStyle='rgba(212,175,55,0.14)'; ctx.lineWidth=Math.max(2,w*0.006);
    ctx.beginPath(); ctx.arc(w*0.92,h*0.95,w*0.35,Math.PI,Math.PI*1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(w*0.92,h*0.95,w*0.28,Math.PI,Math.PI*1.5); ctx.stroke();
    var R=srand(140),i;
    for(i=0;i<16;i++){ spark(ctx,R()*w,R()*h,w*(0.004+R()*0.006),'#f0d98c',0.2+R()*0.4); }
    ctx.restore();
    grain(ctx,w,h,140,0.04,700);
  }},
  {nameKey:'tpl_layer_artwork',draw:function(ctx,w,h,lang){
    var cx0=w*0.10, cy0=h*0.52, cw=w*0.085, chh=h*0.115;
    ctx.save();
    var g=ctx.createLinearGradient(0,cy0,0,cy0+chh);
    g.addColorStop(0,'#e8c15a'); g.addColorStop(1,'#a8842a');
    ctx.fillStyle=g; rr(ctx,cx0,cy0,cw,chh,w*0.008); ctx.fill();
    ctx.strokeStyle='rgba(60,40,10,0.55)'; ctx.lineWidth=Math.max(1.5,w*0.0025);
    ctx.beginPath(); ctx.moveTo(cx0+cw*0.5,cy0); ctx.lineTo(cx0+cw*0.5,cy0+chh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx0,cy0+chh*0.5); ctx.lineTo(cx0+cw,cy0+chh*0.5); ctx.stroke();
    ctx.restore();
    ctx.save();
    var sx=w*0.42, sy=h*0.60, sr=w*0.020, gap=w*0.052, k, px2;
    for(k=0;k<10;k++){
      px2=sx+k*gap;
      if(k<3){
        ctx.fillStyle='#d4af37'; ctx.beginPath(); ctx.arc(px2,sy,sr,0,6.3); ctx.fill();
        ctx.fillStyle='#0e0e13'; ctx.beginPath(); ctx.arc(px2,sy,sr*0.35,0,6.3); ctx.fill();
      }else{
        ctx.strokeStyle='rgba(212,175,55,0.55)'; ctx.lineWidth=Math.max(1.5,w*0.002);
        ctx.beginPath(); ctx.arc(px2,sy,sr,0,6.3); ctx.stroke();
      }
    }
    ctx.restore();
  }},
  {nameKey:'tpl_layer_headline',draw:function(ctx,w,h,lang){
    var x=w*0.10;
    ctx.textAlign='left'; ctx.textBaseline='middle';
    eyL(ctx,lang==='vi'?'THẺ THÀNH VIÊN':'MEMBERSHIP CARD',x,h*0.20,'#d4af37',w*0.026);
    var nm=lang==='vi'?'NGUYỄN VĂN AN':'NGUYEN VAN AN';
    var s=fitFont(ctx,nm,w*0.048,w*0.62,'700','Arial,sans-serif');
    ctx.fillStyle='#f5f1e6'; ctx.font='700 '+s+'px Arial,sans-serif';
    ctx.fillText(nm,x,h*0.32);
    ctx.fillStyle='#d4af37'; ctx.font='600 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'HẠNG VÀNG':'GOLD TIER',x,h*0.42);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textBaseline='middle';
    ctx.textAlign='left'; ctx.fillStyle='rgba(245,241,230,0.75)';
    ctx.font='400 '+(w*0.028)+'px Arial,sans-serif';
    ctx.fillText('2026 001 234',w*0.10,h*0.80);
    ctx.textAlign='right';
    ctx.fillStyle='rgba(212,175,55,0.9)'; ctx.font='600 '+(w*0.024)+'px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Tích 3/10 điểm':'3/10 points',w*0.90,h*0.50);
    ctx.fillStyle='rgba(245,241,230,0.5)';
    ctx.fillText('LEHA STUDIO',w*0.90,h*0.82);
  }}
 ]};

})();

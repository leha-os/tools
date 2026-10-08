/* ============================================================================
   LEHA Studio — shared template definitions (single source of truth)
   - Loaded via <script src="templates-data.js"> by: templates.html,
     photo-editor.html, vector-editor.html (inserted before </head>).
   - Photo templates: each layer has draw(ctx,w,h,lang). Gallery renders
     thumbnails by running draws on a scaled ctx; photo-editor builds REAL
     editable layers and runs the same draws at full size.
   - Vector templates: objects[] -> real editable SVG elements in
     vector-editor; gallery renders the same objects as an inline SVG string.
   - No external images. Works offline. No emojis.
   ============================================================================ */
(function(){
'use strict';

function srand(seed){ var s=seed>>>0; return function(){ s=(s*9301+49297)%233280; return s/233280; }; }

function rr(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);     ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function starD(cx,cy,ro,ri,n,rot){
  var d='',i,a,rad;
  for(i=0;i<n*2;i++){ a=(rot==null?-Math.PI/2:rot)+i*Math.PI/n; rad=(i%2)?ri:ro;
    d+=(i?'L':'M')+(cx+rad*Math.cos(a)).toFixed(1)+' '+(cy+rad*Math.sin(a)).toFixed(1); }
  return d+'Z';
}
function polyD(cx,cy,r,n,rot){
  var d='',i,a;
  for(i=0;i<n;i++){ a=(rot==null?-Math.PI/2:rot)+i*2*Math.PI/n;
    d+=(i?'L':'M')+(cx+r*Math.cos(a)).toFixed(1)+' '+(cy+r*Math.sin(a)).toFixed(1); }
  return d+'Z';
}

var PHOTO = {

/* ---------------- 1. Poster sale 1080x1350 ---------------- */
'poster-sale':{ w:1080,h:1350,nameKey:'tpl_poster_sale',descKey:'tpl_poster_sale_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#b01e28'); g.addColorStop(0.55,'#701016'); g.addColorStop(1,'#2b0609');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    var rg=ctx.createRadialGradient(w/2,200,60,w/2,200,760);
    rg.addColorStop(0,'rgba(255,190,90,0.40)'); rg.addColorStop(1,'rgba(255,190,90,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var R=srand(11),i,x,y,r;
    var cols=['#f4d35e','#ee964b','#ffffff','#ffd166'];
    for(i=0;i<80;i++){ x=R()*w; y=R()*h; r=3+R()*8;
      ctx.globalAlpha=0.20+R()*0.50; ctx.fillStyle=cols[i%4];
      ctx.beginPath(); ctx.arc(x,y,r,0,6.3); ctx.fill(); }
    ctx.globalAlpha=1;
    ctx.strokeStyle='#f4d35e'; ctx.lineWidth=10;
    ctx.beginPath(); ctx.arc(w-200,220,120,0,6.3); ctx.stroke();
    ctx.lineWidth=4;
    ctx.beginPath(); ctx.arc(w-200,220,94,0,6.3); ctx.stroke();
    ctx.fillStyle='rgba(244,211,94,0.92)';
    ctx.save(); ctx.translate(w/2,h+60); ctx.rotate(-0.16);
    ctx.fillRect(-w,-120,2*w,64); ctx.restore();
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#7a1010'; ctx.font='900 40px Arial,sans-serif';
    ctx.fillText('12.12', w-200, 220);
    ctx.fillStyle='#ffffff'; ctx.font='900 140px "Arial Black",Arial,sans-serif';
    ctx.fillText(lang==='vi'?'SIÊU SALE':'MEGA SALE', w/2, 560);
    ctx.fillStyle='#f4d35e'; ctx.font='900 84px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'GIẢM ĐẾN 50%':'UP TO 50% OFF', w/2, 700);
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='42px Arial,sans-serif';
    ctx.fillText('LEHA Studio', w/2, h-90);
  }}
 ]},

/* ---------------- 2. Card visit 1050x600 ---------------- */
'business-card':{ w:1050,h:600,nameKey:'tpl_business_card',descKey:'tpl_business_card_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'#101f30'); g.addColorStop(0.5,'#18293f'); g.addColorStop(1,'#0a1420');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='rgba(201,162,39,0.12)'; ctx.lineWidth=2;
    var i; for(i=-h;i<w;i+=46){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+h,h); ctx.stroke(); }
    ctx.fillStyle='#c9a227'; ctx.fillRect(0,h-24,w,24);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    ctx.strokeStyle='#c9a227'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(150,285,86,0,6.3); ctx.stroke();
    ctx.fillStyle='#c9a227'; ctx.font='700 104px Georgia,serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('L',150,294);
    ctx.fillRect(300,212,64,6);
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    ctx.fillStyle='#ffffff'; ctx.font='700 62px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'NGUYỄN VĂN AN':'NGUYEN VAN AN', 300, 300);
    ctx.fillStyle='#c9a227'; ctx.font='600 30px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Giám đốc sáng tạo':'Creative Director', 300, 352);
    ctx.fillStyle='rgba(255,255,255,0.72)'; ctx.font='28px Arial,sans-serif';
    ctx.fillText('0901 234 567', 300, 430);
    ctx.fillText('hello@leha.studio', 300, 472);
  }}
 ]},

/* ---------------- 3. Bài đăng vuông 1080x1080 ---------------- */
'post-square':{ w:1080,h:1080,nameKey:'tpl_post_square',descKey:'tpl_post_square_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#faf4e8'); g.addColorStop(1,'#f1e3c9');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(224,120,86,0.12)';
    ctx.beginPath(); ctx.arc(180,200,150,0,6.3); ctx.fill();
    ctx.fillStyle='rgba(201,162,39,0.14)';
    ctx.beginPath(); ctx.arc(920,880,190,0,6.3); ctx.fill();
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    ctx.fillStyle='rgba(60,40,20,0.12)';
    ctx.beginPath(); ctx.ellipse(540,786,210,44,0,0,6.3); ctx.fill();
    ctx.fillStyle='#ffffff';
    rr(ctx,390,400,300,330,44); ctx.fill();
    ctx.strokeStyle='#e4d6bd'; ctx.lineWidth=6;
    rr(ctx,390,400,300,330,44); ctx.stroke();
    ctx.fillStyle='#6f4e37';
    ctx.beginPath(); ctx.ellipse(540,448,118,32,0,0,6.3); ctx.fill();
    ctx.lineCap='round';
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=36;
    ctx.beginPath(); ctx.arc(706,560,86,-1.25,1.25); ctx.stroke();
    ctx.strokeStyle='#e4d6bd'; ctx.lineWidth=6;
    ctx.beginPath(); ctx.arc(706,560,106,-1.25,1.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(706,560,66,-1.25,1.25); ctx.stroke();
    ctx.strokeStyle='rgba(111,78,55,0.55)'; ctx.lineWidth=10;
    var sp=[[480,330],[540,330],[600,330]],i,p;
    for(i=0;i<sp.length;i++){ p=sp[i];
      ctx.beginPath(); ctx.moveTo(p[0],p[1]);
      ctx.bezierCurveTo(p[0]-24,p[1]-40,p[0]+24,p[1]-70,p[0],p[1]-110); ctx.stroke(); }
    ctx.fillStyle='#e07856';
    ctx.beginPath(); ctx.arc(830,300,92,0,6.3); ctx.fill();
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#3b2a20'; ctx.font='900 84px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'CÀ PHÊ SÁNG':'MORNING BREW', 540, 150);
    ctx.fillStyle='#ffffff'; ctx.font='900 52px Arial,sans-serif';
    ctx.fillText('-30%', 830, 302);
    ctx.fillStyle='#e07856'; ctx.font='700 54px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'MUA 1 TẶNG 1':'BUY 1 GET 1', 540, 918);
    ctx.fillStyle='rgba(59,42,32,0.6)'; ctx.font='32px Arial,sans-serif';
    ctx.fillText('LEHA Studio', 540, 984);
  }}
 ]}
};
window.__LEHA_PHOTO_TPL__ = PHOTO;

/* ---- photo templates 4-5 appended below (inside same IIFE: helpers in scope) ---- */

/* ---------------- 4. Thumbnail YouTube 1280x720 ---------------- */
window.__LEHA_PHOTO_TPL__['youtube-thumbnail']={ w:1280,h:720,nameKey:'tpl_youtube_thumbnail',descKey:'tpl_youtube_thumbnail_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'#1c1140'); g.addColorStop(1,'#0b1e42');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    var orbs=[[240,160,220,'rgba(217,70,160,0.50)'],[1060,560,260,'rgba(56,189,248,0.45)'],[1050,140,150,'rgba(250,204,21,0.35)']];
    orbs.forEach(function(o){
      var rg=ctx.createRadialGradient(o[0],o[1],10,o[0],o[1],o[2]);
      rg.addColorStop(0,o[3]); rg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
    });
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    ctx.fillStyle='#e62e2e';
    rr(ctx,560,250,220,160,48); ctx.fill();
    ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.moveTo(646,292); ctx.lineTo(646,368); ctx.lineTo(718,330); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#facc15';
    var bx=180,by=430;
    ctx.beginPath();
    ctx.moveTo(bx+40,by-110); ctx.lineTo(bx-30,by+10); ctx.lineTo(bx+8,by+10);
    ctx.lineTo(bx-20,by+110); ctx.lineTo(bx+60,by-20); ctx.lineTo(bx+18,by-20);
    ctx.closePath(); ctx.fill();
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font='900 104px Arial,sans-serif';
    ctx.lineWidth=14; ctx.strokeStyle='#0a0a0a'; ctx.lineJoin='round';
    var s=lang==='vi'?'BÍ KÍP 100K SUB':'100K SUB SECRETS';
    ctx.strokeText(s,640,140);
    ctx.fillStyle='#facc15'; ctx.fillText(s,640,140);
    ctx.font='700 52px Arial,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.fillText(lang==='vi'?'TRONG 30 NGÀY':'IN 30 DAYS',640,620);
  }}
 ]};

/* ---------------- 5. Cover Facebook 1640x924 ---------------- */
window.__LEHA_PHOTO_TPL__['facebook-cover']={ w:1640,h:924,nameKey:'tpl_facebook_cover',descKey:'tpl_facebook_cover_d',
 layers:[
  {nameKey:'tpl_layer_bg',draw:function(ctx,w,h,lang){
    var g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'#07333b'); g.addColorStop(1,'#0b5560');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  }},
  {nameKey:'tpl_layer_shapes',draw:function(ctx,w,h,lang){
    var waves=[['rgba(255,255,255,0.07)',120],['rgba(255,255,255,0.10)',300],['rgba(201,162,39,0.16)',520]];
    waves.forEach(function(wv){
      ctx.fillStyle=wv[0]; ctx.beginPath(); ctx.moveTo(0,h);
      ctx.bezierCurveTo(w*0.3,h-160+wv[1]*0.2, w*0.6,h-40-wv[1]*0.2, w,h-120);
      ctx.lineTo(w,h); ctx.closePath(); ctx.fill();
    });
    var R=srand(21),i;
    ctx.fillStyle='#c9a227';
    for(i=0;i<40;i++){ ctx.globalAlpha=0.25+R()*0.5;
      ctx.beginPath(); ctx.arc(R()*w,R()*h*0.5,2+R()*5,0,6.3); ctx.fill(); }
    ctx.globalAlpha=1;
  }},
  {nameKey:'tpl_layer_text',draw:function(ctx,w,h,lang){
    ctx.textAlign='left'; ctx.textBaseline='middle';
    ctx.fillStyle='#ffffff'; ctx.font='900 118px Arial,sans-serif';
    ctx.fillText('LEHA STUDIO', 130, 400);
    ctx.fillStyle='#e8c15a'; ctx.font='600 46px Arial,sans-serif';
    ctx.fillText(lang==='vi'?'Sáng tạo không giới hạn':'Create without limits', 134, 512);
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='32px Arial,sans-serif';
    ctx.fillText('leha.studio', 134, 584);
  }}
 ]};

/* ================= VECTOR TEMPLATES ================= */
var VECTOR = {};

/* 6. Logo quán cà phê (1000x1000) */
VECTOR['logo-cafe']={ w:1000,h:1000,nameKey:'tpl_logo_cafe',descKey:'tpl_logo_cafe_d',
 objects:[
  {tag:'ellipse',attrs:{cx:500,cy:430,rx:320,ry:320},style:{fill:'#2b1d12'},nameKey:'tpl_p_bg'},
  {tag:'ellipse',attrs:{cx:500,cy:430,rx:320,ry:320},style:{fill:'none',stroke:'#c9a227','stroke-width':16},nameKey:'tpl_p_ring'},
  {tag:'ellipse',attrs:{cx:500,cy:640,rx:185,ry:42},style:{fill:'#c9a227',opacity:0.92},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M368 420 L632 420 L594 616 L406 616 Z'},style:{fill:'#f5efe4'},nameKey:'tpl_p_shape'},
  {tag:'ellipse',attrs:{cx:500,cy:430,rx:132,ry:28},style:{fill:'#4b2f1d'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M632 452 C712 452 712 560 606 572'},style:{fill:'none',stroke:'#f5efe4','stroke-width':34,'stroke-linecap':'round'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M462 366 C444 328 482 300 462 258'},style:{fill:'none',stroke:'#ffffff','stroke-width':10,'stroke-linecap':'round',opacity:0.75},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M538 366 C520 328 558 300 538 258'},style:{fill:'none',stroke:'#ffffff','stroke-width':10,'stroke-linecap':'round',opacity:0.75},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:836,'font-size':66,'text-anchor':'middle','font-family':'Georgia, serif','font-weight':'bold'},style:{fill:'#2b1d12'},text:{vi:'CÀ PHÊ LEHA',en:'LEHA COFFEE'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:894,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':10},style:{fill:'#8a6d1a'},text:{vi:'HƯƠNG VỊ ĐẬM ĐÀ',en:'RICH FLAVOR'},nameKey:'tpl_p_text'}
 ]};

/* 7. Logo công nghệ (1000x1000) */
VECTOR['logo-tech']={ w:1000,h:1000,nameKey:'tpl_logo_tech',descKey:'tpl_logo_tech_d',
 objects:[
  {tag:'path',attrs:{d:polyD(500,420,300,6)},style:{fill:'#1f6feb'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:polyD(500,420,300,6)},style:{fill:'none',stroke:'#0a2540','stroke-width':10,opacity:0.35},nameKey:'tpl_p_ring'},
  {tag:'path',attrs:{d:'M548 250 L402 540 L498 540 L452 690 L618 470 L518 470 Z'},style:{fill:'#ffd60a'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:856,'font-size':76,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':900,'letter-spacing':14},style:{fill:'#101828'},text:{vi:'LEHA TECH',en:'LEHA TECH'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:912,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':8},style:{fill:'#667085'},text:{vi:'CÔNG NGHỆ TƯƠNG LAI',en:'FUTURE TECH'},nameKey:'tpl_p_text'}
 ]};

/* 8. Bộ 8 icon (1200x800) — glyphs generated in code */
VECTOR['icons-8']=(function(){
  var glyphs=[
   [{d:'M50 12 L90 48 H76 V88 H24 V48 H10 Z',f:1}],
   [{d:'M50 86 C32 70 16 57 16 39 C16 25 27 15 39 15 C45 15 49 19 50 25 C51 19 55 15 61 15 C73 15 84 25 84 39 C84 57 68 70 50 86 Z',f:1}],
   [{d:starD(50,52,42,17,5),f:1}],
   [{d:'M12 22 H26 L38 68 H76 L86 34',f:0},
    {d:'M38 80 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M70 80 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0',f:1}],
   [{d:'M34 12 H66 A8 8 0 0 1 74 20 V80 A8 8 0 0 1 66 88 H34 A8 8 0 0 1 26 80 V20 A8 8 0 0 1 34 12 Z M44 76 H56',f:0}],
   [{d:'M16 30 H84 V72 H16 Z M16 34 L50 60 L84 34',f:0}],
   [{d:'M16 38 H84 V74 H16 Z',f:0},
    {d:'M50 56 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0',f:0},
    {d:'M38 38 L44 28 H58 L64 38',f:0}],
   [{d:'M36 78 m-11 0 a11 9 0 1 0 22 0 a11 9 0 1 0 -22 0',f:1},
    {d:'M47 78 V24 C58 24 68 30 70 44',f:0}]
  ];
  var obs=[],i,g,j,col,row,tx,ty;
  for(i=0;i<glyphs.length;i++){
    col=i%4; row=(i/4)|0; tx=40+col*290; ty=60+row*340;
    obs.push({tag:'rect',attrs:{x:tx,y:ty,width:240,height:280,rx:28},
      style:{fill:'#f2f4f8',stroke:'#d7dde6','stroke-width':3},nameKey:'tpl_p_icon'});
    g=glyphs[i];
    for(j=0;j<g.length;j++){
      obs.push({tag:'path',
        attrs:{d:g[j].d,transform:'translate('+(tx+70)+' '+(ty+90)+')'},
        style:g[j].f?{fill:'#1f2937'}:{fill:'none',stroke:'#1f2937','stroke-width':9,'stroke-linecap':'round','stroke-linejoin':'round'},
        nameKey:'tpl_p_icon'});
    }
  }
  return { w:1200,h:800,nameKey:'tpl_icons_8',descKey:'tpl_icons_8_d',objects:obs };
})();

/* 9. Huy hiệu tròn (1000x1000) */
VECTOR['badge-round']={ w:1000,h:1000,nameKey:'tpl_badge',descKey:'tpl_badge_d',
 defs:'<path id="lehaTplArc" d="M500 500 m -232 0 a 232 232 0 1 1 464 0 a 232 232 0 1 1 -464 0" fill="none"/>',
 objects:[
  {tag:'circle',attrs:{cx:500,cy:500,r:380},style:{fill:'none',stroke:'#b98a1e','stroke-width':20},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:500,r:344},style:{fill:'none',stroke:'#b98a1e','stroke-width':4},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:500,r:300},style:{fill:'#0f3d2e'},nameKey:'tpl_p_bg'},
  {tag:'path',attrs:{d:starD(500,500,150,62,5)},style:{fill:'#e8c15a'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{'font-size':54,'font-family':'Arial, sans-serif','font-weight':'bold','letter-spacing':6},
   style:{fill:'#e8c15a'},
   children:[{tag:'textPath',attrs:{href:'#lehaTplArc','xlink:href':'#lehaTplArc'},
     text:{vi:'CHẤT LƯỢNG CAO • LEHA STUDIO • 2026 • ',en:'PREMIUM QUALITY • LEHA STUDIO • 2026 • '}}],
   nameKey:'tpl_p_text'}
 ]};

window.LEHA_TEMPLATES={photo:window.__LEHA_PHOTO_TPL__,vector:VECTOR};
})();

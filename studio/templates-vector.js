/* ============================================================================
   LEHA Studio — 19 vector templates (premium set).
   Load AFTER templates-core.js (uses starD, polyD) and BEFORE templates-index.js.
   Schema: V[id] = { w,h,cat,nameKey,descKey,defs?,objects:[{tag,attrs,style,
             text?{vi,en},children?,nameKey}] }
   Rule: defs ids are unique per template (prefixed by template id).
   ============================================================================ */
(function(){
'use strict';
window.__LEHA_VECTOR_TPL__ = window.__LEHA_VECTOR_TPL__ || {};
var V = window.__LEHA_VECTOR_TPL__;

/* arc segment of a donut chart */
function donutSeg(cx,cy,r0,r1,a0,a1){
  function pt(r,a){ return (cx+r*Math.cos(a)).toFixed(1)+' '+(cy+r*Math.sin(a)).toFixed(1); }
  var large=(a1-a0)>Math.PI?1:0;
  return 'M'+pt(r1,a0)+'A'+r1+' '+r1+' 0 '+large+' 1 '+pt(r1,a1)+
         'L'+pt(r0,a1)+'A'+r0+' '+r0+' 0 '+large+' 0 '+pt(r0,a0)+'Z';
}

/* ============ 1. logo-cafe (REDESIGN 1000x1000) ============ */
V['logo-cafe']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_logo_cafe',descKey:'tpl_logo_cafe_d',
 objects:[
  {tag:'circle',attrs:{cx:500,cy:470,r:392},style:{fill:'#FAF6EC'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:470,r:392},style:{fill:'none',stroke:'#B98A1E','stroke-width':10},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:470,r:360},style:{fill:'none',stroke:'#B98A1E','stroke-width':3},nameKey:'tpl_p_ring'},
  /* saucer */
  {tag:'ellipse',attrs:{cx:500,cy:660,rx:178,ry:30},style:{fill:'#B98A1E',opacity:0.9},nameKey:'tpl_p_shape'},
  /* cup body */
  {tag:'path',attrs:{d:'M368 372 L632 372 L590 612 L410 612 Z'},style:{fill:'#3B2416'},nameKey:'tpl_p_shape'},
  /* coffee surface */
  {tag:'ellipse',attrs:{cx:500,cy:372,rx:132,ry:26},style:{fill:'#8A5A2B'},nameKey:'tpl_p_shape'},
  {tag:'ellipse',attrs:{cx:500,cy:368,rx:104,ry:17},style:{fill:'#6B4220'},nameKey:'tpl_p_shape'},
  /* handle */
  {tag:'path',attrs:{d:'M632 404 C724 404 724 544 594 552'},style:{fill:'none',stroke:'#3B2416','stroke-width':38,'stroke-linecap':'round'},nameKey:'tpl_p_shape'},
  /* gold band on cup */
  {tag:'path',attrs:{d:'M392 470 L608 470 L600 512 L400 512 Z'},style:{fill:'#B98A1E',opacity:0.9},nameKey:'tpl_p_shape'},
  /* steam */
  {tag:'path',attrs:{d:'M458 322 C438 282 478 252 458 210'},style:{fill:'none',stroke:'#B98A1E','stroke-width':12,'stroke-linecap':'round',opacity:0.75},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M542 322 C522 282 562 252 542 210'},style:{fill:'none',stroke:'#B98A1E','stroke-width':12,'stroke-linecap':'round',opacity:0.75},nameKey:'tpl_p_shape'},
  /* laurel sprigs */
  {tag:'path',attrs:{d:'M206 540 C236 606 292 656 366 682'},style:{fill:'none',stroke:'#8A6D1A','stroke-width':6,'stroke-linecap':'round'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M794 540 C764 606 708 656 634 682'},style:{fill:'none',stroke:'#8A6D1A','stroke-width':6,'stroke-linecap':'round'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:polyD(232,586,15,4)+polyD(282,634,15,4)+polyD(340,664,15,4)},style:{fill:'#B98A1E'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:polyD(768,586,15,4)+polyD(718,634,15,4)+polyD(660,664,15,4)},style:{fill:'#B98A1E'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:872,'font-size':74,'text-anchor':'middle','font-family':'Georgia, serif','font-weight':'bold','letter-spacing':10},style:{fill:'#3B2416'},text:{vi:'CÀ PHÊ LEHA',en:'LEHA COFFEE'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:928,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':12},style:{fill:'#B98A1E'},text:{vi:'HƯƠNG VỊ ĐẬM ĐÀ',en:'RICH FLAVOR'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:968,'font-size':22,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':6},style:{fill:'#8A6D1A'},text:{vi:'EST. 2016',en:'EST. 2016'},nameKey:'tpl_p_text'}
 ]};

/* ============ 2. logo-tech (REDESIGN 1000x1000) ============ */
V['logo-tech']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_logo_tech',descKey:'tpl_logo_tech_d',
 defs:'<linearGradient id="ltGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#1F6FEB"/></linearGradient>',
 objects:[
  {tag:'rect',attrs:{x:0,y:0,width:1000,height:1000},style:{fill:'#0A2540'},nameKey:'tpl_p_bg'},
  {tag:'path',attrs:{d:polyD(500,430,332,6)},style:{fill:'none',stroke:'url(#ltGrad)','stroke-width':12},nameKey:'tpl_p_ring'},
  {tag:'path',attrs:{d:polyD(500,430,294,6)},style:{fill:'none',stroke:'#1F6FEB','stroke-width':3,opacity:0.7},nameKey:'tpl_p_ring'},
  /* circuit traces */
  {tag:'path',attrs:{d:'M500 98 V180 M228 580 L300 538 M772 580 L700 538 M352 748 L400 690 M648 748 L600 690'},style:{fill:'none',stroke:'#22D3EE','stroke-width':8,'stroke-linecap':'round',opacity:0.85},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:500,cy:180,r:16},style:{fill:'#22D3EE'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:300,cy:538,r:16},style:{fill:'#22D3EE'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:700,cy:538,r:16},style:{fill:'#22D3EE'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:400,cy:690,r:16},style:{fill:'#22D3EE'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:600,cy:690,r:16},style:{fill:'#22D3EE'},nameKey:'tpl_p_shape'},
  /* monogram */
  {tag:'text',attrs:{x:500,y:560,'font-size':270,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':900},style:{fill:'url(#ltGrad)'},text:{vi:'L',en:'L'},nameKey:'tpl_p_logo'},
  {tag:'text',attrs:{x:500,y:884,'font-size':80,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':900,'letter-spacing':16},style:{fill:'#F8FAFC'},text:{vi:'LEHA TECH',en:'LEHA TECH'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:936,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':10},style:{fill:'#22D3EE'},text:{vi:'CÔNG NGHỆ TƯƠNG LAI',en:'FUTURE TECH'},nameKey:'tpl_p_text'}
 ]};

/* ============ 3. icons-8 (REDESIGN 1200x800) ============ */
V['icons-8']=(function(){
  var glyphs=[
   /* coffee cup */
   [{d:'M24 34 H72 V66 A22 22 0 0 1 50 88 H40 Z',f:0},
    {d:'M72 40 H82 A13 13 0 0 1 82 66 H70',f:0},
    {d:'M40 28 C34 20 46 14 40 6 M56 28 C50 20 62 14 56 6',f:0}],
   /* shopping bag */
   [{d:'M32 42 H88 L82 94 H38 Z',f:0},
    {d:'M46 42 V32 A14 14 0 0 1 74 32 V42',f:0}],
   /* heart */
   [{d:'M60 92 C42 76 24 62 24 44 C24 32 33 24 44 24 C51 24 57 28 60 34 C63 28 69 24 76 24 C87 24 96 32 96 44 C96 62 78 76 60 92 Z',f:0}],
   /* truck */
   [{d:'M10 34 H62 V72 H10 Z',f:0},
    {d:'M62 44 H84 L98 58 V72 H62',f:0},
    {d:'M32 72 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0',f:0},
    {d:'M80 72 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0',f:0}],
   /* smartphone */
   [{d:'M38 12 H82 A8 8 0 0 1 90 20 V92 A8 8 0 0 1 82 100 H38 A8 8 0 0 1 30 92 V20 A8 8 0 0 1 38 12 Z',f:0},
    {d:'M52 90 H68',f:0}],
   /* envelope */
   [{d:'M16 32 H104 A6 6 0 0 1 110 38 V78 A6 6 0 0 1 104 84 H16 A6 6 0 0 1 10 78 V38 A6 6 0 0 1 16 32 Z',f:0},
    {d:'M14 40 L60 68 L106 40',f:0}],
   /* camera */
   [{d:'M14 40 H106 A6 6 0 0 1 112 46 V80 A6 6 0 0 1 106 86 H14 A6 6 0 0 1 8 80 V46 A6 6 0 0 1 14 40 Z',f:0},
    {d:'M60 63 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0',f:0},
    {d:'M44 40 L52 28 H68 L76 40',f:0}],
   /* gift */
   [{d:'M28 50 H92 V94 H28 Z',f:0},
    {d:'M60 50 V94',f:0},
    {d:'M28 62 H92',f:0},
    {d:'M60 50 C46 48 36 40 38 30 C39 23 48 22 53 27 C57 18 74 18 76 28 C78 38 68 48 60 50',f:0}]
  ];
  var obs=[],i,g,j,col,row,tx,ty;
  for(i=0;i<glyphs.length;i++){
    col=i%4; row=(i/4)|0; tx=40+col*290; ty=60+row*340;
    obs.push({tag:'rect',attrs:{x:tx,y:ty,width:240,height:280,rx:28},
      style:{fill:'#FFFFFF',stroke:'#E2E8F0','stroke-width':2},nameKey:'tpl_p_icon'});
    obs.push({tag:'rect',attrs:{x:tx+95,y:ty+20,width:50,height:6,rx:3},
      style:{fill:'#D4AF37'},nameKey:'tpl_p_icon'});
    g=glyphs[i];
    for(j=0;j<g.length;j++){
      obs.push({tag:'path',
        attrs:{d:g[j].d,transform:'translate('+(tx+60)+' '+(ty+82)+')'},
        style:{fill:'none',stroke:'#14213D','stroke-width':10,'stroke-linecap':'round','stroke-linejoin':'round'},
        nameKey:'tpl_p_icon'});
    }
  }
  return { w:1200,h:800,cat:'logovec',nameKey:'tpl_icons_8',descKey:'tpl_icons_8_d',objects:obs };
})();

/* ============ 4. badge-round (REDESIGN 1000x1000) ============ */
V['badge-round']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_badge',descKey:'tpl_badge_d',
 defs:'<path id="brArc" d="M500 500 m -268 0 a 268 268 0 1 1 536 0 a 268 268 0 1 1 -536 0" fill="none"/>',
 objects:[
  {tag:'circle',attrs:{cx:500,cy:500,r:388},style:{fill:'#0F3D2E'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:500,r:388},style:{fill:'none',stroke:'#C9A227','stroke-width':18},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:500,r:352},style:{fill:'none',stroke:'#C9A227','stroke-width':4},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:500,r:308},style:{fill:'none',stroke:'#C9A227','stroke-width':2,opacity:0.6},nameKey:'tpl_p_ring'},
  {tag:'path',attrs:{d:starD(500,500,158,64,5)},style:{fill:'#E8C15A'},nameKey:'tpl_p_badge'},
  {tag:'text',attrs:{x:500,y:580,'font-size':160,'text-anchor':'middle','font-family':'Georgia, serif','font-weight':'bold'},style:{fill:'#0F3D2E'},text:{vi:'L',en:'L'},nameKey:'tpl_p_logo'},
  {tag:'path',attrs:{d:starD(500,838,26,11,5)},style:{fill:'#E8C15A'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{'font-size':50,'font-family':'Arial, sans-serif','font-weight':'bold','letter-spacing':8},
   style:{fill:'#E8C15A'},
   children:[{tag:'textPath',attrs:{href:'#brArc','xlink:href':'#brArc'},
     text:{vi:'CHẤT LƯỢNG CAO • LEHA STUDIO • 2026 • ',en:'PREMIUM QUALITY • LEHA STUDIO • 2026 • '}}],
   nameKey:'tpl_p_text'}
 ]};

/* ============ 5. restaurant-logo (1000x1000) ============ */
V['restaurant-logo']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_restaurant_logo',descKey:'tpl_restaurant_logo_d',
 defs:'<linearGradient id="rlGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0D98C"/><stop offset="1" stop-color="#B98A1E"/></linearGradient>',
 objects:[
  {tag:'circle',attrs:{cx:500,cy:470,r:392},style:{fill:'#FBF7EE'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:470,r:392},style:{fill:'none',stroke:'url(#rlGold)','stroke-width':14},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:470,r:358},style:{fill:'none',stroke:'#B98A1E','stroke-width':3},nameKey:'tpl_p_ring'},
  /* cloche dome */
  {tag:'path',attrs:{d:'M330 500 C330 400 410 330 500 330 C590 330 670 400 670 500 Z'},style:{fill:'#1A1A1A'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M330 500 C330 400 410 330 500 330 C590 330 670 400 670 500'},style:{fill:'none',stroke:'url(#rlGold)','stroke-width':10},nameKey:'tpl_p_shape'},
  /* knob */
  {tag:'circle',attrs:{cx:500,cy:306,r:22},style:{fill:'url(#rlGold)'},nameKey:'tpl_p_shape'},
  /* base line + steam hole */
  {tag:'rect',attrs:{x:310,y:500,width:380,height:16,rx:8},style:{fill:'url(#rlGold)'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M440 430 C430 410 448 396 440 374 M500 430 C490 410 508 396 500 374 M560 430 C550 410 568 396 560 374'},style:{fill:'none',stroke:'#B98A1E','stroke-width':7,'stroke-linecap':'round',opacity:0.8},nameKey:'tpl_p_shape'},
  /* monogram under cloche */
  {tag:'text',attrs:{x:500,y:636,'font-size':120,'text-anchor':'middle','font-family':'Georgia, serif','font-weight':'bold','letter-spacing':26},style:{fill:'#1A1A1A'},text:{vi:'M',en:'M'},nameKey:'tpl_p_logo'},
  {tag:'path',attrs:{d:polyD(272,620,14,4)+polyD(728,620,14,4)},style:{fill:'#B98A1E'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:872,'font-size':96,'text-anchor':'middle','font-family':'Georgia, serif','font-weight':'bold','letter-spacing':22},style:{fill:'#1A1A1A'},text:{vi:'MAISON',en:'MAISON'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:930,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':14},style:{fill:'#B98A1E'},text:{vi:'FINE DINING',en:'FINE DINING'},nameKey:'tpl_p_text'}
 ]};

/* ============ 6. spa-logo (1000x1000) ============ */
V['spa-logo']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_spa_logo',descKey:'tpl_spa_logo_d',
 objects:[
  {tag:'circle',attrs:{cx:500,cy:460,r:392},style:{fill:'#FBF9F4'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:460,r:392},style:{fill:'none',stroke:'#2A7B6F','stroke-width':8},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:460,r:360},style:{fill:'none',stroke:'#2A7B6F','stroke-width':2,opacity:0.5},nameKey:'tpl_p_ring'},
  /* lotus petals */
  {tag:'path',attrs:{d:'M500 250 C462 316 462 392 500 452 C538 392 538 316 500 250 Z',transform:'rotate(-66 500 452)'},style:{fill:'#E8F3F0',stroke:'#2A7B6F','stroke-width':8},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M500 250 C462 316 462 392 500 452 C538 392 538 316 500 250 Z',transform:'rotate(-33 500 452)'},style:{fill:'#DDF0EB',stroke:'#2A7B6F','stroke-width':8},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M500 250 C462 316 462 392 500 452 C538 392 538 316 500 250 Z'},style:{fill:'#F2FAF7',stroke:'#2A7B6F','stroke-width':9},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M500 250 C462 316 462 392 500 452 C538 392 538 316 500 250 Z',transform:'rotate(33 500 452)'},style:{fill:'#DDF0EB',stroke:'#2A7B6F','stroke-width':8},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M500 250 C462 316 462 392 500 452 C538 392 538 316 500 250 Z',transform:'rotate(66 500 452)'},style:{fill:'#E8F3F0',stroke:'#2A7B6F','stroke-width':8},nameKey:'tpl_p_shape'},
  /* water line */
  {tag:'path',attrs:{d:'M360 500 C440 530 560 530 640 500'},style:{fill:'none',stroke:'#C9A227','stroke-width':10,'stroke-linecap':'round'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M410 536 C470 556 530 556 590 536'},style:{fill:'none',stroke:'#C9A227','stroke-width':7,'stroke-linecap':'round',opacity:0.7},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:856,'font-size':88,'text-anchor':'middle','font-family':'Georgia, serif','letter-spacing':20},style:{fill:'#2A7B6F'},text:{vi:'LOTUS SPA',en:'LOTUS SPA'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:916,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':10},style:{fill:'#C9A227'},text:{vi:'THƯ GIÃN • CÂN BẰNG',en:'RELAX • BALANCE'},nameKey:'tpl_p_text'}
 ]};

/* ============ 7. gym-logo (1000x1000) ============ */
V['gym-logo']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_gym_logo',descKey:'tpl_gym_logo_d',
 defs:'<linearGradient id="gyGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6B00"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>',
 objects:[
  {tag:'rect',attrs:{x:0,y:0,width:1000,height:1000},style:{fill:'#111418'},nameKey:'tpl_p_bg'},
  {tag:'path',attrs:{d:polyD(500,430,332,6)},style:{fill:'#1A1D23',stroke:'url(#gyGrad)','stroke-width':14},nameKey:'tpl_p_ring'},
  {tag:'path',attrs:{d:polyD(500,430,296,6)},style:{fill:'none',stroke:'#FF6B00','stroke-width':3,opacity:0.6},nameKey:'tpl_p_ring'},
  /* lightning bolt */
  {tag:'path',attrs:{d:'M566 210 L418 470 L492 470 L452 650 L612 410 L528 410 Z'},style:{fill:'url(#gyGrad)'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:884,'font-size':86,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':900,'letter-spacing':12},style:{fill:'#FFFFFF'},text:{vi:'POWER GYM',en:'POWER GYM'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:936,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':10},style:{fill:'#FF6B00'},text:{vi:'KHỎE MẠNH MỖI NGÀY',en:'STRONGER EVERY DAY'},nameKey:'tpl_p_text'}
 ]};

/* ============ 8. fashion-logo (1000x1000) ============ */
V['fashion-logo']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_fashion_logo',descKey:'tpl_fashion_logo_d',
 objects:[
  {tag:'rect',attrs:{x:0,y:0,width:1000,height:1000},style:{fill:'#FFFFFF'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:440,r:392},style:{fill:'none',stroke:'#111111','stroke-width':6},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:440,r:362},style:{fill:'none',stroke:'#111111','stroke-width':2},nameKey:'tpl_p_ring'},
  {tag:'text',attrs:{x:500,y:566,'font-size':300,'text-anchor':'middle','font-family':'Georgia, serif'},style:{fill:'#111111'},text:{vi:'F',en:'F'},nameKey:'tpl_p_logo'},
  {tag:'path',attrs:{d:polyD(500,196,16,4)},style:{fill:'#111111'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:'M300 700 H700'},style:{fill:'none',stroke:'#111111','stroke-width':2},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:866,'font-size':64,'text-anchor':'middle','font-family':'Georgia, serif','letter-spacing':16},style:{fill:'#111111'},text:{vi:'MAISON LEHA',en:'MAISON LEHA'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:922,'font-size':28,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':10},style:{fill:'#666666'},text:{vi:'THỜI TRANG CAO CẤP',en:'HAUTE COUTURE'},nameKey:'tpl_p_text'}
 ]};

/* ============ 9. realestate-logo (1000x1000) ============ */
V['realestate-logo']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_realestate_logo',descKey:'tpl_realestate_logo_d',
 objects:[
  {tag:'circle',attrs:{cx:500,cy:460,r:392},style:{fill:'#102A43'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:460,r:392},style:{fill:'none',stroke:'#C9A227','stroke-width':10},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:460,r:360},style:{fill:'none',stroke:'#C9A227','stroke-width':3},nameKey:'tpl_p_ring'},
  /* sun */
  {tag:'circle',attrs:{cx:640,cy:330,r:44},style:{fill:'#E8C15A'},nameKey:'tpl_p_shape'},
  /* skyline */
  {tag:'rect',attrs:{x:330,y:440,width:70,height:170},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:414,y:380,width:70,height:230},style:{fill:'#E8C15A'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:498,y:330,width:76,height:280},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:588,y:420,width:70,height:190},style:{fill:'#E8C15A'},nameKey:'tpl_p_shape'},
  /* windows */
  {tag:'rect',attrs:{x:512,y:360,width:48,height:12},style:{fill:'#102A43',opacity:0.7},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:512,y:392,width:48,height:12},style:{fill:'#102A43',opacity:0.7},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:512,y:424,width:48,height:12},style:{fill:'#102A43',opacity:0.7},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:428,y:410,width:42,height:10},style:{fill:'#102A43',opacity:0.7},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:428,y:438,width:42,height:10},style:{fill:'#102A43',opacity:0.7},nameKey:'tpl_p_shape'},
  /* rooftop mark */
  {tag:'path',attrs:{d:'M300 640 L500 540 L700 640'},style:{fill:'none',stroke:'#FFFFFF','stroke-width':12,'stroke-linecap':'round','stroke-linejoin':'round'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:856,'font-size':72,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800,'letter-spacing':10},style:{fill:'#FFFFFF'},text:{vi:'LEHA REALTY',en:'LEHA REALTY'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:914,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':8},style:{fill:'#C9A227'},text:{vi:'BẤT ĐỘNG SẢN CAO CẤP',en:'PREMIUM REAL ESTATE'},nameKey:'tpl_p_text'}
 ]};

/* ============ 10. bubbletea-logo (1000x1000) ============ */
V['bubbletea-logo']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_bubbletea_logo',descKey:'tpl_bubbletea_logo_d',
 objects:[
  {tag:'circle',attrs:{cx:500,cy:460,r:392},style:{fill:'#FFF8F0'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:460,r:392},style:{fill:'none',stroke:'#FF8FAB','stroke-width':10},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:460,r:360},style:{fill:'none',stroke:'#FF8FAB','stroke-width':3,opacity:0.6},nameKey:'tpl_p_ring'},
  /* straw */
  {tag:'rect',attrs:{x:556,y:250,width:26,height:170,rx:13,transform:'rotate(12 569 335)'},style:{fill:'#E86A8A'},nameKey:'tpl_p_shape'},
  /* cup */
  {tag:'path',attrs:{d:'M380 380 L620 380 L584 640 L416 640 Z'},style:{fill:'#FFD6E0',stroke:'#E86A8A','stroke-width':10,'stroke-linejoin':'round'},nameKey:'tpl_p_shape'},
  /* tea layer */
  {tag:'path',attrs:{d:'M398 470 L602 470 L584 640 L416 640 Z'},style:{fill:'#C98A5A',opacity:0.85},nameKey:'tpl_p_shape'},
  /* boba pearls */
  {tag:'circle',attrs:{cx:452,cy:590,r:22},style:{fill:'#5C374C'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:505,cy:600,r:22},style:{fill:'#5C374C'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:556,cy:592,r:22},style:{fill:'#5C374C'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:480,cy:552,r:22},style:{fill:'#5C374C'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:532,cy:550,r:22},style:{fill:'#5C374C'},nameKey:'tpl_p_shape'},
  /* lid */
  {tag:'rect',attrs:{x:364,y:356,width:272,height:30,rx:15},style:{fill:'#E86A8A'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:856,'font-size':76,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800,'letter-spacing':8},style:{fill:'#5C374C'},text:{vi:'BOBA LEHA',en:'BOBA LEHA'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:914,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':8},style:{fill:'#E86A8A'},text:{vi:'TRÀ SỮA NGON MỖI NGÀY',en:'TASTY MILK TEA DAILY'},nameKey:'tpl_p_text'}
 ]};

/* ============ 11. icons-food (1200x800) — uniform stroke set ============ */
V['icons-food']=(function(){
  var glyphs=[
   /* burger */
   [{d:'M22 54 A38 24 0 0 1 98 54',f:0},
    {d:'M22 62 H98',f:0},{d:'M22 72 H98',f:0},{d:'M28 82 H92',f:0}],
   /* pizza */
   [{d:'M60 12 L102 88 L18 88 Z',f:0},
    {d:'M60 12 L102 88',f:0},{d:'M48 30 L38 50 M72 30 L82 50',f:0},
    {d:'M52 62 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0',f:0}],
   /* cupcake */
   [{d:'M34 56 A26 20 0 0 1 86 56',f:0},
    {d:'M38 56 L46 94 H74 L82 56',f:0},
    {d:'M60 30 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0',f:0}],
   /* ramen bowl */
   [{d:'M20 62 H100 C100 84 82 96 60 96 C38 96 20 84 20 62',f:0},
    {d:'M44 16 L78 52 M60 12 L92 46',f:0},
    {d:'M48 44 C44 38 52 34 48 28 M66 46 C62 40 70 36 66 30',f:0}],
   /* ice cream */
   [{d:'M60 64 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0',f:0},
    {d:'M44 76 L60 104 L76 76',f:0},
    {d:'M60 38 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',f:0}],
   /* fried egg */
   [{d:'M60 14 C84 14 102 32 100 56 C98 80 80 96 58 94 C36 92 18 78 20 54 C22 32 38 14 60 14 Z',f:0},
    {d:'M60 56 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0',f:0}],
   /* donut */
   [{d:'M60 58 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0',f:0},
    {d:'M60 58 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0',f:0},
    {d:'M40 44 L46 50 M78 40 L72 46 M84 66 L78 62',f:0}],
   /* coffee to-go */
   [{d:'M42 40 H78 L72 94 H48 Z',f:0},
    {d:'M38 30 H82',f:0},
    {d:'M44 58 H76',f:0},
    {d:'M54 24 C52 20 58 18 56 14',f:0}]
  ];
  var obs=[],i,g,j,col,row,tx,ty;
  for(i=0;i<glyphs.length;i++){
    col=i%4; row=(i/4)|0; tx=40+col*290; ty=60+row*340;
    obs.push({tag:'rect',attrs:{x:tx,y:ty,width:240,height:280,rx:28},
      style:{fill:'#FFF9F2',stroke:'#F0D9C4','stroke-width':2},nameKey:'tpl_p_icon'});
    obs.push({tag:'rect',attrs:{x:tx+95,y:ty+20,width:50,height:6,rx:3},
      style:{fill:'#E8A33D'},nameKey:'tpl_p_icon'});
    g=glyphs[i];
    for(j=0;j<g.length;j++){
      obs.push({tag:'path',
        attrs:{d:g[j].d,transform:'translate('+(tx+60)+' '+(ty+82)+')'},
        style:{fill:'none',stroke:'#7C2D12','stroke-width':10,'stroke-linecap':'round','stroke-linejoin':'round'},
        nameKey:'tpl_p_icon'});
    }
  }
  return { w:1200,h:800,cat:'logovec',nameKey:'tpl_icons_food',descKey:'tpl_icons_food_d',objects:obs };
})();

/* ============ 12. icons-travel (1200x800) — uniform stroke set ============ */
V['icons-travel']=(function(){
  var glyphs=[
   /* paper plane */
   [{d:'M14 62 L106 18 L66 100 L56 70 Z',f:0},
    {d:'M56 70 L106 18',f:0}],
   /* suitcase */
   [{d:'M30 38 H90 A6 6 0 0 1 96 44 V88 A6 6 0 0 1 90 94 H30 A6 6 0 0 1 24 88 V44 A6 6 0 0 1 30 38 Z',f:0},
    {d:'M46 38 V28 H74 V38',f:0},
    {d:'M46 38 V94 M74 38 V94',f:0}],
   /* map pin */
   [{d:'M60 98 C44 76 30 60 30 42 A30 30 0 0 1 90 42 C90 60 76 76 60 98 Z',f:0},
    {d:'M60 42 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0',f:0}],
   /* globe */
   [{d:'M60 56 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0',f:0},
    {d:'M60 22 C46 40 46 72 60 90 C74 72 74 40 60 22',f:0},
    {d:'M26 56 H94 M32 38 H88 M32 74 H88',f:0}],
   /* compass */
   [{d:'M60 58 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0',f:0},
    {d:'M60 32 L70 58 L60 84 L50 58 Z',f:0},
    {d:'M60 58 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',f:1}],
   /* palm tree */
   [{d:'M60 98 C58 78 58 66 60 50',f:0},
    {d:'M60 50 C44 38 30 38 22 44 M60 50 C76 38 90 38 98 44 M60 50 C52 34 40 28 30 30 M60 50 C68 34 80 28 90 30',f:0},
    {d:'M52 54 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',f:0}],
   /* passport */
   [{d:'M36 20 H84 A6 6 0 0 1 90 26 V94 A6 6 0 0 1 84 100 H36 A6 6 0 0 1 30 94 V26 A6 6 0 0 1 36 20 Z',f:0},
    {d:'M60 50 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0',f:0},
    {d:'M44 74 H76 M44 84 H76',f:0}],
   /* tent */
   [{d:'M60 20 L104 92 H16 Z',f:0},
    {d:'M60 56 L76 92 H44 Z',f:0}]
  ];
  var obs=[],i,g,j,col,row,tx,ty;
  for(i=0;i<glyphs.length;i++){
    col=i%4; row=(i/4)|0; tx=40+col*290; ty=60+row*340;
    obs.push({tag:'rect',attrs:{x:tx,y:ty,width:240,height:280,rx:28},
      style:{fill:'#F2F8FD',stroke:'#CFE3F2','stroke-width':2},nameKey:'tpl_p_icon'});
    obs.push({tag:'rect',attrs:{x:tx+95,y:ty+20,width:50,height:6,rx:3},
      style:{fill:'#1F8AED'},nameKey:'tpl_p_icon'});
    g=glyphs[i];
    for(j=0;j<g.length;j++){
      obs.push({tag:'path',
        attrs:{d:g[j].d,transform:'translate('+(tx+60)+' '+(ty+82)+')'},
        style:g[j].f?{fill:'#0F4C81'}:{fill:'none',stroke:'#0F4C81','stroke-width':10,'stroke-linecap':'round','stroke-linejoin':'round'},
        nameKey:'tpl_p_icon'});
    }
  }
  return { w:1200,h:800,cat:'logovec',nameKey:'tpl_icons_travel',descKey:'tpl_icons_travel_d',objects:obs };
})();

/* ============ 13. badge-vintage (1000x1000) ============ */
V['badge-vintage']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_badge_vintage',descKey:'tpl_badge_vintage_d',
 defs:'<path id="bvArc" d="M500 470 m -282 0 a 282 282 0 1 1 564 0 a 282 282 0 1 1 -564 0" fill="none"/>',
 objects:[
  {tag:'circle',attrs:{cx:500,cy:470,r:392},style:{fill:'#F1E7D3'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:470,r:392},style:{fill:'none',stroke:'#8B5E34','stroke-width':14},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:470,r:362},style:{fill:'none',stroke:'#8B5E34','stroke-width':3},nameKey:'tpl_p_ring'},
  {tag:'path',attrs:{d:starD(218,470,24,10,5)+starD(782,470,24,10,5)},style:{fill:'#8B5E34'},nameKey:'tpl_p_shape'},
  /* ribbon */
  {tag:'path',attrs:{d:'M250 560 L250 690 L310 650 L310 740 L500 700 L690 740 L690 650 L750 690 L750 560 Z'},style:{fill:'#8B5E34'},nameKey:'tpl_p_badge'},
  {tag:'rect',attrs:{x:300,y:400,width:400,height:170},style:{fill:'#8B5E34'},nameKey:'tpl_p_badge'},
  {tag:'text',attrs:{x:500,y:472,'font-size':40,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':12},style:{fill:'#F1E7D3'},text:{vi:'EST',en:'EST'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:548,'font-size':72,'text-anchor':'middle','font-family':'Georgia, serif','font-weight':'bold','letter-spacing':8},style:{fill:'#F1E7D3'},text:{vi:'2016',en:'2016'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:660,'font-size':44,'text-anchor':'middle','font-family':'Georgia, serif','font-weight':'bold','letter-spacing':10},style:{fill:'#F1E7D3'},text:{vi:'LEHA',en:'LEHA'},nameKey:'tpl_p_logo'},
  {tag:'text',attrs:{'font-size':44,'font-family':'Arial, sans-serif','font-weight':'bold','letter-spacing':6},
   style:{fill:'#8B5E34'},
   children:[{tag:'textPath',attrs:{href:'#bvArc','xlink:href':'#bvArc'},
     text:{vi:'HÀNG THỦ CÔNG • CHẤT LƯỢNG • TỪ 2016 • ',en:'HANDMADE • PREMIUM QUALITY • SINCE 2016 • '}}],
   nameKey:'tpl_p_text'}
 ]};

/* ============ 14. monogram (1000x1000) ============ */
V['monogram']={ w:1000,h:1000,cat:'logovec',nameKey:'tpl_monogram',descKey:'tpl_monogram_d',
 defs:'<linearGradient id="mmGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0D98C"/><stop offset="1" stop-color="#B98A1E"/></linearGradient>',
 objects:[
  {tag:'rect',attrs:{x:0,y:0,width:1000,height:1000},style:{fill:'#0E0E12'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:500,cy:450,r:380},style:{fill:'none',stroke:'url(#mmGold)','stroke-width':8},nameKey:'tpl_p_ring'},
  {tag:'circle',attrs:{cx:500,cy:450,r:350},style:{fill:'none',stroke:'#B98A1E','stroke-width':2,opacity:0.6},nameKey:'tpl_p_ring'},
  {tag:'path',attrs:{d:polyD(500,190,18,4)},style:{fill:'url(#mmGold)'},nameKey:'tpl_p_shape'},
  {tag:'path',attrs:{d:polyD(500,710,18,4)},style:{fill:'url(#mmGold)'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:580,'font-size':250,'text-anchor':'middle','font-family':'Georgia, serif','letter-spacing':14},style:{fill:'url(#mmGold)'},text:{vi:'LH',en:'LH'},nameKey:'tpl_p_logo'},
  {tag:'path',attrs:{d:'M300 640 H700'},style:{fill:'none',stroke:'#B98A1E','stroke-width':2,opacity:0.7},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:500,y:880,'font-size':52,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':26},style:{fill:'#C9A227'},text:{vi:'LE HA',en:'LE HA'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:500,y:930,'font-size':24,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':12},style:{fill:'#777777'},text:{vi:'SIGNATURE',en:'SIGNATURE'},nameKey:'tpl_p_text'}
 ]};

/* ============ 15. patterns (1200x1200) — 4 repeatable tiles ============ */
V['patterns']={ w:1200,h:1200,cat:'logovec',nameKey:'tpl_patterns',descKey:'tpl_patterns_d',
 defs:'<pattern id="patChev" width="80" height="40" patternUnits="userSpaceOnUse"><path d="M0 30 L40 8 L80 30" fill="none" stroke="#C9A227" stroke-width="6"/></pattern>'+
       '<pattern id="patDots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="9" fill="#2A7B6F"/><circle cx="0" cy="0" r="9" fill="#2A7B6F"/><circle cx="60" cy="0" r="9" fill="#2A7B6F"/><circle cx="0" cy="60" r="9" fill="#2A7B6F"/><circle cx="60" cy="60" r="9" fill="#2A7B6F"/></pattern>'+
       '<pattern id="patDiag" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M0 44 L44 0 M-11 11 L11 -11 M33 55 L55 33" fill="none" stroke="#E86A5A" stroke-width="7"/></pattern>'+
       '<pattern id="patDia" width="70" height="70" patternUnits="userSpaceOnUse"><path d="M35 8 L62 35 L35 62 L8 35 Z" fill="none" stroke="#F5F1E8" stroke-width="5"/></pattern>',
 objects:[
  {tag:'rect',attrs:{x:0,y:0,width:600,height:600},style:{fill:'#14213D'},nameKey:'tpl_p_bg'},
  {tag:'rect',attrs:{x:0,y:0,width:600,height:600},style:{fill:'url(#patChev)'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:600,y:0,width:600,height:600},style:{fill:'#FBF9F4'},nameKey:'tpl_p_bg'},
  {tag:'rect',attrs:{x:600,y:0,width:600,height:600},style:{fill:'url(#patDots)'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:0,y:600,width:600,height:600},style:{fill:'#FFF8F0'},nameKey:'tpl_p_bg'},
  {tag:'rect',attrs:{x:0,y:600,width:600,height:600},style:{fill:'url(#patDiag)'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:600,y:600,width:600,height:600},style:{fill:'#7C2D12'},nameKey:'tpl_p_bg'},
  {tag:'rect',attrs:{x:600,y:600,width:600,height:600},style:{fill:'url(#patDia)'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:300,y:300,'font-size':44,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800,'letter-spacing':10},style:{fill:'#FFFFFF'},text:{vi:'CHEVRON',en:'CHEVRON'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:900,y:300,'font-size':44,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800,'letter-spacing':10},style:{fill:'#2A7B6F'},text:{vi:'CHẤM BI',en:'DOTS'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:300,y:900,'font-size':44,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800,'letter-spacing':10},style:{fill:'#C05621'},text:{vi:'ĐƯỜNG CHÉO',en:'DIAGONAL'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:900,y:900,'font-size':44,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800,'letter-spacing':10},style:{fill:'#F5F1E8'},text:{vi:'HÌNH THOI',en:'DIAMONDS'},nameKey:'tpl_p_text'}
 ]};

/* ============ 16. pattern-tet (1200x1200) ============ */
V['pattern-tet']=(function(){
  /* apricot blossom: 5 petals + center */
  var fl='',i,a,px,py;
  for(i=0;i<5;i++){ a=-Math.PI/2+i*2*Math.PI/5; px=(60+30*Math.cos(a)).toFixed(1); py=(60+30*Math.sin(a)).toFixed(1);
    fl+='<circle cx="'+px+'" cy="'+py+'" r="17" fill="#D4AF37"/>'; }
  fl+='<circle cx="60" cy="60" r="11" fill="#B98A1E"/>';
  var coin='<circle cx="155" cy="150" r="26" fill="none" stroke="#D4AF37" stroke-width="7"/>'+
           '<rect x="143" y="138" width="24" height="24" fill="none" stroke="#D4AF37" stroke-width="6"/>';
  var defs='<pattern id="tetPat" width="210" height="210" patternUnits="userSpaceOnUse">'+fl+coin+'</pattern>';
  var obs=[
   {tag:'rect',attrs:{x:0,y:0,width:1200,height:1200},style:{fill:'#7A1414'},nameKey:'tpl_p_bg'},
   {tag:'rect',attrs:{x:0,y:0,width:1200,height:1200},style:{fill:'url(#tetPat)'},nameKey:'tpl_p_shape'},
   {tag:'rect',attrs:{x:36,y:36,width:1128,height:1128},style:{fill:'none',stroke:'#D4AF37','stroke-width':10},nameKey:'tpl_p_ring'},
   {tag:'rect',attrs:{x:66,y:66,width:1068,height:1068},style:{fill:'none',stroke:'#D4AF37','stroke-width':3},nameKey:'tpl_p_ring'},
   {tag:'path',attrs:{d:starD(120,120,30,13,5)+starD(1080,120,30,13,5)+starD(120,1080,30,13,5)+starD(1080,1080,30,13,5)},style:{fill:'#D4AF37'},nameKey:'tpl_p_shape'}
  ];
  return { w:1200,h:1200,cat:'logovec',nameKey:'tpl_pattern_tet',descKey:'tpl_pattern_tet_d',defs:defs,objects:obs };
})();

/* ============ 17. cv-resume (1000x1414) ============ */
V['cv-resume']={ w:1000,h:1414,cat:'logovec',nameKey:'tpl_cv_resume',descKey:'tpl_cv_resume_d',
 objects:[
  {tag:'rect',attrs:{x:0,y:0,width:1000,height:1414},style:{fill:'#FFFFFF'},nameKey:'tpl_p_bg'},
  {tag:'rect',attrs:{x:0,y:0,width:360,height:1414},style:{fill:'#14213D'},nameKey:'tpl_p_bg'},
  {tag:'circle',attrs:{cx:180,cy:195,r:105},style:{fill:'#E8E4DA',stroke:'#C9A227','stroke-width':8},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:180,y:380,'font-size':46,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800},style:{fill:'#FFFFFF'},text:{vi:'LÊ HÀ',en:'LE HA'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:180,y:422,'font-size':24,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':4},style:{fill:'#C9A227'},text:{vi:'TRƯỞNG NHÓM DỰ ÁN',en:'PROJECT LEAD'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:70,y:512,'font-size':26,'font-family':'Arial, sans-serif','font-weight':800,'letter-spacing':6},style:{fill:'#C9A227'},text:{vi:'LIÊN HỆ',en:'CONTACT'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:70,y:556,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#DDE3EE'},text:{vi:'090 123 4567',en:'090 123 4567'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:70,y:594,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#DDE3EE'},text:{vi:'leha@email.com',en:'leha@email.com'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:70,y:632,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#DDE3EE'},text:{vi:'TP. Hồ Chí Minh',en:'Ho Chi Minh City'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:70,y:706,'font-size':26,'font-family':'Arial, sans-serif','font-weight':800,'letter-spacing':6},style:{fill:'#C9A227'},text:{vi:'KỸ NĂNG',en:'SKILLS'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:70,y:750,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#DDE3EE'},text:{vi:'QUẢN LÝ DỰ ÁN',en:'PROJECT MGMT'},nameKey:'tpl_p_text'},
  {tag:'rect',attrs:{x:70,y:764,width:220,height:14,rx:7},style:{fill:'#2A3A5C'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:70,y:764,width:192,height:14,rx:7},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:70,y:820,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#DDE3EE'},text:{vi:'MARKETING',en:'MARKETING'},nameKey:'tpl_p_text'},
  {tag:'rect',attrs:{x:70,y:834,width:220,height:14,rx:7},style:{fill:'#2A3A5C'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:70,y:834,width:172,height:14,rx:7},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:70,y:890,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#DDE3EE'},text:{vi:'TIẾNG ANH',en:'ENGLISH'},nameKey:'tpl_p_text'},
  {tag:'rect',attrs:{x:70,y:904,width:220,height:14,rx:7},style:{fill:'#2A3A5C'},nameKey:'tpl_p_shape'},
  {tag:'rect',attrs:{x:70,y:904,width:150,height:14,rx:7},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  /* main column */
  {tag:'text',attrs:{x:420,y:130,'font-size':40,'font-family':'Arial, sans-serif','font-weight':800},style:{fill:'#14213D'},text:{vi:'KINH NGHIỆM',en:'EXPERIENCE'},nameKey:'tpl_p_text'},
  {tag:'rect',attrs:{x:420,y:150,width:120,height:6},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:440,cy:232,r:9},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:470,y:242,'font-size':30,'font-family':'Arial, sans-serif','font-weight':700},style:{fill:'#1A1A1A'},text:{vi:'TRƯỞNG NHÓM GOLFCARE',en:'GOLFCARE TEAM LEAD'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:470,y:278,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#C9A227'},text:{vi:'EPLUS+ • WEPLUS+ GROUP',en:'EPLUS+ • WEPLUS+ GROUP'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:470,y:312,'font-size':22,'font-family':'Arial, sans-serif'},style:{fill:'#555555'},text:{vi:'Quản lý dự án sự kiện golf cao cấp',en:'Managing premium golf events'},nameKey:'tpl_p_text'},
  {tag:'circle',attrs:{cx:440,cy:412,r:9},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:470,y:422,'font-size':30,'font-family':'Arial, sans-serif','font-weight':700},style:{fill:'#1A1A1A'},text:{vi:'CHUYÊN VIÊN MARKETING',en:'MARKETING SPECIALIST'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:470,y:458,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#C9A227'},text:{vi:'TGROUP ECOSYSTEM',en:'TGROUP ECOSYSTEM'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:470,y:492,'font-size':22,'font-family':'Arial, sans-serif'},style:{fill:'#555555'},text:{vi:'Xây dựng thương hiệu & nội dung',en:'Brand & content building'},nameKey:'tpl_p_text'},
  {tag:'circle',attrs:{cx:440,cy:592,r:9},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:470,y:602,'font-size':30,'font-family':'Arial, sans-serif','font-weight':700},style:{fill:'#1A1A1A'},text:{vi:'ĐIỀU PHỐI SỰ KIỆN',en:'EVENT COORDINATOR'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:470,y:638,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#C9A227'},text:{vi:'CÔNG TY ABC',en:'ABC COMPANY'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:470,y:672,'font-size':22,'font-family':'Arial, sans-serif'},style:{fill:'#555555'},text:{vi:'Tổ chức sự kiện MICE 500+ khách',en:'MICE events with 500+ guests'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:420,y:800,'font-size':40,'font-family':'Arial, sans-serif','font-weight':800},style:{fill:'#14213D'},text:{vi:'HỌC VẤN',en:'EDUCATION'},nameKey:'tpl_p_text'},
  {tag:'rect',attrs:{x:420,y:820,width:120,height:6},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'circle',attrs:{cx:440,cy:902,r:9},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'},
  {tag:'text',attrs:{x:470,y:912,'font-size':28,'font-family':'Arial, sans-serif','font-weight':700},style:{fill:'#1A1A1A'},text:{vi:'CỬ NHÂN QTKD',en:'BBA — BUSINESS ADMIN'},nameKey:'tpl_p_text'},
  {tag:'text',attrs:{x:470,y:948,'font-size':24,'font-family':'Arial, sans-serif'},style:{fill:'#C9A227'},text:{vi:'ĐH KINH TẾ TP.HCM • 2012–2016',en:'HCMC UNIV. OF ECONOMICS • 2012–2016'},nameKey:'tpl_p_text'}
 ]};

/* ============ 18. infographic (1200x1600) ============ */
V['infographic']=(function(){
  var obs=[
   {tag:'rect',attrs:{x:0,y:0,width:1200,height:1600},style:{fill:'#FFFFFF'},nameKey:'tpl_p_bg'},
   {tag:'rect',attrs:{x:0,y:0,width:1200,height:260},style:{fill:'#14213D'},nameKey:'tpl_p_bg'},
   {tag:'text',attrs:{x:600,y:110,'font-size':64,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800},style:{fill:'#FFFFFF'},text:{vi:'BÁO CÁO TĂNG TRƯỞNG',en:'GROWTH REPORT'},nameKey:'tpl_p_text'},
   {tag:'text',attrs:{x:600,y:176,'font-size':30,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':8},style:{fill:'#C9A227'},text:{vi:'SỐ LIỆU KINH DOANH 2026',en:'2026 BUSINESS METRICS'},nameKey:'tpl_p_text'}
  ];
  /* stat cards */
  var stats=[['+128%','TĂNG TRƯỞNG','GROWTH'],['4.9/5','ĐÁNH GIÁ','RATING'],['12K','KHÁCH HÀNG','CUSTOMERS']];
  var i,x;
  for(i=0;i<3;i++){ x=60+i*370;
    obs.push({tag:'rect',attrs:{x:x,y:330,width:340,height:200,rx:24},style:{fill:'#F5F1E8'},nameKey:'tpl_p_shape'});
    obs.push({tag:'text',attrs:{x:x+170,y:432,'font-size':64,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800},style:{fill:'#14213D'},text:{vi:stats[i][0],en:stats[i][0]},nameKey:'tpl_p_text'});
    obs.push({tag:'text',attrs:{x:x+170,y:482,'font-size':24,'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':6},style:{fill:'#666666'},text:{vi:stats[i][1],en:stats[i][2]},nameKey:'tpl_p_text'});
  }
  /* bar chart */
  obs.push({tag:'text',attrs:{x:600,y:622,'font-size':34,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800},style:{fill:'#14213D'},text:{vi:'DOANH THU THEO QUÝ',en:'QUARTERLY REVENUE'},nameKey:'tpl_p_text'});
  var bars=[[180,'#1F6FEB'],[260,'#22D3EE'],[220,'#C9A227'],[340,'#14213D']];
  for(i=0;i<4;i++){ x=200+i*220;
    obs.push({tag:'rect',attrs:{x:x,y:1020-bars[i][0],width:120,height:bars[i][0],rx:12},style:{fill:bars[i][1]},nameKey:'tpl_p_shape'});
    obs.push({tag:'text',attrs:{x:x+60,y:1056,'font-size':28,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':700},style:{fill:'#666666'},text:{vi:'Q'+(i+1),en:'Q'+(i+1)},nameKey:'tpl_p_text'});
  }
  /* donut chart */
  obs.push({tag:'text',attrs:{x:900,y:1130,'font-size':34,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800},style:{fill:'#14213D'},text:{vi:'CƠ CẤU DOANH THU',en:'REVENUE MIX'},nameKey:'tpl_p_text'});
  var segs=[[0.40,'#1F6FEB'],[0.30,'#22D3EE'],[0.20,'#C9A227'],[0.10,'#E5E7EB']];
  var a0=-Math.PI/2, k;
  for(k=0;k<segs.length;k++){ var a1=a0+segs[k][0]*2*Math.PI;
    obs.push({tag:'path',attrs:{d:donutSeg(900,1330,110,170,a0,a1)},style:{fill:segs[k][1]},nameKey:'tpl_p_shape'});
    a0=a1;
  }
  obs.push({tag:'text',attrs:{x:900,y:1352,'font-size':56,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':800},style:{fill:'#14213D'},text:{vi:'68%',en:'68%'},nameKey:'tpl_p_text'});
  var legend=[['#1F6FEB','BÁN LẺ 40%','RETAIL 40%'],['#22D3EE','ONLINE 30%','ONLINE 30%'],['#C9A227','ĐỐI TÁC 20%','PARTNERS 20%'],['#E5E7EB','KHÁC 10%','OTHER 10%']];
  for(k=0;k<legend.length;k++){ var ly=1240+k*60;
    obs.push({tag:'rect',attrs:{x:120,y:ly-24,width:30,height:30,rx:6},style:{fill:legend[k][0]},nameKey:'tpl_p_shape'});
    obs.push({tag:'text',attrs:{x:166,y:ly,'font-size':26,'font-family':'Arial, sans-serif','font-weight':700},style:{fill:'#333333'},text:{vi:legend[k][1],en:legend[k][2]},nameKey:'tpl_p_text'});
  }
  /* timeline */
  obs.push({tag:'rect',attrs:{x:120,y:1526,width:960,height:8,rx:4},style:{fill:'#E5E7EB'},nameKey:'tpl_p_shape'});
  var years=['2023','2024','2025','2026'];
  for(k=0;k<4;k++){ var tx2=240+k*240;
    obs.push({tag:'circle',attrs:{cx:tx2,cy:1530,r:16},style:{fill:'#C9A227'},nameKey:'tpl_p_shape'});
    obs.push({tag:'text',attrs:{x:tx2,y:1498,'font-size':26,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':700},style:{fill:'#14213D'},text:{vi:years[k],en:years[k]},nameKey:'tpl_p_text'});
  }
  return { w:1200,h:1600,cat:'logovec',nameKey:'tpl_infographic',descKey:'tpl_infographic_d',objects:obs };
})();

/* ============ 19. sticker-pack (1200x800) ============ */
V['sticker-pack']=(function(){
  var obs=[
   /* star sticker */
   {tag:'path',attrs:{d:starD(230,215,112,47,5),'stroke-linejoin':'round'},style:{fill:'#FFC531',stroke:'#FFFFFF','stroke-width':28},nameKey:'tpl_p_icon'},
   /* heart sticker */
   {tag:'path',attrs:{d:'M600 305 C530 252 490 214 490 174 C490 144 514 124 542 124 C564 124 584 134 600 154 C616 134 636 124 658 124 C686 124 710 144 710 174 C710 214 670 252 600 305 Z','stroke-linejoin':'round'},style:{fill:'#FF5A5A',stroke:'#FFFFFF','stroke-width':28},nameKey:'tpl_p_icon'},
   /* SALE badge */
   {tag:'circle',attrs:{cx:970,cy:215,r:118},style:{fill:'#FFFFFF',stroke:'#E5E7EB','stroke-width':2},nameKey:'tpl_p_icon'},
   {tag:'circle',attrs:{cx:970,cy:215,r:94},style:{fill:'#FF3B30'},nameKey:'tpl_p_icon'},
   {tag:'text',attrs:{x:970,y:238,'font-size':60,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':900},style:{fill:'#FFFFFF'},text:{vi:'SALE',en:'SALE'},nameKey:'tpl_p_text'},
   {tag:'text',attrs:{x:970,y:280,'font-size':32,'text-anchor':'middle','font-family':'Arial, sans-serif','font-weight':700},style:{fill:'#FFFFFF'},text:{vi:'-50%',en:'-50%'},nameKey:'tpl_p_text'},
   /* lightning sticker */
   {tag:'path',attrs:{d:'M262 460 L176 600 L238 600 L212 692 L312 552 L244 552 Z','stroke-linejoin':'round'},style:{fill:'#22D3EE',stroke:'#FFFFFF','stroke-width':28},nameKey:'tpl_p_icon'},
   /* coffee sticker */
   {tag:'path',attrs:{d:'M680 522 C752 522 752 612 640 618'},style:{fill:'none',stroke:'#FFFFFF','stroke-width':48,'stroke-linecap':'round'},nameKey:'tpl_p_icon'},
   {tag:'path',attrs:{d:'M680 522 C752 522 752 612 640 618'},style:{fill:'none',stroke:'#8A5A2B','stroke-width':24,'stroke-linecap':'round'},nameKey:'tpl_p_icon'},
   {tag:'path',attrs:{d:'M520 502 L680 502 L648 662 L552 662 Z','stroke-linejoin':'round'},style:{fill:'#8A5A2B',stroke:'#FFFFFF','stroke-width':28},nameKey:'tpl_p_icon'},
   {tag:'ellipse',attrs:{cx:600,cy:502,rx:72,ry:16},style:{fill:'#FFFFFF',opacity:0.55},nameKey:'tpl_p_shape'},
   /* flower sticker */
   {tag:'circle',attrs:{cx:970,cy:498,r:44},style:{fill:'#FF8FAB',stroke:'#FFFFFF','stroke-width':18},nameKey:'tpl_p_icon'},
   {tag:'circle',attrs:{cx:1042,cy:540,r:44},style:{fill:'#FF8FAB',stroke:'#FFFFFF','stroke-width':18},nameKey:'tpl_p_icon'},
   {tag:'circle',attrs:{cx:1042,cy:622,r:44},style:{fill:'#FF8FAB',stroke:'#FFFFFF','stroke-width':18},nameKey:'tpl_p_icon'},
   {tag:'circle',attrs:{cx:970,cy:664,r:44},style:{fill:'#FF8FAB',stroke:'#FFFFFF','stroke-width':18},nameKey:'tpl_p_icon'},
   {tag:'circle',attrs:{cx:898,cy:622,r:44},style:{fill:'#FF8FAB',stroke:'#FFFFFF','stroke-width':18},nameKey:'tpl_p_icon'},
   {tag:'circle',attrs:{cx:898,cy:540,r:44},style:{fill:'#FF8FAB',stroke:'#FFFFFF','stroke-width':18},nameKey:'tpl_p_icon'},
   {tag:'circle',attrs:{cx:970,cy:581,r:36},style:{fill:'#FFD166',stroke:'#FFFFFF','stroke-width':18},nameKey:'tpl_p_icon'}
  ];
  return { w:1200,h:800,cat:'logovec',nameKey:'tpl_sticker_pack',descKey:'tpl_sticker_pack_d',objects:obs };
})();

})();

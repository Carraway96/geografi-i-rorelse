'use strict';
const COPY={
sv:{title:'Geografi i rörelse',subject:'GEOGRAFI · ÅRSKURS 7–9',intro:'Utforska kartor och krafterna som formar vår jord.',detail:'23 bilder · 4 språk',all:'Alla bilder',contents:'INNEHÅLL',map:'Kartkunskap',forces:'Inre och yttre krafter',previous:'Föregående bild',next:'Nästa bild',full:'Helskärm',exit:'Avsluta helskärm',still:'Visa stillbild',play:'Spela animation',animation:'● Animation',paused:'○ Stillbild',hint:'Bläddra med ← → på tangentbordet',share:'Dela bild',copied:'Länken är kopierad. Klistra in den i OneNote.',shareTitle:'Länk till bilden',shareHelp:'Kopiera länken och klistra in den i OneNote.',close:'Stäng',reading:'Text från bilden',readingNote:'Text i illustrationerna läser du i bilden ovan.',empty:'Den här bildens text finns i illustrationen ovan.',footer:'Samma innehåll på fyra språk. Svenska ämnesbegrepp finns i de översatta versionerna.',error:'Bilden kunde inte laddas. Prova att ladda om sidan.'},
en:{title:'Geography in motion',subject:'GEOGRAPHY · YEARS 7–9',intro:'Explore maps and the forces that shape our planet.',detail:'23 slides · 4 languages',all:'All slides',contents:'CONTENTS',map:'Map skills',forces:'Inner and outer forces',previous:'Previous slide',next:'Next slide',full:'Fullscreen',exit:'Exit fullscreen',still:'Show still image',play:'Play animation',animation:'● Animation',paused:'○ Still image',hint:'Use the ← → arrow keys to change slides',share:'Share slide',copied:'Link copied. Paste it into OneNote.',shareTitle:'Link to this slide',shareHelp:'Copy the link and paste it into OneNote.',close:'Close',reading:'Text from the slide',readingNote:'Text in illustrations is shown in the slide above.',empty:'This slide’s text is part of the illustration above.',footer:'The same content in four languages. Swedish subject terms are included in the translations.',error:'The image could not load. Please reload the page.'},
uk:{title:'Географія в русі',subject:'ГЕОГРАФІЯ · 7–9 КЛАСИ',intro:'Досліджуй карти й сили, що формують нашу планету.',detail:'23 слайди · 4 мови',all:'Усі слайди',contents:'ЗМІСТ',map:'Картографічні навички',forces:'Внутрішні й зовнішні сили',previous:'Попередній слайд',next:'Наступний слайд',full:'На весь екран',exit:'Вийти з повного екрана',still:'Статичне зображення',play:'Відтворити анімацію',animation:'● Анімація',paused:'○ Статичне зображення',hint:'Перемикай слайди клавішами ← →',share:'Поділитися',copied:'Посилання скопійовано. Встав його в OneNote.',shareTitle:'Посилання на слайд',shareHelp:'Скопіюй посилання та встав його в OneNote.',close:'Закрити',reading:'Текст зі слайда',readingNote:'Текст ілюстрацій можна прочитати на слайді вище.',empty:'Текст цього слайда міститься в ілюстрації вище.',footer:'Однаковий зміст чотирма мовами. У перекладах збережено шведські терміни.',error:'Не вдалося завантажити зображення. Онови сторінку.'},
hu:{title:'Földrajz mozgásban',subject:'FÖLDRAJZ · 7–9. OSZTÁLY',intro:'Fedezd fel a térképeket és a Földet formáló erőket.',detail:'23 dia · 4 nyelv',all:'Összes dia',contents:'TARTALOM',map:'Térképismeret',forces:'Belső és külső erők',previous:'Előző dia',next:'Következő dia',full:'Teljes képernyő',exit:'Kilépés',still:'Állókép',play:'Animáció lejátszása',animation:'● Animáció',paused:'○ Állókép',hint:'Lapozás a ← → nyílbillentyűkkel',share:'Dia megosztása',copied:'A linket másoltuk. Illeszd be a OneNote-ba.',shareTitle:'Hivatkozás a diára',shareHelp:'Másold a linket, és illeszd be a OneNote-ba.',close:'Bezárás',reading:'A dia szövege',readingNote:'Az ábrák szövege a fenti dián olvasható.',empty:'A dia szövege a fenti ábra része.',footer:'Ugyanaz a tartalom négy nyelven. A fordításokban a svéd szakkifejezések is szerepelnek.',error:'A kép nem tölthető be. Töltsd újra az oldalt.'}
};
const $=id=>document.getElementById(id);
let language='sv',slideIndex=0,still=false;
const validLanguages=Object.keys(COPY);
function parseHash(){
 const params=new URLSearchParams(location.hash.slice(1));
 language=validLanguages.includes(params.get('lang'))?params.get('lang'):'sv';
 const value=Number(params.get('slide'));
 slideIndex=Number.isInteger(value)&&value>=1&&value<=23?value-1:0;
}
function writeHash(){history.replaceState(null,'',`#lang=${language}&slide=${slideIndex+1}`);}
function percent(n){return `${n*100}%`;}
function geometry(layer){return {x:Number(layer.off.x)/12192000,y:Number(layer.off.y)/6858000,w:Number(layer.ext.cx)/12192000,h:Number(layer.ext.cy)/6858000};}
function renderStage(){
 const slide=SLIDES[language][slideIndex],t=COPY[language],stage=$('stage');
 stage.replaceChildren();stage.setAttribute('aria-label',`${slideIndex+1}. ${slide.title}`);
 const image=document.createElement('img');image.className='slide-background';image.src=slide.image;image.alt=slide.title;image.draggable=false;image.fetchPriority='high';
 image.addEventListener('error',()=>{$('announcement').textContent=t.error;});stage.append(image);
 if(!still){for(const layer of slide.animations){
  const g=geometry(layer),crop=layer.crop;
  const l=Number(crop.l||0)/100000,r=Number(crop.r||0)/100000,top=Number(crop.t||0)/100000,b=Number(crop.b||0)/100000;
  const wrap=document.createElement('div');wrap.className='animation-crop';Object.assign(wrap.style,{left:percent(g.x),top:percent(g.y),width:percent(g.w),height:percent(g.h)});
  const gif=document.createElement('img');gif.src=layer.src;gif.alt='';gif.draggable=false;Object.assign(gif.style,{width:percent(1/(1-l-r)),height:percent(1/(1-top-b)),left:percent(-l/(1-l-r)),top:percent(-top/(1-top-b))});wrap.append(gif);stage.append(wrap);
  for(const foreground of layer.later){
   const f=geometry(foreground);
   if(f.x>=g.x+g.w||f.x+f.w<=g.x||f.y>=g.y+g.h||f.y+f.h<=g.y)continue;
   const cover=document.createElement('div');cover.className='foreground';
   // Include the inherited shape's edge stroke in the raster foreground.
   const x=Math.max(0,f.x-.001),y=Math.max(0,f.y-.001),w=Math.min(1-x,f.w+.002),h=Math.min(1-y,f.h+.002);
   Object.assign(cover.style,{left:percent(x),top:percent(y),width:percent(w),height:percent(h)});
   const fg=document.createElement('img');fg.src=slide.image;fg.alt='';Object.assign(fg.style,{width:percent(1/w),height:percent(1/h),left:percent(-x/w),top:percent(-y/h)});cover.append(fg);stage.append(cover);
  }
 }}
 const animated=slide.animations.length>0;
 $('motion').hidden=!animated;$('motion-status').hidden=!animated;
 $('motion').textContent=still?t.play:t.still;$('motion').setAttribute('aria-pressed',String(still));
 $('motion-status').textContent=still?t.paused:t.animation;
}
function renderOutline(){
 const list=$('slide-list');list.replaceChildren();const t=COPY[language];
 for(const slide of SLIDES[language]){
  if(slide.number===1||slide.number===12){const group=document.createElement('p');group.className='chapter-label';group.textContent=slide.number===1?t.map:t.forces;list.append(group);}
  const button=document.createElement('button');button.className='slide-item';button.dataset.slide=slide.number;button.setAttribute('aria-current',String(slide.number===slideIndex+1));
  const number=document.createElement('span');number.className='slide-num';number.textContent=String(slide.number).padStart(2,'0');
  const title=document.createElement('span');title.className='slide-name';title.textContent=slide.title;button.append(number,title);
  if(slide.animations.length){const dot=document.createElement('span');dot.className='motion-dot';dot.textContent='●';dot.setAttribute('aria-label',t.animation.slice(2));button.append(dot);}
  button.addEventListener('click',()=>{go(slide.number-1);if(matchMedia('(max-width:800px)').matches){$('outline').classList.remove('open');$('outline-toggle').setAttribute('aria-expanded','false');$('viewer').focus({preventScroll:true});}});list.append(button);
 }
}
function render(){
 const t=COPY[language],slide=SLIDES[language][slideIndex];document.documentElement.lang=language;document.title=`${slide.title} · ${t.title}`;
 for(const [id,key] of Object.entries({'site-title':'title',subject:'subject',intro:'intro',detail:'detail','outline-label':'all','outline-heading':'contents','keyboard-hint':'hint','reading-label':'reading','reading-note':'readingNote','footer-note':'footer','share-title':'shareTitle','share-help':'shareHelp','close-dialog':'close'}))$(id).textContent=t[key];
 $('previous').setAttribute('aria-label',t.previous);$('previous').title=`${t.previous} (←)`;$('next').setAttribute('aria-label',t.next);$('next').title=`${t.next} (→)`;
 $('fullscreen').querySelector('span').textContent=document.fullscreenElement?t.exit:t.full;$('share').querySelector('span').textContent=t.share;
 $('slide-title').textContent=slide.title;$('chapter').textContent=slideIndex<11?t.map:t.forces;
 $('counter').textContent=`${String(slideIndex+1).padStart(2,'0')} / 23`;$('previous').disabled=slideIndex===0;$('next').disabled=slideIndex===22;
 $('slide-text').textContent=slide.text.trim().replace(/^(Sida|Page|С\.|\d+\. o\.)\s*\d*\s*$/gm,'').trim()||t.empty;
 $('announcement').textContent='';
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===language)));
 renderOutline();renderStage();writeHash();
 const active=$('slide-list').querySelector('[aria-current="true"]');
 if(active)$('slide-list').scrollTop=Math.max(0,active.offsetTop-$('slide-list').offsetTop-$('slide-list').clientHeight/2+active.clientHeight/2);
 const next=SLIDES[language][slideIndex+1];if(next){const preload=new Image();preload.src=next.image;}
}
function go(index){const next=Math.max(0,Math.min(22,index));if(next===slideIndex)return;slideIndex=next;render();}
$('previous').addEventListener('click',()=>go(slideIndex-1));$('next').addEventListener('click',()=>go(slideIndex+1));
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.lang;render();}));
$('motion').addEventListener('click',()=>{still=!still;renderStage();});
$('outline-toggle').addEventListener('click',()=>{$('outline-toggle').setAttribute('aria-expanded',String($('outline').classList.toggle('open')));});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('viewer').requestFullscreen();}catch{$('viewer').scrollIntoView({block:'center',behavior:'smooth'});}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').querySelector('span').textContent=document.fullscreenElement?COPY[language].exit:COPY[language].full;});
document.addEventListener('keydown',event=>{
 if(event.ctrlKey||event.metaKey||event.altKey||$('share-dialog').open||['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName))return;
 if(event.key==='ArrowRight'){event.preventDefault();go(slideIndex+1);}if(event.key==='ArrowLeft'){event.preventDefault();go(slideIndex-1);}
 if(event.key==='Home'){event.preventDefault();go(0);}if(event.key==='End'){event.preventDefault();go(22);}
});
let touchStart=null;$('stage').addEventListener('touchstart',e=>{touchStart=[e.changedTouches[0].clientX,e.changedTouches[0].clientY];},{passive:true});
$('stage').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart[0],dy=e.changedTouches[0].clientY-touchStart[1];if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)go(slideIndex+(dx<0?1:-1));touchStart=null;},{passive:true});
$('share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);$('announcement').textContent=COPY[language].copied;}catch{$('share-link').value=location.href;$('share-dialog').showModal();$('share-link').select();}});
window.addEventListener('hashchange',()=>{parseHash();render();});
parseHash();if(matchMedia('(prefers-reduced-motion: reduce)').matches)still=true;render();

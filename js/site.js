(function(){
var U='https://qqdqkpdclkvppdilbjdg.supabase.co',K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZHFrcGRjbGt2cHBkaWxiamRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyODI0ODAsImV4cCI6MjEwMTg1ODQ4MH0.UV7ejhUMy7S4ayUonwpRDK3QfbgaAMy-6x42MYyE3cE';
var EDIT=/[?&]cms=1/.test(location.search);
var PAGE=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'')||'index';
function api(q){return fetch(U+'/rest/v1/'+q,{headers:{apikey:K,Authorization:'Bearer '+K}}).then(function(r){return r.ok?r.json():[]}).catch(function(){return[]});}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]})}
function norm(h){return h.replace(/\s+/g,' ').trim();}



/* ---- mobile menu ---- */
(function(){var n=document.querySelector('.nav nav');if(!n)return;var b=document.createElement('button');b.type='button';b.className='nb';b.setAttribute('aria-label','Menu');b.setAttribute('aria-expanded','false');b.innerHTML='<i></i><i></i><i></i>';n.parentNode.insertBefore(b,n);b.onclick=function(){var o=n.classList.toggle('open');b.classList.toggle('on',o);b.setAttribute('aria-expanded',String(o));};n.addEventListener('click',function(e){if(e.target.closest('a')){n.classList.remove('open');b.classList.remove('on');}});})();

/* ---- tabs (program page) ---- */
document.querySelectorAll('[data-tabs]').forEach(function(w){
  var bs=w.querySelectorAll('.tabs button'),ps=w.querySelectorAll('[data-pane]');
  function go(k){bs.forEach(function(b){b.classList.toggle('on',b.dataset.k===k)});ps.forEach(function(p){p.hidden=p.dataset.pane!==k});}
  bs.forEach(function(b){b.onclick=function(){go(b.dataset.k);}});
  go(bs[0].dataset.k);
});

/* ---- sanitizer for edited text ---- */
var OK={B:1,I:1,EM:1,STRONG:1,BR:1,SPAN:1,SMALL:1,U:1,SUP:1,SUB:1,A:1};
function clean(html){
  var t=document.createElement('template');t.innerHTML=html;
  (function w(n){Array.prototype.slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===1){
      if(!OK[c.tagName]){c.replaceWith(document.createTextNode(c.textContent));return;}
      Array.prototype.slice.call(c.attributes).forEach(function(a){
        var ok=c.tagName==='A'&&a.name==='href'&&/^(https?:|mailto:|tel:|\/|#|[a-z0-9_.-]+\.html)/i.test(a.value);
        if(!ok)c.removeAttribute(a.name);});
      w(c);
    }else if(c.nodeType!==3)c.remove();
  });})(t.content);
  return t.innerHTML;
}

/* ---- find editable text blocks ---- */
var INL={BR:1,B:1,I:1,EM:1,STRONG:1,SPAN:1,SMALL:1,U:1,SUP:1,SUB:1};
var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,SVG:1,IFRAME:1,INPUT:1,TEXTAREA:1,SELECT:1,OPTION:1,CANVAS:1,TIME:1};
function leaves(){
  var out=[];
  (function walk(n){
    for(var c=n.firstElementChild;c;c=c.nextElementSibling){
      if(SKIP[c.tagName.toUpperCase()]||c.id==='pl'||c.closest('[data-nocms]'))continue;
      var inline=Array.prototype.every.call(c.children,function(k){return INL[k.tagName]&&!k.querySelector('img,[id]');});
      var txt=c.textContent.trim();
      if(inline&&txt&&/[A-Za-z؀-ۿ]/.test(txt)&&!c.id&&!c.closest('.cd,.lb'))out.push(c);
      else walk(c);
    }
  })(document.body);
  return out;
}

/* ---- apply content overrides ---- */
var LV=[],OVR={};
function applyText(rows){
  LV=leaves();
  rows.forEach(function(r){OVR[r.kind+'|'+r.orig]=r.val;});
  LV.forEach(function(el){
    el.__o=norm(el.innerHTML);
    var v=OVR['text|'+el.__o];
    if(v!=null)el.innerHTML=clean(v);
  });
  document.querySelectorAll('img').forEach(function(im){
    if(im.closest('#pl,[data-nocms]'))return;
    im.__o=im.getAttribute('src');
    var v=OVR['img|'+im.__o];
    if(v&&/^https:\/\//.test(v)){im.src=v;im.removeAttribute('srcset');}
  });
}

/* ---- posts ---- */
function card(p){
  var d='';try{d=new Date(p.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});}catch(e){}
  var img=p.image_url&&/^https:\/\//.test(p.image_url)?'<img src="'+esc(p.image_url)+'" alt="" loading="lazy">':'';
  return '<article class="op">'+img+'<div class="opb"><time>'+esc(d)+'</time><h3>'+esc(p.title)+'</h3><p>'+esc(p.body).replace(/\n/g,'<br>')+'</p></div></article>';
}
function css(){
  var s=document.createElement('style');
  s.textContent='.ops{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px}.op{background:#fff;border:1px solid var(--line,#d3e6f2);border-radius:18px;overflow:hidden;box-shadow:0 8px 24px rgba(20,48,95,.07)}.op img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}.opb{padding:18px 20px 22px}.opb time{font-size:.8rem;color:var(--soft,#4a5d73)}.opb h3{margin:6px 0 8px;font-size:1.2rem;color:var(--navy,#14305f)}.opb p{margin:0;line-height:1.65;color:var(--ink,#0f2038)}#latest{padding:10px 22px 46px}#latest h2{margin:0 0 18px}#latest .more{margin-top:18px;display:inline-block}[contenteditable]{outline:1px dashed rgba(21,128,187,.45);outline-offset:2px;cursor:text}[contenteditable]:focus{outline:2px solid #1580bb;background:rgba(21,128,187,.07)}img.cms-i{outline:2px dashed #c8222b;outline-offset:-2px;cursor:pointer}.stats{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin:30px auto 8px;max-width:900px}.stats div{flex:1;min-width:130px;background:#fff;border:1px solid var(--line,#d3e6f2);border-radius:16px;padding:16px 10px;box-shadow:0 8px 22px rgba(29,63,122,.08)}.stats b{display:block;font-family:"Plus Jakarta Sans",sans-serif;font-size:2.1rem;line-height:1.1;color:var(--navy,#14305f)}.stats small{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--soft,#4a5d73)}.pdfc{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;background:#fff;border:1px solid var(--line,#d3e6f2);border-radius:18px;padding:18px 22px;margin:0 0 22px;box-shadow:0 8px 24px rgba(20,48,95,.07)}.pdfc b{display:block;color:var(--navy,#14305f);font-size:1.1rem}.pdfc span{color:var(--soft,#4a5d73);font-size:.92rem}.pdfa{display:flex;gap:10px;flex-wrap:wrap}.pdff{width:100%;height:80vh;border:1px solid var(--line,#d3e6f2);border-radius:14px;margin:0 0 22px;background:#fff}';
  document.head.appendChild(s);
}
function posts(list){
  var box=document.getElementById('posts');
  if(box){box.innerHTML=list.length?'<div class="ops">'+list.map(card).join('')+'</div>':'<p style="color:var(--soft,#4a5d73)">No news yet. Please check back soon.</p>';}
  var lt=document.getElementById('latest');
  if(lt&&list.length){lt.innerHTML='<h2>Latest news</h2><div class="ops">'+list.slice(0,3).map(card).join('')+'</div><a class="btn btn-red more" href="news.html">All news</a>';lt.hidden=false;}
}

/* ---- butterflies ---- */
var BF={base:'img/butterflies/',spread:true};
function butterflies(on){
  if(EDIT)return;
  if(on&&window.startButterflies){window.startButterflies(BF);if(window.bfSet)window.bfSet(true);}
}

/* ---- visual edit mode (used by the admin page) ---- */
function editMode(){
  var send=function(m){parent.postMessage(Object.assign({ontic:1,page:PAGE},m),'*');};
  LV.forEach(function(el){
    el.contentEditable='true';el.spellcheck=false;
    el.addEventListener('focus',function(){el.__f=norm(el.innerHTML);});
    el.addEventListener('blur',function(){
      var now=norm(el.innerHTML);if(now===el.__f)return;
      send({t:'text',orig:el.__o,val:now===el.__o?null:now});
    });
    el.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey&&/^(H[1-6]|A|BUTTON|LI|SPAN)$/.test(el.tagName)){e.preventDefault();el.blur();}});
  });
  document.querySelectorAll('img').forEach(function(im){
    if(im.closest('[data-nocms]'))return;
    im.classList.add('cms-i');
    im.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();send({t:'img',orig:im.__o});});
  });
  document.addEventListener('click',function(e){var a=e.target.closest('a,button');if(a&&!a.closest('.tabs'))e.preventDefault();},true);
  document.addEventListener('submit',function(e){e.preventDefault();},true);
  window.addEventListener('message',function(e){
    var m=e.data;if(!m||!m.ontic||m.page!==PAGE)return;
    if(m.t==='setimg'){document.querySelectorAll('img').forEach(function(im){if(im.__o===m.orig){im.src=m.url;im.removeAttribute('srcset');}});}
  });
  send({t:'ready'});
}

/* ---- stats + program file ---- */
function counters(){var els=document.querySelectorAll('[data-n]');if(!els.length)return;els.forEach(function(e){var to=+e.dataset.n,t0=null;function st(ts){if(t0===null)t0=ts;var p=Math.min(1,(ts-t0)/1600);e.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(st);}requestAnimationFrame(st);});}
function pdf(u){var b=document.getElementById('pdfbox');if(!b||!u||!/^https:\/\//.test(u))return;b.innerHTML='<div class="pdfc"><div><b>Official program</b><span>Download the full scientific program or view it online.</span></div><div class="pdfa"><a class="btn btn-red" href="'+esc(u)+'" target="_blank" rel="noopener" download>Download program</a><button class="btn btn-ghost" type="button" id="pdfv">View online</button></div></div>';b.hidden=false;document.getElementById('pdfv').onclick=function(){var f=document.getElementById('pdff');if(f){f.remove();this.textContent='View online';return;}f=document.createElement('iframe');f.id='pdff';f.className='pdff';f.title='Program';f.src=u;b.appendChild(f);this.textContent='Hide';};}

function hvideo(u,pos,cap){if(PAGE!=='index'||EDIT||!u||!/^https:\/\//.test(u))return;var secs=document.querySelectorAll('main>section');if(!secs.length)return;var k=Math.max(0,Math.min(secs.length,typeof pos==='number'?pos:1));var s=document.createElement('section');s.setAttribute('data-nocms','');s.style.cssText='padding:30px 22px';var v=document.createElement('video');v.controls=true;v.muted=true;v.defaultMuted=true;v.loop=true;v.autoplay=true;v.preload='auto';v.setAttribute('muted','');v.setAttribute('autoplay','');v.setAttribute('loop','');v.setAttribute('playsinline','');v.src=u;v.style.cssText='display:block;width:100%;max-width:1000px;max-height:78vh;margin:0 auto;border-radius:18px;background:#000;box-shadow:0 14px 34px rgba(20,48,95,.18)';s.appendChild(v);if(cap){var c=document.createElement('p');c.textContent=cap;c.style.cssText='max-width:1000px;margin:14px auto 0;text-align:center;font-size:1.05rem;color:#0d3f64;font-weight:500;line-height:1.6';s.appendChild(c);}var pl=function(){var p=v.play();if(p&&p.catch)p.catch(function(){});};if('IntersectionObserver' in window){new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting)pl();else v.pause();});},{threshold:.25}).observe(v);}else pl();if(k===0)secs[0].parentNode.insertBefore(s,secs[0]);else secs[k-1].parentNode.insertBefore(s,secs[k-1].nextSibling);}

/* ---- boot ---- */
css();setTimeout(counters,1200);
var needPosts=!!(document.getElementById('posts')||document.getElementById('latest'));
Promise.all([
  api('ontic_settings?select=key,value'),
  api('ontic_text?select=orig,val,kind&page=eq.'+encodeURIComponent(PAGE)),
  needPosts?api('ontic_posts?select=id,title,body,image_url,created_at&published=eq.true&order=created_at.desc&limit=60'):Promise.resolve([])
]).then(function(r){
  var S={};r[0].forEach(function(x){S[x.key]=x.value;});
  try{if(S.loader_logo&&/^https:\/\//.test(S.loader_logo))localStorage.setItem('ontic_ll',S.loader_logo);else localStorage.removeItem('ontic_ll');}catch(e){}
  applyText(r[1]||[]);
  posts(r[2]||[]);pdf(S.program_pdf);hvideo(S.home_video,S.home_video_pos,S.home_video_caption);
  if(EDIT)editMode();
  else butterflies(S.butterflies!==false);
  window.__onticReady=true;
}).catch(function(){
  applyText([]);window.__onticReady=true;if(!EDIT)butterflies(true);
});
})();

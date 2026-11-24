(function(){
var d=document,h=d.documentElement,logo='img/brand/ontic-logo.png';
if(/[?&]cms=1/.test(location.search))return;
try{var c=localStorage.getItem('ontic_ll');if(c&&/^https:\/\//.test(c))logo=c;}catch(e){}
var s=d.createElement('style');
s.textContent='#pl{position:fixed;inset:0;z-index:99999;background:#fff;display:flex;align-items:center;justify-content:center;transition:opacity .5s}#pl.x{opacity:0;pointer-events:none}#pl img{width:min(280px,62vw);height:auto;animation:plp 1.4s ease-in-out infinite}@keyframes plp{0%,100%{opacity:.55;transform:scale(.95)}50%{opacity:1;transform:scale(1)}}';
h.appendChild(s);
var p=d.createElement('div');p.id='pl';p.setAttribute('aria-hidden','true');p.innerHTML='<img src="'+logo+'" alt="">';h.appendChild(p);
var t0=Date.now(),done=false;
function go(){if(done)return;done=true;setTimeout(function(){p.classList.add('x');setTimeout(function(){if(p.parentNode)p.parentNode.removeChild(p);},600);},Math.max(0,800-(Date.now()-t0)));}
function chk(){if(window.__onticReady||Date.now()-t0>4000)go();else setTimeout(chk,80);}
window.addEventListener('load',chk);setTimeout(go,8000);
})();

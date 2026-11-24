var K=(function(){
var sound=true,voice=null,ac=null,mix=null,GOOD=['Great job!','Well done!','Super!','You are a star!','Wonderful!','Hooray!','Fantastic!','Brilliant!'];
function rnd(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function pick(a){return a[rnd(0,a.length-1)]}
function shuffle(a){return a.sort(function(){return Math.random()-.5})}
/* ---------- voice ---------- */
function vc(){try{var v=speechSynthesis.getVoices().filter(function(x){return /^en/i.test(x.lang)});if(!v.length)return;
 function sc(x){var s=0;if(/Google|Natural|Online|Samantha|Serena|Daniel|Karen|Moira|Aria|Jenny/i.test(x.name))s+=10;
  if(/en[-_]NG/i.test(x.lang))s+=4;else if(/en[-_]GB/i.test(x.lang))s+=3;else if(/en[-_]US/i.test(x.lang))s+=2;
  if(/Female|Samantha|Serena|Karen|Moira|Aria|Jenny|Zira|Susan/i.test(x.name))s+=2;return s}
 voice=v.sort(function(a,b){return sc(b)-sc(a)})[0]}catch(e){}}
if(window.speechSynthesis){vc();speechSynthesis.onvoiceschanged=vc}
function say(t,done){
 var fin=false;function f(){if(!fin){fin=true;done&&done()}}
 if(!sound||!window.speechSynthesis){done&&setTimeout(f,700);return}
 function go(){try{var u=new SpeechSynthesisUtterance(t);window._u=u;
  if(voice){u.voice=voice;u.lang=voice.lang}else u.lang='en-GB';
  u.rate=.82;u.pitch=1.12;u.volume=1;u.onend=f;u.onerror=f;speechSynthesis.speak(u);speechSynthesis.resume()}catch(e){f()}
  setTimeout(f,1800+t.length*130)}
 if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();setTimeout(go,90)}else go()}
function stopSpeech(){try{speechSynthesis.cancel()}catch(e){}}
/* ---------- audio ---------- */
function ctx(){if(!ac){var C=window.AudioContext||window.webkitAudioContext;ac=new C();var c=ac.createDynamicsCompressor();mix=ac.createGain();mix.gain.value=.9;mix.connect(c);c.connect(ac.destination)}
 if(ac.state==='suspended')ac.resume();return ac}
document.addEventListener('pointerdown',function(){try{ctx()}catch(e){}},{once:true});
function tone(seq,step){try{if(!sound)return;var a=ctx();seq.forEach(function(f,i){var o=a.createOscillator(),g=a.createGain(),t=a.currentTime+i*(step||.12);o.type='triangle';o.frequency.value=f;
 g.gain.setValueAtTime(.2,t);g.gain.exponentialRampToValueAtTime(.001,t+.28);o.connect(g);g.connect(mix);o.start(t);o.stop(t+.3)})}catch(e){}}
function note(t0,o){var a=ctx(),t=a.currentTime+t0,osc=a.createOscillator(),bp=a.createBiquadFilter(),am=a.createGain(),g=a.createGain(),v=o.v||1;
 osc.type=o.type||'sawtooth';o.f.forEach(function(p,i){osc.frequency[i?'linearRampToValueAtTime':'setValueAtTime'](p[1],t+p[0])});
 bp.type='bandpass';bp.frequency.value=o.bp;bp.Q.value=o.q||2;am.gain.value=o.am?1-o.am[1]:1;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.setValueAtTime(v,t+o.d-.1);g.gain.linearRampToValueAtTime(0,t+o.d);
 if(o.vib){var l=a.createOscillator(),lg=a.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1];l.connect(lg);lg.connect(osc.frequency);l.start(t);l.stop(t+o.d)}
 if(o.am){var l2=a.createOscillator(),lg2=a.createGain();l2.type='square';l2.frequency.value=o.am[0];lg2.gain.value=o.am[1];l2.connect(lg2);lg2.connect(am.gain);l2.start(t);l2.stop(t+o.d)}
 osc.connect(bp);bp.connect(am);am.connect(g);g.connect(mix);osc.start(t);osc.stop(t+o.d+.05)}
var SY={
 cow:[[0,{f:[[0,150],[.4,125],[1.5,88]],d:1.6,bp:520,q:1.3,vib:[5,7],v:1.6}]],
 dog:[[0,{f:[[0,260],[.2,130]],d:.22,bp:900,q:1.5,v:1.5}],[.38,{f:[[0,250],[.22,125]],d:.24,bp:900,q:1.5,v:1.5}]],
 cat:[[0,{f:[[0,480],[.3,950],[1,520]],d:1.1,bp:1400,q:2.5,vib:[6,15],v:1.3}]],
 sheep:[[0,{f:[[0,340],[1.1,290]],d:1.2,bp:1100,q:3,am:[28,.6],vib:[6,10],v:1.4}]],
 frog:[[0,{f:[[0,140],[.3,200]],d:.32,bp:500,q:3,am:[30,.8],v:1.6}],[.45,{f:[[0,150],[.3,210]],d:.32,bp:500,q:3,am:[30,.8],v:1.6}]],
 duck:[[0,{type:'square',f:[[0,520],[.2,320]],d:.24,bp:1300,q:5,am:[45,.5],v:1.3}],[.35,{type:'square',f:[[0,500],[.2,300]],d:.24,bp:1300,q:5,am:[45,.5],v:1.3}]],
 horse:[[0,{f:[[0,550],[.25,1150],[.7,900],[1.5,420]],d:1.6,bp:1600,q:2,vib:[16,40],am:[11,.3],v:1.3}]],
 pig:[[0,{f:[[0,130],[.28,85]],d:.3,bp:650,q:3,am:[38,.6],v:1.7}],[.42,{f:[[0,130],[.28,85]],d:.3,bp:650,q:3,am:[38,.6],v:1.7}]]};
var DUR={cow:1700,dog:800,cat:1200,sheep:1300,frog:900,duck:800,horse:1700,pig:800};
function synth(k,done){try{ctx();(SY[k]||[]).forEach(function(n){note(n[0],n[1])})}catch(e){}setTimeout(function(){done&&done()},DUR[k]||1000)}
/* real recordings: drop sounds/cow.mp3 etc. next to the pages and they are used automatically */
function animal(k,done){if(!sound){done&&done();return}
 var a=new Audio('sounds/'+k+'.mp3'),used=false;function fb(){if(used)return;used=true;synth(k,done)}
 a.onerror=fb;a.onended=function(){used=true;done&&done()};var p=a.play();if(p&&p.catch)p.catch(fb)}
function confetti(){if(!sound&&0)return;var e=['🎉','⭐','✨','🎈','💛','🌈','🎊'];for(var i=0;i<30;i++){var s=document.createElement('span');s.className='confetti';s.textContent=pick(e);
 s.style.left=rnd(2,95)+'%';s.style.animationDelay=(Math.random()*.6)+'s';s.style.setProperty('--dx',rnd(-80,80)+'px');document.body.appendChild(s);setTimeout(function(x){x.remove()},3200,s)}}
/* ---------- game runner ---------- */
function run(cfg){
 var app=document.getElementById('app'),idx=0,score=0,rounds=[],lock=false,cur='',api={},st=null;
 function $(s){return document.getElementById(s)}
 function head(stars){var s='';if(stars)for(var i=0;i<rounds.length;i++)s+='<span class="'+(i<score?'on':'')+'">⭐</span>';
  return '<div class="top"><a class="round" href="index.html" aria-label="Home">🏠</a><div class="stars" id="stars">'+s+'</div><button class="round" id="snd" aria-label="Sound on or off">'+(sound?'🔊':'🔇')+'</button></div>'}
 function bind(){$('snd').onclick=function(){sound=!sound;this.textContent=sound?'🔊':'🔇';if(!sound)stopSpeech()}}
 function home(){app.innerHTML=head(0)+'<main class="stage"><div class="hero"><div class="mascot bob">'+cfg.mascot+'</div><h1>'+cfg.hello+'</h1><p>'+cfg.sub+'</p><button class="big" id="go">▶ Start</button></div></main>';bind();
  $('go').onclick=function(){rounds=cfg.rounds();idx=0;score=0;next()};setTimeout(function(){say(cfg.hello)},300)}
 function next(){if(idx>=rounds.length)return finish();lock=false;api.rep=null;
  app.innerHTML=head(1)+'<main class="stage"><div class="bubble"><span class="face">'+cfg.mascot+'</span><div class="pt" id="pt"></div><button class="round" id="rep" aria-label="Hear again">🔊</button></div><div class="play" id="play"></div><div class="msg" id="msg"></div><div class="choices" id="ch"></div></main>';
  bind();$('rep').onclick=function(){api.rep?api.rep():say(cur)};rounds[idx](api,idx)}
 api.ask=function(h,s,keep){$('pt').innerHTML=h;cur=s;if(!keep)say(s)};
 api.play=function(h){$('play').innerHTML=h;return $('play')};
 api.msg=function(t,bad){var m=$('msg');m.textContent=t;m.className='msg'+(bad?' bad':'')};
 api.say=say;api.animal=animal;api.tone=tone;api.rnd=rnd;api.pick=pick;api.shuffle=shuffle;api.$=$;
 api.choose=function(list,check,cls){var ch=$('ch');ch.innerHTML=list.map(function(o,i){return '<button class="opt '+(cls||'')+'" data-i="'+i+'" aria-label="'+(o.label||'')+'">'+o.html+'</button>'}).join('');
  Array.prototype.forEach.call(ch.children,function(b){b.onclick=function(){if(!lock)check(list[+b.dataset.i],b)}})};
 api.ok=function(el,extra){if(lock)return;lock=true;score++;var c=pick(GOOD);tone([523,659,784,1047],.11);confetti();api.msg(c+' ⭐');
  if(el)el.classList.add('hop');var s=$('stars').children;if(s[score-1])s[score-1].className='on';
  setTimeout(function(){say((extra?extra+' ':'')+c)},400);setTimeout(function(){idx++;next()},extra?3600:2800)};
 api.no=function(el){if(lock)return;tone([260,190],.15);api.msg('Oops! Try again, you can do it!',1);el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');say('Oops! Try again. You can do it!')};
 function finish(){tone([523,659,784,1047,784,1047,1319],.13);confetti();try{var k='kids-'+cfg.id,b=+localStorage.getItem(k)||0;if(score>b)localStorage.setItem(k,score)}catch(e){}
  var s='';for(var i=0;i<score;i++)s+='<span class="on">⭐</span>';
  app.innerHTML=head(0)+'<main class="stage"><div class="hero"><div class="mascot hop">🏆</div><h1>'+cfg.done+'</h1><div class="stars" style="margin:6px 0 20px">'+s+'</div><button class="big" id="again">↻ Play again</button></div></main>';bind();$('again').onclick=home;setTimeout(function(){say(cfg.done)},500)}
 home()}
return {run:run,say:say,tone:tone,animal:animal,rnd:rnd,pick:pick,shuffle:shuffle,confetti:confetti,mute:function(){sound=!sound;if(!sound)stopSpeech();return sound}}})();

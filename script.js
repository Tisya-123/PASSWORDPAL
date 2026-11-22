const $=id=>document.getElementById(id);
const pw=$('pw'),go=$('go'),kev=$('kevin'),st=$('status');
const mons=['pikachu','eevee','snorlax','mew','ditto','gengar','psyduck','jigglypuff'];
let mon=mons[0],extra=null,attempts=0,dodges=0,busy=false;
const extras=[
 ['must not contain the letter "e" (we are tired of it)',v=>!/e/i.test(v)],
 ['must contain "tue" (it was a Tuesday)',v=>/tue/i.test(v)],
 ['must be a palindrome-adjacent: end with the same char you started with',v=>v.length>1&&v[0]===v.slice(-1)],
 ['must contain a emoji that looks like how you feel',v=>/\p{Extended_Pictographic}/u.test(v)]
];
const base=[
 ['at least 12 characters',v=>v.length>=12],
 ['an uppercase letter',v=>/[A-Z]/.test(v)],
 ['a symbol',v=>/[^\w\s\u{13000}-\u{1342F}]/u.test(v)],
 ['a hieroglyph',v=>/[\u{13000}-\u{1342F}]/u.test(v)],
 ['a number that is "not too prime, not too composite" (6, 10, 14, 15, 21 or 22)',v=>/(6|10|14|15|21|22)/.test(v)]
];
function rules(){
 return [...base,['the name of a Pokémon: currently "'+mon+'" (case-sensitive, obviously)',v=>v.includes(mon)],...(extra?[extra]:[])];
}
function render(){
 const v=pw.value,r=rules();
 $('rules').innerHTML=r.map(x=>'<li class="'+(x[1](v)?'ok':'')+'">'+x[0]+'</li>').join('');
 go.disabled=busy||!(r.every(x=>x[1](v))&&$('user').value.trim());
}
function say(t){kev.textContent=t}
function shake(){const c=$('card');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake')}
pw.addEventListener('input',()=>{render();if(pw.value.length===4)say('*sigh*')});
$('user').addEventListener('input',render);
$('hier').onclick=()=>{pw.value+='𓂀';render();say('Cheating, but fine.')};
render();

// Moving submit button
go.addEventListener('mouseenter',()=>{
 if(go.disabled||busy||dodges>=6)return;
 dodges++;
 go.style.transform='translate('+(Math.random()*240-120)+'px,'+(Math.random()*60-30)+'px)';
 say(['Nope.','Too slow.','Missed me!','Try harder.','Almost.','Fine. One more.'][dodges-1]);
 if(dodges===6)setTimeout(()=>{go.style.transform='';say('I\'m too tired to run. Go ahead.')},700);
});
go.addEventListener('focus',()=>{if(dodges<6&&!go.disabled){dodges=6;go.style.transform=''}});

const errs=[
 'Incorrect password. We will not say whether it is the password, the username, or the vibes.',
 'Your password is too similar to your old password. Also too different from your old password.',
 'Error 200: Everything is fine. Please try again.',
 'That password is already used by someone else. We notified them. They are upset.',
 'Your password is strong! Unfortunately, we forgot it.'
];
go.onclick=()=>{
 busy=true;go.disabled=true;
 const bar=$('bar'),fill=$('fill');bar.style.display='block';
 st.className='';let p=0,resets=0;
 say('Reflecting...');
 const t=setInterval(()=>{
  p+=Math.random()*2+0.8;
  if(p>=99&&resets<2){p=12;resets++;st.textContent='Reconsidering your choices...';say('99%. Just kidding.')}
  else if(p>=99){clearInterval(t);finish()}
  else if(p>40)st.textContent='Verifying your sincerity...';
  fill.style.width=p+'%';
 },60);
 async function finish(){
  bar.style.display='none';busy=false;attempts++;
  let msg=errs[(attempts-1)%errs.length];
  try{const r=await fetch('/api/login',{method:'POST'});if(r.ok){msg=(await r.json()).error||msg}}catch(e){}
  st.className='err';st.textContent='❌ '+msg;
  mon=mons[attempts%mons.length];extra=extras[(attempts-1)%extras.length];
  pw.value='';dodges=0;go.style.transform='';render();shake();
  say(attempts>=3?'I\'m not mad, I\'m just tired.':'The rules have changed. You didn\'t read them. Again.');
 }
};

// Expiry every 4 minutes (for your protection)
let left=240;
setInterval(()=>{
 left--;if(left<0){left=240;pw.value='';render();say('Your password expired. For your protection.');st.className='err';st.textContent='❌ Password expired.'}
 $('exp').textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');
},1000);

$('forgot').onclick=e=>{e.preventDefault();st.className='err';st.textContent='📧 Reset link sent to the email you cannot access because you forgot your password.';say('The circle of life.')};
$('cap').onclick=e=>{
 e.preventDefault();
 const a=prompt('Brenda here. To prove you are human, describe your childhood trauma in 40 words or more.');
 if(a===null)return;
 const n=a.trim().split(/\s+/).filter(Boolean).length;
 alert(n>=40?'Interesting. Still not convinced.':'Only '+n+' words. Brenda is judging you.');
};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!go.disabled)go.click()});

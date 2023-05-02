/**
 * grrd's 4 in a Row
 * Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
 * @license MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
!function(){"use strict";window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)};let e,t,n,o=function(e){return document.getElementById(e)},a=!1,i=!1;const l=["col0","col1","col2","col3","col4","col5","col6"];let s=[],r=[],c=[];for(e=0;e<6;e+=1)c[e]=[],c[e][6]=void 0;let d,A,m,g,u,f,h,w,p=[],y=[],L=null,E=!0,b=!1,v=!1;const I=o("game"),_=o("title"),k=o("popupInfo"),B=o("popupStats"),S=o("popupSettings"),T=o("popupCountry"),M=o("popupOnline"),Q=o("popupDialog"),O=o("popupLeft"),x=o("sp_country"),P=o("inputImage"),D=o("inputName"),N=o("b_sound"),R=o("l_country"),C=o("txt_search"),U=o("P1country"),H=o("P2country");let F,G=[],q=[];const z=["#ff0080","#6969EE"],j=["#D6016B","#5A5ACE"],W=["#FD6BB4","#9393EF"];let Y=0;const K=["Images/red_on.png","Images/red_off.png"],X=["Images/blue_on.png","Images/blue_off.png"];let Z,V,J,$,ee,te,ne,oe,ae,ie,le,se,re,ce,de,Ae,me,ge,ue,fe,he,we,pe,ye,Le,Ee,be=0,ve=[0,0],Ie=Boolean(!1),_e=null,ke=0,Be=!1,Se=!1,Te=function(){const e="modernizr";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(e){return!1}}();function Me(e){e!==k&&e!==B&&e!==S&&e!==M||(document.getElementsByTagName("FIELDSET")[0].disabled=!0),e===T&&(S.getElementsByTagName("FIELDSET")[0].disabled=!0),e!==Q&&e!==O||(Array.from(I.getElementsByTagName("canvas")).forEach((e=>{e.tabIndex=-1})),I.getElementsByTagName("FIELDSET")[0].disabled=!0),e.classList.remove("popup-init"),e.classList.remove("popup-hide"),e.classList.add("popup-show"),document.activeElement.blur()}function Qe(e){e!==k&&e!==B&&e!==S&&e!==M||(document.getElementsByTagName("FIELDSET")[0].disabled=!1),e===T&&(S.getElementsByTagName("FIELDSET")[0].disabled=!1),e!==Q&&e!==O||(Array.from(I.getElementsByTagName("canvas")).forEach((e=>{e.tabIndex=0})),I.getElementsByTagName("FIELDSET")[0].disabled=!1),e.classList.remove("popup-show"),e.classList.add("popup-hide"),setTimeout((function(){e.scrollTop=0}),1050),document.activeElement.blur()}function Oe(e,t,n,o){r[t].beginPath(),r[t].arc(ie/2,e,ie/2*.85,0,2*Math.PI,!1),r[t].fillStyle=n,r[t].fill(),r[t].lineWidth=ie/20,r[t].strokeStyle=o,r[t].stroke()}function xe(){let e,o,a;for(t=document.documentElement.clientHeight,n=document.documentElement.clientWidth,t>n?(ie=Math.min((n-50)/7,(t-140)/6),le=Math.max(6*ie*.85,t-190)):(ie=Math.min((n-140-60)/7,(t-20)/6),le=Math.max(6*ie*.85,t-95)),e=0;e<l.length;e+=1)document.getElementById(l[e]).width=ie,document.getElementById(l[e]).height=le;for(o=0;o<c[0].length&&void 0!==r[o];o+=1)for(e=0;e<c.length;e+=1)a=r[o].createLinearGradient(0,.9*(c.length-e-1)*ie,.7*ie,.9*(c.length-e-1)*ie+.7*ie),a.addColorStop(0,"black"),a.addColorStop(1,"grey"),r[o].beginPath(),r[o].arc(ie/2,(c.length-e-.5)*ie*.85,ie/2*.7,0,2*Math.PI,!1),r[o].lineWidth=ie/10,r[o].strokeStyle=a,r[o].stroke();for(o=0;o<c[0].length&&void 0!==r[o];o+=1){for(r[o].save(),r[o].beginPath(),e=0;e<c.length;e+=1)r[o].arc(ie/2,(c.length-e-.5)*ie*.85,ie/2*.7,0,2*Math.PI,!1);r[o].clip(),r[o].clearRect(0,0,ie,le)}for(e=0;e<c.length;e+=1)for(o=0;o<c[e].length;o+=1)void 0!==c[e][o]&&Oe((c.length-e-.5)*ie*.85,o,z[c[e][o]],j[c[e][o]]);i&&(ae=ae/oe*((c.length-V-.5)*ie*.85),oe=(c.length-V-.5)*ie*.85)}function Pe(){let e,t;for(ke=0,_e=null,e=0;e<c.length;e+=1)for(t=0;t<c[e].length;t+=1)c[e][t]=void 0,0===e&&r[t].clearRect(0,0,ie,le);xe()}function De(){o("P1light").src=K[Y],o("P2light").src=X[1-Y]}function Ne(){let e,t;Te?(e=parseInt(localStorage.getItem(L+"_win")||0),t=parseInt(localStorage.getItem(L+"_loose")||0)):(e=0,t=0),"online"===L?(se=Math.max(e+t,he+we,1),o("P"+(1+parseInt(ye.role))+"win").style.width=100/se*e+"%",o("P"+(1+parseInt(ye.role))+"loose").style.width=100/se*t+"%",o("P"+(2-parseInt(ye.role))+"win").style.width=100/se*he+"%",o("P"+(2-parseInt(ye.role))+"loose").style.width=100/se*we+"%"):("2player"===L&&(e=ve[0],t=ve[1]),se=Math.max(e+t,1),o("P1win").style.width=100/se*e+"%",o("P1loose").style.width=100/se*t+"%",o("P2win").style.width=100/se*t+"%",o("P2loose").style.width=100/se*e+"%")}function Re(e){let t,n;Te&&(L&&e&&(t=L+"_"+e,n=parseInt(localStorage.getItem(t)||0)+1,localStorage.setItem(t,n)),de=localStorage.getItem("easy_win")||0,Ae=localStorage.getItem("easy_loose")||0,me=localStorage.getItem("medium_win")||0,ge=localStorage.getItem("medium_loose")||0,ue=localStorage.getItem("hard_win")||0,fe=localStorage.getItem("hard_loose")||0,re=localStorage.getItem("online_win")||0,ce=localStorage.getItem("online_loose")||0,se=Math.max(de,Ae,me,ge,ue,fe,re,ce,1),document.getElementById("easy_win").innerHTML=document.webL10n.get("lb_won")+" "+de,document.getElementById("easy_loose").innerHTML=document.webL10n.get("lb_lost")+" "+Ae,document.getElementById("medium_win").innerHTML=document.webL10n.get("lb_won")+" "+me,document.getElementById("medium_loose").innerHTML=document.webL10n.get("lb_lost")+" "+ge,document.getElementById("hard_win").innerHTML=document.webL10n.get("lb_won")+" "+ue,document.getElementById("hard_loose").innerHTML=document.webL10n.get("lb_lost")+" "+fe,document.getElementById("online_win").innerHTML=document.webL10n.get("lb_won")+" "+re,document.getElementById("online_loose").innerHTML=document.webL10n.get("lb_lost")+" "+ce,document.getElementById("easy_win").style.width=100/se*de+"%",document.getElementById("easy_loose").style.width=100/se*Ae+"%",document.getElementById("medium_win").style.width=100/se*me+"%",document.getElementById("medium_loose").style.width=100/se*ge+"%",document.getElementById("hard_win").style.width=100/se*ue+"%",document.getElementById("hard_loose").style.width=100/se*fe+"%",document.getElementById("online_win").style.width=100/se*re+"%",document.getElementById("online_loose").style.width=100/se*ce+"%")}function Ce(e){e.classList.remove("_African_Union","_Arab_League","_ASEAN","_CARICOM","_CIS","_Commonwealth","_England","_European_Union","_Islamic_Conference","_Kosovo","_NATO","_Northern_Cyprus","_Northern_Ireland","_Olimpic_Movement","_OPEC","_Red_Cross","_Scotland","_Somaliland","_Tibet","_United_Nations","_Wales","ad","ae","af","ag","ai","al","am","an","ao","aq","ar","as","at","au","aw","az","ba","bb","bd","be","bf","bg","bh","bi","bj","bm","bn","bo","br","bs","bt","bw","by","bz","ca","cd","cf","cg","ch","ci","ck","cl","cm","cn","co","cr","cu","cv","cy","cz","de","dj","dk","dm","do","dz","ec","ee","eg","eh","er","es","et","fi","fj","fm","fo","fr","ga","gb","gd","ge","gg","gh","gi","gl","gm","gn","gp","gq","gr","gt","gu","gw","gy","hk","hn","hr","ht","hu","id","mc","ie","il","im","in","iq","ir","is","it","je","jm","jo","jp","ke","kg","kh","ki","km","kn","kp","kr","kw","ky","kz","la","lb","lc","li","lk","lr","ls","lt","lu","lv","ly","ma","md","me","mg","mh","mk","ml","mm","mn","mo","mq","mr","ms","mt","mu","mv","mw","mx","my","mz","na","nc","ne","ng","ni","nl","no","np","nr","nz","om","pa","pe","pf","pg","ph","pk","pl","pr","ps","pt","pw","py","qa","re","ro","rs","ru","rw","sa","sb","sc","sd","se","sg","si","sk","sl","sm","sn","so","sr","st","sv","sy","sz","tc","td","tg","th","tj","tl","tm","tn","to","tr","tt","tv","tw","tz","ua","ug","us","uy","uz","va","vc","ve","vg","vi","vn","vu","ws","ye","za","zm","zw")}function Ue(e,t){Be||(t+2e3>Date.now()&&i?window.requestAnimFrame((function(){Ue(e,t)})):(be+=1,o("printMessage").innerHTML=e,o("printGames").innerHTML=1===be?be+" "+document.webL10n.get("lb_game"):be+" "+document.webL10n.get("lb_games"),o("printScore1a").innerHTML=h,o("printScore2a").innerHTML=w,o("printScore1b").innerHTML=ve[0],o("printScore2b").innerHTML=ve[1],Me(Q),i=!1))}function He(e,t,n,o){let a;if(!Be)if(n<6&&o+250<Date.now()&&i){for(n+=1,o=Date.now(),a=0;a<4;a+=1)Oe((c.length-e[a]-.5)*ie*.85,t[a],n%2!=0?W[Y]:z[Y],"white");window.requestAnimFrame((function(){He(e,t,n,o)}))}else n<6&&i&&window.requestAnimFrame((function(){He(e,t,n,o)}))}function Fe(){i=!0,He(p.slice(),y.slice(),0,Date.now())}function Ge(e,t,n,o,a,i){let l;if(e+3*n<c.length&&t+3*o<c[e].length&&e+3*n>=0&&t+3*o>=0)for(l=0;l<4;l+=1)c[e+l*n][t+l*o]===a?(p[l]=e+l*n,y[l]=t+l*o,3===l&&(ee=!0,i&&Fe(),l=5)):l=5}function qe(e,t){for(ee=!1,V=0;V<c.length;V+=1)for(Z=0;Z<c[V].length;Z+=1)Ge(V,Z,1,0,e,t),Ge(V,Z,0,1,e,t),Ge(V,Z,1,1,e,t),Ge(V,Z,1,-1,e,t);for(te=!1,Z=0;Z<c[0].length;Z+=1)void 0===c[c.length-1][Z]&&(te=!0)}function ze(e,t,n){let o,a,l,s;i&&(o=new Date,a=o.getTime(),l=a-e,s=le*l/1e3,t<oe?(t=Math.min(oe,t+s),e=a,r[n].clearRect(0,0,ie,oe+ie/2*.85),Oe(t,n,z[Y],j[Y]),window.requestAnimFrame((function(){ze(e,t,n)}))):(E&&document.getElementById("click_sound").play(),i=!1,qe(Y,!0),ee?(ve[Y]=ve[Y]+1,"easy"!==L&&"medium"!==L&&"hard"!==L||Re(0===Y?"win":"loose"),"online"===L&&(0===Y&&"0"===ye.role||1===Y&&"1"===ye.role?(we+=1,Re("win")):(he+=1,Re("loose"))),Ne(),E&&document.getElementById("ding_sound").play(),Ue(0===Y?h+" "+document.webL10n.get("lb_win"):w+" "+document.webL10n.get("lb_win"),Date.now())):te?(Y=1-Y,De(),"2player"!==L&&"online"!==L&&1===Y&&$e()):(Re("draw"),Ue(document.webL10n.get("lb_draw"),Date.now()))))}function je(e){let t,n;if(!(Se&&(Se=!1,"online"===L&&(0===Y&&"0"===ye.role||1===Y&&"1"===ye.role))||i))for(ke+=1,V=0,oe=0;V<c.length&&0===oe;){if(void 0===c[V][e]){i=!0,c[V][e]=Y,oe=(c.length-V-.5)*ie*.85,t=new Date,n=t.getTime(),ae=-30,ze(n,ae,e);break}V+=1}}function We(){o("P1icon").src=b?P.src:"Images/player.svg",h=v?D.value:document.webL10n.get("lb_player"),Ce(U),u&&U.classList.add(u.split(" ")[1]),w=document.webL10n.get("lb_computer"),o("P1name").innerHTML=h,o("P2name").innerHTML=w,o("P2icon").src="Images/computer.svg",Ce(H),Ne(),De(),Be=!1,_.classList.remove("swipe-out-right"),I.classList.remove("swipe-in-left"),_.classList.add("swipe-out"),I.classList.add("swipe-in")}function Ye(){"online"===L&&(pe.disconnect(),o("bt_online").disabled=!1),Be=!0,xe(),i=!1,Pe(),be=0,Y=0,ve=[0,0],L=null,setTimeout((function(){_.classList.remove("swipe-out"),I.classList.remove("swipe-in"),_.classList.add("swipe-out-right"),I.classList.add("swipe-in-left")}),600*document.getElementsByClassName("popup-show").length),Qe(Q),Qe(O)}function Ke(e){let t=0,n=0;for(;t<c.length&&0===n;)void 0===c[t][e]&&(n=(c.length-t-.5)*ie*.85,r[e].fillStyle="rgba(255,255,255,0.1)",r[e].beginPath(),r[e].fillRect(0,0,ie,n+ie/2*.85),r[e].stroke()),t+=1}function Xe(e){let t=0,n=0;for(;t<c.length&&0===n;)void 0===c[t][e]&&(n=(c.length-t-.5)*ie*.85,r[e].clearRect(0,0,ie,n+ie/2*.85)),t+=1}function Ze(e){"online"===L?1===Y&&"0"===ye.role||0===Y&&"1"===ye.role||(pe.emit("playsend",{to:ye.opponent,col:e,round:ke}),je(e)):je(e)}function Ve(e,t,n){let o,a;for(d=0,A=0,m=0,o=n-3;o<=n;o+=1)if(o>=0&&o+3<c[0].length){for(Ie=!0,g=0,a=0;a<=3;a+=1)void 0!==c[t][o+a]&&(c[t][o+a]===e?g+=1:Ie=!1);Ie&&(d+=1,A+=g,g>m&&(m=g))}for(o=t+3;o>=t;o-=1)if(o-3>=0&&o<c.length){for(Ie=!0,g=0,a=0;a<=3;a+=1)void 0!==c[o-a][n]&&(c[o-a][n]===e?g+=1:Ie=!1);Ie&&(d+=1,A+=g,g>m&&(m=g))}for(o=3;o>=0;o-=1)if(n-o>=0&&n-o+3<c[0].length&&t-o>=0&&t-o+3<c.length){for(Ie=!0,g=0,a=0;a<=3;a+=1)void 0!==c[t-o+a][n-o+a]&&(c[t-o+a][n-o+a]===e?g+=1:Ie=!1);Ie&&(d+=1,A+=g,g>m&&(m=g))}for(o=3;o>=0;o-=1)if(n-o>=0&&n-o+3<c[0].length&&t+o<c.length&&t+o-3>=0){for(Ie=!0,g=0,a=0;a<=3;a+=1)void 0!==c[t+o-a][n-o+a]&&(c[t+o-a][n-o+a]===e?g+=1:Ie=!1);Ie&&(d+=1,A+=g,g>m&&(m=g))}}function Je(e,t){return e-t}function $e(){let e;for(G=[],ne=!1,J=0;J<c[0].length;J+=1)for(G[J]=0,$=0;$<c.length;$+=1)if(void 0===c[$][J]){c[$][J]=Y,Ve(Y,$,J),G[J]=1e4*m+100*d+A+2,c[$][J]=void 0;break}for(q[0]=0,e=0;e<G.length;e+=1)G[e]>q[0]&&(q[0]=G[e]);for(Y=1-Y,J=0;J<c[0].length;J+=1)for($=0;$<c.length;$+=1)if(void 0===c[$][J]){c[$][J]=Y,Ve(Y,$,J),1e4*m+100*d+A+2>q[0]&&(G[J]=1e4*m+100*d+A+2),c[$][J]=void 0;break}for(Y=1-Y,Y=1-Y,J=0;J<c[0].length;J+=1){for($=0;$<c.length-1;$+=1)if(void 0===c[$][J]){c[$+1][J]=Y,qe(Y,ne),c[$+1][J]=void 0;break}ee&&(G[J]=1,ee=!1)}for(Y=1-Y,Y=1-Y,J=0;J<c[0].length;J+=1){for($=0;$<c.length;$+=1)if(void 0===c[$][J]){c[$][J]=Y,qe(Y,ne),c[$][J]=void 0;break}ee&&(G[J]=5e4,ee=!1)}for(Y=1-Y,J=0;J<c[0].length;J+=1){for($=0;$<c.length;$+=1)if(void 0===c[$][J]){c[$][J]=Y,qe(Y,ne),c[$][J]=void 0;break}ee&&(G[J]=6e4,ee=!1)}if(q=G.slice(),q.sort(Je),q.reverse(),Z=Math.round(6*Math.random()),"hard"===L)for(;G[Z]!==q[0];)Z=Math.round(6*Math.random());if("medium"===L)for(;G[Z]<q[1]||0===G[Z];)Z=Math.round(6*Math.random());if("easy"===L)for(;G[Z]<q[2]||0===G[Z];)Z=Math.round(6*Math.random());je(Z)}function et(){Pe(),Y=be%2!=0?1:0,De()}"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("sw.js").then((function(e){console.log("ServiceWorker registration successful with scope: ",e.scope)}),(function(e){console.log("ServiceWorker registration failed: ",e)}))})),navigator.onLine&&"undefined"!=typeof io||(o("bt_online").disabled=!0);const tt=new Promise(((e,t)=>{const n=new Image;n.onload=()=>{e(1===n.naturalWidth)},n.onerror=t,n.src="data:image/jpeg;base64,/9j/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAYAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAABIAAAAAQAAAEgAAAAB/9sAQwAEAwMEAwMEBAMEBQQEBQYKBwYGBgYNCQoICg8NEBAPDQ8OERMYFBESFxIODxUcFRcZGRsbGxAUHR8dGh8YGhsa/9sAQwEEBQUGBQYMBwcMGhEPERoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoa/8IAEQgAAQACAwERAAIRAQMRAf/EABQAAQAAAAAAAAAAAAAAAAAAAAf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAF/P//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//aAAwDAQACAAMAAAAQH//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Qf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Qf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Qf//Z"}));function nt(e){let t=new FileReader,n=document.createElement("canvas"),o=null,a=new Image,i=67,l=71,s={Orientation:void 0};n.id="hiddenCanvas",n.width=i,n.height=l,n.style.visibility="hidden",document.body.appendChild(n),o=n.getContext("2d"),e.target.files[0].type.match("image.*")?t.readAsDataURL(e.target.files[0]):alert("File is not an image"),t.onload=function(){let t=this.result;EXIF.getData(e.target.files[0],(function(){s.Orientation=EXIF.getTag(this,"Orientation"),a.src=t}))},a.onload=function(){let e=0,t=0;0===this.width||0===this.height?alert("Image is empty"):(tt||(5!==s.Orientation&&6!==s.Orientation||(o.rotate(90*Math.PI/180),t=-1*i,i=71,l=67),3!==s.Orientation&&4!==s.Orientation||(o.rotate(180*Math.PI/180),t=-1*i-4,e=-1*l+4),7!==s.Orientation&&8!==s.Orientation||(o.rotate(270*Math.PI/180),e=-1*l,i=71,l=67)),o.clearRect(0,0,i,l),o.drawImage(a,0,0,this.width,this.height,e,t,i,l),P.src=n.toDataURL("image/jpeg"),Te&&localStorage.setItem("s_image",n.toDataURL("image/jpeg")),b=!0)}}function ot(e){Array.from(R.getElementsByTagName("A")).forEach((function(t){t.innerHTML.toLowerCase().indexOf(e)>-1||0===e.length?t.style.display="block":t.style.display="none"}))}document.onkeydown=function(e){const t=document.activeElement;let n,a;if(k.classList.contains("popup-show"))switch(n=Array.prototype.slice.call(k.getElementsByTagName("BUTTON"),0),a=n.indexOf(t),e.key){case"ArrowUp":case"ArrowLeft":a>0&&n[n.indexOf(t)-1].focus();break;case"ArrowDown":case"ArrowRight":a<n.length-1&&n[n.indexOf(t)+1].focus();break;case"Escape":Qe(k)}else if(B.classList.contains("popup-show"))switch(n=Array.prototype.slice.call(B.getElementsByTagName("BUTTON"),0),a=n.indexOf(t),e.key){case"ArrowUp":case"ArrowLeft":a>0&&n[n.indexOf(t)-1].focus();break;case"ArrowDown":case"ArrowRight":a<n.length-1&&n[n.indexOf(t)+1].focus();break;case"Escape":Qe(B)}else if(T.classList.contains("popup-show"))switch(n=Array.prototype.slice.call(T.querySelectorAll("INPUT,A:not([style*='display: none;'])"),0),a=n.indexOf(t),e.key){case"ArrowUp":case"ArrowLeft":a>0&&(n[n.indexOf(t)-1].focus(),e.preventDefault());break;case"ArrowDown":case"ArrowRight":a<n.length-1&&(n[n.indexOf(t)+1].focus(),e.preventDefault());break;case"Space":case" ":case"Enter":a>=1&&t.click();break;case"Escape":Qe(T)}else if(S.classList.contains("popup-show"))switch(n=Array.prototype.slice.call(S.querySelectorAll("BUTTON,INPUT:not(#b_image_input)"),0),a=n.indexOf(t),e.key){case"ArrowUp":case"ArrowLeft":a>0&&n[n.indexOf(t)-1].focus();break;case"ArrowDown":case"ArrowRight":a<n.length-1&&n[n.indexOf(t)+1].focus();break;case"Escape":Qe(S)}else if(M.classList.contains("popup-show"))switch(n=Array.prototype.slice.call(M.getElementsByTagName("BUTTON"),0),a=n.indexOf(t),e.key){case"ArrowUp":case"ArrowLeft":a>0&&n[n.indexOf(t)-1].focus();break;case"ArrowDown":case"ArrowRight":a<n.length-1&&n[n.indexOf(t)+1].focus();break;case"Escape":Qe(M)}else if(o("popupDialog").classList.contains("popup-show"))switch(n=Array.prototype.slice.call(o("popupDialog").getElementsByTagName("BUTTON"),0),a=n.indexOf(t),e.key){case"ArrowUp":case"ArrowLeft":a>0&&n[n.indexOf(t)-1].focus();break;case"ArrowDown":case"ArrowRight":a<n.length-1&&n[n.indexOf(t)+1].focus();break;case"Escape":Ye()}else if(O.classList.contains("popup-show"))switch(n=Array.prototype.slice.call(O.getElementsByTagName("BUTTON"),0),a=n.indexOf(t),e.key){case"ArrowUp":case"ArrowLeft":a>0&&n[n.indexOf(t)-1].focus();break;case"ArrowDown":case"ArrowRight":a<n.length-1&&n[n.indexOf(t)+1].focus();break;case"Escape":Ye()}else if(I.classList.contains("swipe-in"))switch(n=Array.prototype.slice.call(I.getElementsByTagName("CANVAS"),0),a=n.indexOf(t),e.key){case"ArrowLeft":a>0&&n[n.indexOf(t)-1].focus();break;case"ArrowRight":a<n.length-1&&n[n.indexOf(t)+1].focus();break;case"Space":case" ":case"Enter":case"ArrowDown":a>=0&&Ze(a);break;case"Escape":Ye()}else switch(n=Array.prototype.slice.call(_.querySelectorAll("BUTTON:not([disabled])"),0),a=n.indexOf(t),e.key){case"ArrowUp":case"ArrowLeft":a>0&&n[n.indexOf(t)-1].focus();break;case"ArrowDown":case"ArrowRight":a<n.length-1&&n[n.indexOf(t)+1].focus()}},window.onload=function(){let e;if(Te&&null!==localStorage.getItem("s_sound")?N.checked="on"===localStorage.getItem("s_sound"):N.checked=!0,E=N.checked,Te&&null!==localStorage.getItem("s_image")&&(P.src=localStorage.getItem("s_image"),b=!0),Te&&null!==localStorage.getItem("s_name")&&(D.value=localStorage.getItem("s_name"),""!==localStorage.getItem("s_name").replace(/\s+/g,"")&&(v=!0)),Te&&null!==localStorage.getItem("s_country")){u=localStorage.getItem("s_country");let e=document.getElementsByClassName(u)[0];x.innerHTML=e.innerHTML,x.classList=e.classList}for(o("iInfo").addEventListener("click",(function(){Me(k)})),o("iInfoClose").addEventListener("click",(function(){Qe(k)})),k.addEventListener("click",(function(e){e.target===k&&Qe(k)})),o("iStats").addEventListener("click",(function(){Me(B)})),o("iStatsClose").addEventListener("click",(function(){Qe(B)})),B.addEventListener("click",(function(e){e.target===B&&Qe(B)})),o("iSettings").addEventListener("click",(function(){N.checked=E,Me(S)})),o("iSettingsClose").addEventListener("click",(function(){E=N.checked,Te&&localStorage.setItem("s_sound",N.checked?"on":"off"),Qe(S)})),S.addEventListener("click",(function(e){e.target===S&&Qe(S)})),o("iOnlineClose").addEventListener("click",(function(){Qe(M)})),M.addEventListener("click",(function(e){e.target===M&&Qe(M)})),o("bt_country").addEventListener("click",(function(){Me(T)})),T.addEventListener("click",(function(e){e.target===T&&Qe(T)})),Q.addEventListener("click",(function(e){e.target===Q&&Ye()})),O.addEventListener("click",(function(e){e.target===O&&Ye()})),o("bt_play").addEventListener("click",(function(){L="2player",o("P1icon").src=b?P.src:"Images/player.svg",h=v?D.value:document.webL10n.get("lb_player1"),Ce(U),u&&U.classList.add(u.split(" ")[1]),Ce(H),w=document.webL10n.get("lb_player2"),o("P1name").innerHTML=h,o("P2name").innerHTML=w,o("P2icon").src="Images/player.svg",De(),Ne(),Be=!1,_.classList.remove("swipe-out-right"),I.classList.remove("swipe-in-left"),_.classList.add("swipe-out"),I.classList.add("swipe-in")})),o("bt_online").addEventListener("click",(function(){Me(M),o("bt_online").disabled=!0,pe=io.connect("https://grrd.a2hosted.com:49152",{forceNew:!0}),pe.heartbeatTimeout=2e4,pe.on("connect",(function(){})),pe.on("startgame",(function(e){ye=e,he=0,we=0,ye.id!==Le&&(f=b?P.src:null,pe.emit("usersend",{to:ye.opponent,name:D.value,pic:f,country:u,win:re,loose:ce}),Le=ye.id,Be=!1,null!==L&&(_.classList.remove("swipe-out"),I.classList.remove("swipe-in"),_.classList.add("swipe-out-right"),I.classList.add("swipe-in-left")),i=!1,Pe(),be=0,Y=0,ve=[0,0],L="online",De(),Ne(),"0"===ye.role?(o("P1icon").src=b?P.src:"Images/player.svg",h=v?D.value:document.webL10n.get("lb_player1"),Ce(U),u&&U.classList.add(u.split(" ")[1]),Ce(H),o("P2icon").src="Images/online.svg",w=document.webL10n.get("bt_online")):(Ce(U),o("P1icon").src="Images/online.svg",h=document.webL10n.get("bt_online"),o("P2icon").src=b?P.src:"Images/player.svg",w=v?D.value:document.webL10n.get("lb_player1"),Ce(H),u&&H.classList.add(u.split(" ")[1])),o("P1name").innerHTML=h,o("P2name").innerHTML=w,_.classList.remove("swipe-out-right"),I.classList.remove("swipe-in-left"),_.classList.add("swipe-out"),I.classList.add("swipe-in"),Qe(M))})),pe.on("playget",(function(e){0===e.round&&ke>6&&et(),ke===e.round&&_e!==e.round&&(_e=e.round,Se=!0,je(e.col))})),pe.on("userget",(function(e){he=parseInt(e.win),we=parseInt(e.loose),se=Math.max(re,ce,he,we,1),"0"===ye.role?(null!==e.pic&&(o("P2icon").src=e.pic),e.name.length>0&&(w=e.name,o("P2name").innerHTML=w),Ce(H),e.country&&H.classList.add(e.country.split(" ")[1])):(null!==e.pic&&(o("P1icon").src=e.pic),e.name.length>0&&(h=e.name,o("P1name").innerHTML=h),Ce(U),e.country&&U.classList.add(e.country.split(" ")[1])),Ne()})),pe.on("quit",(function(){ye.id!==Ee&&"online"===L&&(Ee=ye.id,Be=!0,Me(O))}))})),o("bt_easy").addEventListener("click",(function(){L="easy",We()})),o("bt_med").addEventListener("click",(function(){L="medium",We()})),o("bt_hard").addEventListener("click",(function(){L="hard",We()})),Array.from(document.getElementsByClassName("back")).forEach((function(e){e.addEventListener("click",(function(){Ye()}))})),o("again").addEventListener("click",(function(){ke>1&&et(),Qe(Q),"2player"!==L&&"online"!==L&&1===Y&&$e()})),o("bt_img").addEventListener("click",(function(){o("b_image_input").click()})),o("bt_reset").addEventListener("click",(function(){Te&&(localStorage.removeItem("easy_start"),localStorage.removeItem("easy_win"),localStorage.removeItem("easy_loose"),localStorage.removeItem("easy_draw"),localStorage.removeItem("medium_start"),localStorage.removeItem("medium_win"),localStorage.removeItem("medium_loose"),localStorage.removeItem("medium_draw"),localStorage.removeItem("hard_start"),localStorage.removeItem("hard_win"),localStorage.removeItem("hard_loose"),localStorage.removeItem("hard_draw"),localStorage.removeItem("online_Start"),localStorage.removeItem("online_win"),localStorage.removeItem("online_loose"),localStorage.removeItem("online_draw"),localStorage.removeItem("online_left"),Re())})),D.onchange=function(){var e;""!==(e=this.value).replace(/\s+/g,"")?(Te&&localStorage.setItem("s_name",e),v=!0):(Te&&localStorage.removeItem("s_name"),v=!1)},C.onchange=function(){ot(this.value.toLowerCase())},C.addEventListener("keyup",(function(e){ot(this.value.toLowerCase())})),e=0;e<l.length;e+=1)s[e]=document.getElementById(l[e]),r[e]=s[e].getContext("2d"),function(e){s[e].addEventListener("click",(function(){Ze(e)})),s[e].addEventListener("mouseover",(function(){Ke(e)})),s[e].addEventListener("mouseout",(function(){Xe(e)})),s[e].addEventListener("focus",(function(){Ke(e)})),s[e].addEventListener("blur",(function(){Xe(e)}))}(e);R.childNodes.forEach((function(e){e.addEventListener("click",(function(){u=this.className,localStorage.setItem("s_country",this.className),x.innerHTML=this.innerHTML,x.classList=this.classList,Qe(T),C.value="",ot("")})),e.tabIndex=0})),document.getElementById("b_image_input").addEventListener("change",nt,!1),xe()},window.addEventListener("resize",(function(){xe()})),document.webL10n.ready((function(){F=function(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");let t=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(window.location.href);return null!==t&&t[1]}("lang"),a=!0,F&&F!==document.webL10n.getLanguage()&&(document.webL10n.setLanguage(F),a=!1)})),document.addEventListener("localized",(function(){a&&(document.documentElement.lang=document.webL10n.getLanguage().substr(0,2),document.querySelector("meta[name='description']").setAttribute("content",document.webL10n.get("lb_desc")),document.querySelector("link[rel='manifest']").href="Manifest/appmanifest_"+document.webL10n.getLanguage().substr(0,2)+".json",document.querySelector("link[rel='canonical']").href="https://grrd01.github.io/4inaRow/?lang="+document.webL10n.getLanguage().substr(0,2),Re(),Array.from(R.getElementsByTagName("LI")).sort(((e,t)=>e.textContent.localeCompare(t.textContent))).forEach((e=>R.appendChild(e)))),a=!0}))}();
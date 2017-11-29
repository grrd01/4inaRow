/*
* grrd's 4 in a Row
* Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
* Licensed under the MPL License
*/
!function(){"use strict";function a(a,b,c,d){M[b].beginPath(),M[b].arc(fa/2,a,fa/2*.85,0,2*Math.PI,!1),M[b].fillStyle=c,M[b].fill(),M[b].lineWidth=fa/20,M[b].strokeStyle=d,M[b].stroke()}function b(){var b,c,d;H=$(window).height(),I=$(window).width(),H>I?(fa=Math.min((I-50)/7,(H-140)/6),ga=Math.max(6*fa*.85,H-190),Ea.attr("style","width:100%;"),$(".li_port").attr("style","height:"+(H-I/3-130)/7+"px;"),$(".li_pad").attr("style","padding-top:"+(H-I/3-270)/14+"px;"),$("#page_landscape").attr("style","display:none;"),$("#page_portrait").attr("style","display:inline;"),$("#indicator_landscape_l").attr("style","display:none;"),$("#indicator_landscape_r").attr("style","display:none;"),$("#indicator_portrait").attr("style","display:block;"),$("#popupDialog_landscape").attr("style","display:none;"),$("#popupDialog_portrait").attr("style","display:block;"),$("#popupSettings_portrait").attr("style","display:block;"),$("#popupSettings_landscape").attr("style","display:none;"),$("#popupSettings_col_b").appendTo("#popupSettings_portrait"),$("#printMessage").attr("style","display:block;")):(fa=Math.min((I-140-60)/7,(H-20)/6),ga=Math.max(6*fa*.85,H-95),Ea.attr("style","width:"+.6*I+"px;"),$("#blank_space").attr("style","height:"+(H/4-I/20)+"px;"),$("#page_landscape").attr("style","display:inline;"),$("#page_portrait").attr("style","display:none;"),$("#indicator_landscape_l").attr("style","display:inline;"),$("#indicator_landscape_r").attr("style","display:inline;"),$("#indicator_portrait").attr("style","display:none;"),$("#popupDialog_landscape").attr("style","display:block;"),$("#popupDialog_portrait").attr("style","display:none;"),$("#popupSettings_portrait").attr("style","display:none;"),$("#popupSettings_landscape").attr("style","display:block;"),$("#popupSettings_col_b").appendTo("#popupSettings_landscape_b"),$("#printMessage").attr("style","display:inline;"));var e=Math.max((H-I/3)/7,0);for($(".a_land").attr("style","width:"+(I/5-8)+"px;padding-bottom:"+e/2+"px;"),$(".img_land").attr("style","padding-top:"+e+"px;padding-bottom:"+e/2+"px;width: 100%;min-width: 40px;max-width: 108px;"),b=0;b<K.length;b+=1)document.getElementById(K[b]).width=fa,document.getElementById(K[b]).height=ga;for(c=0;c<N[0].length&&void 0!==M[c];c+=1)for(b=0;b<N.length;b+=1)d=M[c].createLinearGradient(0,.9*(N.length-b-1)*fa,.7*fa,.9*(N.length-b-1)*fa+.7*fa),d.addColorStop(0,"black"),d.addColorStop(1,"grey"),M[c].beginPath(),M[c].arc(fa/2,(N.length-b-.5)*fa*.85,fa/2*.7,0,2*Math.PI,!1),M[c].lineWidth=fa/10,M[c].strokeStyle=d,M[c].stroke();for(c=0;c<N[0].length&&void 0!==M[c];c+=1){for(M[c].save(),M[c].beginPath(),b=0;b<N.length;b+=1)M[c].arc(fa/2,(N.length-b-.5)*fa*.85,fa/2*.7,0,2*Math.PI,!1);M[c].clip(),M[c].clearRect(0,0,fa,ga)}for(b=0;b<N.length;b+=1)for(c=0;c<N[b].length;c+=1)void 0!==N[b][c]&&a((N.length-b-.5)*fa*.85,c,Ka[N[b][c]],La[N[b][c]]);J&&(ea=ea/da*(N.length-Y-.5)*fa*.85,da=(N.length-Y-.5)*fa*.85)}function c(){var a,c;for(Ua=0,Ta=null,a=0;a<N.length;a+=1)for(c=0;c<N[a].length;c+=1)N[a][c]=void 0,0===a&&M[c].clearRect(0,0,fa,ga);b()}function d(){$(".P1light").attr("src",Oa[Na]),$(".P2light").attr("src",Pa[1-Na])}function e(){var a,b;Xa?(a=parseInt(localStorage.getItem(ya+"_win")||0),b=parseInt(localStorage.getItem(ya+"_loose")||0)):(a=0,b=0),"online"===ya?(ha=Math.max(a+b,qa+ra,1),$(".P"+(1+parseInt(ta.role))+".win").width(100/ha*a+"%"),$(".P"+(1+parseInt(ta.role))+".loose").width(100/ha*b+"%"),$(".P"+(2-parseInt(ta.role))+".win").width(100/ha*qa+"%"),$(".P"+(2-parseInt(ta.role))+".loose").width(100/ha*ra+"%")):("2player"===ya&&(a=Ra[0],b=Ra[1]),ha=Math.max(a+b,1),$(".P1.win").width(100/ha*a+"%"),$(".P1.loose").width(100/ha*b+"%"),$(".P2.win").width(100/ha*b+"%"),$(".P2.loose").width(100/ha*a+"%"))}function f(a){var b,c;Xa&&(ya&&a&&(b=ya+"_"+a,c=parseInt(localStorage.getItem(b)||0)+1,localStorage.setItem(b,c)),ka=localStorage.getItem("easy_win")||0,la=localStorage.getItem("easy_loose")||0,ma=localStorage.getItem("medium_win")||0,na=localStorage.getItem("medium_loose")||0,oa=localStorage.getItem("hard_win")||0,pa=localStorage.getItem("hard_loose")||0,ia=localStorage.getItem("online_win")||0,ja=localStorage.getItem("online_loose")||0,ha=Math.max(ka,la,ma,na,oa,pa,ia,ja,1),document.getElementById("easy_win").innerHTML=document.webL10n.get("lb_won")+" "+ka,document.getElementById("easy_loose").innerHTML=document.webL10n.get("lb_lost")+" "+la,document.getElementById("medium_win").innerHTML=document.webL10n.get("lb_won")+" "+ma,document.getElementById("medium_loose").innerHTML=document.webL10n.get("lb_lost")+" "+na,document.getElementById("hard_win").innerHTML=document.webL10n.get("lb_won")+" "+oa,document.getElementById("hard_loose").innerHTML=document.webL10n.get("lb_lost")+" "+pa,document.getElementById("online_win").innerHTML=document.webL10n.get("lb_won")+" "+ia,document.getElementById("online_loose").innerHTML=document.webL10n.get("lb_lost")+" "+ja,document.getElementById("easy_win").style.width=100/ha*ka+"%",document.getElementById("easy_loose").style.width=100/ha*la+"%",document.getElementById("medium_win").style.width=100/ha*ma+"%",document.getElementById("medium_loose").style.width=100/ha*na+"%",document.getElementById("hard_win").style.width=100/ha*oa+"%",document.getElementById("hard_loose").style.width=100/ha*pa+"%",document.getElementById("online_win").style.width=100/ha*ia+"%",document.getElementById("online_loose").style.width=100/ha*ja+"%")}function g(){Xa&&(localStorage.removeItem("easy_start"),localStorage.removeItem("easy_win"),localStorage.removeItem("easy_loose"),localStorage.removeItem("easy_draw"),localStorage.removeItem("medium_start"),localStorage.removeItem("medium_win"),localStorage.removeItem("medium_loose"),localStorage.removeItem("medium_draw"),localStorage.removeItem("hard_start"),localStorage.removeItem("hard_win"),localStorage.removeItem("hard_loose"),localStorage.removeItem("hard_draw"),localStorage.removeItem("online_Start"),localStorage.removeItem("online_win"),localStorage.removeItem("online_loose"),localStorage.removeItem("online_draw"),localStorage.removeItem("online_left"),f())}function h(){ya="2player",Aa?$(".P1icon").attr("src",Ca.attr("src")):$(".P1icon").attr("src","Images/player.svg"),U=Ba?Da.val():document.webL10n.get("lb_player1"),S?($("p.P1country").html(document.getElementById("l_country").getElementsByClassName(S)[0].innerHTML),$(".P1country").attr("class","P1country "+S),$("div.P1country").addClass("flag_left")):($("p.P1country").html(" "),$(".P1country").attr("class","P1country"),$("div.P1country").addClass("flag_left")),V=document.webL10n.get("lb_player2"),$(".P1name").html(U),$(".P2name").html(V),$(".P2icon").attr("src","Images/player.svg"),$(".P2country").attr("class","P2country"),$("p.P2country").html(" "),$("div.P2country").addClass("flag_right"),d(),e(),Va=!1,$.mobile.changePage("#game",{transition:"slide"})}function i(a,b){Va||(b+2e3>Date.now()&&J?window.requestAnimFrame(function(){i(a,b)}):(Qa+=1,$("#printMessage").html(a),1===Qa?$("#printGames").html(Qa+" "+document.webL10n.get("lb_game")):$("#printGames").html(Qa+" "+document.webL10n.get("lb_games")),$("#printScore1a").html(U),$("#printScore2a").html(V),$("#printScore1b").html(Ra[0]),$("#printScore2b").html(Ra[1]),$.mobile.changePage("#popupDialog",{transition:"pop",role:"dialog"}),c(),Na=Qa%2!==0?1:0,d(),J=!1))}function j(b,c,d,e){var f;if(!Va)if(6>d&&e+250<Date.now()&&J){for(d+=1,e=Date.now(),f=0;4>f;f+=1)d%2!==0?a((N.length-b[f]-.5)*fa*.85,c[f],Ma[Na],"white"):a((N.length-b[f]-.5)*fa*.85,c[f],Ka[Na],"white");window.requestAnimFrame(function(){j(b,c,d,e)})}else 6>d&&J&&window.requestAnimFrame(function(){j(b,c,d,e)})}function k(){J=!0;var a=wa.slice(),b=xa.slice();j(a,b,0,Date.now())}function l(a,b,c,d,e,f){var g;if(a+3*c<N.length&&b+3*d<N[a].length&&a+3*c>=0&&b+3*d>=0)for(g=0;4>g;g+=1)N[a+g*c][b+g*d]===e?(wa[g]=a+g*c,xa[g]=b+g*d,3===g&&(aa=!0,f&&k(),g=5)):g=5}function m(a,b){for(aa=!1,Y=0;Y<N.length;Y+=1)for(X=0;X<N[Y].length;X+=1)l(Y,X,1,0,a,b),l(Y,X,0,1,a,b),l(Y,X,1,1,a,b),l(Y,X,1,-1,a,b);for(ba=!1,X=0;X<N[0].length;X+=1)void 0===N[N.length-1][X]&&(ba=!0)}function n(b,c,g){var h,j,k,l;J&&(h=new Date,j=h.getTime(),k=j-b,l=ga*k/1e3,da>c?(c=Math.min(da,c+l),b=j,M[g].clearRect(0,0,fa,da+fa/2*.85),a(c,g,Ka[Na],La[Na]),window.requestAnimFrame(function(){n(b,c,g)})):(za&&document.getElementById("click_sound").play(),J=!1,m(Na,!0),aa?(Ra[Na]=Ra[Na]+1,("easy"===ya||"medium"===ya||"hard"===ya)&&f(0===Na?"win":"loose"),"online"===ya&&(0===Na&&"0"===ta.role||1===Na&&"1"===ta.role?(ra+=1,f("win")):(qa+=1,f("loose"))),e(),za&&document.getElementById("ding_sound").play(),0===Na?i(U+" "+document.webL10n.get("lb_win"),Date.now()):i(V+" "+document.webL10n.get("lb_win"),Date.now())):ba?(Na=1-Na,d(),"2player"!==ya&&"online"!==ya&&1===Na&&z()):(f("draw"),i(document.webL10n.get("lb_draw"),Date.now()))))}function o(a){var b,c;if(!(Wa&&(Wa=!1,"online"===ya&&(0===Na&&"0"===ta.role||1===Na&&"1"===ta.role))||J))for(Ua+=1,Y=0,da=0;Y<N.length&&0===da;){if(void 0===N[Y][a]){J=!0,N[Y][a]=Na,da=(N.length-Y-.5)*fa*.85,b=new Date,c=b.getTime(),ea=-30,n(c,ea,a);break}Y+=1}}function p(){$.mobile.changePage("#popupOnline",{transition:"pop",role:"dialog"}),$(".bt_online").addClass("ui-disabled"),sa=io.connect("https://grrd.a2hosted.com:49152",{forceNew:!0}),sa.heartbeatTimeout=2e4,sa.on("connect",function(){}),sa.on("startgame",function(a){ta=a,qa=0,ra=0,ta.id!==ua&&(T=Aa?Ca.attr("src"):null,sa.emit("usersend",{to:ta.opponent,name:Da.val(),pic:T,country:S,win:ia,loose:ja}),ua=ta.id,Va=!1,null!==ya&&$.mobile.changePage("#title",{transition:"slide",reverse:!0}),J=!1,c(),Qa=0,Na=0,Ra=[0,0],ya="online",d(),e(),"0"===ta.role?(Aa?$(".P1icon").attr("src",Ca.attr("src")):$(".P1icon").attr("src","Images/player.svg"),U=Ba?Da.val():document.webL10n.get("lb_player1"),S?($("p.P1country").html(document.getElementById("l_country").getElementsByClassName(S)[0].innerHTML),$(".P1country").attr("class","P1country "+S),$("div.P1country").addClass("flag_left")):($("p.P1country").html(" "),$(".P1country").attr("class","P1country"),$("div.P1country").addClass("flag_left")),$(".P2icon").attr("src","Images/online.svg"),V=document.webL10n.get("bt_online")):($(".P1icon").attr("src","Images/online.svg"),U=document.webL10n.get("bt_online"),Aa?$(".P2icon").attr("src",Ca.attr("src")):$(".P2icon").attr("src","Images/player.svg"),V=Ba?Da.val():document.webL10n.get("lb_player1"),S?($("p.P2country").html(document.getElementById("l_country").getElementsByClassName(S)[0].innerHTML),$(".P2country").attr("class","P2country "+S),$("div.P2country").addClass("flag_right")):($("p.P2country").html(" "),$(".P2country").attr("class","P2country"),$("div.P2country").addClass("flag_right"))),$(".P1name").html(U),$(".P2name").html(V),$.mobile.changePage("#game",{transition:"slide"}))}),sa.on("playget",function(a){Ua===a.round&&Ta!==a.round&&(Ta=a.round,Wa=!0,o(a.col))}),sa.on("userget",function(a){qa=parseInt(a.win),ra=parseInt(a.loose),ha=Math.max(ia,ja,qa,ra,1),"0"===ta.role?(null!==a.pic&&$(".P2icon").attr("src",a.pic),a.name.length>0&&(V=a.name,$(".P2name").html(V)),a.country?($("p.P2country").html(document.getElementById("l_country").getElementsByClassName(a.country)[0].innerHTML),$(".P2country").attr("class","P2country "+a.country),$("div.P2country").addClass("flag_right")):($("p.P2country").html(" "),$(".P2country").attr("class","P2country"),$("div.P2country").addClass("flag_right"))):(null!==a.pic&&$(".P1icon").attr("src",a.pic),a.name.length>0&&(U=a.name,$(".P1name").html(U)),a.country?($("p.P1country").html(document.getElementById("l_country").getElementsByClassName(a.country)[0].innerHTML),$(".P1country").attr("class","P1country "+a.country),$("div.P1country").addClass("flag_left")):($("p.P1country").html(" "),$(".P1country").attr("class","P1country"),$("div.P1country").addClass("flag_left"))),e()}),sa.on("quit",function(){ta.id!==va&&(va=ta.id,Va=!0,$.mobile.changePage("#popupLeft",{transition:"pop",role:"dialog"}))})}function q(){Aa?$(".P1icon").attr("src",Ca.attr("src")):$(".P1icon").attr("src","Images/player.svg"),U=Ba?Da.val():document.webL10n.get("lb_player"),S?($("p.P1country").html(document.getElementById("l_country").getElementsByClassName(S)[0].innerHTML),$(".P1country").attr("class","P1country "+S),$("div.P1country").addClass("flag_left")):($("p.P1country").html(" "),$(".P1country").attr("class","P1country"),$("div.P1country").addClass("flag_left")),V=document.webL10n.get("lb_computer"),$(".P1name").html(U),$(".P2name").html(V),$(".P2icon").attr("src","Images/computer.svg"),$("p.P2country").html(" "),$(".P2country").attr("class","P2country"),$("div.P2country").addClass("flag_right"),e(),d(),Va=!1,$.mobile.changePage("#game",{transition:"slide"})}function r(){ya="easy",q()}function s(){ya="medium",q()}function t(){ya="hard",q()}function u(){"online"===ya&&(sa.disconnect(),$(".bt_online").removeClass("ui-disabled")),Va=!0,b(),$.mobile.changePage("#title",{transition:"slide",reverse:!0}),J=!1,c(),Qa=0,Na=0,Ra=[0,0],ya=null}function v(){za="on"===Fa.val(),Xa&&localStorage.setItem("s_sound",Fa.val()),b(),$.mobile.changePage("#title",{transition:"pop",reverse:!0})}function w(a){"online"===ya?1===Na&&"0"===ta.role||0===Na&&"1"===ta.role||(sa.emit("playsend",{to:ta.opponent,col:a,round:Ua}),o(a)):o(a)}function x(a,b,c){var d,e;for(O=0,P=0,Q=0,d=c-3;c>=d;d+=1)if(d>=0&&d+3<N[0].length){for(Sa=!0,R=0,e=0;3>=e;e+=1)void 0!==N[b][d+e]&&(N[b][d+e]===a?R+=1:Sa=!1);Sa&&(O+=1,P+=R,R>Q&&(Q=R))}for(d=b+3;d>=b;d-=1)if(d-3>=0&&d<N.length){for(Sa=!0,R=0,e=0;3>=e;e+=1)void 0!==N[d-e][c]&&(N[d-e][c]===a?R+=1:Sa=!1);Sa&&(O+=1,P+=R,R>Q&&(Q=R))}for(d=3;d>=0;d-=1)if(c-d>=0&&c-d+3<N[0].length&&b-d>=0&&b-d+3<N.length){for(Sa=!0,R=0,e=0;3>=e;e+=1)void 0!==N[b-d+e][c-d+e]&&(N[b-d+e][c-d+e]===a?R+=1:Sa=!1);Sa&&(O+=1,P+=R,R>Q&&(Q=R))}for(d=3;d>=0;d-=1)if(c-d>=0&&c-d+3<N[0].length&&b+d<N.length&&b+d-3>=0){for(Sa=!0,R=0,e=0;3>=e;e+=1)void 0!==N[b+d-e][c-d+e]&&(N[b+d-e][c-d+e]===a?R+=1:Sa=!1);Sa&&(O+=1,P+=R,R>Q&&(Q=R))}}function y(a,b){return a-b}function z(){var a;for(Ia=[],ca=!1,Z=0;Z<N[0].length;Z+=1)for(Ia[Z]=0,_=0;_<N.length;_+=1)if(void 0===N[_][Z]){N[_][Z]=Na,x(Na,_,Z),Ia[Z]=1e4*Q+100*O+P+2,N[_][Z]=void 0;break}for(Ja[0]=0,a=0;a<Ia.length;a+=1)Ia[a]>Ja[0]&&(Ja[0]=Ia[a]);for(Na=1-Na,Z=0;Z<N[0].length;Z+=1)for(_=0;_<N.length;_+=1)if(void 0===N[_][Z]){N[_][Z]=Na,x(Na,_,Z),1e4*Q+100*O+P+2>Ja[0]&&(Ia[Z]=1e4*Q+100*O+P+2),N[_][Z]=void 0;break}for(Na=1-Na,Na=1-Na,Z=0;Z<N[0].length;Z+=1){for(_=0;_<N.length-1;_+=1)if(void 0===N[_][Z]){N[_+1][Z]=Na,m(Na,ca),N[_+1][Z]=void 0;break}aa&&(Ia[Z]=1,aa=!1)}for(Na=1-Na,Na=1-Na,Z=0;Z<N[0].length;Z+=1){for(_=0;_<N.length;_+=1)if(void 0===N[_][Z]){N[_][Z]=Na,m(Na,ca),N[_][Z]=void 0;break}aa&&(Ia[Z]=5e4,aa=!1)}for(Na=1-Na,Z=0;Z<N[0].length;Z+=1){for(_=0;_<N.length;_+=1)if(void 0===N[_][Z]){N[_][Z]=Na,m(Na,ca),N[_][Z]=void 0;break}aa&&(Ia[Z]=6e4,aa=!1)}if(Ja=Ia.slice(),Ja.sort(y),Ja.reverse(),X=Math.round(6*Math.random()),"hard"===ya)for(;Ia[X]!==Ja[0];)X=Math.round(6*Math.random());if("medium"===ya)for(;Ia[X]<Ja[1]||0===Ia[X];)X=Math.round(6*Math.random());if("easy"===ya)for(;Ia[X]<Ja[2]||0===Ia[X];)X=Math.round(6*Math.random());o(X)}function A(){$.mobile.changePage("#game",{transition:"pop",reverse:!0}),"2player"!==ya&&"online"!==ya&&1===Na&&z()}function B(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null!==d?d[1]:!1}function C(a){var b=new FileReader,c=document.createElement("canvas"),d=null,e=new Image,f=67,g=71,h={Orientation:void 0};c.id="hiddenCanvas",c.width=f,c.height=g,c.style.visibility="hidden",document.body.appendChild(c),d=c.getContext("2d"),a.target.files[0].type.match("image.*")?b.readAsDataURL(a.target.files[0]):alert("File is not an image"),b.onload=function(){var a=this.result;h=EXIF.readFromBinaryFile(new BinaryFile(atob(a.split(",")[1]))),e.src=a},e.onload=function(){var a=0,b=0;0===this.width||0===this.height?alert("Image is empty"):((5===h.Orientation||6===h.Orientation)&&(d.rotate(90*Math.PI/180),b=-1*f,f=71,g=67),(3===h.Orientation||4===h.Orientation)&&(d.rotate(180*Math.PI/180),b=-1*f-4,a=-1*g+4),(7===h.Orientation||8===h.Orientation)&&(d.rotate(270*Math.PI/180),a=-1*g,f=71,g=67),d.clearRect(0,0,f,g),d.drawImage(e,0,0,this.width,this.height,a,b,f,g),Ca.attr("src",c.toDataURL("image/jpeg")),$("#inputImage_l").attr("src",c.toDataURL("image/jpeg")),Xa&&localStorage.setItem("s_image",c.toDataURL("image/jpeg")),Aa=!0)}}function D(a){""!==a.replace(/\s+/g,"")?(Xa&&localStorage.setItem("s_name",a),Ba=!0):(Xa&&localStorage.removeItem("s_name"),Ba=!1)}function E(a){var b=Ga.find("li");b.each(function(b,c){var d=$(c);d[0].innerHTML.toLowerCase().indexOf(a)>-1||0===a.length?d.show():d.hide()})}function F(){$("#b_image_input").click()}window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}();var G,H,I,J=!1,K=["col0","col1","col2","col3","col4","col5","col6"],L=[],M=[],N=[];for(G=0;6>G;G+=1)N[G]=[],N[G][6]=void 0;var O,P,Q,R,S,T,U,V,W,X,Y,Z,_,aa,ba,ca,da,ea,fa,ga,ha,ia,ja,ka,la,ma,na,oa,pa,qa,ra,sa,ta,ua,va,wa=[],xa=[],ya=null,za=!0,Aa=!1,Ba=!1,Ca=$("#inputImage"),Da=$("#inputName"),Ea=$("#img_title"),Fa=$("#b_sound"),Ga=$("#l_country"),Ha=$("#txt_search"),Ia=[],Ja=[],Ka=["#ff0080","#6969EE"],La=["#D6016B","#5A5ACE"],Ma=["#FD6BB4","#9393EF"],Na=0,Oa=["Images/red_on.png","Images/red_off.png"],Pa=["Images/blue_on.png","Images/blue_off.png"],Qa=0,Ra=[0,0],Sa=Boolean(!1),Ta=null,Ua=0,Va=!1,Wa=!1,Xa=function(){var a="modernizr";try{return localStorage.setItem(a,a),localStorage.removeItem(a),!0}catch(b){return!1}}();"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(a){console.log("ServiceWorker registration successful with scope: ",a.scope)},function(a){console.log("ServiceWorker registration failed: ",a)})}),navigator.onLine||$(".bt_online").addClass("ui-disabled"),window.onload=function(){var a;if(Xa&&null!==localStorage.getItem("s_sound")?Fa.val(localStorage.getItem("s_sound")):Fa.val("on"),za="on"===Fa.val(),Xa&&null!==localStorage.getItem("s_image")&&(Ca.attr("src",localStorage.getItem("s_image")),$("#inputImage_l").attr("src",localStorage.getItem("s_image")),Aa=!0),Xa&&null!==localStorage.getItem("s_name")&&(Da.val(localStorage.getItem("s_name")),""!==localStorage.getItem("s_name").replace(/\s+/g,"")&&(Ba=!0)),Xa&&null!==localStorage.getItem("s_country")){$("#bt_country").empty(),S=localStorage.getItem("s_country");var c=document.getElementsByClassName(S);document.getElementById("bt_country").appendChild(c[0].cloneNode(!0))}for(W=B("theme"),$(".bt_play").click(function(a){h(),a.preventDefault()}),$(".bt_online").click(function(a){p(),a.preventDefault()}),$(".bt_easy").click(function(a){r(),a.preventDefault()}),$(".bt_med").click(function(a){s(),a.preventDefault()}),$(".bt_hard").click(function(a){t(),a.preventDefault()}),$(".back").click(function(a){u(),a.preventDefault()}),$(".again").click(function(a){A(),a.preventDefault()}),$(".bt_img").click(function(a){F(),a.preventDefault()}),$(".bt_close").click(function(a){v(),a.preventDefault()}),$("#bt_reset").click(function(a){g(),a.preventDefault()}),Da.change(function(){D(this.value)}),Ha.change(function(){E(this.value.toLowerCase())}),Ha.keyup(function(){E(this.value.toLowerCase())}),a=0;a<K.length;a+=1)L[a]=document.getElementById(K[a]),M[a]=L[a].getContext("2d"),function(a){L[a].addEventListener("click",function(){w(a)})}(a);Ga.children().click(function(){S=this.className,localStorage.setItem("s_country",this.className),$("#bt_country").empty(),document.getElementById("bt_country").appendChild(this.cloneNode(!0)),$("#popupCountry").popup("close"),Ha.val(""),E("")}),jQuery.preLoadImages(["Images/red_on.png","Images/red_off.png","Images/blue_on.png","Images/blue_off.png","Images/title2eng.png"]),document.getElementById("b_image_input").addEventListener("change",C,!1),$("#popupSettings_col_b").find("label").attr("style","display:inline;"),b(),Ea.delay(1500),Ea.fadeOut(1e3),Ea.queue(function(){W=B("theme"),W&&"mi"===W?Ea.attr("src","Images/title2_mi.png"):Ea.attr("src","Images/title2eng.png"),$(this).fadeIn(1e3),$(this).dequeue()})},$(window).resize(function(){("popupSettings"!==$.mobile.activePage.attr("id")||I!==$(window).width())&&b()}),function(a){var b,c,d=[];a.preLoadImages=function(a){var e=a.length-1;for(c=e;c>=0;c-=1)b=document.createElement("img"),b.src=a[c],d.push(b)}}(jQuery),document.webL10n.ready(function(){if(W=B("lang"),W&&W!==document.webL10n.getLanguage())return void document.webL10n.setLanguage(W);f();var a=Ga.find("li").get();a.sort(function(a,b){var c=$(a).text(),d=$(b).text();return d>c?-1:c>d?1:0}),$.each(a,function(a,b){Ga.append(b)})})}();
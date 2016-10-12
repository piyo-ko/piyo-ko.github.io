function decor_0(uL, uL_len, uR, uR_len) {
  var h=document.getElementById('left_col').clientHeight;
  var n=Math.floor(h*3/4/24);
  
  var t="";
  for (var i=0; i < n/uL_len; i++) {
    t+=uL;
  }
  document.getElementById('left_col').textContent=t;
  t="";
  for (var i=0; i < n/uR_len; i++) {
    t+=uR;
  }
  document.getElementById('right_col').textContent=t;
}

var decor=function () { decor_0("💚 🍎 💛 🍏 ", 4, "💜 🍏 💙 🍎 ", 4); };
window.onload=decor;

var rt;
window.addEventListener('resize', function () {
  if (rt) {
    clearTimeout(rt);
  }
  rt=setTimeout(decor, 400);
});

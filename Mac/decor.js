function decor_0(Lstr, Rstr, line_height) { // line_height is specified in point
  var h=document.getElementById('main').clientHeight; // in pixel
  // the number of characters to be written (cf. 3pt==4px)
  var n=Math.floor(h*3/4/line_height);
  var c=Lstr.split(' ');
  console.log("length of c: [" + c.length + "]");
  var t="";
  for (var i=0; i < n; i++) {
    t+= c[i%(c.length - 1)] + '<br>';
  }
  document.getElementById('left_col').innerHTML=t;

  c=Rstr.split(' ');
  console.log("length of c: [" + c.length + "]");
  t="";
  for (var i=0; i < n; i++) {
    t+= (c[i%(c.length - 1)] + '<br>');
  }
  document.getElementById('right_col').innerHTML=t;
}
var decor=function () { decor_0("💚 🍎 💛 🍏 ", "💜 🍏 💙 🍎 ", 30); };
window.onload=decor;

var rt;
window.addEventListener('resize', function () {
  if (rt) {
    clearTimeout(rt);
  }
  rt=setTimeout(decor, 800);
});

window.MathJax = {
  //$で囲む表記を使えるようにする
  tex2jax: {
    inlineMath: [ ['$','$'], ['\\(','\\)'] ],
    displayMath: [ ['$$','$$'], ['\\[','\\]'] ]
  },
  //別行だての数式を、中央揃えではなく、左から所定の大きさのインデントにする
  displayAlign: "left",
  displayIndent: "1ex",

  TeX: {
    Macros: { // マクロ定義
      disp: '\\displaystyle',
      deriv: ['\\frac{d#1}{d#2}', 2],     //微分
    }
  }
};

'use strict';

var counter = 0;

function gen_link() {
  const d8 = document.isbn.eight_digits.value.toString();
  if (d8.length != 8) { alert('8桁を入力してね'); return(false); }
  counter++;

  const cd = isbn10_check_digit(d8);
  let link_txt = '<a href="https://www.amazon.co.jp/dp/4' + d8 + cd +
    '/" target="_amzn">Amazon (' + counter + ')</a>\n' +
    '<a href="http://iss.ndl.go.jp/api/openurl?isbn=4' + d8 + cd +
    '" target="_ndl">NDL (' + counter + ')</a>';

  document.getElementById('link_test').innerHTML = link_txt;
  document.getElementById('link_list').textContent += (link_txt + "\n");
}

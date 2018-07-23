'use strict';

// dは、最初の "987-4-" を除く、真ん中の8桁。
// 13桁のISBNと10桁のISBNではチェックディジットが違うので計算せねばならない。
function isbn10_check_digit(d) {
  let sum = 4*10;
  for (let i=0; i<8; i++) {
    sum += parseInt(d.charAt(i)) * (9 - i);
  }
  const c = 11-(sum % 11);
  if (c == 10) { return('X'); }
  if (c == 11) { return('0'); }
  return(c);
}

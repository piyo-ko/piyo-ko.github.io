'use strict';

/*
このファイルは、CC0ライセンス (https://creativecommons.org/publicdomain/zero/1.0/deed.ja) のもとに提供します。
*/


function finish() {
  //入力値をカンマ区切りでつなげた文字列。最後に改行あり。
  const csv = get_csv_data();
  // 下記1行を音声発信の処理に置き換えるか、下記1行に加えて音声発信の処理を記述すれば良さそう。
  document.in.csv_data.value = csv;
}

function get_csv_data() {
  const input_fields = document.querySelectorAll('input,textarea');
  let csv = '';
  function append(val) {
    //なんちゃってエスケープなので要修正だろうと思うが、とりあえず。
    csv += (csv == '' ? '' : ',') + '"' + 
      val.toString().replace(/\n/g, '').replace(/\"/g, "''") + '"';
    return;
  }
  for (const field of input_fields) {
    if (field.tagName == 'TEXTAREA') {
      append(field.value);
      continue;
    }
    if (field.tagName == 'INPUT' && field.type == "radio") {
      if (!field.checked) { continue; }
      append(field.value);
      continue;
    }
    if (field.tagName == 'INPUT' && field.type == "checkbox") {
      append(field.checked ? '有' : '無');
      continue;
    }
    if (field.tagName == 'INPUT' && 
        ['text', 'number', 'date', 'time', 'email', 'tel'].includes(field.type)) {
      append(field.value);
      continue;
    }
    console.log('error');
    console.log(`  tagName: ${field.tagName}`);
    console.log(`  type: ${field.type}`);
    console.log(`  value: ${field.value}`);
  }

  csv += '\n';
  return(csv);
}

function clear_csv_data() { document.in.csv_data.value = ''; }

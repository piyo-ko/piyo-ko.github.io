'use strict';

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

  document.in.csv_data.value = csv + '\n';
}

function clear_csv_data() { document.in.csv_data.value = ''; }

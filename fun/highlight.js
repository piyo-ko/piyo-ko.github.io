'use strict';

function highlight() {

  const orig_txt = document.cn_txt.orig_txt.value;
  const orig_sentences = orig_txt.replace(/\n+/g, '\n<br>\n').split('。');

  reset_personal_names();
  const specified_names = document.cn_txt.personal_names.value.split('\n');
  specified_names.map(n => { if (n !== '') { personal_names.push(n); }});

  let result_html = '';

  orig_sentences.map(sent => {
    if (sent === '\n' || sent === '' || sent === '\n<br>\n') { return; }
    const L = sent.length, class_names = new Array(L);
    for (let i = 0; i < L; i++) { class_names[i] = 'none'; }
    cls_kw_pairs.map(cls_kw_pair => {
      const cur_class = cls_kw_pair[0];
      cls_kw_pair[1].map(cur_keyword => {
        const regEx = new RegExp(cur_keyword, 'g');
        let resArr, j;
        while ((resArr = regEx.exec(sent)) !== null) {
          for (j = resArr.index; j < regEx.lastIndex; j++) {
            class_names[j] = cur_class;
          }
        }
      });
    });
    let prev_char_class = 'none';
    for (let i = 0; i < L; i++) {
      if (class_names[i] !== prev_char_class) {
        if (0 < i && prev_char_class !== 'none') {
          result_html += '</span>';
        }
        if (class_names[i] !== 'none') { 
          result_html += '<span class="' + class_names[i] + '">';
        }
      }
      result_html += sent[i];
      prev_char_class = class_names[i];
    }
    if (class_names[L-1] !== 'none') { result_html += '</span>'; }
    result_html += '。';
  });

  document.getElementById('hilighted_text').innerHTML = result_html;
  document.getElementById('output_html').textContent = result_html;

}

function clear_all() {
  document.cn_txt.reset();
  document.getElementById('hilighted_text').textContent = '';
  document.getElementById('output_html').textContent = '';
  reset_personal_names();
}

function reset_personal_names() {
  while (personal_names.pop() !== undefined) {};
}

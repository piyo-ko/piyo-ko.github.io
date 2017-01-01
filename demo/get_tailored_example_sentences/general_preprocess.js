"use strict";

/****
* Define global Objects DAT and COM_FUNC.
* 大域オブジェクトの DAT と COM_FUNC を定義する。
****/


// a global Object to hold IDs and sentences read from a specified file,
// as well as holding auxiliary data.
//
// 指定されたファイルから読み込んだ ID と文を、補助的データとともに保持する
// ための、大域オブジェクト。
var DAT = DAT || {
  // sentence IDs, each with a <span> tag and a tab character
  // 文ID。それぞれが、<span> タグとタブ文字を含んでいる。
  id_tags : [],

  // sentences included in a specified file
  // 指定されたファイルに含まれる文。
  sentences : [],

  // is_selected[i] is true if sentences[i] has been selected, by a filter, 
  // as an element of a potential base subset which may be used as a base of
  // a narrowing down operation to be done by another filter.
  // 別のフィルタによる絞り込み操作のベースとして使われるかもしれない
  // 潜在的なベース部分集合の要素として、sentences[i] が、あるフィルタに
  // よって選択されている場合には、is_selected[i] が真となる。
  is_selected : [],

  // If type_of_base_subset as defined below is 'pattern_specified' and 
  // is_selected[i] is true, then displayed_sentences[i] is a string that
  // corresponds to sentences[i] and includes an <em> tag; otherwise,
  // displayed_sentences[i] is an empty string.  
  // 以下で定義される type_of_base_subset が 'pattern_specified' であり、かつ、
  // is_selected[i] が真ならば、displayed_sentences[i] は、sentences[i] に対応
  // していて <em> タグを含むような文字列である。それ以外の場合、
  // displayed_sentences[i] は空文字列である。
  displayed_sentences : [],

  // the type of the potential base subset ('none', 'length_limited', or 
  // 'pattern_specified')
  // 潜在的なベース部分集合の種類 ('none', 'length_limited', または
  // 'pattern_specified')
  type_of_base_subset: 'none',

  // Once the number of words/characters of sentences[i] has been counted, 
  // it will be recorded for the later use.
  // sentences[i] の単語数または文字数を一旦数えたら、後々のために、その数を
  // 記録しておく。
  num_of_words : [],
  num_of_chars : [],
  num_of_words_has_been_counted : false,
  num_of_chars_has_been_counted : false, 

  // UI language (English (default) or Japanese)
  // ユーザ・インタフェイスに使っている言語 (英語 (デフォルト) か日本語)
  ui_lang : 'en',

  // When a new file is specified to be read, reset_all() should be executed.
  // 新たなファイルが読み取り対象として指定されたら、reset_all() が実行される。
  reset_all : function () {
    this.id_tags = [];
    this.sentences = [];
    this.is_selected = [];
    this.displayed_sentences = [];
    this.type_of_base_subset = 'none';
    this.num_of_words = [];
    this.num_of_chars = [];
    this.num_of_words_has_been_counted = false;
    this.num_of_chars_has_been_counted = false;
    this.reset_base_subset();
  },

  // Reset the potential base subset.
  // 潜在的なベース (部分) 集合をリセットする。
  reset_base_subset : function() {
    this.type_of_base_subset = 'none';
    window.top.document.f.base_set.value = 'whole';
    var elem;
    elem = window.top.document.getElementById('use_whole_sentences');
    elem.setAttribute('checked', 'checked');
    elem = window.top.document.getElementById('use_specific_pattern');
    elem.setAttribute('disabled', 'disabled');
    elem = window.top.document.getElementById('use_length_limited_sentences');
    elem.setAttribute('disabled', 'disabled');
  }
};

// Create a quasi-namespace for general common functions,
// by using an Object named COM_FUNC.
// COM_FUNC という名前のオブジェクトを使って、共通の一般的関数のための
// 擬似的な名前空間を作る。
var COM_FUNC = COM_FUNC || {};

// Read a selected text file, which is in the tab-separated format.
// 選択されたテキストファイル (タブ区切り形式) を読み込む。
COM_FUNC.read_in = function() {
  var reader = new FileReader();
  reader.onload = COM_FUNC.txt_loaded;
  var input_file = window.top.document.getElementById("input_txt_file");
  reader.readAsText(input_file.files[0], "utf-8");
};

// This is called from COM_FUNC.read_in().
// Set the values in DAT, and display all the sentences.
// これは COM_FUNC.read_in() から呼ばれる。
// DAT 内の値を設定し、すべての文を表示する。
COM_FUNC.txt_loaded = function(e) {
  DAT.reset_all();
  var lines = e.target.result.split('\n');
  for (var i = 0, N = lines.length-1, str=""; i < N; i++) {
    var tmp=lines[i].split("\t");
    DAT.id_tags[i] = "<span class=\"tag\">" + tmp[0] + "</span>\t";
    DAT.sentences[i] = tmp[1];
    str += (DAT.id_tags[i] + DAT.sentences[i] + "\n");
  }
  window.top.document.getElementById("output_area").innerHTML=str;
  COM_FUNC.reset_counter(N);
};

// Re-set the text counter, which indicates the number of extracted sentences.
// 文のカウンタ (抽出された文の数を示す) を設定し直す。
COM_FUNC.reset_counter = function(c) {
  window.top.document.getElementById("sentence_counter").textContent = c;
};

// Set the font used for the example sentences, depending on 
// the language of them.  Note that filter_page.css defines some language-
// dependent fonts.
// 例文の言語に応じて、例文用のフォントを設定する。
// filter_page.css で言語ごとのフォントをいくつか定義していることに注意。
COM_FUNC.set_font = function(lang_name) {
  window.top.document.getElementById("output_area").lang = lang_name;
};

/*
*** POSSIBLE FILTERING OPERATIONS (A) through (F) ***

(A) The target is set to be the whole set of sentences and 
    the number of characters is constrained.
    Note that, after this operation, only one of (A), (B), and (C) (as "redo" 
    operations), and (D) (as "narrowing down" operation) is allowed.
(B) The target is set to be the whole set of sentences and 
    the number of words is constrained.
    Note that, after this operation, only one of (A), (B), and (C) (as "redo" 
    operations), and (D) (as "narrowing down" operation) is allowed.
(C) The target is set to be the whole set of sentences and 
    the sentences including a specific pattern are extracted.
    Note that, after this operation, only one of (A), (B), and (C) (as "redo" 
    operations), and (E) and (F) (as "narrowing down" operations) is allowed.
(D) The target is set to be the subset resulting from (A) or (B) and
    the sentences including a specific pattern are extracted from that subset.
    Note that, after this operation, only one of (A), (B), and (C) (as "redo" 
    operations from scratch), and (D) (as "re-narrowing down" operation 
    performed on the same base subset while specifying a different pattern)
    is allowed.
(E) The target is set to be the subset resulting from (C) and
    the number of characters is constrained.
    Note that, after this operation, only one of (A), (B), and (C) (as "redo" 
    operations from scratch), and (E) and (F) (as "re-narrowing down" 
    operations performed on the same base subset while specifying a different 
    range of the sentence length) is allowed.
    Strictly speaking, it is inappropriate to allow (F) in this case, but such 
    inappropriateness is tentatively overlooked.
(F) The target is set to be the subset resulting from (C) and
    the number of words is constrained.
    Note that, after this operation, only one of (A), (B), and (C) (as "redo" 
    operations from scratch), and (E) and (F) (as "re-narrowing down" 
    operations performed on the same base subset while specifying a different 
    range of the sentence length) is allowed.
    Strictly speaking, it is inappropriate to allow (E) in this case, but such 
    inappropriateness is tentatively overlooked.


*** 可能なフィルタリング操作 (A)〜(F) ***

(A) すべての文を対象に、文字数を制限する。
    これの実行後に可能なのは、「やり直し」である (A), (B), (C) か、
    「絞り込み」である (D) のうちのいずれか。
(B) すべての文を対象に、単語数を制限する。
    これの実行後に可能なのは、「やり直し」である (A), (B), (C) か、
    「絞り込み」である (D) のいずれか。
(C) すべての文を対象に、特定の表現を含むもののみを抽出する。
    これの実行後に可能なのは、「やり直し」である (A), (B), (C) か、
    「絞り込み」である (E), (F) のいずれか。
(D) (A)または(B)の結果を対象に、特定の表現を含むもののみを抽出する。
    これの実行後に可能なのは、「まったくのやり直し」である (A), (B), (C) か、
    「同じベース集合を使った、別の表現による絞り込みのやり直し」である (D) 
    のいずれか。
(E) (C)の結果を対象に、文字数を制限する。
    これの実行後に可能なのは、「まったくのやり直し」である (A), (B), (C) か、
   「同じベース集合を使った、長さによる絞り込みのやり直し」である (E), (F) 
    のいずれか。
    本当は (F) を許すのは変だが、今は見逃してやっている。
(F) (C)の結果を対象に、単語数を制限する。
    これの実行後に可能なのは、「まったくのやり直し」である (A), (B), (C) か、
    「同じベース集合を使った、長さによる絞り込みのやり直し」である (E), (F) 
    のいずれか。
    本当は (E) を許すのは変だが、今は見逃してやっている。

*/


// A somewhat general filter applicable to multiple languages.
// Constrain the length of sentences, which is counted by the number 
// of characters.
// This is suitable for Chinese or Japanese text, which are written 
// without whitespace characters between words.
// 複数の言語に適用可能な、割と一般的なフィルタ。
// 文の長さ (文字数で測られる) を制約する。
// これは、中国語や日本語のテキスト (語間に空白文字を置かずに書かれる) に
// 適している。
COM_FUNC.constrain_num_of_chars = function() {
  var base_type = window.top.document.f.base_set.value;
  var min_len=parseInt(window.top.document.f.min_chars.value);
  var max_len=parseInt(window.top.document.f.max_chars.value);
  var i, N, L, str, c, elem;
  N = DAT.sentences.length;
  // If the number of characters of each sentence has not been counted yet,
  // count and record it first.
  // 各文の文字数をまだ数えていなければ、まずは文字数を数えて、記録する。
  if (!DAT.num_of_chars_has_been_counted) {
    for (i = 0; i < N; i++) {
      DAT.num_of_chars[i] = DAT.sentences[i].length;
    }
    DAT.num_of_chars_has_been_counted = true;
  }
  //
  str = "";
  c = 0;
  // If the whole set of sentences is explicitly specified as the base, the new 
  // base subset will be the subset to be obtained by the current application
  // of this filter.
  // If a set of length-limited sentences are specified as the base, such a
  // designation is ignored and the new base subset will be the subset 
  // to be obtained by the current application of this filter.
  // もし、明示的に、すべての文がベースとして指定されていたら、新たなベース
  // 部分集合は、このフィルタの今回の適用によって得られることになる部分集合。
  // もし、長さが制限された文の集合がベースとして指定されていたら、そんな
  // 指定は無視されて、新たなベース部分集合は、このフィルタの今回の適用に
  // よって得られることになる部分集合となる。
  if (base_type == 'len_lim') {
    alert("The target is set to be the whole sentences.");
  }
  if (base_type == 'whole' || base_type == 'len_lim') {
    // In this case, the potential base subset is to be newly set.
    // この場合、潜在的なベース部分集合を新たに設定すべきである。
    DAT.type_of_base_subset = 'length_limited';
    elem = window.top.document.getElementById('use_length_limited_sentences');
    elem.removeAttribute('disabled');
    elem = window.top.document.getElementById('use_specific_pattern');
    elem.setAttribute('disabled', 'disabled');

    for (i = 0; i < N; i++) {
      L = DAT.num_of_chars[i];
      if (min_len <= L && L <= max_len) {
        str += (DAT.id_tags[i] + DAT.sentences[i] + "\n");
        c++;
        DAT.is_selected[i] = true;
      } else {
        DAT.is_selected[i] = false;
      }
      DAT.displayed_sentences[i] = '';
    }
  } else if (DAT.type_of_base_subset == 'pattern_specified' && 
             base_type == 'specific_pattern') {
    // If a set of sentences including a specific pattern has been set as
    // the *potential* base subset and this is specified as the *actual* base
    // subset to be used in this time, the base subset should be unchanged
    // and this filter should be applied to this base subset.
    // もし、特定のパタンを含む文の集合が、*潜在的な*ベース部分集合として
    // 指定済みであり、かつ、これが、今回使うべき*実際の*ベース部分集合として
    // 指定されていたら、このフィルタは、このベース部分集合に対して適用すべき
    // である。
    for (i = 0; i < N; i++) {
      if (DAT.is_selected[i]) { // a sentence including the specific pattern
        L = DAT.num_of_chars[i];
        if (min_len <= L && L <= max_len) {
          str += (DAT.id_tags[i] + DAT.displayed_sentences[i] + "\n");
          c++;
        }
      }
    }
  } else {
    alert("Oops! Something is wrong.\nAn error occurred at COM_FUNC.constrain_num_of_chars.");
  }
  window.top.document.getElementById("output_area").innerHTML=str;
  COM_FUNC.reset_counter(c);
};

// A similar general filter applicable to multiple languages.
// Constrain the length of sentences, which is counted by the number 
// of words.
// This is suitable for Russian, English, Germany, etc., which are written 
// with whitespace characters between words.
// 上記と同様の、複数の言語に適用可能な一般的なフィルタ。
// 文の長さ (単語数で測られる) を制約する。
// これは、ロシア語、英語、ドイツ語などのテキスト (語間に空白文字を置いて
// 書かれる) に適している。
COM_FUNC.constrain_num_of_words = function() {
  var base_type = window.top.document.f.base_set.value;
  var min_len = parseInt(window.top.document.f.min_words.value);
  var max_len = parseInt(window.top.document.f.max_words.value);
  var i, N, L, str, c, elem;
  N = DAT.sentences.length;

  if (!DAT.num_of_words_has_been_counted) {
    for (i = 0; i < N; i++) {
      var w = DAT.sentences[i].split(/[—\-\s]+/);
      for (var j = 0, L = w.length; j < L; j++) {
        if (w[j] == "") { L--; }
      }
      DAT.num_of_words[i] = L;
    }
    DAT.num_of_words_has_been_counted = true;
  }

  str = "";
  c = 0;

  if (base_type == 'len_lim') {
    alert("The target is set to be the whole sentences.");
  }
  if (base_type == 'whole' || base_type == 'len_lim') {
    DAT.type_of_base_subset = 'length_limited';
    elem = window.top.document.getElementById('use_length_limited_sentences');
    elem.removeAttribute('disabled');
    elem = window.top.document.getElementById('use_specific_pattern');
    elem.setAttribute('disabled', 'disabled');

    for (i = 0; i < N; i++) {
      L = DAT.num_of_words[i];
      if (min_len <= L && L <= max_len) {
        str += (DAT.id_tags[i] + DAT.sentences[i] + "\n");
        c++;
        DAT.is_selected[i] = true;
      } else {
        DAT.is_selected[i] = false;
      }
      DAT.displayed_sentences[i] = '';
    }
  } else if (DAT.type_of_base_subset == 'pattern_specified' && 
             base_type == 'specific_pattern') {
    for (i = 0; i < N; i++) {
      if (DAT.is_selected[i]) { 
        L = DAT.num_of_words[i];
        if (min_len <= L && L <= max_len) {
          str += (DAT.id_tags[i] + DAT.displayed_sentences[i] + "\n");
          c++;
        }
      }
    }
  } else {
    alert("Oops! Something is wrong.\nAn error occurred at COM_FUNC.constrain_num_of_chars.");
  }
  window.top.document.getElementById("output_area").innerHTML=str;
  COM_FUNC.reset_counter(c);
};

// A wrapper function that is called in order to apply a language-
// specific filter.
// 言語依存のフィルタを適用するために呼び出される、ラッパ関数。
COM_FUNC.call_filter_of = function(f_name, is_filter_in_listbox) {
  var filter_name;
  const em_tag = /<em>/;
  if (is_filter_in_listbox) {
    var op_list = window.top.document.getElementById('filter_setting').contentWindow.document.getElementById(f_name);
    filter_name = op_list.options[op_list.selectedIndex].value;
  } else {
    filter_name = f_name;
  }
  //console.log("filter_name : " + filter_name);
  var base_type = window.top.document.f.base_set.value;
  //console.log("base_type: " + base_type);
  var i, N, L, str, c, elem;
  N = DAT.sentences.length;
  //console.log("N = " + N);
  str = "";
  c = 0;
  if (base_type == 'specific_pattern') {
    alert("The target is set to be the whole sentences.");
  }
  if (base_type == 'whole' || base_type == 'specific_pattern') {
    // In this case, the potential base subset is to be newly set.
    // この場合、潜在的なベース部分集合を新たに設定すべきである。
    DAT.type_of_base_subset = 'pattern_specified';
    elem = window.top.document.getElementById('use_specific_pattern');
    elem.removeAttribute('disabled');
    elem = window.top.document.getElementById('use_length_limited_sentences');
    elem.setAttribute('disabled', 'disabled');

    for (i = 0; i < N; i++) {
      var check_sentence_result = eval(filter_name + "(" + i + ")" );
      //console.log(i + ": " + check_sentence_result);
      if (em_tag.test(check_sentence_result)) {
        str += (DAT.id_tags[i] + check_sentence_result + "\n");
        c++;
        DAT.is_selected[i] = true;
      } else {
        DAT.is_selected[i] = false;
      }
      DAT.displayed_sentences[i] = check_sentence_result;
    }
  } else if (DAT.type_of_base_subset == 'length_limited' && 
             base_type == 'len_lim') {
    for (i = 0; i < N; i++) {
      if (DAT.is_selected[i]) { // a sentence whose length is as constrained
        check_sentence_result = eval(filter_name + "(" + i + ")" );
        if (em_tag.test(check_sentence_result)) {
          str += (DAT.id_tags[i] + check_sentence_result + "\n");
          c++;
        }
      }
    }
  } else {
    alert("Oops! Something is wrong.\nAn error occurred at COM_FUNC.call_filter_of.");
  }
  window.top.document.getElementById("output_area").innerHTML=str;
  COM_FUNC.reset_counter(c);
};

// Get an array of the "value" attribute of the checked checkboxes included 
// in the element whose "id" attribute is group_element_id.
// This can be used to extract the sentences that match any one of the 
// words/prefixes/suffixes/phrases being selected (i.e., checked by checkboxes) 
// from among listed ones.
// id 属性が group_element_id であるような要素の中に含まれている、
// チェックされた状態のチェックボックス群の、value 属性の配列を得る。
// これは、列挙されているもののうちで選択されている状態の (チェックボックスで
// チェックされている) 単語/接頭辞/接尾辞/句のうちの、どれか任意の一つに
// 合致する文を、抽出するために使える。
COM_FUNC.get_checked_values = function(group_element_id) {
  var grp = window.top.document.getElementById('filter_setting').contentWindow.document.getElementById(group_element_id);
  var elm = grp.getElementsByTagName('input');
  var keywords = [];
  for (var i = 0, N = elm.length; i < N; i++) {
    if (elm[i].getAttribute('type') == 'checkbox' && elm[i].checked) {
      keywords.push(elm[i].value);
    }
  }
  return(keywords);
};

// Check or uncheck multiple checkboxes at once, where checkbox_ids is 
// an array of the "id" attributes of the checkboxes and check_or_uncheck is
// a boolean value.
// 複数のチェックボックスを、一括選択するか、または一括解除する。
// なおここで、checkbox_ids は、それらチェックボックスの id 属性の配列であり、
// check_or_uncheck は真偽値である。
COM_FUNC.set_at_once = function(checkbox_ids, check_or_uncheck) {
  for (var i = 0, N = checkbox_ids.length; i < N; i++) {
    window.top.document.getElementById('filter_setting').contentWindow.document.getElementById(checkbox_ids[i]).checked = check_or_uncheck;
  }
};

// Switch the user interface (UI) language.
// ユーザ・インタフェイス (UI) 用 言語を切り換える。
COM_FUNC.set_UI_lang = function(lang_code) {
  DAT.ui_lang = lang_code;
  var docs = new Array(2);
  docs[0] = window.top.document;
  docs[1] = window.top.document.getElementById('filter_setting').contentWindow.document;
  var d;
  var i, j, Ni, Nj, attName;
  attName = 'data-' + lang_code + '-value';
for (d = 0; d <= 1; d++) {
  // for the text in <span class="ui" ...> tags
  var UI_text_blocks = docs[d].getElementsByClassName('ui');
  for (i = 0, Ni = UI_text_blocks.length; i < Ni; i++) {
    if (UI_text_blocks[i].getAttribute('lang') == lang_code) {
      if (UI_text_blocks[i].tagName == 'P') {
        UI_text_blocks[i].style.display = 'block';
      } else {
        UI_text_blocks[i].style.display = 'inline';
      }
    } else {
      UI_text_blocks[i].style.display = 'none';
    }
  }

  // for the text displayed on <input type="button" ...>
  var buttons = docs[d].getElementsByTagName('input');
  for (i = 0, Ni = buttons.length; i < Ni; i++) {
    if (buttons[i].getAttribute('type') == 'button') {
      if (buttons[i].hasAttribute(attName)) {
        buttons[i].value = buttons[i].getAttribute(attName);
      }
    }
  }

  // for the text in <option> tags
  var selectors = docs[d].getElementsByTagName('select');
  for (i = 0, Ni = selectors.length; i < Ni; i++) {
    for (j = 0, Nj = selectors[i].options.length; j < Nj; j++) {
      var op = selectors[i].options[j];
      if (op.hasAttribute(attName)) {
        op.textContent = op.getAttribute(attName);
      }
    }
  }
}
};

// Display or hide a simple help.
// 簡単なヘルプを表示するか、または隠す。
COM_FUNC.toggle_help = function () {
  var h = window.top.document.getElementById('help_txt').style;
  if (h.display=='none') {
    h.display='block';
  } else {
    h.display='none';
  }
};

// Switch the setting page for specifying a language-dependent filter.
// 言語依存のフィルタを指定するための設定ページを、切り換える。
COM_FUNC.switch_setting_page = function(src_page, js_file) {
  // the source HTML page for <iframe>
  window.top.document.getElementById('filter_setting').src = src_page;

  // Has the specified JavaScript source file (js_file) for this language been
  // already read? (If yes, already_exists is set to be true.)
  // この言語用の、指定された JavaScript ソースファイル (js_file) は、既に
  // 読み込まれているか? (もしそうだったら、already_exists を真に設定する。)
  var scr = window.top.document.getElementsByTagName('script');
  var i = 0;
  var N = scr.length;
  var already_exists = false;
  while (i < N) {
    //console.log(i + "-th script's src : " + scr[i].src);
    if (scr[i].src.substring(scr[i].src.lastIndexOf('/')+1) == js_file) {
      already_exists = true;
      break;
    }
    i++;
  }
  //console.log("already_exists? : " + already_exists);
  // Read the specified JavaScript source file (js_file) as the source of a new
  // <script> element.
  // 指定された JavaScript ソースファイル (js_file) を、新たな <script> 要素の
  // ソースとして読み込む。
  if (!already_exists) {
    var s = window.top.document.createElement('script');
    s.type = 'text/javascript';
    s.src = js_file;
    var h = window.top.document.getElementsByTagName('head')[0];
    h.appendChild(s);
  }

  DAT.reset_base_subset();
};

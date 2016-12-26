// creating a quasi-namespace for Russian-specific filters, 
// by using an Object named RU
//
// ロシア語特有のフィルタ用に、擬似的に名前空間を作る。
var RU = {
// Cyrillic alphabet
// キリル文字アルファベット
uppercase_alphabet : 
  'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
lowercase_alphabet : 
  'абвгдежзийклмнопрстуфхцчшщъыьэюя',

// Convert word_str into lowercase and strip punctuation signs (which may be
// prepended or appended to a word to form word_str), in order to
// compare the word represented by word_str with the normal form of a word.
//
// word_str で表される語を標準形と比較するために、word_str を小文字に変換し、
// (前後についているかもしれない) 句読点等の符号を削ぎ落とす。
to_lowercase : function(word_str) {
  var res = word_str;
  var N = this.uppercase_alphabet.length;
  for (var i = 0; i < N; i++) {
    res = res.replace(this.uppercase_alphabet[i], this.lowercase_alphabet[i]);
  }
  res = res.replace(/^[\"\'«—…]*([абвгдежзийклмнопрстуфхцчшщъыьэюя]*)[\.\;\:\?\!\"\',»—…]*$/, "$1");
  return(res);
},

// Return the string corresponding to DAT.sentences[idx] where 
// the selected words are highlighted by <em> tags.  Note that
// target_word_group is the id attribute of an element which contains
// checkboxes used to select the target words to be highlighted.
// Only the words that *exactly* (but in the case-insensitive way) match 
// one of the target words are highlighted.  Partial match is ignored.
//
// DAT.sentences[idx] に対応する文字列 (選択した語が <em> タグによって強調
// されているもの) を返す。なお、target_word_group は、強調対象の語を選ぶのに
// 使うチェックボックスを含む要素の id 属性である。
// 対象語のうちの一つと*正確に* (ただし大文字・小文字の差は無視して) 一致する
// 語のみ、強調される。部分一致は無視される。
check_exact_match : function(idx, target_word_group) {
  const words = DAT.sentences[idx].split(/\s+/);
  const selected_targets = COM_FUNC.get_checked_values(target_word_group);
  var str = "";
  for (var i = 0, L = words.length; i < L; i++) {
    if (selected_targets.includes(this.to_lowercase(words[i]))) {
      str += " <em>" + words[i] + "</em>";
    } else {
      str += " " + words[i];
    }
  }
  return(str);
},

check_affix : function(idx, target_affix_group, prefix_or_suffix) {
  const words = DAT.sentences[idx].split(/\s+/);
  const selected_affixes = COM_FUNC.get_checked_values(target_affix_group);
  var str = "";
  var REs = [];
  // creating regular expression patterns, each including each affix
  // 正規表現のパタン (その各々が、各々の接辞を含む) を作る
  for (var j = 0, S = selected_affixes.length; j < S; j++) {
    if (prefix_or_suffix) {
      RE[j] = new RegExp('^' + selected_affixes[j]);
    } else {
      RE[j] = new RegExp(selected_affixes[j] + '$');
    }
  }
  // checking for each word of DAT.sentences[idx]
  // DAT.sentences[idx] のそれぞれの語について調べる
  for (var i = 0, L = words.length; i < L; i++) {
    for (j = 0, S = selected_affixes.length; j < S; j++) {
      if (RE[j].test(words[i])) { // if words[i] match the j-th affix ...
        str += " <em>" + words[i] + "</em>";
        break;
      }
    }
    if (j==S) { // if words[i] does not match any affix ...
      str += " " + words[i];
    }
  }
  return(str);
},

// Return the string corresponding to DAT.sentences[idx] where 
// the selected personal pronouns are highlighted by <em> tags.
//
// 選択した人称代名詞を <em> タグで強調した状態の、DAT.sentences[idx] に
// 相当する文字列を返す。
pronouns: function(idx) {
  return(this.check_exact_match(idx, 'ru_pronouns'));
},

// Return the string corresponding to DAT.sentences[idx] where 
// the selected interrogative pronouns are highlighted by <em> tags.
//
// 選択した疑問代名詞を <em> タグで強調した状態の、DAT.sentences[idx] に
// 相当する文字列を返す。
interrogatives: function(idx) {
  return(this.check_exact_match(idx, 'ru_interrogatives'));
},

// This function should not be used for a large number of sentences because
// such use of this function can hang the browser.
// Using this function for a selected one sentence will work well (but 
// no interface to do so has been prepared so far).
//
// 文の数が多いと固まるのでやめた方がよい。
// 使うなら、選択した一つの文に対して使うようにする。
// (ただし、そのような用法のためのインタフェイスはまだ作っていない。)
wiktionary_link: function(idx) {
  var words = DAT.sentences[idx].split(/\s+/);
  var str = "";
  for (var j = 0, L = words.length; j < L; j++) {
    var dict_form = this.to_lowercase(words[j]);
    if (dict_form == "") {
      str += " " + words[j];
    } else {
      str += " <a href=\"https://en.wiktionary.org/wiki/" + encodeURIComponent(dict_form) + "#Russian\" class=\"dict\" target=\"_wikt\">" + words[j] + "</a>";
    }
  }
  return(str);
}

}; // end of the declaration of the global Object named RU


// creating a quasi-namespace for Chinese-specific filters, 
// by using an Object named ZH
//
// 中国語特有のフィルタ用に、擬似的に名前空間を作る。
var ZH = ZH || {

/* Extract sentences including the pattern of "是〜的".
Note that "的" which is independent of this pattern may appear after "但是", 
creating the pattern "(但) 是〜的".  Such a spurious pattern is excluded.
How to handle "可是", "還是", etc. is to be considered (but is still pending).
This filter is merely for rough screening since "的" can be used in a wide 
variety of ways, often independent of the pattern of "是〜的".
*/
/*「是〜的」構文の例文を抽出したい。
この構文とは無関係な「的」が、「但是」の後に出現する場合があるので、それを
除外。「可是」「還是」あたりをどう考えるかは要検討。
まあ、それでも無関係な「的」は多いので、あくまでもこれは粗いスクリーニング。
*/
shi_de : function(idx) {
  const sent=DAT.sentences[idx];

  const RE = /[^但]是.+的/;
  if (RE.test(sent)) {
    // Emphasize "是〜的" if "的" is found after "是" other than one included 
    // in "但是", where this "是" is not the head of a sentence.
    // 「但是」以外の「是」の後に「的」があれば、「是〜的」を強調。
    // なおこの「是」は文頭ではない。
    return(sent.replace(/(是[^是的]+的)/g, "<em>$1</em>"));
  } else {
    // Emphasize "是〜的" if it starts at the head of a sentence.
    // 文頭から「是〜的」が始まっていれば、その「是〜的」を強調。
    return(sent.replace(/^(是[^是的]+的)/g, "<em>$1</em>"));
  }
},

// Extracting sentences including the pattern of "又〜又〜".
/*「又〜又〜」の例文を抽出したい。*/
you_you : function(idx) {
  return(DAT.sentences[idx].replace(/(又.{1,2}又.{1,2})/g, "<em>$1</em>"));
},

// Extracting sentences including the pattern of "越〜越〜".
/*「越〜越〜」の例文を抽出したい。*/
yue_yue : function(idx) {
  return(DAT.sentences[idx].replace(/(越.+越.)/g, "<em>$1</em>"));
},

// Extracting sentences including numerical expressions.
/*数の入っている例文を抽出したい。*/
numerical : function(idx) {
  return(DAT.sentences[idx].replace(/([零〇一二三四五六七八九十百千万亿億兆]+.)/g, "<em>$1</em>"));
},

// Extracting sentences including interrogatives with a repetitive expression
// (i.e., "A 不 A", "有没有", or "有沒有").
/*反復疑問 (「A不A」または「有没有」もしくは「有沒有」) */
repetitive_question : function(idx) {
  var res = DAT.sentences[idx].replace(/((.{1,2})不\2)/g, "<em>$1</em>");
  return(res.replace(/(有[没沒]有)/g, "<em>$1</em>"));
},

// Extracting sentences including passive voice.
/*受け身*/
passive : function(idx) {
  return(DAT.sentences[idx].replace(/([被叫让譲讓])/g, "<em>$1</em>"));
},

// Extracting sentences including the pattern of "了".
/*「了」*/
le : function(idx)  {
  return(DAT.sentences[idx].replace(/(了)/g, "<em>$1</em>"));
}

}; // end of the declaration of the global Object named ZH


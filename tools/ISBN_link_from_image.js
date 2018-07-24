'use strict';

function read_in() {
  const reader = new FileReader(),
        input_file = document.getElementById("input_image_file");

  reader.onload = function (e) {
    //選択された画像をimg要素として表示する。
    const img_as_data_uri = e.target.result;
    document.getElementById("receipt_image").src = img_as_data_uri;

    //結果出力先の要素を取得する。
    const ndl_out = document.getElementById("ndl_links"),
          amz_out = document.getElementById("amz_links");
    //複数回、連続して実行するときのために、最初に中身を捨てる。
    ndl_out.innerHTML = "";
    amz_out.innerHTML = "";

    document.getElementById("msg").textContent = "[処理中です……]";

    let num_books=0; // ISBNを読み取れた本の冊数を初期化する。
    //画像認識
    Tesseract.recognize(
      img_as_data_uri, 
      { tessedit_char_whitelist: "0123456789" })
      .then(function(result) { 
        const lines = result.text.split("\n"),
              isbn_pattern = /9784\d{9}/;  //13桁ISBN

        lines.forEach(thisLine => {
          // '1'の認識で前後にスペースが入ってしまうことがあるので、
          // スペースをあらかじめ削除しておくためにreplaceを使っている。
          const res = isbn_pattern.exec(thisLine.replace(' ', ''));
          // マッチする文字列があったら……
          if (res !== undefined && res !== null) {
            num_books++;
            const d8 = res[0].substring(4,12), cd = isbn10_check_digit(d8);
            ndl_out.innerHTML += '<a href="http://iss.ndl.go.jp/api/openurl?isbn=4' + d8 + cd + '" target="_ndl">' + res[0] + '</a>\n';
            amz_out.innerHTML += '<a href="https://www.amazon.co.jp/dp/4' + d8 + cd + '/" target="_amzn">' + res[0] + '</a>\n';
          }
        });
      })
      .finally(function(r) {
        document.getElementById("msg").textContent = "[処理が終わりました (" + num_books + "冊のISBNを読み取りました)]";
      });
  } // end of the function assigned to reader.onload

  // 画像ファイルをdata URLとして読み込むように指示しておく。
  reader.readAsDataURL(input_file.files[0]);
}

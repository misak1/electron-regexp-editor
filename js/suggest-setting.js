// 補完候補の配列作成
// var suggestList = ['Java', 'JavaScript', 'Perl', 'Ruby', 'PHP', 'Python', 'C', 'C++', '.NET',
//   'MySQL', 'Oracle', 'PostgreSQL',"Hoge"];
// var suggestList = ["Excel/Excelのセル内改行文字列の正規化/regexp.json", "SQL/INSERT文作成/regexp.json", "Text/空行削除/regexp.json", "Text/空行削除（スペースのみも対象）/regexp.json", "Text/空行削除（スペース・タブのみも対象）/regexp.json", "Text/空行削除（タブのみも対象）/regexp.json", "サンプル/サンプル/regexp.json", "Excel/HTMLテンプレート流し込み用関数作成/regexp.json"]
function startSuggest() {
  console.log("startSuggest");
  new Suggest.Local(
    "input-regexp-search",    // 入力のエレメントID
    "suggest", // 補完候補を表示するエリアのID
    suggestList,      // 補完候補の検索対象となる配列
    { dispMax: 10, interval: 200 }); // オプション
}

// window.addEventListener ?
//   window.addEventListener('load', startSuggest, false) :
//   window.attachEvent('onload', startSuggest);

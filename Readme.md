# Regular Expression Editor

複数の正規表現置換をリアルタイムに実行してくれるエディタです。

<p>
<a href="https://github.com/misak1/electron-regexp-editor/releases/">
<img src="https://github.com/misak1/electron-regexp-editor/blob/images/images/download.png?raw=true" width="200" alt="DOWNLOAD">
</a>
</p>

<img src="https://github.com/misak1/electron-regexp-editor/blob/images/images/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202016-12-30%2015.02.28.png?raw=true" alt="スクリーンショット" width="720">

- 上で実行しているregexp.jsonは次のようになっています。

## regexp.json
```json
// jsonのような記述で、シングルクォートで括ることも、json内にコメントを書くことも可能です。
{
   "ダブルクォートを関数に置換"  :{"g": ['"', '"&char(34)&"']}

   // シリアル値を日付型で取得
   ,"日付フォーマットで参照"    :{"g": ['date#([a-zA-Z][1-9])#','"&TEXT($1, "yyyy年m月d日")&"']}
   // 英語書式
   ,"日付フォーマットで参照(en)"    :{"g": ['date-en#([a-zA-Z][1-9])#','"&TEXT($1, "[$-409]mmmm d, yyyy;@")&"']}

   // A1 - Z9 まで
   ,"通常参照" :{"g": ['#([a-zA-Z][1-9])#','"&$1&"']}

   ,"文章全体を関数化"         :{"m": ['((.*\n*.*)*)','="$1"']}
}
```


設定ファイルの追加はこちらにお願いします。  
https://github.com/misak1/regexp-json

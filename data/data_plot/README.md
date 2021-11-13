# データの作成の仕方

make_plot.dict.pyの6行目のgenreを、作成したいジャンルの名前に変更する。ジャンル名はdata_tabelogにあるcsvの、_out.csvより前の部分の文字列とします。

以下を実行するとデータが作成・上書きされます。
```
python3 make_plot_dict.py
```

出力ファイル名は、[ジャンル名]_plot.jsです。

## 新しくデータを作った後にやること

main.htmlのヘッダーにも作成したjsファイルのパスを記載してください。

genreMapにもそのジャンルの記載を足してください。

# 地図へ店舗をプロットするためのデータセットのデータ構成

```
const genre = {year: {month: [{name: name,
                               longitude_latitude: [longitude, latitude]
                               open: 0 or 1,
                               prefecture: prefecture}]
                    }
                }

const genreMap = new Map([
    ["genreName", genre] // [ジャンル, ジャンルに対応する連想配列の名前]
]);
```

例

```JavaScript
var unagi = {2021: {11:[{name: "名代 宇奈とと 四条河原町店",
                        longitude_latitude: [135.76802728152623, 35.00137705544553],
                        open: 1},
                        {name: "うな泰 錦店",
                        longitude_latitude: [136.90145854578213, 35.1692864476607],
                        open: 1},
                        ]
            }};

var takoyaki = {2021: {11: [{}]}};
var cafe = {};

const genreMap = new Map([
    ["unagi", unagi],
    ["takoyaki", takoyaki],
    ["cafe", cafe]
]);

```

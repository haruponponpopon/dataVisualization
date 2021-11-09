# 層グラフの描画

## 参考プログラム

[Stacked Density and Quantile Graphs](http://bl.ocks.org/NPashaP/113f7fea0751fa1513e1)

## 実装の説明

`data.js`の内容が層グラフとして出力される．

凡例をマウスホバーすると，そのジャンルのみのグラフが表示される．

凡例をクリックして選択すると，選択したジャンルだけを比較することができる．

## データ構造

`index: [dP, dist, quant]`と`[ジャンル名，数値]`のセットで保存されている．



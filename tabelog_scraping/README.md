# 食べログスクレイピング

## スクレイピングするサイト

- [食べログ](https://tabelog.com/)

## 方法

1. 食べログでの検索結果のurlを設定
2. 一番上に出てきた店のurlを取得
3. 取得した店のurlから情報を得る(ジャンル情報は`span[class="linktree__parent-target-text"]`の属性で設定されている)
4. `(bs4.BeautifulSoup).select('span[class="rdheader-rating__score-val-dtl"]')`で駅名・地名・ジャンルのリストを得られ，その中のテキストだけを`.getText()`で得ることができる．
5. 得られたリストの最初の一個目は最寄りの駅名，二個目は地名なので，その二つを除外するとジャンル一覧を得ることができる．

## 参考資料

- [Pythonでスクレイピングする方法を初心者向けに徹底解説！](https://dividable.net/programming/python/python-scraping)
- [Python初心者による食べログのスクレイピング](https://qiita.com/you_gin/items/e982ed443c71771ee9b6)
- [【Python】食べログの情報をスクレイピングするコード](https://komono-tsukai-minarai.net/tabelog-scraping/)

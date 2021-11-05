# 食べログ スクレイピング

## スクレイピングするサイト

- [食べログ](https://tabelog.com/)

## 事前準備

- ChromeDriverをインストールする必要があります．

[ChromeDriver インストール方法【Mac】【Windows】](https://doku-pro.com/chromedriver-mac-windows/)
などのサイトを参考にしました．

## 方法

1. 入力のcsvファイル名を指定する．
2. ChromeDriverを利用して食べログ上で店名を自動検索し，検索結果のurlを取得
3. 一番上に出てきた店のurlを取得
4. 取得した店のurlから情報を得る(ジャンル情報は`span[class="linktree__parent-target-text"]`の属性で設定されている)
5. `(bs4.BeautifulSoup).select('span[class="rdheader-rating__score-val-dtl"]')`で駅名・地名・ジャンルのリストを得られ，その中のテキストだけを`.getText()`で得ることができる．
6. 得られたリストの最初の一個目は最寄りの駅名，二個目は地名なので，その二つを除外するとジャンル一覧を得ることができる．
7. ジャンルは#で区切られています．ジャンルが存在しない，または店が食べログの検索で出ない場合は，Noneとなります．

## 参考資料

- [Pythonでスクレイピングする方法を初心者向けに徹底解説！](https://dividable.net/programming/python/python-scraping)
- [Python初心者による食べログのスクレイピング](https://qiita.com/you_gin/items/e982ed443c71771ee9b6)
- [【Python】食べログの情報をスクレイピングするコード](https://komono-tsukai-minarai.net/tabelog-scraping/)
- [SeleniumからHeadless Chromeを使ってみた](https://qiita.com/orangain/items/db4594113c04e8801aad)
- [【Python】current_url・・・URLを取得する](https://www.seleniumqref.com/api/python/window_get/Python_current_url.html)

# 閉店開店.comのスクレイピング  
csvファイルはまだ、データがきちんと生成されていないので、使う時は注意してください。
## カフェ・レストラン
#### todo
- google mapがそもそも表示されていない店があって、その緯度経度の抽出は未定  
- 都道府県が書いておらず、市町村名からの住所が複数あり、そこからは都道府県が抽出できていない。 
- そのほかの店舗のデータ収集。外食全て含む。
#### 説明
- カフェ・レストランの閉店の実行ファイルがcafe_restaurant_cl.py, 開店はcafe_restaurant_op.py  
- データがdataset.csv
- 開店した日付、店名、緯度、経度の順に保存されている。  
- 緯度、経度は存在していない時-1,-1を返す。  
- 都道府県が存在していない時Noneを返す。
#### 例外のサイト(テストケースようのメモ)
- [ディズニー](https://10-19.kaiten-heiten.com/tdl-bijotoyaju/) iframeが複数ある
- [PRESSO cafe&bar](https://10-19.kaiten-heiten.com/presso-cafebar/) google mapのリンクが特異的  
- [LE MACCHAN](https://10-19.kaiten-heiten.com/le-macchan/) google mapが存在しない
- [ひだまりカフェ](https://10-19.kaiten-heiten.com/hidamari-cafe/) google mapのリンクが&llタイプ
- [コミュニティカフェ](https://10-19.kaiten-heiten.com/cafe-kisora/) google mapのリンクが&sllタイプ
# アルゴリズムの簡単な説明  
## データ抽出方法  
開店閉店.comのカテゴリ別で一覧が表示されているサイトのリンクをurl変数に渡す。  
for文の中身  
- そのurlからそれぞれのお店の詳細を表示するサイトのリンクをpost_linksクラスのaタグから抽出し、そこに移動。その時に、そのaタグのテキストの6番目の文字からが開店、閉店した時間を表しているので、dateに保存。緯度、経度はiframeタグより抽出。　　   
google mapのリンクはgoogle mapの性質上抽出できないバグが起こるが、全ての出力結果を抽出して欲しいデータが存在しているか検索すると良いby TAさん
## 緯度、経度の抽出方法
#### 参考文献
https://ashikapengin.com/2021/01/10/scraping3/
#### Webサイト内のgoogle mapのリンクを探す
サイト内のiframeタグを探し、その中で`maps`という文字が入っているリンクを探す。
#### 緯度、経度の探し方
!2d、!3dという文字列を探し、その後の数字を抽出。  
例えばこんな感じのgoogle mapのリンクがあります。
```
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.5422452944144!2d135.68890491568408!3d34.79229738581382
!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001194139cd40e3%3A0x6ce14c67c351de2!2z44CSNTc2LTAwNTEg5aSn6Ziq5bqc5Lqk6Y
eO5biC5YCJ5rK777yR5LiB55uu77yV77yV4oiSNjI255Wq!5e0!3m2!1sja!2sjp!4v1637108848787!5m2!1sja!2sjp" width="640" height="350" 
style="border:0;" allowfullscreen="" loading="lazy"></iframe>  
```
google　mapのリンクはワンパターンではなく、見つからない場合もある。  
見つからなかったら、sll, llなどの文字列を探し、その後ろの数字を持ってくる。  
持ってきた数字が適切かどうかは、数字が日本国内の緯度、経度を指しているかどうかで判断。  
しかし、一部不適切な数字が混入してしまいました。  

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

# 閉店開店.comのスクレイピング  
csvファイルはまだ、データがきちんと生成されていないので、使う時は注意してください。
## カフェ・レストラン
#### todo
- 2021年のデータが別リンクに保存されているため、欠損している 
- google mapがそもそも表示されていない店があって、その緯度経度の抽出は未定  
- 閉店のデータ収集。ファイル名もわかりやすく書き換え  
- そのほかの店舗のデータ収集。外食
#### 説明
- 実行ファイルがcafe_restaurant.py
- データがcafe_restaurant.csv
- 開店した日付、店名、緯度、経度の順に保存されている。  
- 緯度、経度は存在していない時-1,-1を返す  
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

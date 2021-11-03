import bs4
import os
import re
import requests
import pandas as pd
import time
import openpyxl
from datetime import datetime

url = "https://tabelog.com/tokyo/A1303/A130301/R4698/rstLst/?vs=1&sa=%E6%B8%8B%E8%B0%B7%E9%A7%85&sk=&lid=top_navi1&vac_net=&svd=20211104&svt=1900&svps=2&hfc=1&sw="
res = requests.get(url)
res.raise_for_status()  #エラーチェック

now = datetime.now()
file_time = now.strftime('%Y%m%d-%H%M%S')
print(file_time)

no_starch_soup = bs4.BeautifulSoup(res.text) # リクエストしたURLの内容を取得

# TODO ページャーのMAXを把握する
elems = no_starch_soup.select('span[class="c-page-count__num"]') # ページャー関連の数値を取得
print(type(elems)) # 確認(いらなそう)
print(len(elems)) # 要素の数を表示
print(type(elems[0])) # 要素のTypeを表示

max_shop = elems[2].getText() # INPUTにおけるMAX店舗数を取得
print('一覧ページの総店舗数は' + (max_shop) + 'です。') # MAX店舗数を表示
max_page = str(-(-(int(max_shop)) // 20)) # MAXページURL末尾の数字を計算
print('最大ページ数は' + (max_page) + 'です。') # MAXページ数を表示
max_page_url = (url) + (max_page) + '/' # MAXページURLを作成
print('最終ページのURLは ' + (max_page_url) + ' です。') # MAXページURLを表示

time.sleep(1)
print('情報取得を開始します...') # 場繋ぎで表示
time.sleep(1)

shop_name = [] # 空のリストを作成
shop_link = [] # 空のリストを作成
shop_star = [] # 空のリストを作成

#〇一覧ページ
#・個別ページのURL一覧を取得
i = 1 # ループ用の変数を設定、URL構造的にこれがよさそうだった。
e = 0 # 通算実行回数カウント用の変数を設定(max店舗数で取得終了させる用)
while True:
    print('ページをダウンロード中 {}...'.format(url)) # 取得対象ページを表示
    res = requests.get(url) # 対象ページをリクエスト
    res.raise_for_status() # エラーチェック
    soup = bs4.BeautifulSoup(res.text) # 変数soupでページ内容を取得
    elems = soup.select('a[class="list-rst__rst-name-target cpy-rst-name"]') # 変数elemsで店名・リンクを取得
    shop_name.extend(elems) # 店舗名のリストを更新
    shop_link.extend(elems) # 店舗リンクのリストを更新
    shop_link_temp = [] # 空のリストを作成(ループ時はリセットが目的)
    shop_link_temp.extend(elems) # 店舗リンク(temp)のリストを更新

    # TODO ループ内の店舗URLを取得
    n = 0 # ループ内ループ用の変数を設定(20回で次の一覧ページに飛ぶ用)
    while True:
        print('-----一覧ページ(' + str(i) + '/' + (max_page) + ')内、' + str((n) + 1) + '回目の店舗情報取得を行います。-----')
        shop_kobetsu_url = shop_link_temp[n].get('href')
        res_kobetsu = requests.get(shop_kobetsu_url)
        soup_kobetsu = bs4.BeautifulSoup(res_kobetsu.text)
        res_kobetsu.raise_for_status()
        star_elems = soup_kobetsu.select('span[class="rdheader-rating__score-val-dtl"]') # 変数star_elemsで点数を取得
        print('※一覧ページ内' + str(n + 1) + '回目・' + '通算' + str(e + 1) + '回目')
        shop_kobetsu_name = shop_link_temp[n].getText()
        print('店舗名は ' + (shop_kobetsu_name) + ' です。')
        print('店舗URLは ' + (shop_kobetsu_url) + ' です。')
        print('点数は ' + (star_elems[0].getText()) + 'です。')
        shop_star.extend(star_elems)

        # TODO: 次の店舗に進む
        if ((e + 1) % 20) == 0: # ページ内20回目で通算回数をプラスしてbrake
            e += 1
            time.sleep(2)
            break

        elif (e + 1) == int(max_shop): # 通算回数が最大店舗数と同じになったらbrake
            break
        
        else: # その他の実行回数の場合カウントをそれぞれ追加
            time.sleep(2) # 気持ちsleepさせて負荷を掛け過ぎないようにする
            n += 1
            e += 1

    
    # TODO 実行回数に応じて処理を分岐
    if i == int(max_page): # URL末尾がmax_pageだった場合brake
        break

    # TODO: 「次の20件」に進む
    else:
        prev_link = soup.select('a[rel="next"]')[0] # aタグのrel="next"が「次の20件」なので指定。
        url = prev_link.get('href') # 変数urlを「次の20件」のリンクに更新
        print('-----次の一覧ページURLは ' + (url) + ' です。-----') # 場繋ぎで表示
        time.sleep(0.5) # なんとなくスリープさせる。
        i += 1 # ループ回数の値を更新

print('-----結果を表示します。-----') # 前置き

print('-----【店舗名一覧は以下の通りです。】-----')
for elem in shop_name: # 店名を表示
    print(elem.getText())
    time.sleep(0.05)

print('-----【店舗リンク一覧は以下の通りです。】-----')
for link_elem in shop_link: # 各店リンクを表示
    print(link_elem.get('href')) 
    time.sleep(0.05)

print('-----【店舗点数一覧は以下の通りです。】-----')
for star_elem in shop_star: # 各店の点数を表示
    print(star_elem.getText()) 
    time.sleep(0.05)

wb = openpyxl.Workbook()
sheet = wb.active
sheet.title = '出力結果'

# Excel見出しを入れる
sheet['A1'].value = 'No.'
sheet['B1'].value = '店舗名'
sheet['C1'].value = '店舗URL'
sheet['D1'].value = '点数'

excel_num = len(shop_star)

for a in range(excel_num):
    sheet.cell(row=a+2,column=1).value = a +1

for index,tenmei in enumerate(shop_name):
	sheet.cell(row=2+index,column=2).value = tenmei.getText()

for index,tenpourl in enumerate(shop_link):
	sheet.cell(row=2+index,column=3).value = tenpourl.get('href')

for index,tenpostar in enumerate(shop_star):
    if tenpostar.getText() == '-': # ハイフンの場合
        sheet.cell(row=2+index,column=4).value = tenpostar.getText()
    else:
        sheet.cell(row=2+index,column=4).value = float(tenpostar.getText())

wb.save('Tabelog_' + str(file_time) + '.xlsx')
print('リスト出力が完了しました。')
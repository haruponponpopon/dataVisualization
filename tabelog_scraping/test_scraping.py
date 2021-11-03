import bs4
import os
import re
import requests
import pandas as pd
import time
import openpyxl
from datetime import datetime


##### 実際はこのurlを検索結果の物にできるようにしたい (今は渋谷で検索した時のurlで設定しています)####
url = "https://tabelog.com/tokyo/A1303/A130301/R4698/rstLst/?vs=1&sa=%E6%B8%8B%E8%B0%B7%E9%A7%85&sk=&lid=top_navi1&vac_net=&svd=20211104&svt=1900&svps=2&hfc=1&sw="
res = requests.get(url)
res.raise_for_status()  #エラーチェック


no_starch_soup = bs4.BeautifulSoup(res.text, features="html.parser") # リクエストしたURLの内容を取得

# TODO ページャーのMAXを把握する
elems = no_starch_soup.select('span[class="c-page-count__num"]') # ページャー関連の数値を取得


time.sleep(1)
print('情報取得を開始します...') 
time.sleep(1)

shop_name = [] # 空のリストを作成
shop_link = [] # 空のリストを作成
shop_star = [] # 空のリストを作成


##########店舗情報取得##################
res = requests.get(url) # 対象ページをリクエスト
res.raise_for_status() # エラーチェック
soup = bs4.BeautifulSoup(res.text, features="html.parser") # 変数soupでページ内容を取得
elems = soup.select('a[class="list-rst__rst-name-target cpy-rst-name"]') # 変数elemsで店名・リンクを取得
shop_name.extend(elems) # 店舗名のリストを更新
shop_link.extend(elems) # 店舗リンクのリストを更新
shop_link.extend(elems) # 店舗リンク(temp)のリストを更新


######ページに出てきた一番上の店舗情報のみを取得#####
shop_kobetsu_url = shop_link[0].get('href')
res_kobetsu = requests.get(shop_kobetsu_url)
soup_kobetsu = bs4.BeautifulSoup(res_kobetsu.text, features="html.parser")
res_kobetsu.raise_for_status()
star_elems = soup_kobetsu.select('span[class="rdheader-rating__score-val-dtl"]') # 変数star_elemsで点数を取得
shop_kobetsu_name = shop_link[0].getText()
print('店舗名は ' + (shop_kobetsu_name) + ' です。')
print('店舗URLは ' + (shop_kobetsu_url) + ' です。')
print('点数は ' + (star_elems[0].getText()) + 'です。')
shop_star.extend(star_elems)

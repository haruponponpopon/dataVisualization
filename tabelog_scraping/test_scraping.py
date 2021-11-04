import bs4
import os
import re
import requests
import pandas as pd
import time
import openpyxl
from datetime import datetime

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options


shop_name = "島たこやき MIKE トゥースマート店"  #ここを自由に店名を変える
options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome()
driver.get('https://tabelog.com/')
input_element = driver.find_element_by_id('sk')
input_element.send_keys(shop_name)
input_element.send_keys(Keys.RETURN)
time.sleep(2)
url = driver.current_url

res = requests.get(url)
res.raise_for_status()  #エラーチェック


no_starch_soup = bs4.BeautifulSoup(res.text, features="html.parser") # リクエストしたURLの内容を取得

# TODO ページャーのMAXを把握する
elems = no_starch_soup.select('span[class="c-page-count__num"]') # ページャー関連の数値を取得


time.sleep(1)
print('情報取得を開始します...') 
time.sleep(1)



##########店舗情報一覧取得##################
res = requests.get(url) # 対象ページをリクエスト
res.raise_for_status() # エラーチェック
soup = bs4.BeautifulSoup(res.text, features="html.parser") # 変数soupでページ内容を取得
elems = soup.select('a[class="list-rst__rst-name-target cpy-rst-name"]') # 変数elemsで店名・リンクを取得


######ページに出てきた一番上の店舗情報のみを取得#####
shop_kobetsu_url = elems[0].get('href') #その店舗のURLにアクセス
res_kobetsu = requests.get(shop_kobetsu_url)
soup_kobetsu = bs4.BeautifulSoup(res_kobetsu.text, features="html.parser")
res_kobetsu.raise_for_status()
star_elems = soup_kobetsu.select('span[class="rdheader-rating__score-val-dtl"]') # 変数star_elemsで点数を取得
shop_kobetsu_name = elems[0].getText()
print('店舗名: ' + (shop_kobetsu_name))
print('店舗URL: ' + (shop_kobetsu_url))
print('点数: ' + (star_elems[0].getText()))

#########ジャンル取得#######
genre_elems = soup_kobetsu.select('span[class="linktree__parent-target-text"]')
print("-----ジャンル一覧----")
# 最初の二つは駅と地名？(一般的なのかは怪しい)
for genre in genre_elems[2:]:
    print("  ・" + genre.getText())




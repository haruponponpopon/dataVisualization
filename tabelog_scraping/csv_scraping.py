import sys

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
import csv
import pprint

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome()


def do_scraping(shop_name):
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

    ##########店舗情報一覧取得##################
    res = requests.get(url) # 対象ページをリクエスト
    res.raise_for_status() # エラーチェック
    soup = bs4.BeautifulSoup(res.text, features="html.parser") # 変数soupでページ内容を取得
    elems = soup.select('a[class="list-rst__rst-name-target cpy-rst-name"]') # 変数elemsで店名・リンクを取得


    ######ページに出てきた一番上の店舗情報のみを取得#####
    if len(elems) == 0:
        return None
    shop_kobetsu_url = elems[0].get('href') #その店舗のURLにアクセス
    res_kobetsu = requests.get(shop_kobetsu_url)
    soup_kobetsu = bs4.BeautifulSoup(res_kobetsu.text, features="html.parser")
    res_kobetsu.raise_for_status()
    shop_kobetsu_name = elems[0].getText()

    #########ジャンル取得#######
    genres = []
    genre_elems = soup_kobetsu.select('span[class="linktree__parent-target-text"]')
    # 最初の二つは駅と地名？(一般的なのかは怪しい)
    if (len(genre_elems) <= 2):
        return None
    for genre in genre_elems[2:]:
        genres.append(genre.getText())
    return genres

df = pd.read_csv("./takoyaki_test.csv")
df["genres"] = "None"
for i in range(0,len(df)):
    shop_name = df.loc[i, "ShopName"]
    genre = do_scraping(shop_name)
    add_genre  = ""
    if (genre == None):
        add_genre= "None"
    else:
        for g in genre:
            add_genre = add_genre + " #" + g
    print(shop_name , " : " , add_genre)
    df.loc[i, "genres"] = add_genre
    df.to_csv("./takoyaki_test_out.csv")
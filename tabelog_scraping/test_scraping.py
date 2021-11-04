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


options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome()
driver.get('https://tabelog.com/')
input_element = driver.find_element_by_id('sk')
input_element.send_keys('島たこやき MIKE トゥースマート店')
input_element.send_keys(Keys.RETURN)
time.sleep(2)
print(driver.title)

##### 実際はこのurlを設定を自動化したい(今は手動で検索したときのurlを設定)####
# 本郷三丁目の検索結果
# url = "https://tabelog.com/tokyo/A1310/A131004/R9108/rstLst/?vs=1&sa=%E6%9C%AC%E9%83%B7%E4%B8%89%E4%B8%81%E7%9B%AE%E9%A7%85&sk=&lid=hd_search1&vac_net=&svd=20211104&svt=1900&svps=2&hfc=1&sw="
# 渋谷駅の検索結果
# url = "https://tabelog.com/tokyo/A1303/A130301/R4698/rstLst/?vs=1&sa=%E6%B8%8B%E8%B0%B7%E9%A7%85&sk=&lid=top_navi1&vac_net=&svd=20211104&svt=1900&svps=2&hfc=1&sw="
# ゴンチャの検索結果
url = "https://tabelog.com/rstLst/?vs=1&sa=&sk=%25E3%2582%25B4%25E3%2583%25B3%25E3%2583%2581%25E3%2583%25A3&lid=hd_search1&vac_net=&svd=20211104&svt=1900&svps=2&hfc=1&sw=%25E3%2582%25B4%25E3%2583%25B3%25E3%2583%2581%25E3%2583%25A3&sunday=&LstRange=&LstReserve=&ChkCard=&ChkCardType=&ChkRoom=&ChkSemiRoom=&ChkRoomType=&ChkCharter=&ChkCharterType=&LstSmoking=&ChkBunen=&ChkParking=&ChkVegKodawari=&ChkFishKodawari=&ChkHealthy=&ChkVegetarianMenu=&ChkSake=&ChkSakeKodawari=&ChkShochu=&ChkShochuKodawari=&ChkWine=&ChkWineKodawari=&ChkCocktail=&ChkCocktailKodawari=&ChkNomihoudai=&ChkOver180minNomihoudai=&ChkTabehoudai=&ChkFineView=&ChkNightView=&ChkOceanView=&ChkHotel=&ChkKakurega=&ChkHouse=&ChkSanitation=&ChkStylish=&ChkRelax=&ChkWideSeat=&ChkCoupleSeat=&ChkCounter=&ChkSofa=&ChkZashiki=&ChkHorikotatsu=&ChkTerrace=&ChkKaraoke=&ChkDarts=&ChkLive=&ChkSports=&ChkOver150minParty=&ChkCelebrate=&ChkCarryOnDrink=&ChkSommelier=&ChkPet=&ChkTakeout=&ChkDelivery=&ChkPremiumCoupon=&freecall=&ChkNewOpen=&award_prize=&chk_hyakumeiten_genres=&ChkTpointGive=&ChkTpointUse=&ChkGteMealTicket=&ChkEnglishMenu=&ChkMorningMenu=&ChkAllergyLabeling=&ChkCalorieLabeling=&ChkSweetsTabehoudai=&ChkEMoneyPayment=&ChkKoutsuuIcPayment=&ChkRakutenEdyPayment=&ChkNanacoPayment=&ChkWaonPayment=&ChkIdPayment=&ChkQuicPayPayment=&ChkKids=&ChkBabies=&ChkPreschoolChild=&ChkElementarySchoolStudent=&ChkKidsMenu=&ChkBabycar=&ChkTachiNomi=&ChkProjector=&ChkPowerSupply=&ChkWheelchair=&ChkFreeWifi=&ChkPaidWifi=&LstCos=&LstCosT=&RdoCosTp=2&LstSitu=&LstRev=&ChkCoupon=&ChkCampaign="

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




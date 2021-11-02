
from bs4 import BeautifulSoup
from urllib import request
import datetime
import numpy as np

def period(year,month,year_s = 2019,year_e = 2019,month_s = 3,month_e = 4):
    res = False
    if (year<=year_e) & (year >=year_s) & (month>=month_s) & (month<=month_e):
        res = 2
    if year >= year_e:
        if year > year_e:
            res = 1
        else:
            if month>month_e:
                res = 1

    return res



def main():
    dic = []
    states = [0]
    for state in range(len(states)):
        url = 'https://kaiten-heiten.com/category/restaurant/takoyaki/?s=%E3%80%90%E9%96%8B%E5%BA%97%E3%80%91'
        response = request.urlopen(url)
        soup = BeautifulSoup(response,'html.parser')

        for a in soup.find_all('a', class_="post_links"): 
            link = a.get('href')
            date = a.text[6:16]
            all_data = a.text
            # print(all_data)
            # print(date)
            s_flag = False
            shop_name = ""
            for i in range(len(all_data)):
                #店の名前に関する処理
                if s_flag:
                    if all_data[i]=='\n':
                        s_flag=False
                    else:
                        shop_name+=all_data[i]
                elif all_data[i]=='】':
                    s_flag = True
            # print(shop_name)


            # if dic.get(shop_name) is None:
            #     dic[shop_name] = [0,0]



            url = link
            response = request.urlopen(url)
            soup = BeautifulSoup(response,'html.parser')
            prefecture = ""
            address_data = soup.find('h3')
            address = address_data.text
            index = 0
            while True:
                prefecture+=address[index]
                if address[index]=='都' or address[index]=='道' or address[index]=='府' or address[index]=='県':
                    break
                else:
                    index+=1
            phone = soup.select('td')[3].text
            dic.append([date,prefecture,shop_name,phone])
    return dic






print(main())

from bs4 import BeautifulSoup
from urllib import request
import datetime
import numpy as np
import time



def scrape():
    dic = []
    url = 'https://10-19.kaiten-heiten.com/category/restaurant/cafe-restaurant/?s=%E3%80%90%E9%96%89%E5%BA%97%E3%80%91'
    u_flag = True
    while u_flag:
        response = request.urlopen(url)
        soup = BeautifulSoup(response,'html.parser')
        next_url = soup.find('a', class_="next page-numbers")
        if next_url != None:
            next_url = next_url.get('href')
        else:
            u_flag=False

        for a in soup.find_all('a', class_="post_links"): 
            link = a.get('href')
            date = a.text[6:16]
            all_data = a.text
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
            url = 'https://10-19.kaiten-heiten.com/dogcafe-rollick/'
            response = request.urlopen(url)
            soup = BeautifulSoup(response,'html.parser')

            #都道府県データが必要になったらここのコメントを外す
            # prefecture = ""
            # address = soup.select('td')[1].text
            # index = 0
            # while True:
            #     if index>=len(address):
            #         print(address)
            #         break
            #     if address[index]=='都':
            #         if index-2>=0 and address[index-2]=='東':
            #             prefecture = '東京都'
            #         else:
            #             prefecture = '京都府'
            #         break
            #     elif address[index]=='道' or address[index]=='府' or address[index]=='県':
            #         if address[index-1]=='川' and address[index-2]=='奈':
            #             prefecture = '神奈川県'
            #         elif address[index-2]=='歌':
            #             prefecture = '和歌山県'
            #         elif address[index-2]=='児':
            #             prefecture = '鹿児島県'
            #         else:
            #             prefecture = address[index-2:index+1]
            #         break
            #     index+=1


            ## 緯度、経度の取得
            map_link = soup.find_all('iframe')
            if len(map_link)==0:
                # print(date)
                dic.append([date,shop_name,"-1","-1"])
                continue
            test = map_link[len(map_link)-1]
            txt = test.get('src')
            pos2d = txt.find('!2d')
            possll = txt.find('&sll')
            posll = txt.find('&ll')
            ido=""
            keido=""
            if pos2d>0:
                pos3d = txt.find('!3d')
                ido = txt[pos2d+3:pos3d]
                pos2m = txt.find('!2m')
                pos3m = txt.find('!3m')
                if pos2m>0:
                    keido = txt[pos3d+3:pos2m]
                elif pos3m>0:
                    keido = txt[pos3d+3:pos3m]
            elif possll>0:
                possspn = txt.find('&sspn')
                possll += 5
                while txt[possll]!=',':
                    ido += txt[possll]
                    possll+=1
                possll+=1
                if possspn>0:
                    keido = txt[possll:possspn-1]
                else:
                    poshl = txt.find('&hl')
                    keido = txt[possll:poshl-1]

            else:
                posspn = txt.find('&spn')
                posll += 4
                while txt[posll]!=',':
                    ido += txt[posll]
                    posll+=1
                posll+=1
                keido = txt[posll:posspn-1]

            dic.append([date,shop_name,ido,keido])
        url = next_url

    return dic






if __name__ == "__main__":
    data = scrape()
    f = open('cafe_restaurant_cl_2020.csv', 'w')
    f.write("Date,ShopName,longitude,latitude\n")
    for d in data:
        f.write(d[0]+","+d[1]+","+d[2]+","+d[3]+"\n")
    f.close()

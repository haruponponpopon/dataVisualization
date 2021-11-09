
from bs4 import BeautifulSoup
from urllib import request
import datetime
import numpy as np



def scrape(url_set):
    dic = []
    # url_set = ['https://kaiten-heiten.com/category/restaurant/india/?s=%E3%80%90%E9%96%89%E5%BA%97%E3%80%91']
    for ii in range(len(url_set)):
        url = url_set[ii]
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
                if ii==0 and date[0:4]=="2020":
                    u_flag=False
                    break
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
                response = request.urlopen(url)
                soup = BeautifulSoup(response,'html.parser')

                #都道府県データ
                prefecture = ""
                address = soup.select('td')[1].text
                index = 0
                while True:
                    if index>=len(address):
                        print(address)
                        prefecture = "none"
                        break
                    if address[index]=='都':
                        if index-2>=0 and address[index-2]=='東':
                            prefecture = '東京都'
                        else:
                            prefecture = '京都府'
                        break
                    elif address[index]=='道' or address[index]=='府' or address[index]=='県':
                        if address[index-1]=='川' and address[index-2]=='奈':
                            prefecture = '神奈川県'
                        elif address[index-2]=='歌':
                            prefecture = '和歌山県'
                        elif address[index-2]=='児':
                            prefecture = '鹿児島県'
                        else:
                            prefecture = address[index-2:index+1]
                        break
                    index+=1


                ## 緯度、経度の取得
                map_link = soup.find_all('iframe')
                if len(map_link)==0:
                    dic.append([date,shop_name,prefecture,"-1","-1","0"])
                    continue
                txt = ""
                pos = -1
                for ml in map_link:
                    txt = ml.get('src')
                    pos = txt.find('maps')
                    if pos>=0:
                        break
                if pos<0:
                    dic.append([date,shop_name,prefecture,"-1","-1","0"])
                    continue
                pos2d = txt.find('!2d')
                possll = txt.find('&sll')
                posll = txt.find('&ll')
                ido=""
                keido=""
                ido_start = -1
                if pos2d>0:
                    ido_start = pos2d+3
                    pos3d = txt.find('!3d')
                    ido = txt[pos2d+3:pos3d]
                    pos2m = txt.find('!2m')
                    pos3m = txt.find('!3m')
                    if pos2m>0:
                        keido = txt[pos3d+3:pos2m]
                    elif pos3m>0:
                        keido = txt[pos3d+3:pos3m]
                    dic.append([date,shop_name,prefecture,ido,keido,"0"])
                    continue
                elif possll>0:
                    ido_start = possll+5
                elif posll>0:
                    ido_start = posll+4
                index = ido_start
                while ('0'<=txt[index] and txt[index]<='9') or txt[index]=='.':
                    ido += txt[index]
                    index+=1
                index+=1
                while ('0'<=txt[index] and txt[index]<='9') or txt[index]=='.':
                    keido += txt[index]
                    index+=1
                #最後が閉店の0
                dic.append([date,shop_name,prefecture,ido,keido,"0"])
            url = next_url

    return dic






if __name__ == "__main__":
    #うなぎ
    # url_set = ['https://kaiten-heiten.com/category/restaurant/eel/?s=%E3%80%90%E9%96%89%E5%BA%97%E3%80%91',
    # 'https://10-19.kaiten-heiten.com/category/restaurant/eel/?s=%E3%80%90%E9%96%89%E5%BA%97%E3%80%91']
    # data = scrape(url_set)
    # f = open('unagi.csv', 'a')

    #カフェ
    url_set = ['https://kaiten-heiten.com/category/restaurant/cafe-restaurant/?s=%E3%80%90%E9%96%89%E5%BA%97%E3%80%91',
    'https://10-19.kaiten-heiten.com/category/restaurant/cafe-restaurant/?s=%E3%80%90%E9%96%89%E5%BA%97%E3%80%91']
    #csvファイルがまっさらな状態の時のみコメントを外す
    # f.write("Date,ShopName,Prefecture,longitude,latitude,Open\n")

    for d in data:
        if len(d)==6:
            f.write(d[0]+","+d[1]+","+d[2]+","+d[3]+","+d[4]+","+d[5]+"\n")
        else:
            print(d)
    f.close()


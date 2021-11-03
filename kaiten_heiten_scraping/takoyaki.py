
from bs4 import BeautifulSoup
from urllib import request
import datetime
import numpy as np



def scrape():
    dic = []
    # for i in range(1,22):
    url = 'https://kaiten-heiten.com/category/restaurant/takoyaki/page/1/?s=%E3%80%90%E9%96%8B%E5%BA%97%E3%80%91'
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
            response = request.urlopen(url)
            soup = BeautifulSoup(response,'html.parser')
            prefecture = ""
            address = soup.select('td')[1].text
            index = 0
            # if address[0]=='〒':
            #     index = 10
            # elif address[0]>='0' and address[1]<='9':
            #     index = 9
            while True:
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
            phone = soup.select('td')[3].text
            for i in range(len(phone)):
                if phone[i]!='-' and (phone[i]<'0' or phone[i]>'9'):
                    phone = phone[0:i]
                    break
            dic.append([date,prefecture,shop_name,phone])
        url = next_url

    return dic






if __name__ == "__main__":
    data = scrape()
    f = open('takoyaki.csv', 'w')
    f.write("Date,Prefecture,ShopName,Phone\n")
    for d in data:
        f.write(d[0]+","+d[1]+","+d[2]+","+d[3]+"\n")
    f.close()

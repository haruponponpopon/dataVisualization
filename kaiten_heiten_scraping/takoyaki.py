
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



def main(year_s = 2020,year_e = 2020,month_s = 4,month_e = 4):
    dic = {}
    states = [0]
    for state in range(len(states)):
        url = 'https://kaiten-heiten.com/category/restaurant/takoyaki/?s=%E3%80%90%E9%96%8B%E5%BA%97%E3%80%91'
        response = request.urlopen(url)
        soup = BeautifulSoup(response,'html.parser')

        for a in soup.find_all('a', class_="post_links"): 
            link = a.get('href')
            date = a.text[6:16]
            all_data = a.text 
            print(date)
            # print(all_data)
            flag = False
            shop_name = ""
            for i in range(len(all_data)):
                if flag:
                    if all_data[i]=='\n':
                        flag=False
                    else:
                        shop_name+=all_data[i]
                elif all_data[i]=='】':
                    flag = True
            print(shop_name)


            # if dic.get(shop_name) is None:
            #     dic[shop_name] = [0,0]



            url = link
#             response = request.urlopen(url)
#             soup = BeautifulSoup(response,'html.parser')

#             shop_list = soup.find_all('span', class_='post_time')

#             year_last = int(shop_list[-1].text[:5])
#             month_last = int(shop_list[-1].text[6:8])

#             for a in shop_list:      

#                 year = int(a.text[:5])
#                 month = int(a.text[6:8])


#                 if period(year, month,year_s,year_e,month_s,month_e) == 2:
#                     dic[region][state] += 1

#                 cout = 0
#                 flag = 0

#                 while period(year_last, month_last,year_s,year_e,month_s,month_e)>=1:

#                     next_p = soup.find('a',class_='next page-numbers')

#                     if soup.find_all('a',class_='next page-numbers') is not None:
#                         link = next_p.get('href')
#                     else:
#                         break

#                     url = link
#                     response = request.urlopen(url)
#                     soup = BeautifulSoup(response,'html.parser')


#                     shop_list = soup.find_all('span', class_='post_time')

#                     year_last = int(shop_list[-1].text[:5])
#                     month_last = int(shop_list[-1].text[6:8])


#                     # print(year_last,month_last)

#                     for a in shop_list:        

#                         year = int(a.text[:5])
#                         month = int(a.text[6:8])


#                         if period(year, month):
#                             dic[region][state] += 1


#     regions = list(dic.keys())
#     vals_ = np.array(list(dic.values()))

#     hk = int(22)

#     hk_name = ['北海道']
#     hk_vals = np.array([vals_[:hk,0].sum(), vals_[:hk,1].sum()])

#     regions = hk_name + regions[hk:]
#     vals = [list(hk_vals)] + list(vals_[hk:])


#     # ratio == N_o - N_c / N

#     ratio = np.zeros(len(regions))

#     for i in range(len(regions)):
#         ratio[i] = (vals[i][1] - vals[i][0]) / (vals[i][1] + vals[i][0])

#     return regions, vals, ratio, vals_


# regions_2020, vals_2020, ratio_2020, vals_2020 = main(2020,2020,3,4)
# regions_2019, vals_2019, ratio_2019, vals_2019 = main(2019,2019,3,4)
main()
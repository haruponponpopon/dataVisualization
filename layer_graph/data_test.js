var ShopData=[];
ShopData.push({title:'Test Data',
genre_num: 5,
genre:[ "GROUP01", "GROUP02", "GROUP03", "GROUP04", "GROUP05"],
min_date:-0.67930643331712,
max_date:2.0725075529,
dist:[
[17,0,1,4,9],
[68,1,8,21,24],
[227,2,12,52,69],
[597,7,25,192,171],
[1202,15,51,428,321],
[2004,29,97,853,540],
[2862,19,110,1290,745],
[3501,22,131,1665,859],
[3861,14,139,2032,961],
[3890,5,131,1923,876],
[3381,7,106,1760,844],
[2667,6,93,1465,724],
[2155,1,60,1075,653],
[1584,3,49,810,473],
[1220,0,33,581,377],
[864,0,22,437,280],
[660,0,12,357,225],
[460,0,14,290,174],
[345,1,10,230,142],
[264,0,12,192,97],
[205,0,11,183,81],
[168,0,4,190,62],
[127,0,5,208,38],
[110,0,5,168,28],
[108,0,8,123,25],
[78,0,4,128,9],
[57,0,0,87,11],
[48,0,3,74,12],
[47,0,1,59,9],
[29,0,0,61,3],
[24,0,0,36,8],
[19,0,2,41,1],
[13,0,2,24,2],
[14,0,1,15,2],
[11,0,1,13,1],
[7,0,0,9,1],
[8,0,0,14,0],
[4,0,0,6,0],
[9,0,0,1,0],
[8,0,0,5,1],
[4,0,0,6,0],
[10,0,1,19,0]
],
quant:[
[1730,19,80,572,501,18,98,27,136,0,6,3,9,46,742,2,9,11,23,23,0,65,0,0,426,73,316,81,345,6,33,2368,26,103,62,1,3,3,19,10,3,0,2611,43,163,346,8876],
[2175,29,102,878,579,10,81,11,118,1,2,3,14,53,662,1,3,2,43,22,2,47,0,0,403,19,164,55,288,1,16,2564,7,77,51,0,0,1,14,9,0,0,2411,33,173,339,8575],
[2213,19,93,997,603,4,66,29,104,0,4,1,16,52,628,0,1,1,35,25,0,49,0,0,378,6,136,30,269,3,9,2464,3,93,35,1,1,1,10,2,0,0,2440,42,169,332,8673],
[2273,17,73,1031,546,3,71,18,109,1,3,2,11,50,590,0,4,0,33,17,0,26,0,1,376,3,130,33,300,1,4,2375,3,99,42,0,0,1,4,4,1,0,2593,33,147,365,8645],
[2168,11,89,1064,528,3,41,16,108,0,0,0,15,53,647,1,2,0,42,17,0,22,0,0,365,6,157,43,269,0,1,2200,0,115,37,0,0,2,6,1,0,1,2726,36,159,327,8759],
[2179,11,76,1103,521,4,44,13,96,0,2,0,12,50,689,0,1,0,32,11,0,13,0,0,357,0,139,33,255,1,2,2129,1,140,31,1,0,0,2,1,0,0,2864,31,176,305,8713],
[2089,6,76,1135,519,1,33,15,88,0,3,1,12,56,640,0,0,0,32,12,0,3,0,0,379,2,116,26,262,0,2,2121,1,156,41,1,0,0,4,1,0,0,2883,41,162,280,8838],
[2070,2,77,1025,508,1,43,9,78,0,2,0,10,49,585,0,2,0,33,5,0,9,0,0,365,2,102,29,308,0,1,2193,0,152,44,0,0,1,1,1,0,0,3137,45,159,272,8718],
[2004,0,65,982,434,1,34,9,74,0,0,0,13,39,566,0,1,1,26,6,0,5,0,0,368,1,102,26,260,1,0,2191,0,166,33,0,0,0,0,0,0,0,3294,45,203,234,8853],
[1806,6,63,915,465,0,16,5,52,0,1,0,10,34,546,0,1,0,19,6,0,4,0,0,381,0,98,39,251,0,0,2261,0,150,33,0,0,0,0,1,0,0,3473,53,184,247,8918],
[1696,4,47,988,429,1,19,11,58,0,0,0,5,34,567,0,2,0,21,11,0,11,0,0,387,0,86,39,293,1,0,2405,0,129,41,0,0,1,0,0,0,0,3580,46,190,182,8754],
[1500,2,53,810,425,0,19,11,62,0,1,0,4,33,518,0,0,0,10,4,0,3,0,0,381,0,84,26,271,0,0,2449,1,105,29,0,0,0,1,0,0,0,3839,44,209,187,8956],
[1497,1,41,723,417,0,26,5,48,0,1,0,3,30,500,0,0,0,12,6,0,3,0,0,321,1,67,33,236,0,0,2610,0,99,38,0,0,0,0,1,0,0,3971,57,184,171,8936],
[1321,1,42,691,397,0,13,7,39,0,0,0,6,24,454,0,0,0,8,2,0,2,0,0,306,0,67,31,242,0,1,2706,0,77,16,0,0,0,2,0,0,0,4330,53,153,127,8919],
[1243,3,34,621,383,0,8,7,44,0,0,0,4,25,440,0,0,0,8,4,0,1,1,0,322,0,61,24,242,0,0,2728,0,72,32,1,0,0,0,0,0,0,4528,42,177,119,8864],
[1159,0,28,560,355,0,11,5,25,0,0,0,4,26,423,0,0,0,6,2,0,1,0,0,295,0,41,24,238,0,0,2902,0,56,27,1,0,0,1,0,0,0,4808,47,198,102,8692],
[992,0,29,500,321,0,10,7,20,0,0,0,7,25,317,0,0,0,4,2,0,1,0,0,242,0,37,33,203,0,0,3065,0,25,24,0,0,0,0,0,0,0,5371,46,210,87,8460],
[938,0,23,526,331,0,8,4,38,0,0,0,1,26,304,0,0,0,5,3,0,1,0,0,237,0,21,24,258,0,0,3201,0,28,25,0,0,0,0,2,0,0,5722,15,201,75,8020],
[867,1,30,608,345,0,3,3,22,0,0,0,3,15,219,0,0,0,0,1,0,0,0,0,270,0,26,23,265,0,0,3275,1,12,29,0,0,0,0,0,0,0,6389,23,226,42,7340],
[1017,0,43,1398,251,0,2,2,15,0,0,0,2,16,129,0,0,0,0,1,0,0,0,0,352,0,17,25,261,0,0,3807,0,9,24,0,0,0,0,0,0,0,4708,12,143,33,7771]
]});

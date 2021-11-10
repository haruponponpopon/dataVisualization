function isPrefectureId(number){
    let prefecture_id = number;
    prefecture_id = prefecture_id < 10 ? '0' + String(prefecture_id) : String(prefecture_id);
    return prefecture_id;
}

function makeTopojsonPrefecture(){
    let topojsonPrefecture = new Array(48);
    topojsonPrefecture[0] = 0; // not used

    for (let i = 1; i < 48; i++){
        const prefecture_id = isPrefectureId(i);

        d3.json(`./prefectures/${prefecture_id}.topojson`).then(function(data){
            topojsonPrefecture[i] = [data, data.objects[prefecture_id]];
        });
    }
    return topojsonPrefecture;
}

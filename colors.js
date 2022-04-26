let doodlesColor = []


function getColors(label){
    for (let i = 0; i < doodlesColor.length; i++){
        let v = doodlesColor[i];
        if (v[0] == label.toString()){
            return v[1];
        }
    }
    return [175, 175, 175];
}

function setColor(){
    doodlesColor.push(['flower', [178, 102, 255]]);
    doodlesColor.push(['cat', [75, 81, 77]]);
    doodlesColor.push(['cactus', [35, 125, 65]]);
    doodlesColor.push(['snowman', [204, 255, 255]]);
    doodlesColor.push(['tiger', [255, 128, 0]]);
    doodlesColor.push(['zebra', [255, 255, 255]]);
    doodlesColor.push(['teddy-bear', [153, 76, 0]]);
    doodlesColor.push(['banana', [238, 228, 94]]);
    doodlesColor.push(['rabbit ', [230, 230, 219]]);
    doodlesColor.push(['wine_bottle', [141, 29, 59]]);
    doodlesColor.push(['wine_glass', [145, 36, 65]]);
    
}
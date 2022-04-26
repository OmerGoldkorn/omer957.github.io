let x,y;
let nextPen;

let seedPoints = []
let rdpPoints;
let personDrawing = false;

let pgShow;

let pg; 
let originalL;
let onlyColor;
let onlyLines;

let obj;

let slider;

let H = 450;

///==========================================================

let doodleclassifier;
let resultsDiv;
let result;
let confidenceResult;

function modelReady(){
console.log("model loaded");
doodleclassifier.classify(pg, gotResults);
}
  
function gotResults(error, results){
    if(error){
        console.log(error);
        return;
    }
    console.log(results);

    let content = `
                    ${results[0].label} 
                    ${nf(100 * results[0].confidence, 2, 1)}%<br/>
                    ${results[1].label}
                    ${nf(100 * results[1].confidence, 2, 1)}%<br/>
                    ${results[2].label} 
                    ${nf(100 * results[2].confidence, 2, 1)}%<br/>
                    ${results[3].label}
                    ${nf(100 * results[3].confidence, 2, 1)}%<br/>
                    ${results[4].label}   
                    ${nf(100 * results[4].confidence, 2, 1)}%<br/>-------------------------<br/>`;

    resultsDiv.html(content);
    result = results[0].label;
}
///==========================================================
function BshowPG(){
  pgShow = true;
  obj.showPG();
  doodleclassifier.classify(pg, gotResults);
  image(pg, 10, 10);
}

function BshowoOiginalL(){
  currToShow = originalL;
  image(originalL, 10, 10);
  image(onlyLines, 10, 10);
  pgShow = false;
}

function BmarkObj(){
  pgShow = true;
  obj.mark();
  image(pg, 10, 10);
}

function BshowMatchingPG(){
  pgShow = true;
  obj.updateMatchingStrokes();
  obj.showMatchingPG();
  doodleclassifier.classify(pg, gotResults);
  image(pg, 10, 10);
}

function BnewObject(){
  pg.background(255);
  obj.restart();
}

function BonlyColor(){
  pgShow = true;
  image(onlyColor, 10, 10);
}

function callSetUp(){
  resultsDiv.html(''); // reset the html element
  setup();
}

function drawMatrix(){
  pg.stroke(255,0,0);
  pg.strokeWeight(0.5);
  let space = 450 / 28;
  for(let i = 1; i < 28; i++){
    pg.line(space * i, 0, space * i, 450)
    pg.line(450, space * i, 0, space * i)
  }
  image(pg, 10, 10);
}

function checkC(col){
  if(col[0] < 10 && col[1] < 10 && col[2] < 10){
    return true;
  }
}

function checkPixel(x,y, layer){
  let space = H/28;
  let colUL =  layer.get(x , y);
  let colUR = layer.get(x + space , y);
  let colDL =  layer.get(x, y + space);
  let colDR = layer.get(x + space , y + space);
  let colmid = layer.get(x + 0.5*space, y + 0.5*space);

  if (checkC(colmid)){
    return true;
  }
  let counter = 0;
  for(let col of [colUL, colUR, colDL, colDR]){
    if(checkC(col)){
      counter += 1;
    }
    if (x == 27 * space || y == 27 * space){
      counter -= 2
    }
  }
  return counter > 1;
}

function drawPixels(){
  let space = 450 / 28;
  pg.fill(255,0,0);
  pg.strokeWeight(0.25);
  for(let i = 0; i < 28; i++){
    for(let j = 0; j < 28; j++){
      let x = i * space;
      let y = j * space;
      if(checkPixel(x,y, pg)){
        pg.rect(x,y,space, space);
      }
    }
  }
  drawMatrix();
}


function setButtons(){
  button = createButton('reset');
  button.position(485, 525);
  button.mousePressed(callSetUp);

  button5 = createButton('new object');
  button5.position(540, 525);
  button5.mousePressed(BnewObject);

  button9 = createButton('manage');
  button9.position(10, 575);
  button9.mousePressed(manageButtons);
}

function manageButtons(){
  button1 = createButton('show pg');
  button1.position(485, 550);
  button1.mousePressed(BshowPG);

  button2 = createButton('showoOiginalL');
  button2.position(485, 575);
  button2.mousePressed(BshowoOiginalL);

  button3 = createButton('mark obj');
  button3.position(555, 550);
  button3.mousePressed(BmarkObj);

  button4 = createButton('show matching');
  button4.position(630, 550);
  button4.mousePressed(BshowMatchingPG);
  
  button6 = createButton('onlyColor');
  button6.position(740, 550);
  button6.mousePressed(BonlyColor);

  button7 = createButton('matrix');
  button7.position(220, 520);
  button7.mousePressed(drawMatrix);

  button8 = createButton('drawPixels');
  button8.position(220, 545);
  button8.mousePressed(drawPixels);
}


function setup() {

  slider = createSlider(1, 20, 5);

  setupParticles();
  // console.log('loaded paricles');
  let canvas = createCanvas(1000, 600);
  pixelDensity(1);

  setColor();

  doodleclassifier = ml5.imageClassifier('DoodleNet', modelReady);
  resultsDiv = createDiv('model loading')

  pg = createGraphics(450, 450);
  pg.background(255);

  originalL = createGraphics(450, 450);
  originalL.background(255);

  onlyColor = createGraphics(450,450);
  onlyColor.background(255);
  onlyLines = createGraphics(450,450);
  onlyLines.background(255,0)

  pgShow = false;

  background(150);
  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(10, 10, 450, 450);
  rect(540, 10, 450, 450);

  // when the a the mouse is pressed - save mouse cordinates and sets personDraeind as True
  canvas.mousePressed(startDrawing);
  // start the procees of generating drawing
  canvas.mouseReleased(sketchInLeft);
  setButtons();
  seedPoints = [];

  obj = new OBJECT();
}

function draw() {
  
  // obj.drawOnlyLines();
  simpleDrawing();
  if(!pgShow){
    BshowoOiginalL();
  }
  updateParicles();
};
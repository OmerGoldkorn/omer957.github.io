let CLOSED_SHAPE_DIST = 10;
let margins = 30;
let THICKNESS = 5;
let FRACT = 1;
let prevS = [];

//--------------------------------------------------------------------

let particles = [];

class myParticle {

  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.r = random(4, 12);
      this.lastC = [255,255,255]
  }

  updatePlace() {
    this.x += random(-10, 10);
    this.y += random(-10, 10);

    this.x = constrain(this.x, this.r/2, 450-this.r/2);
    this.y = constrain(this.y, this.r/2, 450-this.r/2);
  };

  show(){
    originalL.noStroke();
      // var px = floor(this.x / vScale);
      // var py = floor(this.y / vScale);
    let col = onlyColor.get(this.x, this.y);
      
    originalL.fill(col[0]*FRACT + (1-FRACT)*this.lastC[0], col[1]*FRACT + (1-FRACT)*this.lastC[1],col[2]*FRACT + (1-FRACT)*this.lastC[2]);
    originalL.circle(this.x, this.y, this.r);
    this.lastC = [col[0], col[1], col[2]];
  }
}

function setupParticles(){
  for(let i = 0; i < 100; i++){
      particles.push(new myParticle(random(0,450), random(0,450)));
  }
}

function updateParicles(){
  for(let i = 0; i < 100; i++){
      particles[i].updatePlace();
      particles[i].show();
  } 
}

//--------------------------------------------------------------------

function checkCollosion0(L){

  let currL = [];
  currL = concat(currL, L);

  if(currL.length == 0){
    return false;
  }

  let ps = currL[0];
  let pe = currL[currL.length - 1];
  let ope;
  let ops;

  for (let i = 0 ; i < obj.strokes.length; i++){
    let s = obj.strokes[i];
    if(L != s){
      ops = s[0];
      ope = s[s.length-1]
      if (dist(pe.x, pe.y, ops.x, ops.y) < CLOSED_SHAPE_DIST){
        currL = concat(currL, s);
        // obj.strokes[i] = currL;
        // break;
      }
      else if(dist(ope.x, ope.y, ps.x, ps.y) < CLOSED_SHAPE_DIST){
        currL =  concat(s, currL);
        // obj.strokes[i] = currL;
        // break;
      }
      else if(dist(ope.x, ope.y, pe.x, pe.y) < CLOSED_SHAPE_DIST){
        currL = concat(currL, reverse(s));
        // obj.strokes[i] = currL;
        // break;
      } 
      else if(dist(ps.x, ps.y, ops.x, ops.y) < CLOSED_SHAPE_DIST){
        currL = concat(reverse(s), currL);
        // obj.strokes[i] = currL;
        // break;
      }
    }
  }
  return currL;
}


function checkCollosion1(currL, prevL){

  if(currL.length == 0 || prevL.length == 0){
    return currL;
  }
  let PCS = currL[0];
  let PCE = currL[currL.length - 1];
  let PPS = prevL[0];
  let PPE = prevL[prevL.length - 1];

  if(dist(PCS.x, PCS.y, PPS.x, PPS.y) < CLOSED_SHAPE_DIST && dist(PCE.x, PCE.y, PPE.x, PPE.y) < CLOSED_SHAPE_DIST){
    return concat(reverse(currL), prevL);
  }
  else if(dist(PCS.x, PCS.y, PPE.x, PPE.y) < CLOSED_SHAPE_DIST && dist(PCE.x, PCE.y, PPS.x, PPS.y) < CLOSED_SHAPE_DIST){
    return concat(prevL, currL);

  }
  else{
    return currL
  }
}

function checkCollosion2(currL){

  if(currL.length == 0){
    return false;
  }

  let ps = currL[0];
  let pe = currL[currL.length - 1];
  let flag1 = false
  let flag2 = false;

  let L = [];

  for (let i = 0 ; i < (obj.strokes.length-1) ; i++){
    let s = obj.strokes[i];
    if(currL != s){
      for (let v of s){
        if(dist(ps.x, ps.y, v.x, v.y) < CLOSED_SHAPE_DIST){
          flag1 = true;
        }
        else if(dist(pe.x, pe.y, v.x, v.y) < CLOSED_SHAPE_DIST){
          flag2 = true;
        }
    }
  }
    return flag1 && flag2;
  }
}

function checkCollosion3(L){

  let currL = [];
  currL = concat(currL, L);

  if(L.length == 0){
    return false;
  }

  let ps = currL[0];
  let pe = currL[currL.length - 1];
  let flag1 = false
  let flag2 = false;

  let p1;
  let p2;
  let LINE;


  let startFirst = false;
  let endFirst = false;


  for (let i = 0 ; i < obj.strokes.length - 1 ; i++){
    let s = obj.strokes[i];
    if (s == L){
      continue;
    }
    flag1 = false;
    flag2 = false;
    if(currL != s){
      for (let v of s){
        if(dist(ps.x, ps.y, v.x, v.y) < CLOSED_SHAPE_DIST){
          flag1 = true;
          p1 = v;
          LINE = s;
          if(!endFirst){
            startFirst = true;
          }
        }
        else if(dist(pe.x, pe.y, v.x, v.y) < CLOSED_SHAPE_DIST){
          flag2 = true;
          p2 = v;
          LINE = s;
          if(!startFirst){
            endFirst = true;
          }
        }
        if (flag1 && flag2){
          break;
        }
      }
    }
    if (flag1 && flag2){
      break;
    }
  }
  if(flag1 && flag2){
    let temp = [];
    let flag = false;
    for(let v of LINE){
      if (flag){
        temp.push(v);
      }
      if (v == p1 || v == p2){
        if(flag){
          break;
        }
        else{
          temp.push(v);
          flag = true;
        }
      }
    }
    if(startFirst){
      currL = concat(reverse(L), temp)
    }
    else{
      currL = concat(L, temp)
    }
  }
  return currL
}

//--------------------------------------------------------------------

class OBJECT{

  constructor(){
    this.time = millis();
    this.lx = 0;
    this.rx = 0;
    this.dy = 0;
    this.uy = 0;
    this.strokes = [];
    this.matchingStrokes = [];
    this.strokesWeights = [];
    this.halfR = 0;
    this.midx = 0;
    this.midy = 0;
    this.c = color(175, 175, 175);
  }

  pushStroke(s){
    this.strokes.push(s);
    for(let v of s){
      if (this.lx == 0){
        this.lx = v.x;
      }else{
        this.lx = min(this.lx, v.x);
      }
      if (this.uy == 0){
        this.uy = v.y;
      }else{
        this.uy = min(this.uy, v.y);
      }
      this.rx = max(this.rx, v.x);
      this.dy = max(this.dy, v.y);   
    }
    obj.strokesWeights.push(slider.value());

    // this.lx -= 5;
    // this.uy -= 5;
    // this.rx += 5;
    // this.dy += 5;
  }

  showPG(){

    pg.background(255);

    for(let i = 0; i < this.strokes.length ; i++){
      let s = this.strokes[i];
      let p = createVector(s[0].x, s[0].y);
      pg.stroke(0);
      pg.strokeWeight(slider.value());
      for(let v of s){
        pg.line(v.x, v.y, p.x, p.y);
        p = createVector(v.x, v.y);
      }
    }
  }

  mark(){
    this.showPG();
    pg.noFill();
    pg.strokeWeight(1);
    pg.stroke(0,0,200);
    pg.rect(this.midx - this.halfR, this.midy-this.halfR, 2*this.halfR, 2*this.halfR);
    pg.strokeWeight(3);
    pg.stroke(255,0,0);
    pg.rect(this.lx, this.uy, this.rx-this.lx, this.dy-this.uy);

  }

  updateMatchingStrokes(){
    this.midy = 0.5*(this.dy + this.uy);
    this.midx = 0.5*(this.rx + this.lx);
    this.halfR = max(abs(this.midy - this.dy), abs(this.midx - this.lx));

    this.matchingStrokes = [];
  
    for(let i = 0; i < this.strokes.length ; i++){
      let s = this.strokes[i];
      let new_s = [];
      for(let v of s){
        let newX = map(v.x, this.midx-this.halfR, this.midx+this.halfR, 0 + 0.5*margins, 440 - 0.5*margins);
        let newY = map(v.y, this.midy-this.halfR, this.midy+this.halfR, 0 + 0.5*margins, 440 - 0.5*margins);
        new_s.push(createVector(newX, newY));
      }
      this.matchingStrokes.push(new_s);
    
    }
  }

  showMatchingPG(){

    pg.background(255);

    for(let i = 0; i < this.matchingStrokes.length ; i++){
      let s = this.matchingStrokes[i];
      let p = createVector(s[0].x, s[0].y);
      pg.stroke(0);

      let m = min(this.rx - this.lx, this.dy - this.up);
      m = max(m, 100);
      // m = m / (450 - margins);
      // pg.strokeWeight(THICKNESS * m  / (100));
      pg.strokeWeight(THICKNESS  * (450 - margins) / (100));
      for(let v of s){
        pg.line(v.x, v.y, p.x, p.y);
        p = createVector(v.x, v.y);
      }

    }
  }

  updateColor(){


    this.updateMatchingStrokes();
    this.showMatchingPG();
    doodleclassifier.classify(pg, gotResults);
    console.log('label: ', result);
    let rgb = getColors(result);
    console.log('color: ', rgb);
    let rand = 0;
    this.c = color(rgb[0]+random(-rand,rand), rgb[1]+random(-rand,rand), rgb[2]+random(-rand,rand));
  }

  

  drawStrokes(){
    prevS = [];
    for(let i = 0; i < this.strokes.length ; i++){

      let s = this.strokes[i];
      if(dist(s[0].x, s[0].y, s[s.length-1].x, s[s.length-1].y) >= CLOSED_SHAPE_DIST){
        // this.strokes[i] = checkCollosion0(s);
        s = checkCollosion0(s)
        console.log("here");
      }
      
      let p1 = s[0];
      let p2 = s[s.length-1];

      onlyColor.beginShape();
      onlyColor.noFill();
      onlyColor.strokeWeight(0);

      let toFill = false;

      let new_s1 = checkCollosion1(s, prevS);
      let new_s2 = checkCollosion3(s);


      if (dist(p1.x, p1.y, p2.x, p2.y) < CLOSED_SHAPE_DIST || new_s1.length > max(s.length, prevS.length) ||
         checkCollosion2(s) || new_s2.length > s.length){
        toFill = true;
      }

      if(toFill){
        originalL.fill(this.c);
        onlyColor.fill(this.c);
      }

      if (new_s2.length > new_s1.length){
        // this.strokes[i] = new_s2;
        for (let v of new_s2){      
          // originalL.vertex(v.x, v.y);  
          onlyColor.vertex(v.x, v.y);  
        }
      }
      else{
        // this.strokes[i] = new_s1;
        for (let v of new_s1){      
          // originalL.vertex(v.x, v.y);  
          onlyColor.vertex(v.x, v.y);  
        }
      }
      // originalL.endShape();
      onlyColor.endShape();
      
      updateParicles(); // color originalL after setting the color in onlyColor

      prevS = s;
    }
  }
  drawOnlyLines(){
    originalL.noFill();
    for(let i = 0; i < this.strokes.length ; i++){
      originalL.stroke(0);
      // originalL.strokeWeight(slider.value());
      onlyLines.stroke(0);
      onlyLines.strokeWeight(this.strokesWeights[i]);
      let s = this.strokes[i];

      let p = createVector(this.strokes[0].x, this.strokes[0]);
      for (let v of s){      
        // originalL.line(v.x, v.y, p.x, p.y);
        onlyLines.line(v.x, v.y, p.x, p.y);  
        p = createVector(v.x, v.y);
      }
    }
  }

  restart(){
    this.time = millis();
    this.lx = 0;
    this.rx = 0;
    this.dy = 0;
    this.uy = 0;
    this.strokes = [];
    this.matchingStrokes = [];
    this.strokesWeights = [];
    this.halfR = 0;
    this.midx = 0;
    this.midy = 0;
    this.c = color(175, 175, 175);
  }
}

//--------------------------------------------------------------------

function startDrawing(){
    personDrawing = true;
    seedPoints = [];
  }
  function inRect(xx, yy, x, y, w, h){
    if ((xx >= x) && (xx <= (x+w)) &&( yy>=y) && (yy<=(y+h))){
      return true;
    }
    return false;
  }
  
  function sketchInLeft(){
    personDrawing = false;
    if (seedPoints.length == 0){
      return;
    }

    obj.pushStroke(seedPoints);
    obj.updateColor();
    obj.drawStrokes();
    obj.drawOnlyLines();
    obj.drawOnlyLines();
    seedPoints = [];
  }
  
  function simpleDrawing(){
    strokeWeight(2);
  
    stroke(255);
    fill(155);
    rect(490, 480, 30, 30, 5);
  
  
    if (inRect(mouseX, mouseY, 540, 10, 450, 450)){
    // if (inRect(mouseX, mouseY, 10, 10, 450, 450)){
      // fill(0, 125, 0);
      // noStroke();
      // circle(mouseX, mouseY, 2);
  
      fill(0, 255, 0);
      stroke(255);
      rect(490, 480,30, 30, 5);
  
      if (personDrawing){
        stroke(0, 125, 125);
        strokeWeight(slider.value());
        line(mouseX, mouseY, pmouseX, pmouseY);

        // originalL.stroke(0);
        // originalL.strokeWeight(slider.value());
        // originalL.line(mouseX-10, mouseY-10, pmouseX-10, pmouseY-10);

        seedPoints.push(createVector(mouseX-540, mouseY-10));

      }
    }
    else if (inRect(mouseX, mouseY, 10, 10, 450, 450)){
    // else if(inRect(mouseX, mouseY, 540, 10, 450, 450)){
      // originalL.fill(125, 0, 0);
      // originalL.noStroke();
      // originalL.circle(mouseX, mouseY, 2);
      fill(255, 0, 0);
      stroke(255);
      rect(490, 480,30, 30, 5);
    }
  }
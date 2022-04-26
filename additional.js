// let sketchRNN;
// let currentStroke;
// let x,y;
// let nextPen;
// let seedPoints = []
// let seedPath = []
// let personDrawing = false;


// function preload() {
//   sketchRNN = ml5.sketchRNN('cat');
// }

// // updates the current stroke and print the specs of it
// function gotStrokePath(error, strokePath) {
//   console.log(strokePath);
//   currentStroke = strokePath;
// }

// function startDrawing(){
//   personDrawing = true;
//   sketchRNN.reset();
//   x = mouseX;
//   y = mouseY;
//   seedPoints = [];
//   seedPath = [];
// }

// function sketchRNNStart(){
//   personDrawing = false;
  
//   // perform RDP line simplication:
//   const rdpPoints = [];
  
//   const total = seedPoints.length;
//   const start = seedPoints[0];
//   const end = seedPoints[total-1];
  
//   rdpPoints.push(start);
//   rdp(0,total-1,seedPoints, rdpPoints);
//   rdpPoints.push(end);
  
//   //generating more smooth line
//   seedPath = [];
//   for (let i = 1; i < rdpPoints.length ; i++){
//         let strokePath = {
//         dx: rdpPoints[i].x - rdpPoints[i-1].x,
//         dy: rdpPoints[i].y - rdpPoints[i-1].y,
//         pen: 'down'    
//         }
//         seedPath.push(strokePath);
//   }
  
//   x = rdpPoints[rdpPoints.length - 1].x;
//   y = rdpPoints[rdpPoints.length - 1].y;
  
//   // demponstrite the change od rdp
//   background(220);
//   fill(100, 50);
//   stroke(0, 0, 255); // the color of the shape
//   beginShape();
//   for (let v of rdpPoints){
//     vertex(v.x, v.y);
//   }
  
//   endShape();
  
//   // load the pre-human-drawn-stoke to the model
//   sketchRNN.generate(seedPath, gotStrokePath);
// }

// function setup() {
//   let canvas = createCanvas(800, 800);

//   background(150);
//   // when the a the mouse is pressed - save mouse cordinates and sets personDraeind as True
//   canvas.mousePressed(startDrawing);
//   // start the procees of generating drawing
//   canvas.mouseReleased(sketchRNNStart);
  
//   console.log('model loaded');
// }

// function draw() {
//   strokeWeight(10);
  
//   if (personDrawing){
//     stroke(0, 255,0);
    
//     line(mouseX, mouseY, pmouseX, pmouseY);
//     seedPoints.push(createVector(mouseX, mouseY));
//   }
  
  
//   if (currentStroke){
//     stroke(50, random(255), 50); // random shade of green for drawing/ 
  
//     if(nextPen == 'end'){
//       sketchRNN.reset();
//       sketchRNNStart();
//       currentStroke = null;
//       nextPen = 'down';
//       return;
//       return;
//     }
    
//     if(nextPen == 'down'){
//       line(x,y,x + currentStroke.dx, y + currentStroke.dy);      
//     }
    
//     x += currentStroke.dx;
//     y += currentStroke.dy;
//     nextPen = currentStroke.pen;
//     currentStroke = null;
//     sketchRNN.generate(gotStrokePath);
//   }

// }
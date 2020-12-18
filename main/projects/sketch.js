let snow = [];
let gravity; 
let zOff = 0;
let regWind;

let spriteSheet;
let textures = [];

function preload() {
  spriteSheet = loadImage('flakes32.png');
}

function setup() {
  //slider.style('width', '80px');

  createCanvas(windowWidth, windowHeight);
  noStroke();

   /* SLIDERS */
  gravSlider = createSlider(1, 10, 1, 1);
  gravSlider.position(10, 20);
  windSlider = createSlider(-5, 5, 0, 1);
  windSlider.position(10, 60);
  snowSlider = createSlider(50, 750, 250, 50);
  snowSlider.position(10, 100);
  swingSpeedSlider = createSlider(0, 5, 1, 1);
  swingSpeedSlider.position(160, 20);
  swingWidthSlider = createSlider(0, 5, 1, 1);
  swingWidthSlider.position(160, 60);

  // splice spritesheet into individual textures
  for (let x = 0; x < spriteSheet.width; x += 32) {
    for (let y = 0; y < spriteSheet.width; y += 32) {
      let img = spriteSheet.get(x, y, 32, 32);
      //image(img, x, y);
      textures.push(img);
    }
  }

  for(let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let design = random(textures);
    snow.push(new Snowflake(x, y, design));
  }
  
}

function draw() {
  background(0);
  
  /* SLIDER LABELS */
  // Gravity Slider
  fill(255);
  text("Gravity: "+ gravSlider.value(), gravSlider.x * 2 , gravSlider.y);
  updateGravity();

  // Wind Slider
  text("Wind Speed: "+ windSlider.value(), windSlider.x * 2, windSlider.y);
 
  // Array Slider
  text("Snowflakes: "+ snowSlider.value(), snowSlider.x * 2, snowSlider.y);

  // swingillation Sliders
  
  text("Swing speed: "+ swingSpeedSlider.value(), swingSpeedSlider.x, swingSpeedSlider.y);
  text("Swing width: "+ swingWidthSlider.value(), swingWidthSlider.x, swingWidthSlider.y);


  // update amount of snowflakes based on slider
  while(snow.length != snowSlider.value()) {
    if(snow.length > snowSlider.value()) {
      snow.pop();
    } else {
      let x = random(width);
      let y = random(-500, 10);
      let design = random(textures);
      snow.push(new Snowflake(x, y, design));
    }
  }


  for(flake of snow) {
    // get current position of flakes in relation to canvas
    let xOff = flake.pos.x / width;
    let yOff = flake.pos.y / height;
    regWind = createVector(0,0);
    // without the 'if' statement, some snow still had some wind
    if(windSlider.value() != 0) {
      updateWind(xOff, yOff);
    } else {
      regWind = createVector(0,0);
    }

    flake.applyForce(regWind);
    flake.applyForce(gravity);
    
    flake.update(); // update velocity and angles
    flake.render(); // render and move across the screen
    
  }

}

function updateGravity() {
  gravity = createVector(0, gravSlider.value());
  gravity.mult(0.0001);

}

function updateWind(xOff, yOff){
  regWind = createVector(xOff + windSlider.value(), yOff);
  regWind.mult(0.0001);
}


function updatePerlinWind(xOff, yOff){
  // the larger the zOff, the less smooth the wind
  zOff += 1;
  // creates a flow field for the wind
    let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    wind.mult(0.0001);
}
// function updateAmount(){
//   if ()
// }

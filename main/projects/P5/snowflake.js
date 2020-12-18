function getRandomSize() {
  // normalized distribution/bell curve
  // with a standard deviation of 2.5 centered around 0
  let r = randomGaussian() * 2.5;
  return constrain(abs(r * r), 10, 36);
}

function getRandomSize2() {
  // random function that returns smaller numbers more frequently
  while (true) {
    let r1 = random(1, 36);
    let r2 = random(1, 36);
    if (r2 > r1) {
      return r1;
    }
  }
}

function getRandomSize3() {
  // the larger the exponent, the more likely smaller flakes will appear
  let r = pow(random(.6, 1), 5);
  let smallest = 8;
  let largest = 32;
  // only let the snowflakes be created if r is between 2 and 36
  return constrain(r * 36, smallest, largest);
}

class Snowflake {

  constructor(sx, sy, sprite) {
    let x = sx || random(width);

    // Instantiate snow above the screen
    let y = sy || random(-100, -10);
    this.sprite = sprite;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector();

    this.swingWidth = 1;
    this.swingSpeed = 1;

    // rotation angle
    this.angle = random(TWO_PI);

    // ternary operator for direction of angle
    this.dir = (random(1) > 0.5) ? 1 : -1;

    this.xOff = 0;

    this.size = getRandomSize3();
  }

  applyForce(force) {
    // Parallax Effect hack
    let f = force.copy();
    f.mult(this.size); // force is stronger based on size
    this.acc.add(f);
  }

  // Instead of a snowflake lasting forever, it's recycled and randomized to a new 
  // one at the top of the screen
  randomize() {
    // Instantiate snow above the screen
    let x = random(width);
    let y = random(-100, -10);

    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector();
    this.size = getRandomSize3();
  }

  update() {

    flake.swing(); // figure out how fast/far to bounce back and forth
    
    // adds gravity every frame so it keeps falling faster
    this.vel.add(this.acc);

    // resets acceleration to 0 every frame
    this.acc.mult(0);

    // limits max velocity to 30% of its size just in case
    this.vel.limit(this.size * 0.3);

    // set min velocity to 1
    if (this.vel.mag() < 1) {
      this.vel.normalize();
    }

    // Add Velocity to snowflake every frame
    this.pos.add(this.vel);

    // if snowflake falls past bottom of the screen, recycle it to the top, but randomize it
    if (this.pos.y > height + this.size) {
      this.randomize();
    }

    // If snowflakes go too far off the screen they will show up on the opposite side
    if (this.pos.x < -this.size) {
      this.pos.x = width + this.size;
    }

    if (this.pos.x > width + this.size) {
      this.pos.x = -this.size;
    }

    // rotate based on their velocity's magnitude, but slowed down
    // also uses random direction(right or left)
    this.angle += this.dir * this.vel.mag() / 200;

  }

  swing() {

    // swings based on the rotation angle and size
    // size affects how far it swings and sin of angle affects how fast
    this.swingSpeed = swingSpeedSlider.value();
    let w = swingWidthSlider.value() / 2;

    // Smoothly adjusts swing width to match slider
    // This did not work well for the swing speed unfortunately
    if(this.swingWidth < w){
      this.swingWidth = this.swingWidth + 0.005;
    }
    
    if(this.swingWidth > w){
      this.swingWidth = this.swingWidth - 0.005;
    }

    this.xOff = sin(this.angle * this.swingSpeed) * (this.size * this.swingWidth);
  }

  render() {
    // stroke(255); // color: white
    // strokeWeight(this.size); 
    // point(this.pos.x, this.pos.y);
    // push and pop to keep 

    push();
    translate(this.pos.x + this.xOff, this.pos.y);
    rotate(this.angle);
    imageMode(CENTER);
    // match image to size
    image(this.sprite, 0, 0, this.size, this.size);
    pop();
  }

  offScreen() {
    // See if the snowflake is completely off the screen based on its size
    return (this.pos.y > height + this.size ||
      this.pos.x < -this.size ||
      this.pos.x > width + this.size);
  }

}
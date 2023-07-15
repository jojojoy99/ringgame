let playerImg, monsterImg, bgImg, goldRingImg;
let player;
let monsters = [];
let goldRing;
let gameIsOver = false;
let gameWon = false;
let bgX = [0, 0];  // The x-positions of the background
let bgSpeed = 1;  // The speed of background movement
let bgWidth, bgHeight;  // The dimensions of the background image
let replayButton;  // The replay button

function preload() {
  playerImg = loadImage('girl.png');
  monsterImg = loadImage('monster.png');
  bgImg = loadImage('castle.png');
  goldRingImg = loadImage('goldRing.png');  // Load the gold ring image

}

function setup() {
  createCanvas(800, 600);
  // Calculate the dimensions of the background image based on the canvas size and image aspect ratio
  bgHeight = height;
  bgWidth = bgHeight * (bgImg.width / bgImg.height);
  bgX[1] = bgWidth;  // Set the x-position of the second background image
  player = new Player();
  for (let i = 0; i < 5; i++) {
    let monster = new Monster();
    monsters.push(monster);
  }
  goldRing = new GoldRing();  // Create the gold ring

  // Create the replay button and hide it initially
  replayButton = createButton('Replay');
  replayButton.position(width / 2, height / 2 + 50);
  replayButton.mousePressed(restartGame);
  replayButton.hide();
    
}

function draw() {
  // Draw the background images
  image(bgImg, bgX[0], 0, bgWidth, bgHeight);
  image(bgImg, bgX[1], 0, bgWidth, bgHeight);

  // Move the background images
  for (let i = 0; i < bgX.length; i++) {
    bgX[i] -= bgSpeed;
    if (bgX[i] < -bgWidth) {
      bgX[i] = bgWidth;
    }
  }

  if (!gameIsOver && !gameWon) {
    player.display();
    player.move();
    player.applyGravity();

    if (keyIsPressed && key === ' ' && player.isOnGround()) {
      player.jump();
    }

    for (let monster of monsters) {
      monster.display();
      monster.move();
      if (player.intersects(monster)) {
        gameIsOver = true;
      }
    }

    goldRing.display();  // Display the gold ring

    if (player.intersects(goldRing)) {  // If the player intersects the gold ring
      gameWon = true;
    }
  } else if (gameIsOver) {
    textSize(50);
    text("Game Over", width / 2, height / 2);
    replayButton.show();
  } else if (gameWon) {
    textSize(50);
    text("You Win!", width / 2, height / 2);
    replayButton.show();
  }
}

function restartGame() {
  // Reset all the game variables
  gameIsOver = false;
  gameWon = false;
  player = new Player();
  monsters = [];
  for (let i = 0; i < 5; i++) {
    let monster = new Monster();
    monsters.push(monster);
  }
  goldRing = new GoldRing();
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 100;
    this.speed = 3;
    this.gravity = 1;
    this.lift = -15;
    this.velocity = 0;
  }

  display() {
    image(playerImg, this.x, this.y, this.speed * 9 * 3, this.speed * 16 * 3);  // 3 times bigger
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
      this.gravity = 0;  // Temporarily disable gravity
    } else {
      this.gravity = 1;  // Enable gravity when not moving upwards
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
  }

  jump() {
    this.velocity += this.lift;
  }

  applyGravity() {
    this.y += this.velocity;
    this.velocity += this.gravity;
    // Check for ground
    if (this.y > height - (this.speed * 16 * 3)) {  // Adjust for larger image size
      this.y = height - (this.speed * 16 * 3);
      this.velocity = 0;
    }
  }

  isOnGround() {
    return this.y === height - (this.speed * 16 * 3);
  }

  intersects(other) {
    let distance = dist(this.x, this.y, other.x, other.y);
    return distance < this.speed * 9 * 3 / 2 + other.diameter / 2;  // Adjust for larger image size
  }
}

class Monster {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = 50 * 3;  // 3 times bigger
    this.speed = 2 * 4;  // 4 times faster
  }

  display() {
    image(monsterImg, this.x, this.y, this.diameter, this.diameter);
  }

  move() {
    this.x += random(-this.speed/2, this.speed/2);  // Half the range of random values
    this.y += random(-this.speed/2, this.speed/2);  // Half the range of random values
  }
}

class GoldRing {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = 50;  // Adjust as needed
  }

  display() {
    image(goldRingImg, this.x, this.y, this.diameter, this.diameter);
  }
}

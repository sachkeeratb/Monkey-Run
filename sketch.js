// Global variables
var player, player_walking, player_stop;

var backIMG, jungle, score, ground, uhoh;

var bananaIMG, food_group, obsIMG, obs_group;

var banana, obstacle;

var gameOver, gameOverIMG;

// Game states
PLAY = 1;
END = 0;
game_state = PLAY;

function preload() {
  
  // Preload the images and animations
  backIMG = loadImage("jungle.png");
  player_walking = loadAnimation( "Monkey_01.png","Monkey_02.png","Monkey_03.png","Monkey_04.png","Monkey_05.png","Monkey_06.png","Monkey_07.png","Monkey_08.png","Monkey_09.png","Monkey_10.png");
  
  bananaIMG = loadImage("banana.png");
  obsIMG = loadImage("stone.png");
  
  gameOverIMG = loadImage("gameOver.png");
  player_stop = loadImage("Monkeyuhoh.png");
}

function setup() {
  
  // Create the canvas size
  createCanvas(441, 270);
  
  // Set the score
  score = 0;
  
  // Create the uh oh value
  uhoh = 0;
  
  // Create the gameOver as a sprite
  gameOver = createSprite(220,135);
  gameOver.addImage("gameOver",gameOverIMG);
  
  // Scale it and make it invisible
  gameOver.scale = 2;
  gameOver.visible = false;
  
  // Create the sprite objects and set their animation/Image
  player = createSprite(100,230,20,50);
  player.addAnimation("walking",player_walking);
  player.addAnimation("Monkeyuhoh",player_stop);
  
  // Scale the player
  player.scale = 0.1;
  
  ground = createSprite(400,260,800,10);
  
  // Make the ground invisible
  ground.visible = false;
  
  jungle = createSprite(400,135,800,400);
  jungle.addImage("jungle", backIMG);
  
  // Reset the jungle going back
  jungle.x = jungle.width /2;
  jungle.velocityX = -4;
  
  // Make the bacground behind everything
  jungle.depth = -100;
  
  
  // Create the groups
  food_group = createGroup();
  obs_group = createGroup();
}

function draw() {
  
  // Create the background
  background(220);
  
  // If the game state equals play:
  if (game_state === PLAY) {
    // Create the bananas and obstacles
    food();
    obstacles();

    // Make it so that the player can walk on the ground
    player.collide(ground);

    // Make the player able to jump
    if(keyDown("space")&&player.y>=220) {
        player.velocityY = -17;
    }
    
    // Make the player able to jump
    if(keyDown(UP_ARROW)&&player.y>=220) {
        player.velocityY = -17;
    }

    // Create gravity for the player
    player.velocityY = player.velocityY + 0.8

    // Reset the jungle
    if (jungle.x < 0){
        jungle.x = jungle.width/2;
    }

    // Add points and destory the bananas if they touch the player
    if (food_group.isTouching(player)) {
      food_group.destroyEach();
      score = score + 2;
    }

    // Make the player bigger every 10 points
    switch(score) {
      case 10: player.scale = 0.12;
              break;
      case 20: player.scale = 0.14;
              break;
      case 30: player.scale = 0.16;
              break;
      case 40: player.scale = 0.18;
              break;
      default: break;
    }

    // Make the player smaller if the obstacle touches them
    if(obs_group.isTouching(player)) {
      
      // Destroy the obstacles
      obs_group.destroyEach();
      player.scale = 0.075;
      
      // Add an uh oh point
      uhoh = uhoh + 1;
    }
      
    // End the game at 2 uh oh points
    if(uhoh === 2) {
      game_state = END;
        
      // Change how the monkey looks
      player.changeAnimation("Monkeyuhoh",player_stop);
    }

  }
  // If the game state equals end:
  else if(game_state === END) {
    
    // Stop everything
    stop();
    
    // Make the game over sign visible
    gameOver.visible = true;
    
    // Make the player still able to be on the ground
    player.collide(ground);
    
    // If r is  pressed then reset the game
    if(keyDown("r")) {
      reset();
    }
  }
  
  // Draw the sprite objects
  drawSprites();  
  
  // Set the text's attributes and show the score 
  stroke("white");
  textSize(20);
  fill("white");
  text("Score: "+ score, 300,50);
}

// Create a fucntion to generate the bananas
function food() {
  
  // Generate a banana every 80 frames
  if (frameCount % 80 === 0) {
    
    // Create the banana, set it's animation, scale it, and generate it's Y poition randomly
    banana = createSprite(500,200,10,30);
    banana.addAnimation("Banana", bananaIMG);
    banana.scale = 0.05;
    banana.y = Math.round(random(50,135));
    
    // Set the banana's X velocity and it's lifetime
    banana.velocityX = -4;
    // (banana died too quick so it's longer)
    banana.lifetime = 150;
    
    // Add the banana to the banana group
    food_group.add(banana);
  }
}

// Create a fucntion to generate the obstacles
function obstacles() {
  
  // Generate an obstacles every 300 frames
  if (frameCount % 300 === 0) {
    
    // Create the obstacle, set it's animation, and scale it
    obstacle = createSprite(400,230,10,30);
    obstacle.addAnimation("Stone",obsIMG);
    obstacle.scale = 0.15;
    
    // Set the obstacle's X velocity and it's lifetime
    obstacle.velocityX = -4;
    obstacle.lifetime = 100;
    
    // Add the obstacle to the obstacle group
    obs_group.add(obstacle);
  }
}

// Create the reset function to reset the game
function reset() {
  game_state = PLAY;
  
  gameOver.visible = false;
  
  obs_group.destroyEach();
  food_group.destroyEach();
  
  jungle.velocityX = -4;
  jungle.x = 400;

  score = 0;
  uhoh = 0;
  
  player.changeAnimation("walking",player_walking);
  player.scale = 0.1;
}

// Create a function to stop everything
function stop() {
  food_group.setLifetimeEach(-1);
  obs_group.setLifetimeEach(-1);
  
  food_group.setVelocityXEach(0);
  obs_group.setVelocityXEach(-1);
  
  jungle.velocityX = 0;
}
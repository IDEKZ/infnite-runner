var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided, mario_walk;
var ground, invisibleGround, groundImage;
var backgroundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running =   loadAnimation("images/mc.tiff","images/mc1.tiff","images/mc2.tiff",
  "images/mc3.tiff","images/mc4.tiff","images/mc5.tiff",
  "images/mc6.tiff","images/mc7.tiff","images/mc8.tiff",
  "images/mc9.tiff");

  mario_collided = loadAnimation("images/marioUp.png");
 
  
  groundImage = loadImage("images/ground.png");
  backgroundImage = loadImage("images/day.png");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/pipe.png");
  
  obstacle2 = loadImage("images/flowerPine.png");
  obstacle3 = loadImage("images/mushroom.png");
  
  gameOverImg = loadImage("images/gameOverText.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(1200,600);

  backgroundImage.scale=0.1
  mario = createSprite(100,180,20,50);
  
  mario.addAnimation("running", mario_running);

  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.4;
  
  ground = createSprite(200,180,700,20);
  
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible=false
  gameOver = createSprite(600,300);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(900,400);
  restart.addImage(restartImg);
  
  

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,570,400,8);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  textSize(18);

  textStyle(BOLD);
  fill("black");
  score = 0;
}

function draw() {
  
  

  gameOver.position.x = restart.position.x = camera.x

  background(backgroundImage);
  
  textAlign(RIGHT, TOP);
  text("Score: "+ score, 1150,5);
 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    

    if(keyDown("space") && mario.y >= 450) {
      mario.velocityY = -15;
    }
   
    
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/3;
    }
  
    mario.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the mario animation
  

    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }


  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(1600,random(140,340),40,10);
    cloud.y = Math.round(random(190,340));
    cloud.addImage(cloudImage);
    cloud.scale = 2.5;
    cloud.velocityX = -4;
    
     //assign lifetime to the variable
   
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(camera.x+width/2,545,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(5 + 2*score/200);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);

              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
   obstacle.scale=0.2
   
  
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}

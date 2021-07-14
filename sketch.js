var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var fkground;

var background1;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  background1 = loadImage("New Project.png")
}

function setup() {
  createCanvas(displayWidth, 758);
  //createCanvas(600, 200);
  

  // Local variable
  var message = "This is a message";
 console.log(message);
  
  // Create T-Rex
  trex = createSprite(width/100,height/1.25,20,50);
  console.log(displayHeight)
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.8;
  
  // Create ground
  //ground = createSprite(width/3,200,400,20);
  //ground.addImage("ground",groundImage);
  

  fkground = createSprite(width/3,height/1.06,9000,20)
  fkground.x = fkground.width/2;
  fkground.visible = false
  fkground.shapeColor = "green";

  
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/1.6);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.8;
  restart.scale = 0.8;
  
  invisibleGround = createSprite(width/3.33,height/1.05,width,10);
  invisibleGround.visible = false;
  
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();


  // Collider for T-Rex
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  background(background1);
  
  //displaying score
  textSize(25)
  text("Score: "+ score, (trex.x - 100) + width/1.33,height/5);
  
  
  if(gameState === PLAY){

    // Invisible sprites
    gameOver.visible = false;
    restart.visible = false;
    
    // Increases ground speed at a multiple of 100
    //ground.velocityX = -(4 + 3* score/100)

    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //Checkpoint sound plays at the multiple of 100
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
  

    if (fkground.x < 0){
      fkground.x = fkground.width/2;
    }
    fkground.x = trex.x;
    
    fkground.velocityX = (4 + 3* score/100)
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.collide(invisibleGround)) {
        trex.velocityY = -16  ;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.67
    invisibleGround.velocityX = (4 + 3* score/100)
    trex.velocityX = (4 + 3* score/100)
    camera.position.x = trex.x + width/3.5
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        dieSound.play()
        trex.velocityX = 0
        invisibleGround.velocityX = 0
        fkground.velocityX = 0
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      gameOver.x =  trex.x + width/3.5
      restart.visible = true;
      restart.x =  trex.x + width/3.5
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
      //ground and trex stop moving
      
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     //stop the speed of every sprite in the group
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  obstaclesGroup.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
  
  //cordinates for the x and y position
  fill("black");
  text(mouseX+","+mouseY,trex.x,mouseY);
}

// When restart button is clicked
function reset(){
  gameState = PLAY;

  fkground.x = width/3;
  
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  gameOver.visible = false;
  restart.visible = false;
  
  score = 0;
  
  trex.changeAnimation("runningAnimation",trex_running);

}


function spawnObstacles(){
 if (frameCount % 55 === 0){
   var obstacle = createSprite(width,height/1.1 ,10,40);
   obstacle.x = trex.x + width/1.09
   //obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.9;
    obstacle.lifetime = 305;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function inv() {
  if(frameCount % 10 === 0){
  var invisibleGround = createSprite(width/3,190,400,10);
  invisibleGround.visible = false;
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0) {
    var cloud = createSprite(width,height/1.667,40,10);
    cloud.x = trex.x + width/1.091
    cloud.y = Math.round(random(height/2.5,height/1.6667));
    cloud.addImage(cloudImage);
    cloud.scale = 0.9;
    cloud.velocityX = 0;

    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


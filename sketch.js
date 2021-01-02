//Create variables here
    var dogimage,dog1image;
    var dog;
    var food;
    var database,mypos;
    var feed,addfood;
    var foodObj;
    var lastFed;
    var  gameState, readState;
    var  bedroom, garden, washroom;
    var foodStock;
    var fs,fsimg,dv,dvimg
    //var 
function preload()
{
  //load images here
  dogimage=loadImage("Dog.png");
  dog1image=loadImage("happydog.png");
  bedroom=loadImage("Bed Room.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
  fsimg=loadImage("Food Stock.png");
  dvimg=loadImage("dogVaccination.png");
}

function setup() {
	createCanvas(900, 600);
  dog=createSprite(500,450,50,50)
  dog.addImage("d",dogimage);
  dog.scale=0.3

  fs=createSprite(200,50,10,10);
  fs.addImage("s",fsimg);
  fs.scale=0.1

  dv=createSprite(800,100,10,10);
  dv.addImage("v",dvimg);
  dv.scale=0.2

  foodObj =new Food()
  database=firebase.database();
     var foodStock=database.ref("Food");
     foodStock.on("value",read)

     feed=createButton("FEED THE DOG");
     feed.position(400,100);
     feed.mousePressed(feedDog);

     addfood=createButton("ADD FOOD");
     addfood.position(590,100);
     addfood.mousePressed(addfoods);

     fedTime=database.ref('FeedTime');
     fedTime.on("value",function(data){
       lastFed = data.val();
     });

     readState=database.ref('gameState');
     readState.on("value",function(data){
       gameState=data.val();
     });
}


function draw() {  
  background("green")
  

 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("playing");
   foodObj.garden();
 }
 else if(currentTime==(lastFed+2)){
   update("sleeping");
   foodObj.bedroom();
 }
 else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
   update("bathing");
   foodObj.washroom();
 }
 
 else{
   update("hungry")
   foodObj.display();
 }
   
 if(gameState!=="hungry"){
   fs.remove()
  feed.hide();
  addfood.hide();
  dog.remove();
  dv.remove();
}
else{
  fs.addImage(fsimg)
 feed.show();
 addfood.show();
 dog.addImage(dogimage);
 dv.addImage(dvimg)
}
  
 
  drawSprites();
   
}

function read(data){
   foodS=data.val(); 
   foodObj.updateFoodStock(foodS); 
}
 
function feedDog(){
  dog.addImage(dog1image);
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour(),  // hous() is predefined to automatically get current time from your system
    gameState:"hungry"
  })
}
function addfoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}


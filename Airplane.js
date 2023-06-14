let gameArea;
let myAirplane;
let gameContext;
let myBackground;
let airplaneSpeed = 3;
let destroyObstacle = 0;
let bestScore = localStorage.getItem('BestScore') || -1;
let keys = {};
let myObstacles = [];
let myBullets = [];
function startGame(){
    gameArea = new GameBoard();
    gameArea.start();
    gameContext = gameArea.context;
    
    myAirplane = new Component(40,50,'https://cdn-icons-png.flaticon.com/512/1061/1061198.png',600,640,'image');
    myBackground = new Component(1200,1750,'https://png.pngtree.com/thumb_back/fh260/background/20201023/pngtree-abstract-pink-neon-light-gaming-background-design-image_430851.jpg',0,0,'background')

    setInterval(createObstacles,60);
    
}

class GameBoard{
    constructor(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1200;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        this.interval = 10;
        this.frameNo = 0;
        document.body.appendChild(this.canvas);
    }
    start(){
        this.intervalID = setInterval(updateGameArea,this.interval);
         
        window.addEventListener('keydown',(e) => {
         keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', (e) => {
            keys[e.keyCode] = false;
        })
        
    }
   
    stop(){
        clearInterval(this.intervalID);
    }
    
}

class Component{
    constructor(width,height,color,x,y,type){
      this.width = width;
      this.height = height;
      this.color = color;
      this.x = x;
      this.y = y;
      this.type = type;
      this.speedY = 0;
      this.speedX = 0;

    if(type === 'image' || type ==='background'){
      this.image = new Image();
      this.image.src = color;   
     }

    }


    Draw(){
       if(this.type === 'image' || this.type === 'background'){
       gameContext.drawImage(this.image,this.x,this.y,this.width,this.height);
         if(this.type === 'background'){
           gameContext.drawImage(this.image,this.x,this.y + this.height,this.width,this.height)
         } 
       }if(this.type === 'text'){
           gameContext.font = this.width + ' '+ this.height;
           gameContext.fillStyle = this.color;
           gameContext.fillText(this.text,this.x,this.y);
       }if(this.type === 'restart'){
        gameContext.fillStyle = this.color;
        gameContext.fillRect(this.x,this.y,this.width,this.height);
       }  
    }
    newPosition(){
        this.y += this.speedY;
        this.x +=this.speedX;
        if (this.type === 'background'){
           if(this.y >= 0){
              this.y = -this.height;
           }
        }
    }

    creashWith(obstacle){
        let airplaneLeft = this.x;
        let airplaneRight = this.x + this.width;
        let airplaneTop = this.y;
        let airplaneBottom = this.y + this.height;
        let obstacleLeft = obstacle.x;
        let obstacleRight = obstacle.x + obstacle.width;
        let obstacleTop = obstacle.y;
        let obstacleBottom = obstacle.y + obstacle.height;
        let crash = true;
      if( (airplaneRight < obstacleLeft + 2) || (airplaneLeft > obstacleRight - 7) || (airplaneBottom < obstacleTop) || (airplaneTop > obstacleBottom - 5)){
        crash = false;
      }
      return crash;
    }


}

function handleDirection(){
    myAirplane.speedY = 0;
    myAirplane.speedX = 0;

  if (keys[37] && myAirplane.x > 0 ){ // right arrow
     myAirplane.speedX = -1 * airplaneSpeed;
  }if(keys[38] && myAirplane.y > 0){ // top arrow
        myAirplane.speedY = -1 * airplaneSpeed;
  }if(keys[39] && myAirplane.width + myAirplane.x < gameArea.canvas.width){  // left arrow
      myAirplane.speedX = 1 * airplaneSpeed;
  }if(keys[40] && myAirplane.y + myAirplane.height < gameArea.canvas.height){ // bottom arrow
       myAirplane.speedY = 1 * airplaneSpeed;
  }
  if(keys[32]){
    createBullets();
  }
}

function createObstacles(){
    let x = getRandomCoordinate(0,gameArea.canvas.width - 40);
    let obstacle = new Component(40,40,'https://www.kindpng.com/picc/b/674-6744436_rock-transparent-png.png',x,0,'image'); 
    myObstacles.push(obstacle);
}
function getRandomCoordinate(min,max){
    return Math.floor((Math.random() * max - min + 1) + min);
}

function createBullets(){
     if(intervalBullet(8)) {
      let bullet = new Component(40,40,'https://www.freepnglogos.com/uploads/bullet-png/bullets-hd-free-png-5.png',myAirplane.x,myAirplane.y,'image');
      myBullets.push(bullet);
    }
}

function intervalBullet(n){
    return (gameArea.frameNo / n) % 1 === 0;
}

function Score(){
    let myScore = new Component('30px','Consolas','white',1000,80,'text');
    let Record = new Component('30px','Consolas','white',1000,50,'text');
    if(destroyObstacle > bestScore){
        bestScore = destroyObstacle;
        localStorage.setItem('BestScore',bestScore);
    }
    myScore.text ='Score :' + destroyObstacle;
    Record.text ='Record:' + localStorage.getItem('BestScore');
    Record.Draw();
    myScore.Draw();
}
function restartGame(){
    let coverGame = new Component(gameArea.canvas.width,gameArea.canvas.height,'rgba(0, 0, 0, 0.5)',0,0,'restart');
    coverGame.Draw();
    let button = document.createElement('button');
    button.className = 'btn Restart';
    button.textContent = 'Restart';
    document.body.appendChild(button);
    button.addEventListener('click',function(){
        location.reload();
    })
}

function updateGameArea(){
    
    myBackground.speedY = 8;
    myBackground.newPosition(); 
    myBackground.Draw();
    
    handleDirection();
    myAirplane.newPosition();
    myAirplane.Draw();
    gameArea.frameNo++;
    Score();
    for(let i = 0; i < myBullets.length; ++i){
        myBullets[i].y -= 10;
        myBullets[i].Draw();
    }

    for (let i = 0; i < myObstacles.length; ++i){
        myObstacles[i].speedY = 6;
        myObstacles[i].newPosition();
        myObstacles[i].Draw();

        for (let z = 0; z < myBullets.length; ++z){
            if(myBullets[z].creashWith(myObstacles[i])){
            myBullets.splice(z,1);
            myObstacles.splice(i,1);
            --i;
            --z;
            destroyObstacle++;
            }
        }

        if(myAirplane.creashWith(myObstacles[i])) {
          gameArea.stop();
          restartGame();
          return;
          
        }
    }
  
}
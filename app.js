var flag1=0;
var flag2=0;
var life=4;
var counter=0;

Howler.volume(0.5);

//Accessing Webcam
const video = document.getElementById('videoSrc')
video.width = window.innerWidth;
video.height = window.innerHeight;

console.log(window.innerHeight);

const startButton=document.getElementById("start");

startButton.onclick=function startWebcam(){

  start.play();

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }) 
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
  document.getElementById("Menu").style.visibility ="hidden";
  document.getElementById("ObjectOverlay").style.visibility="visible";
}

//Loading Posenet Model
var flipHorizontal = false;
var poses;
video.onloadeddata = function() {
    const model=posenet.load({
    architecture: 'ResNet50',
    outputStride: 32,
    inputResolution: { width: 257, height: 200 },
    quantBytes: 2
  });

       var mainLoop=setInterval(()=>{
         model.then(function(net) {
            const pose = net.estimateSinglePose(video, {
              flipHorizontal: false
            });
            return pose;
          }).then(function(pose){
            loading.text="PoseNet Successfully Loaded";
            console.log(pose.keypoints);

            rightWrist.x=pose.keypoints[10].position.x;
            rightWrist.y=pose.keypoints[10].position.y;

            leftWrist.x=pose.keypoints[9].position.x;
            leftWrist.y=pose.keypoints[9].position.y;

            if(leftWrist.x+100>tennis1.x && leftWrist.x-100<tennis1.x 
              && leftWrist.y+100>tennis1.y && leftWrist.y-100<tennis1.y && flag1==0)
            {
              tennis1.rotation+=10;
              score++;
              scoreSound.play();
              text.text="Score: "+score;
              flag1=1;             
            }
            if(rightWrist.x+100>tennis2.x && rightWrist.x-100<tennis2.x 
              && rightWrist.y+100>tennis2.y && rightWrist.y-100<tennis2.y && flag2==0)
            {
              tennis2.rotation+=10;
              score++;
              scoreSound.play();
              text.text="Score: "+score;
              flag2=1;
            }
            if(counter>=1 && score!=0)
            {
                counter=0;
                if(life==3)
                {
                  lifeLoss.play();
                  app.stage.removeChild(heart1);
                  life--;
                }
                else if(life==2)
                {
                  lifeLoss.play();
                  app.stage.removeChild(heart2);
                  life--;
                }
                else if(life==1)
                {
                  lifeLoss.play();
                  app.stage.removeChild(heart3);
                  life--;
                }
                else 
                {
                  life--;
                }
            }

            if(life==0)
            {
              document.getElementById("ObjectOverlay").style.visibility="hidden";
              document.getElementById("WebCam-Posenet").style.visibility="hidden";
              clearInterval(mainLoop);
              gameOver.play();
              const tracks=video.srcObject.getTracks();
              tracks.forEach(track=>track.stop());
              document.getElementById("GameOver").style.visibility="visible";
              document.getElementById("finalScore").innerHTML="Your Score : "+score;
            }

          })

        },100);


     
};


//Setting Up PIXI
const app = new PIXI.Application({width:window.innerWidth,height:window.innerHeight, transparent: true });
document.getElementById("ObjectOverlay").appendChild(app.view);


var rightWrist = new PIXI.Graphics();

// rightWrist.beginFill(0xe74c3c);
rightWrist.drawCircle(0,0, 100);
// rightWrist.endFill(); 

app.stage.addChild(rightWrist);

var leftWrist = new PIXI.Graphics();

// leftWrist.beginFill(0xffffff);
leftWrist.drawCircle(0,0, 100);
// leftWrist.endFill(); 

app.stage.addChild(leftWrist);

const heart1 = PIXI.Sprite.from('/life.png');

heart1.anchor.set(0.5);
heart1.height=75;
heart1.width=75;
heart1.x=app.screen.width/2+50;
heart1.y=120;

app.stage.addChild(heart1);

const heart2 = PIXI.Sprite.from('/life.png');

heart2.anchor.set(0.5);
heart2.height=75;
heart2.width=75;
heart2.x=app.screen.width/2-50;
heart2.y=120;

app.stage.addChild(heart2);

const heart3 = PIXI.Sprite.from('/life.png');

heart3.anchor.set(0.5);
heart3.height=75;
heart3.width=75;
heart3.x=app.screen.width/2;
heart3.y=120;

app.stage.addChild(heart3);





const tennis1 = PIXI.Sprite.from('/tennis.png');

tennis1.anchor.set(0.5);
// tennis.scale.set(0.2,0.2);
tennis1.height=1;
tennis1.width=1;


tennis1.x = app.screen.width - 100;
tennis1.y = app.screen.height/2;
// tennis.x=app.screen.width/2;
// tennis.y=app.screen.height/2;

app.stage.addChild(tennis1);

// app.ticker.add(() => {
//     tennis.rotation += 0.1;
// });

const tennis2 = PIXI.Sprite.from('/tennis.png');

tennis2.anchor.set(0.5);
// tennis.scale.set(0.2,0.2);
tennis2.height=1;
tennis2.width=1;


tennis2.x = 100;
tennis2.y = app.screen.height/2;
// tennis.x=app.screen.width/2;
// tennis.y=app.screen.height/2;

app.stage.addChild(tennis2);

//Setting Up the Score Counter
var score=0;
const style = new PIXI.TextStyle({
  fontFamily: "Odibee Sans",
  fontSize: 70,
  fontWeight: "",
  fill:"red",
});
var text = new PIXI.Text("Score: "+score,style );

text.scale.x=-1;
// text.anchor.x = 0.5;
// text.anchor.y = 0.5;
text.x=app.screen.width/2+90;
text.y=20;
app.stage.addChild(text);


const style1=new PIXI.TextStyle({
  fontFamily: "Odibee Sans",
  fontSize: 20,
  fill:"green",
})
var loading=new PIXI.Text("PoseNet Loading.... Please Wait",style1);
loading.scale.x=-1;
loading.x=app.screen.width-20;
loading.y=15;
app.stage.addChild(loading);

// app.ticker.add(() => {
//   tennis1.rotation += 0.1;
//   tennis1.width+=5;
//   tennis1.height+=5;
//   if(tennis1.width>=100 && tennis1.height>=100){
//     tennis1.width=1;
//     tennis1.height=1;
//   }
// });

animate1();
function animate1(){
  if(flag1==1)
  {
    tennis1.height=1;
    tennis1.width=1;
    var rand=Math.floor((Math.random() * 2) + 1);
    if(rand==2)
    {
      flag2=0;
      animate2();
    }
    else if(rand==1)
    {
      flag1=0;
      animate1();
    }

  }
  else{
    requestAnimationFrame(animate1);
    tennis1.rotation += 0.1;
    tennis1.width+=1;
    tennis1.height+=1;
    if(tennis1.width>=100 && tennis1.height>=100){
      tennis1.width=1;
      tennis1.height=1;
      counter++;
    }
  }
  
}

function animate2(){
  if(flag2==1)
  {
    tennis2.height=1;
    tennis2.width=1;
    var rand=Math.floor((Math.random() * 2) + 1);
    if(rand==2)
    {
      flag2=0;
      animate2();
    }
    else if(rand==1)
    {
      flag1=0;
      animate1();
    }
    // flag1=0;
    // animate1();
  }
  else
  {
    requestAnimationFrame(animate2);
    tennis2.rotation += 0.1;
    tennis2.width+=1;
    tennis2.height+=1;
    if(tennis2.width>=100 && tennis2.height>=100){
      tennis2.width=1;
      tennis2.height=1;
      counter++;
    }
  }

}

//Setting Up Sound Effects
var start=new Howl({
  src:['assets/Game-Start.wav']
});

var scoreSound=new Howl({
  src:['assets/Score.wav']
});

var lifeLoss=new Howl({
  src:['assets/Life-Loss.wav']
});

var gameOver=new Howl({
  src:['assets/Game-Over.wav']
});
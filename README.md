
# Catch_em_All-Posenet_tfjs
A simple browser-based 2D game by extending TensorFlow.js posenet library.

<h2>Overview</h2>

Catch'am All is an AR game which uses the pose detection model by TensorFlow to track the user's hands and progress the game accordingly. The game consists of two oncoming objects randomly appearing from either side and the goal is to catch all of them. The score is updated everytime the user's hands overlap with the oncoming ball on the screen. The user gets three lives/chances to get the maximum score possible.

**Video Demo of the game could be found [here](https://drive.google.com/file/d/1383x9FNgYyTJvYD47uEa7heRrtGUEpWw/view?usp=sharing)**

**Live Demo of the game could be found [here](https://catch-em-all-posenet.herokuapp.com)**



<h2>Implementation </h2>
The project is implemented using JavaScript libraries and majorly revolves around the posenet model of tensorflow.js.

The implementation steps involved are:
- [x] Accessing WebCam
- [x] Loading Posenet Model
- [x] Setting up a Game Engine (PIXI.js)
- [x] Implementing the Game Loop
- [x] Connecting Pose Detection and Object Overlap with Score Counter
- [x] Adding Sound Effects and General UI

<h3>1. Accessing Webcam </h3>

HTML
```
<video autoplay="false" id="videoSrc"></video>
```

JavaScript
```
const video = document.getElementById('videoSrc')

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }) 
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
}
```
Accessing the web camera of the device can be done by creating an HTML video element and setting the source of that video element as the stream/feed recieved from your web cam in javascript. The navigator.mediaDevices.getUserMedia() does exactly that and then allocates the stream as the video element's source.

<h3>2. Loading Posenet</h3>

JavaScript
```
video.onloadeddata = function() {
    const model=posenet.load({
    architecture: 'ResNet50',
    outputStride: 32,
    inputResolution: { width: 257, height: 200 },
    quantBytes: 2
  });
```
The posenet model cannot load until it recieves the load data information from the video stream that is why it is wrapped inside the video.onloadeddata function.The configuration that I have used for loading the model is the ResNet5.0 model which brings in higher accuracy at the cost of speed. ( if you want a faster load time use 'MobileNetV1' instead ).The above configuration can be better understood [here.](https://github.com/tensorflow/tfjs-models/tree/master/posenet)

<h3>3. Setting up Game Engine (PIXI.js)</h3>

JavaScript
```
const app = new PIXI.Application({width:window.innerWidth,height:window.innerHeight, transparent: true });
document.getElementById("ObjectOverlay").appendChild(app.view);
```
This initialises a canvas element in HTML under the div ObjectOverlay where all the graphical elements can be rendered. The ones that I have used are PIXI.Graphics , PIXI.Sprite and PIXI.Text.

<h3>4. Implementing the Game Loop</h3>

JavaScript
```
var mainLoop=setInterval(()=>{
         model.then(function(net) {
            const pose = net.estimateSinglePose(video, {
              flipHorizontal: false
            });
            return pose;
          }).then(function(pose){
            loading.text="PoseNet Successfully Loaded";
            console.log(pose.keypoints);
        },100);
```
The setInterval function enables the user to repetetively call a function in intervals of a certain period (in this case 100 milliseconds). The reason we recursively call net.estimateSinglePose() is because we have to get the coordinates of each keypoint continuously and in real time.

<h3>5. Connecting Pose Detection and Object Overlap with Score Counter</h3>

```
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
```
So the posenet model or specifically net.estimateSinglePose() returns an array with all the keypoints and their coordinates. For my game I needed only the coordinates of leftWrist (pose.keypoints[9]) and rightWrist (pose.keypoints[10]) and to factor in the detection of hand as well I took a radius of about 100px buffer.The flag1 and flag2 control the animation of the oncoming objects. 

<h3>6. Adding Sound Effects</h3>

JavaScript
```
var start=new Howl({
  src:['assets/Game-Start.wav']
});
start.play()
```
I used howler.js to add the sound effects which can be initialised and played from the code above.

<h2>Behind the Scenes</h2>

![alt text](https://github.com/Ayush-0801/Catch_em_All-Posenet_tfjs/blob/master/assets/ezgif.com-video-to-gif.gif)

<h2>Libraries </h2>

1. Tensorflow.js
2. PIXI.js
3. Howler.js
<h2>References</h2>

- https://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm
- https://www.w3schools.com/tags/av_event_loadeddata.asp
- https://www.w3schools.com/js/js_timing.asp
- https://blog.tensorflow.org/2018/05/real-time-human-pose-estimation-in.html
- https://pixijs.io/examples/#/demos-basic/transparent-background.js
- https://codepen.io/8Observer8/pen/qxmboV
- https://github.com/goldfire/howler.js
- https://dev.to/morinoko/stopping-a-webcam-with-javascript-4297

# Catch_em_All-Posenet_tfjs
A simple browser-based 2D game by extending TensorFlow.js posenet library.

<h2>Overview</h2>

Catch'am All is an AR game which uses the pose detection model by TensorFlow to track the user's hands and progress the game accordingly. The score is updated everytime the user's hands overlap with the oncoming ball on the screen. The user gets three lives/chances to get the maximum score possible.

**Live Demo of the game could be found [here](https://catch-em-all-posenet.herokuapp.com)**

**Video Demo of the game could be found [here]()**

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
The posenet model cannot load until it recieves the load data information from the video stream that is why it is wrapped inside the video.onloadeddata function.The configuration that I have used for loading the model is the ResNet5.0 model which brings in higher accuracy at the cost of speed. ( if you want a faster load time use 'MobileNetV1' instead ).The above configuration can be better understood [here](https://github.com/tensorflow/tfjs-models/tree/master/posenet)

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

```
<h2>Libraries </h2>

1. Tensorflow.js
2. PIXI.js
3. Howler.js
<h2>References</h2>

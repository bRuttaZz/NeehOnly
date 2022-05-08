const video = document.getElementById("video");
var numPeople = 1
var happyIndex = 0
var faceMatcher = null

const neeh = document.getElementById("neeh")

// loading audio element
// var beep = new Audio("/static/images/beep.mp3");

const Neeh = document.getElementById("neeh")
var faceMatcher = null

const uri = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"
const source = "https://raw.githubusercontent.com/bRuttaZz/NeehOnly/main/"
// load model


// load webcam video
startVideo = ()=>{
  console.log("models loaded");

  

  navigator.mediaDevices.getUserMedia({video: true, audio: false})
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function(err) {
    console.log("An error occurred: " + err);
  });
}


loadModel = async ()=>{
    // get inference 
    console.log("models loaded");

    // starting video
    startVideo();

    const results = await faceapi.detectSingleFace(neeh, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    faceMatcher = new faceapi.FaceMatcher(results);


    // repeated checking when video start capturing
    video.addEventListener('canplay',  ()=>{
      // beep.play();

      const canvas =  faceapi.createCanvasFromMedia(video)
      document.getElementById("contentarea").append(canvas)
      const outputSize = { width : video.width, height : video.height}
      faceapi.matchDimensions(canvas, outputSize)

      setInterval(async ()=>{
          // detetcting number of faces and expressions of it
          const heads = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()

          // detect face features
          const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()

          if (!detection){
            return 0;
          }

          const resizedDetections = faceapi.resizeResults(detection, outputSize)
          canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)

          const bestMatch = faceMatcher.findBestMatch(detection.descriptor)
          console.log(bestMatch.toString())

          // draw rectangle
          // faceapi.draw.drawDetections(canvas, resizedDetections)
          var ctx = canvas.getContext('2d')
          ctx.beginPath();
          ctx.lineWidth = "3";
          ctx.strokeStyle = "green";
          ctx.rect(resizedDetections.alignedRect._box._x, resizedDetections.alignedRect._box._y, resizedDetections.alignedRect._box._width, resizedDetections.alignedRect._box._height);
          ctx.stroke();
          

      }, 100);

    });


  }






Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(uri),
  faceapi.nets.faceLandmark68Net.loadFromUri(uri),
  faceapi.nets.faceRecognitionNet.loadFromUri(uri),
  faceapi.nets.faceExpressionNet.loadFromUri(uri),
]).then(loadModel).catch("Model is not loaded yet");





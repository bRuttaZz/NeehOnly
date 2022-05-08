const video = document.getElementById("video");
var numPeople = 1
var happyIndex = 0
var faceMatcher = null

const neeh = document.getElementById("neeh")
const neeh2 = document.getElementById("neeh2")

// loading audio element
// var beep = new Audio("/static/images/beep.mp3");

const Neeh = document.getElementById("neeh")
var faceMatcher = null

const uri = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"
// const source = "https://raw.githubusercontent.com/bRuttaZz/NeehOnly/main/"
// load model


// load webcam video
startVideo = ()=>{

  navigator.mediaDevices.getUserMedia({video: true, audio: false})
  .then(function(stream) {
    window.localStream = stream;
    video.srcObject = stream;
    video.play();
    lookForNeeh();
  })
  .catch(function(err) {
    modal.style.display = "block";
    
  });
}


loadModel = async ()=>{
    // get inference 
    console.log("models loaded");

    const n1 = await faceapi.detectSingleFace(neeh, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()
    const n2 = await faceapi.detectSingleFace(neeh2, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()
    const labeledDescriptors = [
      new faceapi.LabeledFaceDescriptors(
        'Neeh',
        [n1.descriptor ,n2.descriptor ]
      )
    ]

    delete n1;
    delete n2;

    faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

    setTimeout(function(){
      document.querySelector("#loader").style.display = "none"; 
      document.querySelector( "body").style.visibility = "visible"; 
    },200);

    // starting video
    startVideo();

    // repeated checking when video start capturing
    video.addEventListener('canplay',  ()=>{

      var intervel = setInterval(async ()=>{
          // detect face features
          const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()

          if (!detection){
            return 0;
          }

          if (faceMatcher.findBestMatch(detection.descriptor)._label == "Neeh"){
  
            document.getElementById("NeehMessage").style.display="block";
            document.getElementById("contentarea").style.display = "none";
            stopIntrvl();
          }
          else{

          }      
          delete detection;      
      }, 250);

    // stoping the intervel if needed
    function stopIntrvl(){
      clearInterval(intervel);
      localStream.getVideoTracks()[0].stop();
      video.src = '';
    }

    });


}



Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(uri),
  faceapi.nets.faceLandmark68Net.loadFromUri(uri),
  faceapi.nets.faceRecognitionNet.loadFromUri(uri),
  // faceapi.nets.faceExpressionNet.loadFromUri(uri),
]).then(loadModel).catch("Model is not loaded yet");



document.getElementById("loadAgain").addEventListener("click", ()=>{
  console.log("clicked");
  modal.style.display = "none";
  startVideo();
});

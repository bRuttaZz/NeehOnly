const video = document.getElementById("video");
var Neeh3d = 0
var faceMatcher = null
var not_neh = 0
var intervel = null

const MESSAGES = ["Nooo! Are you Neeh! you Sure??", "Where is Neeh I Cant See her", "Show me your face Neeh. Only Youu!", "Maahn Neeh Where are you?"]
const NOMESSAGES = ["Mahn who are you? Where is Neeh", "No you're not Neeh"]

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

// face dimentions
function checkNoseToJawLength(landmarks){
  if (landmarks){
    const nose = landmarks.getNose()
    const jawline = landmarks.getJawOutline()

    topNose = nose[0]._x
    
    rightGap =  Math.sqrt( Math.pow((nose[0]._x - jawline[0]._x ),2) + Math.pow(( nose[0]._y - jawline[0]._y),2) );
    width =  Math.sqrt( Math.pow((jawline[0]._x - jawline[15]._x ),2) + Math.pow(( jawline[0]._y - jawline[15]._y),2) );
    
    return rightGap/width
  }
  else{
    return 0
  }
}



function updateNeeh(landmarks){
  // console.log(landmarks);
  r = checkNoseToJawLength(landmarks)
  console.log(r);
  if (Neeh3d !=0 && (Neeh3d>r+0.1 || Neeh3d<r-0.1)){
    return 1
  }
  else if(Neeh3d==0){
    Neeh3d = r
    document.getElementById("lookInstruction").innerHTML="Well you look a lot like her, can you just tilt your face a little bit for me to confirm.<br> please..."
    return 2
  }
  return 3
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

      var intervel0 = setInterval(()=>{
        document.getElementById("tension").innerHTML = MESSAGES[Math.floor(Math.random()*MESSAGES.length)];
      }, 7000)

      var intervel = setInterval(async ()=>{
          // detect face features
          const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()

          if (!detection){
            return 0;
          }

          if (faceMatcher.findBestMatch(detection.descriptor)._label == "Neeh"){
            var res = updateNeeh(detection.landmarks)
            if ( res == 1){
              document.getElementById("NeehMessage").style.display="block";
              document.getElementById("contentarea").style.display = "none";
              document.getElementById("LookForHer").style.display = "none";
              stopChange();
              stopIntrvl();
            }
            else if (res == 2){
              stopChange();
            }
          }
          else{
            if(not_neh===0){
              stopChange();
              document.getElementById("tension").innerHTML = "Noo! Noo! Noo! It's not Neeh";
              intervel1 = setInterval(()=>{
                document.getElementById("tension").innerHTML = NOMESSAGES[Math.floor(Math.random()*NOMESSAGES.length)];
              },7000);
              not_neh++;
            }
            
          }      
          delete detection;      
      }, 250);

    function stopChange(){
      try{
        clearInterval(intervel0);
        clearInterval(intervel1) ; 
      }
      catch(e){
        console.log("Okay not set");
      }
      document.getElementById("tension").innerHTML = "";   
    }
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

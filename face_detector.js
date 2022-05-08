const Neeh = document.getElementById("neeh")

const uri = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"
const source = "https://raw.githubusercontent.com/bRuttaZz/NeehOnly/main/"
// load model

loadModel = async ()=>{
    // // get inference 
    // console.log("reached here");
    // const results = await faceapi.detectSingleFace(neeh, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    // console.log(results)
    // console.log("got result");
    // faceMatcher = new faceapi.FaceMatcher(results);
    // console.log("read image");

    // // download the result
    // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results));
    // var dlAnchorElem = document.getElementById('downloadAnchorElem');
    // dlAnchorElem.setAttribute("href",     dataStr     );
    // dlAnchorElem.setAttribute("download", "neehFace.json");
    // dlAnchorElem.click();

    fetch(source+"neehFace.json")
    .then(r => r.json())
    .then(r => {
        console.log(r);
    }).catch(err =>{
        console.log(err);
    });

}





Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(uri),
  faceapi.nets.faceLandmark68Net.loadFromUri(uri),
  faceapi.nets.faceRecognitionNet.loadFromUri(uri),
  faceapi.nets.faceExpressionNet.loadFromUri(uri),
]).then(loadModel).catch("Model is not loaded yet");




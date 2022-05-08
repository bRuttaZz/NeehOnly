const Neeh = document.getElementById("neeh")

const uri = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"
const source = "https://raw.githubusercontent.com/bRuttaZz/NeehOnly/main/"
// load model

loadModel = async ()=>{
    // get inference 
    console.log("reached here");
    const results = await faceapi.detectSingleFace(neeh, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    console.log(results)
    console.log("got result");
    console.log("read image");

    // // download the result
    // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results));
    // var dlAnchorElem = document.getElementById('downloadAnchorElem');
    // dlAnchorElem.setAttribute("href",     dataStr     );
    // dlAnchorElem.setAttribute("download", "neehFace.json");
    // dlAnchorElem.click();








    /*
        Author: Jonathan Lurie - http://me.jonathanlurie.fr
        License: MIT
        
        The point of this little gist is to fix the issue of losing
        typed arrays when calling the default JSON serilization.
        The default mode has for effect to convert typed arrays into
        object like that: {0: 0.1, 1: 0.2, 2: 0.3} what used to be
        Float32Array([0.1, 0.2, 0.3]) and once it takes the shape of an
        object, there is no way to get it back in an automated way!
        
        The fix leverages the usually-forgotten functions that can be
        called as arguments of JSON.stringify and JSON.parse: the
        replacer and the reviver.
    */

    // get the glogal context for compatibility with node and browser
    var context = typeof window === "undefined" ? global : window;

    // flag that will be sliped in the json string
    const FLAG_TYPED_ARRAY = "FLAG_TYPED_ARRAY";

    // an object that contains a typed array, among other things
    var obj = results;
    console.log("---------------------");
    console.log('The original object:');
    console.log( obj );

    // ENCODING ***************************************

    var jsonStr = JSON.stringify( obj , function( key, value ){
    // the replacer function is looking for some typed arrays.
    // If found, it replaces it by a trio
    if ( value instanceof Int8Array         ||
        value instanceof Uint8Array        ||
        value instanceof Uint8ClampedArray ||
        value instanceof Int16Array        || 
        value instanceof Uint16Array       ||
        value instanceof Int32Array        || 
        value instanceof Uint32Array       || 
        value instanceof Float32Array      ||
        value instanceof Float64Array       )
    {
        var replacement = {
        constructor: value.constructor.name,
        data: Array.apply([], value),
        flag: FLAG_TYPED_ARRAY
        }
        return replacement;
    }
    return value;
    });

    console.log("---------------------");
    console.log('The JSON string, look at this sneaky replacement!');
    console.log( jsonStr );

    // DECODING ***************************************



        // download the result
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonStr));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "neehFace.json");
    dlAnchorElem.click();


    // var decodedJson = JSON.parse( jsonStr, function( key, value ){
    // // the reviver function looks for the typed array flag
    // try{
    //     if( "flag" in value && value.flag === FLAG_TYPED_ARRAY){
    //     // if found, we convert it back to a typed array
    //     return new context[ value.constructor ]( value.data );
    //     }
    // }catch(e){}
    
    // // if flag not found no conversion is done
    // return value;
    // });

    // console.log("---------------------");
    // console.log('Supposedly the same as the original object:');
    // console.log( decodedJson );














    // console.log("models loaded");

    // fetch(source+"neehFace.json")
    // .then(r => r.json())
    // .then(r => {
    //     console.log(r);
    //     faceMatcher = new faceapi.FaceMatcher(r);



    // }).catch(err =>{
    //     console.log(err);
    // });

}





Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(uri),
  faceapi.nets.faceLandmark68Net.loadFromUri(uri),
  faceapi.nets.faceRecognitionNet.loadFromUri(uri),
  faceapi.nets.faceExpressionNet.loadFromUri(uri),
]).then(loadModel).catch("Model is not loaded yet");




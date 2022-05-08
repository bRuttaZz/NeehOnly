var modal = document.getElementById("allowCam");
// Get the <span> element that closes the modal
var span = document.getElementById("closeModal");

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  document.getElementById("noPermission").style.display="block";
  document.getElementById("contentarea").style.display="none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById("noPermission").style.display="block";
    document.getElementById("contentarea").style.display="none";
  }
} 

// function to be called when looking for neeh's face
function lookForNeeh(){
    document.getElementById("contentarea").style.display = "none";
    document.getElementById("LookForHer").style.display = "block";
}
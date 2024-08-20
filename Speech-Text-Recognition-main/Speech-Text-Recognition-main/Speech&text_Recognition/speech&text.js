document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-button");
    const speechToTextMode = document.getElementById("speech-to-text");
    const textToSpeechMode = document.getElementById("text-to-speech");
  
    toggleButton.addEventListener("click", function () {
      if (speechToTextMode.classList.contains("active")) {
        speechToTextMode.classList.remove("active");
        textToSpeechMode.classList.add("active");
      } else {
        textToSpeechMode.classList.remove("active");
        speechToTextMode.classList.add("active");
      }
    });
  });
  
  
  
  
  
  
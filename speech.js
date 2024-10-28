let recognition;
let recognitionActive = false;
const micButton = document.getElementById("mic-button");
const micIcon = document.getElementById("mic-icon");
const inputField = document.getElementById("user-input");

if (!("webkitSpeechRecognition" in window)) {
//   alert("Web Speech API not supported by browser!!!");
    updateStatus("error", "Web Speech API not supported by browser!!!");
} else {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
//   recognition.continuous = true;
//   recognition.interimResults = true;
  recognition.continuous = false;
  recognition.interimResults = false;

  document.getElementById("mic-button").addEventListener("click", start);
}

function changeMicIcon(isListening) {
    if (isListening) { // turn off
        micButton.classList.remove("recording");
        micIcon.classList.replace("spinner-border", "bi-mic");
        micIcon.classList.remove("spinner-border-sm");
    } else { // turn on
        micButton.classList.add("recording");
        micIcon.classList.replace("bi-mic", "spinner-border");
        micIcon.classList.add("spinner-border-sm"); 
    }
}

function start(event) {
  // turn mic off if clicked again
  if (recognitionActive) {
    recognition.stop();
    updateStatus("info", "Stopped listening.");
    changeMicIcon(recognitionActive);
    recognitionActive = false;
    return;
  }

  // change icon to spinner while listening
  changeMicIcon(recognitionActive);
  recognitionActive = true;
  recognition.start();
  updateStatus("info", "Listening...");

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    
    // inputField.value = transcript;
    // instead of setting the input field value, append the transcript at cursor
    const cursorPosition = inputField.selectionStart;
    const textBefore = inputField.value.substring(0, cursorPosition);
    const textAfter = inputField.value.substring(cursorPosition);
    inputField.value = textBefore + transcript + textAfter;
    inputField.focus();

    recognition.stop();
    updateStatus("info", "Stopped listening.");
    changeMicIcon(recognitionActive);
    recognitionActive = false;
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    updateStatus("error", "Speech recognition error: " + event.error);
    recognition.stop();
    changeMicIcon(recognitionActive);
    recognitionActive = false;

    inputField.focus();
  };
}

micButton.addEventListener("click", start);

function stop(event) {
  // microphone.src = "images/mute.png";
  recognition.stop();
  console.log("Microphone off");
  console.log(finalTranscript);
  updateStatus("info", "Stopped listening.");
  document.getElementById("mic-button").removeEventListener("click", stop);
  document.getElementById("mic-button").addEventListener("click", start);
}

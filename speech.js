if (!('webkitSpeechRecognition' in window)){
    alert('Web Speech API not supported by browser!!!')
}
else{
    var recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    document.getElementById('mic-button').addEventListener('click',start);
}

function start(event){
    finalTranscript = '';
    recognition.start();
    console.log('Microphone on');
    microphone.src = "images/mic.png";

    recognition.onresult = function(event) {
        var interimTranscript = '';
    
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
            question.value = finalTranscript;
            // Just printing the final transcript for now
            // might add additional visuals for interim transcript
        }
    };
    document.getElementById('mic-button').removeEventListener('click',start);
    document.getElementById('mic-button').addEventListener('click',stop);
}

function stop(event){
    microphone.src = "images/mute.png";
    recognition.stop();
    console.log('Microphone off');
    console.log(finalTranscript);
    document.getElementById('mic-button').removeEventListener('click',stop);
    document.getElementById('mic-button').addEventListener('click',start);
}

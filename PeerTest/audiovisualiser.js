function newAnalyser(mediaStream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);
    return analyser;
}

function checkAudioLevel(analyser, userCircle) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let isAudioDetected = dataArray.some(value => value > 0);

    if (isAudioDetected) {
        console.log('audio detected')
        userCircle.className = "circle audioDetected";
    } else if (document.getElementById('connect').innerHTML === "connect") {
        userCircle.className = "circle disconnected";
    } else {
        userCircle.className = "circle connected";
    }

    requestAnimationFrame(checkAudioLevel);
}
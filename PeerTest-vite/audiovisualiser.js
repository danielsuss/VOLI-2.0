function newAnalyser(mediaStream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);
    return analyser;
}

export function checkAudioLevel(userCircle, mediaStream, analyser=null) {
    if (analyser === null) {
        analyser = newAnalyser(mediaStream);
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let isAudioDetected = dataArray.some(value => value > 100);

    if (isAudioDetected) {
        console.log('audio detected');
        userCircle.className = "circle audioDetected";
    } else if (document.getElementById('connect').innerHTML === "connect") {
        console.log('audio undetected');
        userCircle.className = "circle disconnected";
    } else {
        console.log('audio undetected');
        userCircle.className = "circle connected";
    }

    requestAnimationFrame(() => checkAudioLevel(userCircle, mediaStream, analyser));
}

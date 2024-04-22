// import { newAnalyser, checkAudioLevel } from "./audiovisualiser";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyC2MZbUJp1eNi83q4mLCXHFAr1tOEpw3zU",
    authDomain: "webrtctest-c4f18.firebaseapp.com",
    projectId: "webrtctest-c4f18",
    storageBucket: "webrtctest-c4f18.appspot.com",
    messagingSenderId: "48731066672",
    appId: "1:48731066672:web:1a6e71082f818112be78f5",
    measurementId: "G-9CR8KCMC3B"
}

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

console.log(firestore);

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

    requestAnimationFrame(() => checkAudioLevel(analyser, userCircle));
}

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);
let localSenderIndex = null;
let localStream = null;
let remoteStream = null;

const connectButton = document.getElementById('connect');
const microphoneButton = document.getElementById('microphone');
const remoteConnect = document.getElementById('remoteConnect');
const remote = document.getElementById('remote');
const local = document.getElementById('local');
const callCode = document.getElementById('callCode');

remoteStream = new MediaStream();

pc.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
    });
};

async function initLocalStream() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    const analyser = newAnalyser(localStream);
    checkAudioLevel(analyser, local);
    return localStream;
}

connectButton.addEventListener('click', async () => {
    console.log("Connect Button 🖱️");

    if (connectButton.innerHTML === "connect") {
        if (localStream === null) {
            localStream = await initLocalStream();
            localStream.getTracks()[0].enabled = false;
        }
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
            localSenderIndex = pc.getSenders().length - 1;
        });

        if (!callCode.value){

            const callDoc = firestore.collection('calls').doc();
            const offerCandidates = callDoc.collection('offerCandidates');
            const answerCandidates = callDoc.collection('answerCandidates');

            callCode.value = callDoc.id;

            // Get candidates for caller, save to db
            pc.onicecandidate = event => {
                event.candidate && offerCandidates.add(event.candidate.toJSON());
            };

            // Create offer
            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            await callDoc.set({ offer });

            // Listen for remote answer
            callDoc.onSnapshot((snapshot) => {
                const data = snapshot.data();
                if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.setRemoteDescription(answerDescription);
                }
            });

            // Listen for remote ICE candidates
            answerCandidates.onSnapshot(snapshot => {
                snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
                });
            });
        } else {
            const callId = callCode.value;
            const callDoc = firestore.collection('calls').doc(callId);
            const offerCandidates = callDoc.collection('offerCandidates');
            const answerCandidates = callDoc.collection('answerCandidates');

            pc.onicecandidate = event => {
                event.candidate && answerCandidates.add(event.candidate.toJSON());
            };

            // Fetch data, then set the offer & answer

            const callData = (await callDoc.get()).data();

            const offerDescription = callData.offer;
            await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await callDoc.update({ answer });

            // Listen to offer candidates

            offerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                console.log(change)
                if (change.type === 'added') {
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                }
                });
            }); 
        }
        
        const remoteAnalyser = newAnalyser(remoteStream);
        checkAudioLevel(remoteAnalyser, remote);
        connectButton.innerHTML = "disconnect";
        local.className = "circle connected";
    } 
    else {
        pc.removeTrack(pc.getSenders()[localSenderIndex]);
        connectButton.innerHTML = "connect";
        local.className = "circle disconnected";
    }
});

microphoneButton.addEventListener('click', async () => {
    console.log("Microphone Button 🖱️");
    if (microphoneButton.innerHTML === "microphone off") {
        microphoneButton.innerHTML = "microphone on";
        localStream.getTracks()[0].enabled = false;
    } else {
        microphoneButton.innerHTML = "microphone off";
        if (localStream === null) {
            localStream = await initLocalStream();
        }
        localStream.getTracks()[0].enabled = true;
    }
});

remoteConnect.addEventListener('click', () => {
    console.log("Remote Connect Button 🖱️")
    console.log(pc.getSenders())
    if (remoteConnect.innerHTML === "connect remote") {
        remoteConnect.innerHTML = "disconnect remote";
        remote.className = "circle connected";
    } else {
        remoteConnect.innerHTML = "connect remote";
        remote.className = "circle disconnected";
    }
});


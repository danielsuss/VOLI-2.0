import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import { checkAudioLevel } from './audiovisualiser';

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
const localAudio = document.getElementById('localAudio')
const remoteAudio = document.getElementById('remoteAudio');

remoteStream = new MediaStream();

pc.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
        remoteAudio.srcObject = remoteStream;
        remoteStream.addTrack(track);
        remote.className = ("circle connected");
        console.log(remoteStream);
        checkAudioLevel(remote, remoteStream);
    });
};

async function initLocalStream() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    // localAudio.srcObject = localStream;
    console.log(localStream);
    checkAudioLevel(local, localStream);
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

            const callDoc = doc(collection(firestore, 'calls'));
            const offerCandidates = doc(collection(callDoc, 'offerCandidates'));
            const answerCandidates = doc(collection(callDoc, 'answerCandidates'));

            callCode.value = callDoc.id;

            // Get candidates for caller, save to db
            pc.onicecandidate = event => {
                event.candidate && setDoc(offerCandidates, event.candidate.toJSON());
            };

            // Create offer
            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            setDoc(callDoc, { offer } );

            // Listen for remote answer
            onSnapshot(callDoc, (snapshot) => {
                const data = snapshot.data();
                if (!pc.currentRemoteDescription && data?.answer) {
                    const answerDescription = new RTCSessionDescription(data.answer);
                    pc.setRemoteDescription(answerDescription);
                }
            });

            // Listen for remote ICE candidates
            onSnapshot(collection(callDoc, 'answerCandidates'), (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pc.addIceCandidate(candidate);
                    }
                });
            });
        } else 
        {
            const callId = callCode.value;
            const callDoc = doc(firestore, 'calls', callId);
            const offerCandidates = doc(collection(callDoc, 'offerCandidates'));
            const answerCandidates = doc(collection(callDoc, 'answerCandidates'));


            pc.onicecandidate = event => {
                event.candidate && setDoc(answerCandidates, event.candidate.toJSON());
            };

            // Fetch data, then set the offer & answer
            const callData = (await getDoc(callDoc)).data();
            console.log(callData);

            const offerDescription = callData.offer;
            if (offerDescription && offerDescription.type && offerDescription.sdp) {
                await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
            } else {
                console.error('Invalid offer description', offerDescription);
            }

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await setDoc(callDoc, { answer });

            // Listen to offer candidates
            onSnapshot(collection(callDoc, 'offerCandidates'), (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pc.addIceCandidate(candidate);
                    }
                });
            });
        }
        
        // checkAudioLevel(remote, remoteStream);
        connectButton.innerHTML = "disconnect";
        local.className = "circle connected";
    } 
    else { // This block will execute when disconnecting
        // Stop all tracks on the local stream
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        // Close the peer connection
        if (pc) {
            pc.close();
        }

        // Reset UI elements and state
        connectButton.innerHTML = "connect";
        local.className = "circle disconnected";
        remote.className = "circle disconnected";
        callCode.value = ''; // Clear the call code if you're using one

        // Optional: Handle remote stream
        // e.g., Stop tracks, detach from UI elements, etc.
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
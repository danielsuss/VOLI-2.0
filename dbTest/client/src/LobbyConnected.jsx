import { post_disconnect_user } from "./requests";
import { firestoreDB } from "./firebase.js";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from 'firebase/firestore';

function LobbyConnected({ setState, username, roomID }) {
  
    const [users, setUsers] = useState([]);

    const disconnectButton = () => {
        post_disconnect_user(username, roomID);
        setState('UserEntry');
    }

    useEffect(() => {
        const roomDocRef = doc(firestoreDB, "rooms", roomID);
        const unsubscribe = onSnapshot(roomDocRef, (doc) => {
            const users = doc.data().users;
            setUsers(users);
        }, err => {
            console.log(`Encountered error: ${err}`);
        })
        return () => unsubscribe();
    }, [roomID]);

    return (
        <div>
            <p>{username}, connected to room {roomID}</p>
            <p>Other users:</p>
            {users.map((user, index) => (
                user !== username && <p key={index}>{user}</p>
            ))}
            <button onClick={disconnectButton}>Disconnect</button>
        </div>
    );
}

export default LobbyConnected
import { useState } from "react"
import UserEntry from "./UserEntry";
import LobbyConnected from "./LobbyConnected";
import NotAllowed from "./NotAllowed";

function Lobby() {
    const [state, setState] = useState('UserEntry');
    const [username, setUsername] = useState('');
    const [roomID, setRoomID] = useState('');

    let content;

    switch (state) {
        case 'UserEntry':
            content = <UserEntry setState={setState} username={username} setUsername={setUsername} roomID={roomID} setRoomID={setRoomID} />;
            break;
        case 'LobbyConnected':
            content = <LobbyConnected setState={setState} username={username} roomID={roomID} />;
            break;
        case 'NotAllowed':
            content = <NotAllowed setState={setState} />
            break;
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default Lobby
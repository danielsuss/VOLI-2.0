import { post_user_entry } from "./requests"

function UserEntry({ setState, username, setUsername, roomID, setRoomID }) {

    const connectButton = () => {
        post_user_entry(username, roomID).then(outcome => {
            console.log(outcome);
            if (outcome === 'done') {
                setState('LobbyConnected');
            } else {
                setState('NotAllowed');
            }
        }).catch(error => {
            console.error('Failed to post user entry:', error);
            setState('Error');
        });
    }
    

    return (
        <div>
            <input type="text" placeholder="username" onChange={(event) => setUsername(event.target.value)} />
            <input type="text" placeholder="Room ID" onChange={(event) => setRoomID(event.target.value)} />
            <button onClick={connectButton}>Connect</button>
        </div>
    )
}

export default UserEntry
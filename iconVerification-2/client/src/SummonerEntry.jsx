import { useState } from 'react'

function SummonerEntry ({ stateController, summonerController }) {    
    const [username, setUsername] = useState('');
    const [region, setRegion] = useState('');
    
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleRegionChange = (event) => {
        setRegion(event.target.value);
    };

    const startButton = async () => {
        console.log(`Summoner: ${username} ${region}`)
        fetch("http://localhost:5000/summonerEntry", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "region": region
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            summonerController(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        stateController('summonerConfirmation');
    };

    return (
        <div className='verificationCard'>
            <p>Please enter your summoner details:</p>
            <input type="text" placeholder="Username" onChange={handleUsernameChange} value={username}/>
            <input type="text" placeholder="Region" onChange={handleRegionChange} value={region}/>
            <button onClick={startButton}>start</button>
        </div>
    );

}

export default SummonerEntry;
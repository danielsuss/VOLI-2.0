import { useState } from 'react'
import './SummonerEntry.css'

function SummonerEntry ({ stateController, client, setSummoner }) {
    const [username, setUsername] = useState('');
    const [region, setRegion] = useState('');
    
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleRegionChange = (event) => {
        setRegion(event.target.value);
    };

    const startButton = async () => {
        client
            .initialize({
                region: region
            })
            .then(async () => {
                const summoner = await client.summoners.fetchBySummonerName(username);
                console.log(`Summoner: ${summoner.name} (Level: ${summoner.level}`);
                setSummoner(summoner);
                stateController('summonerConfirmation');
            });
    }

    return (
        <div className='verificationCard'>
            <input type="text" placeholder="Username" onChange={handleUsernameChange} value={username}/>
            <input type="text" placeholder="Region" onChange={handleRegionChange} value={region}/>
            <button onClick={startButton}>start</button>
        </div>
    );
}

export default SummonerEntry;
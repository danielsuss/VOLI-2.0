import { useState } from 'react';
import { Client } from "shieldbow";
import SummonerEntry from './SummonerEntry.jsx';
import './index.css';

const client = new Client('RGAPI-c5607cae-c86e-4642-8591-8ce003369c32');

function VerificationCard() {
  const [state, setState] = useState('start');
  const [summoner, setSummoner] = useState('');

  function changeState(state) {
    setState(state);
    console.log(`State Changed: ${state}`);
  }

  function changeSummoner(summoner) {
    setSummoner(summoner);
    console.log(`Summoner Set`);
  }

  let content;

  if (state === 'start') {
    content = <SummonerEntry stateController={changeState} client={client} setSummoner={changeSummoner} />
  }
  else if (state === 'summonerConfirmation') {
    content = <ConfirmSummoner stateController={changeState} />
  }

  return (
    <div>
        {content}
    </div>
  );
}

export default VerificationCard;
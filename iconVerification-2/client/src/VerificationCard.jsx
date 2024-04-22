import { useEffect, useState } from 'react';
import SummonerEntry from './SummonerEntry.jsx';
import ConfirmSummoner from './ConfirmSummoner.jsx';
import IconCheck from './IconCheck.jsx';
import VerificationOutcome from './VerificationOutcome.jsx';

class Summoner {
  constructor(data) {
    this.username = data['username'];
    this. level = data['level'];
    this.region = data['region'];
    this.icon = data['icon'];
    this.keyIcon = data['keyIcon'];
  }
}

function VerificationCard() {
  const [state, setState] = useState('summonerEntry');
  const [summoner, setSummoner] = useState(null);
  const [verified, setVerified] = useState(null);

  function changeState(state) {
    setState(state);
    console.log(`State Changed: ${state}`);
  }

  function changeSummoner(username, level) {
    let summoner = new Summoner(username, level);
    setSummoner(summoner);
    console.log(`Summoner Set: ${summoner}`);
  }

  function changeVerified(value) {
    setVerified(value);
  }

  function resetSummoner() {
    setSummoner(null);
    console.log("Summoner reset.");
  }

  useEffect(() => {
    if (state === 'summonerEntry') {
      resetSummoner();
    }
  }, [state]);

  let content;

  if (state === 'summonerEntry') {
    content = <SummonerEntry stateController={changeState} summonerController={changeSummoner} />
  }
  else if (state === 'summonerConfirmation') {
    content = <ConfirmSummoner stateController={changeState} summoner={summoner} />
  }
  else if (state === 'iconCheck') {
    content = <IconCheck stateController={changeState} summoner={summoner} changeVerified={changeVerified} />
  }
  else if (state === 'verificationOutcome') {
    content = <VerificationOutcome verified={verified} />
  }

  return (
    <div>
        {content}
    </div>
  );
}

export default VerificationCard;
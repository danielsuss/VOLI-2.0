function ConfirmSummoner( { stateController, summoner } ) {

  const returnButton = () => {
    stateController('summonerEntry');
  }

  const confirmButton = () => {
    stateController('iconCheck');
  }

  if (!summoner) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Is this the correct summoner?</p>
      <p>{`${summoner.username} (Level: ${summoner.level}) Icon: ${summoner.icon}`} </p>
      <button onClick={returnButton}>Return</button>
      <button onClick={confirmButton}>Confirm</button>
    </div>
  )
}

export default ConfirmSummoner
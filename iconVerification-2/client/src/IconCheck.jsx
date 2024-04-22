import { useState } from "react";

function IconCheck({ stateController, summoner, changeVerified }) {
    
  const confirmButton = () => {
    fetch("http://localhost:5000/iconCheck", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": summoner.username,
            "region": summoner.region,
            "keyIcon": summoner.keyIcon
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        console.log(data['match']);
        changeVerified(data['match']);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    stateController('verificationOutcome');
  }

  return (
    <div>
      <p>Change Your Icon to the Following</p>
      <p>{summoner.keyIcon[1]}</p>
      <button onClick={confirmButton}>Confirm</button>
    </div>
  )
}

export default IconCheck
function VerificationOutcome({ verified }) {
  
  if (verified === null) {
    return (
      <div>Checking Icon...</div>
    )
  }
  
  else if (verified === true) {
    return (
      <div>VerificationSuccess</div>
    )
  }

  else if (verified === false) {
    return (
      <div>VerificationFailure</div>
    )
  }
  
}

export default VerificationOutcome
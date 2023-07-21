import React, { useState } from 'react'
import Example from '../components/example'

function CreateEvents() {
  const [jet, setJet] = useState("")
  return (
    <Example jet={jet} setJet={setJet}/>
  )
}

export default CreateEvents
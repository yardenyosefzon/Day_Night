import React from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

function LogInToBuyTickets(){

  return (
    <>
      <div>!רוצה ליצור אירועים? התחבר בשנייה עם חשבון גוגל</div>
      <button onClick={()=>signIn('google', { callbackUrl: `http://localhost:3000` }) }>התחבר עם חשבון גוגל</button>
    </>
  )
}

export default LogInToBuyTickets
import React from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

function LogInToWatchTickets(){
  const {query: {callBackUrl}} = useRouter()
  return (
    <>
      <div>!רוצים לצפות בכרטיסים? התחברו בתוך שנייה עם גוגל</div>
      <button onClick={()=>signIn('google', { callbackUrl: `http://localhost:3000/buyTickets/${callBackUrl}` }) }>התחבר עם חשבון גוגל</button>
    </>

  )
}

export default LogInToWatchTickets
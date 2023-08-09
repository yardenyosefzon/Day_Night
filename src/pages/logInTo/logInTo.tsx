import React from 'react'
import { signIn } from 'next-auth/react'
import { IBM_Plex_Sans_Hebrew } from 'next/font/google'

const ibm = IBM_Plex_Sans_Hebrew({subsets:['hebrew'], weight:'700'})

function LogInTo({message}: {message: string}){

  return (
    <div className={`absolute flex flex-col justify-center h-screen w-full bg-orange-300 ${ibm.className}`}>
      <div className='flex flex-col items-center -mt-14'>
        <div className='flex flex-col justify-center text-center'>
          <p dir='rtl' className='text-6xl my-6'>{message}</p>
          <p dir='rtl' className='text-5xl'>התחברו בשנייה עם חשבון גוגל !</p>
        </div>
        <div>
          <button className='bg-orange-100 mt-11 px-6 py-4 rounded-lg text-2xl' onClick={()=>signIn('google', { callbackUrl: `http://localhost:3000` }) }>התחברו עם חשבון גוגל</button>
        </div>
      </div>
    </div>
  )
}

export default LogInTo
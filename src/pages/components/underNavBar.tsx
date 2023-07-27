import Link from 'next/link'
import React from 'react'
import IsLoggedIn from './isLoggedIn'

function UnderNavBar() {
  return (
    <div className='flex justify-center fixed bottom-0 w-full'>
      <Link href={'/myEvents'} className='py-4 w-1/6 bg-slate-400 justify-center flex border-2 border-black rounded-tl-3xl'>האירועים שלי</Link>
      <IsLoggedIn actionA={<Link href={'/createAndModifyEvents'} className='py-4 w-1/6 bg-slate-400 justify-center flex border-2 border-black border-l-0'>צור אירוע</Link>} actionB={<Link href={`/logInTo/logInToCreateEvents?callBackUrl=/`} className='py-4 w-1/6 bg-slate-400 justify-center flex border-2 border-black border-l-0'>צור אירוע</Link>}/>
      <Link href={'/myTickets'} className='py-4 w-1/6 bg-slate-400 justify-center flex border-2 border-l-0 border-black rounded-tr-3xl'>הכרטיסים שלי</Link>
    </div> 
  )
}

export default UnderNavBar
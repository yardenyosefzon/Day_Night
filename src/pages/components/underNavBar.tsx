import Link from 'next/link'
import React from 'react'
import IsLoggedIn from './isLoggedIn'
import {IBM_Plex_Sans_Hebrew, Cousine} from 'next/font/google'

const ibm = IBM_Plex_Sans_Hebrew({subsets: ['hebrew'], weight: '500'})
const cousine = Cousine({subsets: ['hebrew'], weight: '400'})

function UnderNavBar() {
  return (
    <div className={`${cousine.className} flex justify-center fixed bottom-0 w-full shadow-2xl shadow-black drop-shadow-2xl`}>
      <IsLoggedIn actionA={<Link href={'/myEvents'} className='py-3 w-1/3 bg-orange-100 bg-opacity-95 bg-gradient-to-r justify-center flex border-2 border-l-0 border-b-0 border-black sm:rounded-tl-3xl'>האירועים שלי</Link>} actionB={<Link href={`/logInTo/logInToWatchEvents?callBackUrl=/`} className='py-3 w-1/3 bg-orange-100 bg-opacity-95 bg-gradient-to-r justify-center flex border-2 border-l-0 border-b-0 border-black sm:rounded-tl-3xl'>האירועים שלי</Link>}/>
      <IsLoggedIn actionA={<Link href={'/createAndModifyEvents'} className='py-3 w-1/3 bg-orange-100 bg-opacity-95 bg-gradient-to-r justify-center flex border-2 border-b-0 border-black border-l-0'>צור אירוע</Link>} actionB={<Link href={`/logInTo/logInToCreateEvents?callBackUrl=/`} className='py-3 w-1/3 bg-orange-100 bg-opacity-95 bg-gradient-to-r justify-center flex border-2 border-b-0 border-black border-l-0'>צור אירוע</Link>}/>
      <IsLoggedIn actionA={<Link href={'/myTickets'} className='py-3 w-1/3 bg-orange-100 bg-opacity950 bg-gradient-to-r justify-center flex border-2 border-r-0 border-b-0 border-l-0 border-black sm:rounded-tr-3xl'>הכרטיסים שלי</Link>} actionB={<Link href={`/logInTo/logInToWatchTickets?callBackUrl=/`} className='py-3 w-1/3 bg-orange-100 bg-opacity950 bg-gradient-to-r justify-center flex border-2 border-r-0 border-b-0 border-l-0 border-black sm:rounded-tr-3xl'>הכרטיסים שלי</Link>}/>
    </div> 
  )
}

export default UnderNavBar
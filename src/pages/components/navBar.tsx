'use client'
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Secular_One } from 'next/font/google'

const secular = Secular_One({subsets:["hebrew"], weight:"400"})

function NavBar() {
    const session = useSession()
    const { pathname, replace } = useRouter()
    if(pathname == '')return <></>
  return (
    <div className='absolute flex w-full border-b-4 border-orange-300 bg-gradient-to-b from-orange-50 via-white to-orange-50 h-11 items-center p-2 z-40 sm:p-6'>
        <div className='w-1/3 text-left text-sm font-semibold mt-2'>{session.data?.user.name}</div>
        <button onClick={() => {replace('/homePage')}} className={`w-1/3 text-center text-2xl ${secular.className} mt-2`}><label className='text-orange-300 font-extrabold'>Day</label>∞Night</button>
        <div className='w-1/3 text-right font-semibold mt-2'>
            {session.data?
                <button onClick={()=> signOut({callbackUrl: "http://localhost:3000/"})}>sign out</button> 
                :<button onClick={()=> signIn('google')}>signIn</button>
            }
        </div>
    </div>
  )
}

export default NavBar
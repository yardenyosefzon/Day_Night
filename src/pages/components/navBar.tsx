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
    <div className='absolute flex w-full bg-white border-b-4 border-amber-600 h-11 items-center p-2 z-50 sm:p-6'>
        <div className='w-1/3 text-left text-sm font-semibold mt-2'>{session.data?.user.name}</div>
        <button onClick={() => {replace('/')}} className={`w-1/3 text-center text-2xl ${secular.className} mt-2`}>Day∞Night</button>
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
'use client'
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function NavBar() {
    const session = useSession()
    const route = useRouter()
    if(route.pathname == '')return <></>
  return (
    <div className='flex justify-between border-b-4 border-amber-600 h-fit'>
        <div>NavBar</div>
        <h1>Day&Night</h1>
        <div className='flex gap-3'>
            <div>{session.data?.user.name}</div>
            {session.data?
                <button onClick={()=> signOut()}>sign out</button> 
                :<button onClick={()=> signIn('google')}>signIn</button>
            }
        </div>
    </div>
  )
}

export default NavBar
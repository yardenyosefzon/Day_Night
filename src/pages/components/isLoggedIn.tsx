import { useSession } from 'next-auth/react'
import React from 'react'

function IsLoggedIn({actionA, actionB}:any) {

    const session = useSession()
    if(session.data) return (actionA)
    return actionB
}

export default IsLoggedIn
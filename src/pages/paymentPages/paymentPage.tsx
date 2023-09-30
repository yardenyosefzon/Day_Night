import { useRouter } from 'next/router'
import React from 'react'

export default function PaymentPage() {
    const {query: {url}} = useRouter()
  return (
    <div className='flex justify-center items-center h-screen p-6'>
        <iframe className='h-full w-10/12' src={url as string}/>
    </div>
  )
}

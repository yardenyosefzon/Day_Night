import React from 'react'
import { Noto_Sans_Hebrew } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';

const nont = Noto_Sans_Hebrew({subsets: ["hebrew"], weight:"400"})

function Reject() {
  return (
    <div className={`absolute flex flex-col justify-center items-center min-h-screen h-screen bg-orange-50 w-screen ${nont.className} gap-11`}>
        <FontAwesomeIcon icon={faCircleXmark} className='text-9xl text-red-400'/>
        <p dir='rtl' className='text-2xl sm:text-4xl'>משהו השתבש בתהליך התשלום!</p>
        <p dir='rtl' className='text-2xl sm:text-4xl'>אנא נסו שנית</p>
        <Link href={'/homePage'} className='text-2xl p-2 px-3 bg-amber-200 rounded-md'>חזרו לדף הבית</Link>
    </div>
  )
}

export default Reject
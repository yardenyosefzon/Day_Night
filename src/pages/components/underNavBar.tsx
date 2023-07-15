import Link from 'next/link'
import React from 'react'

function UnderNavBar() {
  return (
    <div className='flex justify-center fixed bottom-0 w-full'>
      <Link href={'/'} className='py-4 w-1/6 bg-slate-400 justify-center flex border-2 rounded-tl-3xl border-black'>UnderNavBar</Link>
      <Link href={'/'} className='py-4 w-1/6 bg-slate-400 justify-center flex border-2 border-l-0 border-black rounded-tr-3xl'>UnderNavBar</Link>
    </div> 
  )
}

export default UnderNavBar
import React from 'react'

function TicketNotBelongPopUp() {
  return (
    <div className='absolute flex justify-center w-screen z-50 mt-10'>
        <div className='bg-black bg-opacity-50 p-3 rounded-full'>
        <p className='text-red-400 font-bold text-sm'>הכרטיס לא שייך למסיבה זו</p>
        </div>

    </div>
  )
}

export default TicketNotBelongPopUp
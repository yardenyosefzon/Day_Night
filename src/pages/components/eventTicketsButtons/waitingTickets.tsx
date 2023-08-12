import dynamic from 'next/dynamic';
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp, faUser } from '@fortawesome/free-regular-svg-icons';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

type WaitingTicketsProps = {
    handleButtonClick: (action: string, slug: string, email: string, qrCode: string) => Promise<void>
    ticket: {
        email: string;
        gender: string;
        birthDay: string;
        verified: boolean;
        instaUserName: string;
        phoneNumber: string;
        rejected: boolean;
        slug: string;
        ticketKind: string;
        qrCode: string;
        fullName: string;
    }
}

function NoSSRWaitingTickets({ticket, handleButtonClick}: WaitingTicketsProps) {
  return (
    <>
        <div className="flex flex-col w-10/12 items-center border-b border-dotted border-black p-4 px-0 bg-white shadow-lg rounded">
             <div className='flex flex-row-reverse gap-3 w-4/6 text-right'>
                <div>
                  <FontAwesomeIcon icon={faUser}/>
                </div>
                <div>
                  <p>{ticket.fullName}</p>
                </div>
             </div>
             <div className='flex flex-row-reverse gap-3 w-4/6 text-right'>
                <div>
                  <FontAwesomeIcon icon={faTicket}/>
                </div>
                <div>
                  <p>{ticket.ticketKind}</p>
                </div>
             </div>
             <div className='flex flex-row-reverse gap-3 w-4/6 text-right'>
              <div>
                <FontAwesomeIcon icon={faLink}/>
              </div>
              <div>
               <a href={`https://www.instagram.com/${ticket.instaUserName}`} target="_blank" className='underline'>קישור לאינסטגרם</a>
              </div>
             </div>
              <div className="flex flex-row-reverse gap-6 mt-4">
                <div className="flex flex-row-reverse gap-2 bg-gradient-to-l from-white to-green-50 p-1 rounded-md">
                  <div>
                    <FontAwesomeIcon icon={faThumbsUp} className='text-green-400'/>
                  </div>
                  <div>
                    <button onClick={() => handleButtonClick("verified", ticket.slug, ticket.email, ticket.qrCode)}>אשר כרטיס</button>
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-2 bg-gradient-to-l from-white to-red-50 p-1 rounded-md">
                <div>
                    <FontAwesomeIcon icon={faThumbsDown} className='text-red-400'/>
                  </div>
                  <div>
                    <button onClick={() => handleButtonClick("rejected", ticket.slug, ticket.email, ticket.qrCode)}>דחה כרטיס</button>
                  </div>
                </div>
              </div>
          </div>
    </>
  )
}

const WaitingTickets = dynamic(() => Promise.resolve(NoSSRWaitingTickets), {
    ssr: false,
  })

export default WaitingTickets
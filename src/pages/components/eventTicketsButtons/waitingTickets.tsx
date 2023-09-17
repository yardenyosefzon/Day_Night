import dynamic from 'next/dynamic';
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp, faUser } from '@fortawesome/free-regular-svg-icons';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

type WaitingTicketsProps = {
    handleButtonClick: (action: string, verified: boolean, slug: string, fullName: string, email: string, qrCode: string, ticketKind: string, approval_transaction_uid: string, charge_transaction_uid: string | null) => Promise<void>
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
        approval_transaction_uid: string;
        charge_transaction_uid: string | null;
    }
}

function NoSSRWaitingTickets({ticket, handleButtonClick}: WaitingTicketsProps) {
  return (
    <>
        <div className="flex flex-col items-center border-b border-dotted border-black p-2 sm:flex-row-reverse sm:p-3">
             <div className='flex flex-row-reverse gap-3 w-4/6 text-right sm:w-full'>
                <div>
                  <FontAwesomeIcon icon={faUser}/>
                </div>
                <div>
                  <p>{ticket.fullName}</p>
                </div>
             </div>
             <div className='flex flex-row-reverse gap-3 w-4/6 text-right sm:w-full'>
                <div>
                  <FontAwesomeIcon icon={faTicket}/>
                </div>
                <div>
                  <p>{ticket.ticketKind}</p>
                </div>
             </div>
             <div className='flex flex-row-reverse gap-3 w-4/6 text-right sm:w-full'>
              <div>
                <FontAwesomeIcon icon={faLink}/>
              </div>
              <div>
               <a href={`https://www.instagram.com/${ticket.instaUserName}`} target="_blank" className='underline'>קישור לאינסטגרם</a>
              </div>
             </div>
              <div className="flex flex-row-reverse gap-6 mt-4 sm:mt-0 sm:mr-2">
                <div className="flex flex-row-reverse gap-2 bg-gradient-to-l from-white to-green-50 p-1 rounded-md">
                  <div>
                    <FontAwesomeIcon icon={faThumbsUp} className='text-green-400'/>
                  </div>
                  <div className='sm:w-20'>
                    <button onClick={() => handleButtonClick("verified", false, ticket.slug, ticket.fullName, ticket.email, ticket.qrCode, ticket.ticketKind, ticket.approval_transaction_uid, ticket.charge_transaction_uid)}>אשר כרטיס</button>
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-2 bg-gradient-to-l from-white to-red-50 p-1 rounded-md">
                <div>
                    <FontAwesomeIcon icon={faThumbsDown} className='text-red-400'/>
                  </div>
                  <div className='sm:w-20'>
                    <button onClick={() => handleButtonClick("rejected", false, ticket.slug, ticket.fullName, ticket.email, ticket.qrCode, ticket.ticketKind, ticket.approval_transaction_uid, ticket.charge_transaction_uid)}>דחה כרטיס</button>
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
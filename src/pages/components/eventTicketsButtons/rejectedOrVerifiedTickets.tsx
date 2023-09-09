import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLink, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import React from 'react'

type RejectedOrVerifiedTicketsProps = {
    handleButtonClick: (action: string, slug: string, email: string, qrCode: string, transaction_uid: string) => Promise<void>
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
        transaction_uid: string;
    }
}

function NoSSRRejectedOrVerifiedTickets({ticket, handleButtonClick}: RejectedOrVerifiedTicketsProps) {
  return (
    <>
        <div className="flex flex-col items-center border-b border-dotted border-black p-2 sm:flex-row-reverse sm:p-3">
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
              <div className="flex flex-row-reverse justify-center mt-3 p-2 bg-gradient-to-r from-red-100 to-green-100 rounded sm:w-2/5 sm:mt-0">
                <button onClick={() => handleButtonClick("waiting", ticket.slug, ticket.email, ticket.qrCode, ticket.transaction_uid)}>
                    בטל סטטוס זה
                </button>
              </div>
          </div>
          {
            
          }
    </>
  )
}

const RejectedOrVerifiedTickets = dynamic(() => Promise.resolve(NoSSRRejectedOrVerifiedTickets), {
    ssr: false,
  })

export default RejectedOrVerifiedTickets
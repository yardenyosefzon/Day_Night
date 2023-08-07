import dynamic from 'next/dynamic';
import React from 'react'

type RejectedOrVerifiedTicketsProps = {
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

function NoSSRRejectedOrVerifiedTickets({ticket, handleButtonClick}: RejectedOrVerifiedTicketsProps) {
  return (
    <>
        <div key={ticket.slug} className="border border-black p-4 m-2 text-center flex flex-col">
            <div className="flex flex-row-reverse gap-x-20 justify-center">
              <div>
                <p>{ticket.fullName}</p>
              </div>
              <div>
              סוג הכרטיס: {ticket.ticketKind}
              </div>
              <div>
                <a href={`https://www.instagram.com/${ticket.instaUserName}`} target="_blank">קישור לאינסטגרם</a>
              </div>
            </div>
              <div className="flex flex-row-reverse gap-x-20 justify-center">
                <button onClick={() => handleButtonClick("waiting", ticket.slug, ticket.email, ticket.qrCode)}>
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
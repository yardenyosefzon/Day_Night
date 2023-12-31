import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Spinner from "~/pages/components/spinner";
import WaitingTickets from "~/pages/components/eventTicketsButtons/waitingTickets";
import RejectedOrVerifiedTickets from "~/pages/components/eventTicketsButtons/rejectedOrVerifiedTickets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faChevronRight, faQuestion } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function EventTicketsCreatorPage() {
  const { query: { eventName } } = useRouter();
  const { data: ticketsData, refetch: eventsRefetch } = api.boughtTickets.getManyByEvent.useQuery({ eventName: eventName as string });
  const ticketApprovelMutation = api.boughtTickets.updateAprovelOfOneBySlug.useMutation();
  const ticketChargeMutation = api.boughtTickets.updateChargeTransactionUidofOneBySlug.useMutation();
  const { mutate: changeNumberOfBoughtTickets } = api.schemaTickets.changeNumberOfBoughtTicketsOfOneByEventAndTicketName.useMutation()
  const [isLoading, setIsLoading] = useState(false);
  const [ticketCounts, setTicketCounts] = useState({
    verified: 0,
    waiting: 0,
    rejected: 0
  });

  // State to track the current ticket category (verified, waiting, rejected)
  const [currentCategory, setCurrentCategory] = useState("verified");

  // Recalculate the ticket counts every time ticketsData changes
  useEffect(() => {
    if (ticketsData) {
      const verifiedCount = ticketsData.filter((ticket) => ticket.verified).length;
      const waitingCount = ticketsData.filter((ticket) => !ticket.verified && !ticket.rejected).length;
      const rejectedCount = ticketsData.filter((ticket) => ticket.rejected).length;

      setTicketCounts({
        verified: verifiedCount,
        waiting: waitingCount,
        rejected: rejectedCount,
      });
    }
  }, [ticketsData]);

  const handleButtonClick = async (action: string, verified: boolean, slug: string, fullName: string, email: string, qrCode: string, ticketKind:string, approval_transaction_uid: string, charge_transaction_uid: string | null) => {

    setIsLoading(true);
 
    if(action === "verified"){
      fetch('/api/getTransactionByUid',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "transaction_uid": approval_transaction_uid
        })
      })
        .then(res => {
          if(res.ok)  return res.json()
          else throw new Error('Somthing went wrong with getting your transaction')
        })
          .then(res => {
            const price = res.data[0].data.items[0].quantity_price
            fetch('/api/chargeByApprovalUid',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "approval_transaction_uid": approval_transaction_uid,
                "amount": price
              })  
            })
              .then(res => {
                if(res.ok) return res.json()
              })
                .then(res => {
                  ticketChargeMutation.mutate({charge_transaction_uid: res.data.transaction.uid, slug: slug})
                  ticketApprovelMutation.mutateAsync({ action: action, slug: slug })
                    .then(_ => {
                      setIsLoading(false);
                      eventsRefetch();
                    })
                })
        .catch(error => {
          console.log('error:', error)
        })
        fetch('/api/email/aprove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email, qrCode: qrCode, eventName: eventName })
        })
        .then((res)=>{
        if(res.ok)
        console.log("mail sent")
        else
        console.log("somthing went wrong")
        })    
      })
    }
    else if(action === 'waiting'){
      if(verified){
        fetch('/api/getTransactionByUid',{
          method:'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "transaction_uid": charge_transaction_uid
          })
        })
          .then(res => {
            if(res.ok) return res.json()
          })
            .then(res => {
              const amount = res.data[0].transaction.amount
              fetch('/api/refundByChargeUid',{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "charge_transaction_uid": charge_transaction_uid,
                  "amount": amount
                })
              })
                .then(res => {
                  if(res.ok) return res.json()
                })
                  .then(res => {
                    ticketApprovelMutation.mutateAsync({ action: action, slug: slug })
                      .then(_ => {
                        fetch('/api/email/approvelCancel',{
                          method:'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            "userName": fullName,
                            "usersEmails": email,
                            "eventName": eventName,
                          })
                        })
                        setIsLoading(false)
                        eventsRefetch();
                      })
                  })
            })
    }
    else{
      ticketApprovelMutation.mutateAsync({ action: action, slug: slug })
      .then(_ => {
        changeNumberOfBoughtTickets({eventName: eventName as string, ticketName: ticketKind, number: 1 })
        setIsLoading(false)
        eventsRefetch();
      })
    }
    }
    else{
      ticketApprovelMutation.mutateAsync({ action: action, slug: slug })
        .then(_ => {
          fetch('/api/email/denied',{
            method:'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "userName": fullName,
              "usersEmails": email,
              "eventName": eventName,
            })
          })
          changeNumberOfBoughtTickets({eventName: eventName as string, ticketName: ticketKind, number: -1 })
          setIsLoading(false);
          eventsRefetch();
        })
    }
 };

  // Filter the tickets based on the current category
  const filteredTickets = ticketsData?.filter((ticket) => {
    if (currentCategory === "verified") {
      return ticket.verified;
    } else if (currentCategory === "waiting") {
      return !ticket.verified && !ticket.rejected;
    } else if (currentCategory === "rejected") {
      return ticket.rejected;
    }
    return false;
  });

  return (
    <div className="absolute h-screen w-full bg-orange-50 overflow-hidden">
      <div className="absolute right-0 top-0 mt-10 p-4 sm:p-14 sm:px-20">
        <Link href={'/myEvents'}>
          <FontAwesomeIcon icon={faChevronRight} className="text-xl sm:text-2xl"/>
        </Link>
      </div>
      <div className="flex flex-col w-full h-full items-center mt-16 pb-3">
        {isLoading && <Spinner/>}
        <div className="flex justify-center">
          <p dir="rtl" className="text-2xl mb-4">
             כרטיסים עבור {eventName} 
          </p>
        </div>
        <div className="flex flex-col h-1/5 w-11/12 bg-white rounded justify-center items-center shadow-xl py-2 sm:flex-col sm:mr-0 sm:w-3/12">
            <div className={`flex flex-row-reverse justify-between text-md p-1 text-center w-7/12 cursor-pointer sm:text-base sm:text-right sm:w-7/12`}onClick={() => setCurrentCategory("waiting")}>
                <div className={`${currentCategory === "waiting" ? "text-orange-400" : ""}`}>
                  <FontAwesomeIcon icon={faQuestion}/>
                </div>
                <div className={`${currentCategory === "waiting" ? "text-orange-400" : ""}`}>
                  <p>
                    כרטיסים ממתינים
                  </p>
                </div>
                <div className="bg-orange-100 p-1 px-3 rounded-full">
                  <p>
                {ticketCounts.waiting}
                  </p>
              </div>
            </div>
            <div className={`flex flex-row-reverse justify-between text-md p-1 text-center w-7/12 sm:text-base sm:text-right cursor-pointer sm:w-7/12`}onClick={() => setCurrentCategory("verified")}>
              <div className={`${currentCategory === "verified" ? "text-orange-400" : ""}`}>
                <FontAwesomeIcon icon={faThumbsUp}/>
              </div>
              <div className={`${currentCategory === "verified" ? "text-orange-400" : ""}`}>
                <p>
                  כרטיסים שאושרו 
                </p>
              </div>
              <div className="bg-orange-100 p-1 px-3 rounded-full">
                <p>
                {ticketCounts.verified}
                </p>
              </div>
            </div>
            <div className={`flex flex-row-reverse justify-between text-md p-1 text-center w-7/12 sm:text-base sm:text-right cursor-pointer sm:w-7/12`}onClick={() => setCurrentCategory("rejected")}>
              <div className={`${currentCategory === "rejected" ? "text-orange-400" : ""}`}>
                <FontAwesomeIcon icon={faThumbsDown}/>
              </div>
              <div className={`${currentCategory === "rejected" ? "text-orange-600" : ""}`}>
                <p>
                    כרטיסים שנדחו   
                </p>
              </div>
              <div className="bg-orange-100 p-1 px-3 rounded-full">
                <p>
                {ticketCounts.rejected}
                </p>
              </div>
            </div>
          </div>

        <div className="flex flex-col items-center my-3 w-full h-3/5 rounded-lg overflow-y-auto">
          {filteredTickets?.length === 0 ? (
            <div className="text-xl text-center my-4">אין מה לראות כאן</div>
          )
          :
          <div className="flex flex-col bg-white p-2 pb-0 shadow-lg w-3/4 rounded-2xl sm:w-7/12">
          {filteredTickets?.map((ticket, index) => (
            currentCategory === "waiting" ? 
            <WaitingTickets key={index} ticket={ticket} handleButtonClick={handleButtonClick}/> 
            : 
            <RejectedOrVerifiedTickets key={index} ticket={ticket} handleButtonClick={handleButtonClick}/>
          ))}
          </div>
          }
        </div>
      </div>
    </div>
  );
}

export default EventTicketsCreatorPage;

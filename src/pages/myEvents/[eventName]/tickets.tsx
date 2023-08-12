import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Spinner from "~/pages/components/spinner";
import WaitingTickets from "~/pages/components/eventTicketsButtons/waitingTickets";
import RejectedOrVerifiedTickets from "~/pages/components/eventTicketsButtons/rejectedOrVerifiedTickets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

function EventTicketsCreatorPage() {
  const { query: { eventName } } = useRouter();
  const { data: ticketsData, refetch: eventsRefetch } = api.boughtTickets.getManyByEvent.useQuery({ eventName: eventName as string });
  const ticketMutation = api.boughtTickets.updateAprovelOfOneBySlug.useMutation();
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

  const handleButtonClick = async (action: string, slug: string, email: string, qrCode: string) => {
    setIsLoading(true);

    try {
      await ticketMutation.mutateAsync({ action: action, slug: slug });
      if(action === "verified" )
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
      eventsRefetch();
    } catch (error) {
      console.log("Something went wrong");
    }

    setIsLoading(false);
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
      <div className="flex flex-col w-full h-full items-center mt-16 pb-3">
        {isLoading && <Spinner />}
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

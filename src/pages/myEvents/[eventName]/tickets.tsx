import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Spinner from "~/pages/components/spinner";
import WaitingTickets from "~/pages/components/eventTicketsButtons/waitingTickets";
import RejectedOrVerifiedTickets from "~/pages/components/eventTicketsButtons/rejectedOrVerifiedTickets";

function EventTicketsCreatorPage() {
  const { query: { eventName } } = useRouter();
  const { data: ticketsData, refetch: eventsRefetch } = api.boughtTickets.getManyByEvent.useQuery({ eventName: eventName as string });
  const ticketMutation = api.boughtTickets.updateOneBySlug.useMutation();
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

  const handleButtonClick = async (action: string, slug: string) => {
    setIsLoading(true);

    try {
      await ticketMutation.mutateAsync({ action: action, slug: slug });
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
    <div>
      {isLoading && <Spinner />}
      <div className="text-2xl mb-4">{eventName} כרטיסים עבור</div>
      <div className="border-black border-2 w-fit flex flex-wrap justify-center mx-auto sm:flex-col sm:mr-0">
        <div
          className={`relative text-xs p-1 m-2 flex-auto text-center sm:text-base sm:text-right cursor-pointer ${
            currentCategory === "verified" ? "text-blue-500" : ""
          }`}
          onClick={() => setCurrentCategory("verified")}
        >
          כרטיסים שאושרו ({ticketCounts.verified})
        </div>
        <div
          className={`relative text-xs p-1 border-l m-2 flex-auto text-center sm:border-0 sm:text-base sm:text-right cursor-pointer ${
            currentCategory === "waiting" ? "text-blue-500" : ""
          }`}
          onClick={() => setCurrentCategory("waiting")}
        >
          כרטיסים שמחכים לאישור ({ticketCounts.waiting})
        </div>
        <div
          className={`relative text-xs p-1 border-l m-2 flex-auto text-center sm:border-0 sm:text-base sm:text-right cursor-pointer ${
            currentCategory === "rejected" ? "text-blue-500" : ""
          }`}
          onClick={() => setCurrentCategory("rejected")}
        >
          כרטיסים שלא אושרו ({ticketCounts.rejected})
        </div>
      </div>

      <div className="mt-6">
        {filteredTickets?.length === 0 && (
          <div className="text-xl text-center my-4">אין מה לראות כאן</div>
        )}
        {filteredTickets?.map((ticket, index) => (
          currentCategory === "waiting" ? 
          <WaitingTickets key={index} ticket={ticket} handleButtonClick={handleButtonClick}/> 
          : 
          <RejectedOrVerifiedTickets key={index} ticket={ticket} handleButtonClick={handleButtonClick}/>
        ))}
      </div>
    </div>
  );
}

export default EventTicketsCreatorPage;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Spinner from "~/pages/components/spinner";

function EventTicketsCreatorPage() {
  const { query: { eventName } } = useRouter();
  const { data: ticketsData, refetch: eventsRefetch } = api.tickets.getManyByEvent.useQuery({ eventName: eventName as string });
  const ticketMutation = api.tickets.updateOneBySlug.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [ticketCounts, setTicketCounts] = useState({
    verified: 0,
    waiting: 0,
    rejected: 0,
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
        {filteredTickets?.map((ticket) => (
          <div key={ticket.slug} className="border border-black p-4 m-2 text-center flex flex-col">
            <div className="flex flex-row-reverse gap-x-20 justify-center">
              <div>
                <p>{ticket.user.name}</p>
              </div>
              <div>
                <a href={`https://www.instagram.com/${ticket.instaUserName}`} target="_blank">קישור לאינסטגרם</a>
              </div>
            </div>
            {currentCategory === "waiting" && (
              <div className="flex flex-row-reverse gap-x-20 justify-center">
                <div className="relative">
                  <button onClick={() => handleButtonClick("verified", ticket.slug)}>אשר כרטיס</button>
                </div>
                <div className="relative">
                  <button onClick={() => handleButtonClick("rejected", ticket.slug)}>דחה כרטיס</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventTicketsCreatorPage;

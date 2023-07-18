import React from 'react'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '~/server/api/root'
import superjson from "superjson";
import { createInnerTRPCContext } from '~/server/api/trpc'

function Ticket() {
  const {query: {ticket}} = useRouter()
  const {data: ticketsData, isLoading} = api.tickets.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
  const ticketDet = ticketsData?.find(tickets => tickets.slug == ticket)
  return (
    <div>{ticketDet?.event.eventName}</div>
  )
}

export default Ticket

export async function getServerSideProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    //@ts-ignore
    ctx: createInnerTRPCContext({}), 
    transformer: superjson
  });
  
  // prefetch `events`
  await helpers.events.getAll.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}
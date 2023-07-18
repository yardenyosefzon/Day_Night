import { createServerSideHelpers } from '@trpc/react-query/server';
import React from 'react'
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { api } from '~/utils/api';
import Link from 'next/link';
import { createInnerTRPCContext } from '~/server/api/trpc';

function MyTickets() {
    const {data: ticketsData, isLoading} = api.tickets.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })

  if(isLoading) return <h1>Loading...</h1>
  return (
    <>
    <h1>הכרטיסים שלי</h1>
    {
    ticketsData?.map(ticket => 
        <Link key={ticket.slug} href={`/myTickets/${ticket.slug}`}>{ticket.event.eventName}</Link>
    )
    }
    </>
  )
}
export async function getServerSideProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    //@ts-ignore
    ctx: createInnerTRPCContext({}), 
    transformer: superjson
  });
  
  // prefetch `events`
  await helpers.tickets.getManyByUserId.fetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

export default MyTickets
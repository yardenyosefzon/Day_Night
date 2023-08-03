import { createServerSideHelpers } from '@trpc/react-query/server';
import React from 'react'
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { api } from '~/utils/api';
import Link from 'next/link';
import { costumSuperJson, createInnerTRPCContext, createTRPCContext } from '~/server/api/trpc';
import { getServerAuthSession } from '~/server/auth';
import { GetServerSidePropsContext } from 'next';

function MyTickets() {
    const {data: ticketsData, isLoading} = api.boughtTickets.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })

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
export async function getServerSideProps(context: GetServerSidePropsContext) {
  
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({session: await getServerAuthSession({req: context.req ,res: context.res}) }), 
    transformer: costumSuperJson
  });
  
  // prefetch `events`
  await helpers.boughtTickets.getManyByUserId.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

export default MyTickets
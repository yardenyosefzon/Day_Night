import React from 'react'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '~/server/api/root'
import superjson from "superjson";
import { createInnerTRPCContext } from '~/server/api/trpc'
import Image from 'next/image'

function Ticket() {
  const {query: {ticket}} = useRouter()
  const {data: ticketsData} = api.boughtTickets.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
  const ticketDet = ticketsData?.find(tickets => tickets.slug == ticket)
  return (
    <div>
      <div>{ticketDet?.event.eventName}</div>
      <Image alt="QRcode" src={ticketDet?.qrCode as string} width={150} height={150}></Image>
    </div>
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
import React, {useEffect, useState} from 'react'
import QRScanner from '../../components/scanPage/barcodeScanner'
import { createServerSideHelpers } from '@trpc/react-query/server';
import { getServerAuthSession } from '~/server/auth';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import superjson from "superjson";
import { GetServerSidePropsContext } from 'next';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import ScanData from '~/pages/components/scanPage/scanData';
import { useSession } from 'next-auth/react';

type Event = {
  scannedTicketsNumber: number,
  eventName: string;
  slug: string;
  eventCreator: {
      hideQrEx: boolean;
  } | undefined 
}

function Scan() {
  const {data} = useSession()
  const { query: {eventName} } = useRouter()
  const [event, setEvent] = useState<Event>()
  const {data: eventsData} = api.events.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
  const {data: eventScannersData} = api.eventScanner.getOneByEventNameAndEmail.useQuery( {eventName: eventName as string, userEmail: data?.user.email as string}, { refetchOnMount: false, refetchOnWindowFocus: false })

  useEffect(() => {
    setEvent(eventsData?.find(event => event.eventName === eventName))
  }, [])
  console.log(event, eventScannersData)

  if(!event && !eventScannersData)
   return<div className='absolute mt-24'>Go Away</div>
  
  else
  return (
  <div className='absolute h-screen z-50'>
    <QRScanner/>
    <ScanData scannedTicketsNumber = {event?.scannedTicketsNumber as number}/>
  </div>
  )
}

export default Scan

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const {params} = context
  const session = await getServerAuthSession({req: context.req ,res: context.res})
  
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({session: session}), 
    transformer: superjson
  });
  
  await helpers.eventScanner.getOneByEventNameAndEmail.prefetch({eventName: params?.eventName as string, userEmail: session?.user.email as string})
  await helpers.events.getManyByUserId.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}
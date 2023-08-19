import React, {useEffect, useState} from 'react'
import QRScanner from '../../components/scanPage/qrScanner'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';


export type Event = {
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
  const [showInfo, setShowInfo] = useState(false)
  const {data: verifiedTicketsData, refetch: manyBoughtTicketsRefetch, isLoading} = api.boughtTickets.getManyVerifiedByEvent.useQuery({eventName: eventName as string})
  const {data: eventsData, refetch: eventsRefetch} = api.events.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
  const {data: eventScannersData} = api.eventScanner.getOneByEventNameAndEmail.useQuery( {eventName: eventName as string, userEmail: data?.user.email as string}, { refetchOnMount: false, refetchOnWindowFocus: false })
 
  useEffect(() => {
    setEvent(eventsData?.find(event => event.eventName === eventName))
    if (typeof document !== 'undefined') {
      let scanPage = document.getElementsByClassName('z-50')
      scanPage.item(0)?.addEventListener('click', () => setShowInfo(false))
  }
  }, [event])

  if(!event && !eventScannersData)
   return<div className='absolute mt-24'>Go Away</div>
  
  else
  return (
  <div id={'scanpage'} className='absolute z-50'>
    <Link href={'/myEvents'} className='absolute top-0 right-0 z-50 rounded-full bg-white bg-opacity-90 py-1 px-3 m-2'>
      <FontAwesomeIcon icon={faChevronRight} className='text-2xl text-orange-300'/>
    </Link>
    <QRScanner event= {event as Event} isLoading= {isLoading} manyBoughtTicketsRefetch = {manyBoughtTicketsRefetch} eventsRefetch={eventsRefetch}/>
    <ScanData scannedTicketsNumber = {event?.scannedTicketsNumber as number} verifiedTicketsData = {verifiedTicketsData} showInfo= {showInfo} setShowInfo= {setShowInfo}/>
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
  
  await helpers.boughtTickets.getManyVerifiedByEvent.prefetch({eventName: params?.eventName as string})
  await helpers.eventScanner.getOneByEventNameAndEmail.prefetch({eventName: params?.eventName as string, userEmail: session?.user.email as string})
  await helpers.events.getManyByUserId.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}
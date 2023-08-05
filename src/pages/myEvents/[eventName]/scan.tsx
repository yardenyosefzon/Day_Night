import React from 'react'
import QRScanner from '../../components/barcodeScanner'
import { createServerSideHelpers } from '@trpc/react-query/server';
import { getServerAuthSession } from '~/server/auth';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import superjson from "superjson";
import { GetServerSidePropsContext } from 'next';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';

function Scan() {
  const { query: {eventName}, replace } = useRouter()
  const {data: eventsData, isLoading} = api.events.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
  if(!eventsData?.find(event => event.eventName === eventName)){
   return<div>Go Away</div>
  }
  else
  return (
    <QRScanner/>
  )
}

export default Scan

export async function getServerSideProps(context: GetServerSidePropsContext) {
  
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({session: await getServerAuthSession({req: context.req ,res: context.res}) }), 
    transformer: superjson
  });
  
  // prefetch `events`
  await helpers.events.getManyByUserId.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}
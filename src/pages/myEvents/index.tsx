import { createServerSideHelpers } from '@trpc/react-query/server';
import React from 'react'
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { api } from '~/utils/api';
import Link from 'next/link';
import { getServerAuthSession } from '~/server/auth';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { createInnerTRPCContext } from '~/server/api/trpc';
import { DehydratedState } from '@tanstack/react-query';

function MyEvents(){
  
    const {data: eventsData, isLoading} = api.events.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })

  if(isLoading) return <h1>Loading...</h1>
  return (
    <>
    <h1>האירועים שלי</h1>
    {
    eventsData?.map((event, index) =>
        <div key={index} className='flex-col'>
            <div className='border-black border-2 w-fit ml-auto flex-col p-2 relative'>             
                <div>
                  <div>{event.eventName}</div>
                </div>
                <div>
                <Link className='block w-fit ml-auto' key={event.eventName} href={`/events/${event.eventName}`}>עבור לדף אירוע</Link> 
                </div>
                <div>
                <Link key={event.eventName} href={`/myEvents/${event.eventName}/tickets`}>כרטיסים עבור אירוע זה</Link>
                </div>
                <div>
                <Link key={event.eventName} href={`/createAndModifyEvents?eventName=${event.eventName}`}>ערוך אירוע</Link>
                </div>
            </div>
        </div>
    )
    }
    </>
  )
}

export default MyEvents

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


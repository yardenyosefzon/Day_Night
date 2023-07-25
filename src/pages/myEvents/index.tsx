import { createServerSideHelpers } from '@trpc/react-query/server';
import React from 'react'
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { api } from '~/utils/api';
import Link from 'next/link';
import { getServerAuthSession } from '~/server/auth';
import { GetServerSidePropsContext } from 'next';
import { createInnerTRPCContext } from '~/server/api/trpc';

function MyEvents() {
    const {data: eventsData, isLoading} = api.events.getManyByUserId.useQuery( undefined, { refetchOnWindowFocus: false })

  if(isLoading) return <h1>Loading...</h1>
  return (
    <>
    <h1>האירועים שלי</h1>
    {
    eventsData?.map(event =>
        <div className='flex-col' key={event.eventName}>
            <div className='border-black border-2 w-fit ml-auto flex-col p-2 relative'>
              <div className='flex'>
                <Link className='block w-fit ml-auto' key={event.eventName} href={`/events/${event.eventName}`}>עבור לדף אירוע</Link>
                <div>{event.eventName}</div>
              </div>  
                <Link key={event.eventName} href={`/myEvents/${event.eventName}/tickets`}>כרטיסים עבור אירוע זה</Link>
            </div>
        </div>
    )
    }
    </>
  )
}

export default MyEvents

// export async function getServerSideProps(context: GetServerSidePropsContext) {
  
//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: createInnerTRPCContext({session: await getServerAuthSession({req: context.req ,res: context.res}) }), 
//     transformer: superjson
//   });
  
//   // prefetch `events`
//   await helpers.events.getManyByUserId.prefetch()

//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//     },
//   };
// }


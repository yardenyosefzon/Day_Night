import { createServerSideHelpers } from '@trpc/react-query/server';
import React from 'react'
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import superjson from "superjson";
import { getServerAuthSession } from '~/server/auth';
import { GetServerSidePropsContext } from 'next';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';

function QrCode() {
    const {query: {slug, nationalId, fullName, eventName}} = useRouter()

    if(typeof(slug) === "string"){
    const {data: ticketsData, isLoading} = api.boughtTickets.getOneBySlug.useQuery( {slug}, { refetchOnMount: false, refetchOnWindowFocus: false })
    if(ticketsData){
        return <div>No vialid ticket here</div>
    }
    else
    return (
      <div>
          <div>{nationalId}</div>
          <div>{fullName}</div>
          <div>{eventName}</div>
      </div>
    )
}
}
export default QrCode

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {query: {slug}} = context
    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({session: await getServerAuthSession({req: context.req ,res: context.res}) }), 
      transformer: superjson
    });

    if(typeof(slug) === "string"){
    
        await helpers.boughtTickets.getOneBySlug.prefetch({slug})
    }
  
    return {
      props: {
        trpcState: helpers.dehydrate(),
      },
    };
  }

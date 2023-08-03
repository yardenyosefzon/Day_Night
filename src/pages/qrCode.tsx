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
    const {query: {params}} = useRouter()
    if(typeof(params) === "string"){
    const paramsArray = params.split('_')
    const nationalId = paramsArray[0]
    const slug = paramsArray[1] as string
    const {data: ticketsData, isLoading} = api.boughtTickets.getOneBySlug.useQuery( {slug}, { refetchOnMount: false, refetchOnWindowFocus: false })
    console.log(nationalId, ticketsData, slug)
    if(!ticketsData){
        return <div>No vialid ticket here</div>
    }
    else
    return (
      <div>
          <div>{nationalId}</div>
          <div>{ticketsData?.event.eventName}</div>
          <div>{ticketsData.fullName}</div>
      </div>
    )
}
}
export default QrCode

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let slug
    const {query: {params}} = context
    if(typeof(params) === 'string'){
    const paramsArray = params.split('_')
    slug = paramsArray[1]
    }
    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({session: await getServerAuthSession({req: context.req ,res: context.res}) }), 
      transformer: superjson
    });

    if(typeof(slug) === 'string')
        await helpers.boughtTickets.getOneBySlug.prefetch({slug})
  
    return {
      props: {
        trpcState: helpers.dehydrate(),
      },
    };
  }

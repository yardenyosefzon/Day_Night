import { createServerSideHelpers } from '@trpc/react-query/server';
import React from 'react'
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import superjson from "superjson";
import { getServerAuthSession } from '~/server/auth';
import { GetServerSidePropsContext } from 'next';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';

function QrCode() {
    const {query: {params}} = useRouter()
    if(typeof(params) === "string"){
    const paramsArray = params.split('_')
    const nationalId = paramsArray[0]
    const slug = paramsArray[1]?.trimStart() as string
    const {data, isLoading} = api.boughtTickets.getOneBySlug.useQuery({slug})
    console.log(paramsArray[2])
    if(!data){
        return <div>No vialid ticket here</div>
    }
    else
    console.log(nationalId, data?.event.eventName)
    return (
      <div className='absolute w-full min-h-screen bg-orange-100'>
        <div className='mt-24'>
          <div>{nationalId}</div>
          <div>{data?.event.eventName}</div>
          <div>{data.fullName}</div>
          {/* //space in the string is very important! */}
          {paramsArray[2] === ' true' ?
          <Link href={`/myEvents/${data?.event.eventName}/scan`}>חזור לסריקה</Link>
          :
          <></>
        }
        </div>
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

    if(typeof(slug) === 'string'){
        slug = slug.trimStart()
        await helpers.boughtTickets.getOneBySlug.prefetch({slug})
    }
    
    return {
      props: {
        trpcState: helpers.dehydrate(),
      },
    };
  }

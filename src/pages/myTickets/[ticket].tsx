import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '~/server/api/root'
import superjson from "superjson";
import { createInnerTRPCContext } from '~/server/api/trpc'
import Image from 'next/image'
import { Noto_Sans_Hebrew } from 'next/font/google'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

const noto = Noto_Sans_Hebrew({subsets:["hebrew"], weight:"500"})

function Ticket() {
  const {query: {ticket}} = useRouter()
  const {data: ticketsData} = api.boughtTickets.getOneBySlug.useQuery({slug: ticket as string}, {refetchOnMount: false, refetchOnWindowFocus: false})
  
 if(!ticketsData?.verified)
  return (<></>)
  else
  return (
    <div className={`absolute h-screen w-full bg-gradient-to-bl from-orange-200 to-orange-800 ${noto.className}`}>
      <div className='flex flex-col h-full justify-center items-center'>
        <div className='bg-orange-50 p-2 rounded-lg shadow-lg'>
          <Image alt="QRcode" src={ticketsData?.qrCode as string} width={250} height={250}></Image>
        </div>
        <div className='absolute bottom-24'>
          <Link href={'/myTickets'} className='bg-orange-50 p-2 px-4 rounded-2xl text-2xl shadow-2xl'>חזור</Link>
        </div>
      </div>
    </div>
  )
}

export default Ticket

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query: {ticket}} = context
  const helpers = createServerSideHelpers({
    router: appRouter,
    //@ts-ignore
    ctx: createInnerTRPCContext({}), 
    transformer: superjson
  });
  
  await helpers.boughtTickets.getOneBySlug.prefetch({slug: ticket as string})

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}
import { createServerSideHelpers } from '@trpc/react-query/server';
import React, { useEffect, useState } from 'react'
import { appRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { costumSuperJson, createInnerTRPCContext, createTRPCContext } from '~/server/api/trpc';
import { getServerAuthSession } from '~/server/auth';
import { GetServerSidePropsContext } from 'next';
import { Noto_Sans_Hebrew } from 'next/font/google';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const noto = Noto_Sans_Hebrew({subsets:["hebrew"], weight:"300"})

function MyTickets() {
    const {replace} = useRouter()
    const {data: ticketsData, isLoading} = api.boughtTickets.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
    const [ticketCount, setTicketCount] = useState<Record<string, number>>({})
    const [selectedTickets, setSelectedTickets] = useState(ticketsData? ticketsData[0]?.event.eventName : '')
    const [showPopUp, setShowPopUp] = useState(false)

    const isVerified = (verified: boolean, slug: string) => {
      if(verified)
      replace(`/myTickets/${slug}`)
      else
      setShowPopUp(true)
    }
    
    useEffect(() => {
      let arr : Record<string, number> = {}
      if(ticketsData)
      for ( const ticket of ticketsData ){
        if(arr[ticket.event.eventName]){
          arr[ticket.event.eventName] = arr[ticket.event.eventName]! + 1
        }
        else
          arr[ticket.event.eventName] = 1
      }
      setTicketCount(arr)

    }, [])

  if(isLoading) return <h1>Loading...</h1>

  return (
    <div className={`absolute flex flex-col w-full min-h-screen bg-orange-100 ${noto.className}`}>
      {showPopUp && 
      <div className='fixed flex items-center justify-center w-full h-screen bg-gray-400 bg-opacity-30 z-50'>
        <div className='flex flex-col items-center rounded bg-white w-64 h-1/5'>
          <div className='mt-10'>
            <p>הברקוד יהיה זמין לאחר אישור הכרטיס</p>
          </div>
          <div className=''>
            <button className='mt-6 bg-orange-100 p-3 px-5 rounded' onClick={() => setShowPopUp(false)}>סגור</button>
          </div>
        </div>
      </div>
      }
      <div className='flex flex-col gap-5 grow items-center my-24'>
        <div className='absolute top-0 right-0 mt-14 p-3 sm:p-10 sm:pt-6'>
          <Link href={'/'}>
            <FontAwesomeIcon icon={faChevronRight} className='text-2xl'/>
          </Link>
        </div>
        <div className='flex w-full justify-center'>
          <h1 className='text-3xl font-bold'>הכרטיסים שלי</h1>
        </div>
        <div className='flex grow w-full mx-6 gap-3'>
          <div className=' bg-white rounded-xl w-full ml-1 overflow-auto'>
            {ticketsData?.filter(ticket => selectedTickets === ticket.event.eventName)
            .map(ticket => (
              <div className='w-full border-b-2 border-dotted p-1 py-3 text-sm'>
                <div>
                  שם: {ticket.fullName}
                </div>
                <div>
                  {ticket.email}
                </div>
                <div>
                  טלפון: {ticket.phoneNumber}
                </div>
                <div className='flex w-full justify-center'>
                  <button onClick={() => isVerified(ticket.verified, ticket.slug)} className='border p-1 px-2 rounded mt-1 font-semibold'>ברקוד</button>
                </div>
                <div className='flex w-full mt-3 justify-center'>
                  <FontAwesomeIcon icon={faTicket}/>
                </div>
              </div>
            ))}
          </div>
          <div className='flex h-52 bg-white rounded-xl w-full items-center justify-center shadow-lg mr-1 p-2 sm:h-auto'>
            <div className='flex flex-col-reverse gap-2 rounded border w-full bg-orange-50 p-2 py-4 overflow-scroll sm:overflow-auto sm:h-full sm:justify-end'>
              {
              Object.entries(ticketCount).map((yo) => (
                <button className='flex justify-between bg-white p-2 w-full rounded shadow-md' onClick={() => setSelectedTickets(yo[0])}>
                  <div className='rounded-full bg-orange-50 px-2 border'>
                    <p className='font-semibold'>{yo[1]}</p>
                  </div>
                  <div >
                  {yo[0]}
                  </div>
                </button>
              ))
              }
            </div>
          </div>
        </div>
        </div>
    </div>
  )
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({session: await getServerAuthSession({req: context.req ,res: context.res}) }), 
    transformer: costumSuperJson
  });
  
  // prefetch `events`
  await helpers.boughtTickets.getManyByUserId.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

export default MyTickets
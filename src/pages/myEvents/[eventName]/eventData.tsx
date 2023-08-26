import { createServerSideHelpers } from '@trpc/react-query/server'
import { GetServerSidePropsContext } from 'next'
import React, { useEffect, useState } from 'react'
import { appRouter } from '~/server/api/root'
import { createInnerTRPCContext } from '~/server/api/trpc'
import { getServerAuthSession } from '~/server/auth'
import superjson from "superjson";
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faPercent } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { api } from '~/utils/api'
import { useRouter } from 'next/router'
import { Noto_Sans_Hebrew } from 'next/font/google'
import { Doughnut} from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Link from 'next/link'

ChartJS.register(ArcElement, Tooltip, Legend);

// const options = {
//   plugins: {
//     legend: {
//       display: true,
//     },
//     datalabels: {
//       labels: {
//         color: '#404040',
//         font: {
//           size: 18,
//         },
//       },
//       display: true,
//       formatter: (value) => {
//         console.log(value);
//         return value;
//       },
//       font: {
//         weight: 'bold',
//         size: 15,
//       },
//     },
//   },
// };

const noto = Noto_Sans_Hebrew({subsets: ['hebrew'], weight: '400'})

type Event = {
  eventName: string;
  slug: string;
  views: number;
  eventCreator: {
      hideQrEx: boolean;
  } | undefined 
}

function EventData() {

  const { query: {eventName} } = useRouter()
  const [event, setEvent] = useState<Event>()
  const [boughtTicketsGenderCount, setBoughtTicketsGenderCount] = useState({
    male: 0,
    female: 0,
    other: 0
  })
  const [verifiedTicketsGenderCount, setVerifiedTicketsGenderCount] = useState({
    male: 0,
    female: 0,
    other: 0
  })

  const {data: eventsData} = api.events.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
  const {data: boughtTicketsData} = api.boughtTickets.getManyByEvent.useQuery( {eventName: eventName as string}, { refetchOnMount: false, refetchOnWindowFocus: false })

  const boughtData = {
    labels: [
      `${boughtTicketsGenderCount?.male} :גברים`,
      `${boughtTicketsGenderCount?.female} :נשים`,
      `${boughtTicketsGenderCount?.other} :אחר`,
    ],
    datasets: [{
      data: [boughtTicketsGenderCount?.male, boughtTicketsGenderCount?.female, boughtTicketsGenderCount?.other],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
        'rgb(134 239 172)'
      ],
      hoverOffset: 4
    }]
  };

  const verifiedtData = {
    labels: [
      `${verifiedTicketsGenderCount?.male} :גברים`,
      `${verifiedTicketsGenderCount?.female} :נשים`,
      `${verifiedTicketsGenderCount?.other} :אחר`,
    ],
    datasets: [{
      data: [verifiedTicketsGenderCount?.male, verifiedTicketsGenderCount?.female, verifiedTicketsGenderCount?.other],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
        'rgb(134 239 172)'
      ],
      hoverOffset: 4
    }]
  };

  useEffect(() => {
    setEvent(eventsData?.find(event => event.eventName === eventName))
    const boughtTicketsgenderCount = {
      male: 0,
      female: 0,
      other: 0
    }
    const verifiedTicketsgenderCount = {
      male: 0,
      female: 0,
      other: 0
    }
    for(let ticket of boughtTicketsData!){
      if(ticket.gender === "זכר")
        if(ticket.verified === true)
          verifiedTicketsgenderCount.male += 1
        else
          boughtTicketsgenderCount.male +=1
      if(ticket.gender === "נקבה")
        if(ticket.verified === true)
          verifiedTicketsgenderCount.female += 1
        else
          boughtTicketsgenderCount.female +=1
      if(ticket.gender === "אחר")
        if(ticket.verified === true)
          verifiedTicketsgenderCount.other += 1
        else
          boughtTicketsgenderCount.other +=1
    }
    setBoughtTicketsGenderCount(prev => boughtTicketsgenderCount)
    setVerifiedTicketsGenderCount(prev => verifiedTicketsgenderCount)
  }, [])
  
  return (
    <div className={`absolute flex items-center justify-center min-h-screen h-fit w-full bg-orange-50 ${noto.className} p-4`}>
        <div className='flex flex-col mt-11 w-11/12 h-fit bg-white rounded-xl shadow-md p-3 sm:w-7/12'>          
          <div className='absloute'>
            <Link href={'/myEvents'}>
              <FontAwesomeIcon className='text-lg p-4 sm:text-xl' icon={faChevronRight}/>
            </Link>
          </div>
            <div className='flex flex-col items-center -mt-7'>
                <div className='flex flex-col gap-2 justify-center items-center text-lg border-b border-black py-2 w-11/12'> 
                  <div className='flex gap-4 items-center'>
                    <p>צפיות</p>
                    <FontAwesomeIcon icon={faEye} className=''/>
                  </div>
                  <p className='mr-3'>{event?.views}</p>
                </div>
                <div className='flex flex-col gap-2 justify-center items-center text-lg border-b border-black py-2 w-11/12'> 
                  <div className='flex gap-2 items-center'>
                    <p>אחוזי קנייה</p>
                    <FontAwesomeIcon icon={faPercent} className=''/>
                  </div>
                  {boughtTicketsData?.length === 0 ?
                  <p>0</p>
                  :
                  <p className='mr-3'>{boughtTicketsData?.length! / event?.views! * 100}%</p>
                  }
                </div>
                <div className='flex flex-col items-center mt-3 border-b border-black w-11/12 py-2'>
                  <p className='text-lg'>כרטיסים שנקנו</p>
                  <div>
                    <Doughnut data={boughtData}/>
                  </div>
                </div>
                <div className='flex flex-col items-center mt-3'>
                  <p className='text-lg'>כרטיסים שאושרו</p>
                  <Doughnut data={verifiedtData}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EventData

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const {params} = context
  const session = await getServerAuthSession({req: context.req ,res: context.res})

    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({session: session }), 
      transformer: superjson
    });
    
    await helpers.events.getManyByUserId.prefetch()
    await helpers.boughtTickets.getManyByEvent.prefetch({eventName: params?.eventName as string})
  
    return {
      props: {
        trpcState: helpers.dehydrate(),
      },
    };
  }
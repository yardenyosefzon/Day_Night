import { createServerSideHelpers } from '@trpc/react-query/server'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, {useEffect, useState} from 'react'
import SuperJSON from 'superjson'
import { appRouter } from '~/server/api/root'
import { createInnerTRPCContext } from '~/server/api/trpc'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/utils/api'
import { Noto_Sans_Hebrew } from 'next/font/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const noto = Noto_Sans_Hebrew({subsets: ['hebrew'], weight:'400'})

type verifiedTicketsData = {
  slug: string;
  email: string;
  ticketKind: string;
  birthDay: string;
  gender: string;
  phoneNumber: string;
  instaUserName: string;
  fullName: string;
  verified: boolean;
  rejected: boolean;
  qrCode: string;
  nationalId: string;
}[] | undefined

function ScanData({scannedTicketsNumber} : {scannedTicketsNumber: number}) {

  const {query: {eventName}} = useRouter()
  const {data: verifiedTicketsData} = api.boughtTickets.getManyVerifiedByEvent.useQuery({eventName: eventName as string})
  // const {data: verifiedAndScannedTicketsData} = api.boughtTickets.getManyVerifiedAndScannedByEvent.useQuery({eventName: eventName as string})
  const [lastScanned, setLastScanned] = useState("")
  const [showInfo, setShowInfo] = useState(false)
  const [ticketKind, setTicketKind] = useState('verifiedTickets')
  const [verfiedTickets, setVerfiedTickets] = useState<verifiedTicketsData>()
  const [scannedVerfiedTickets, setScannedVerfiedTickets] = useState<verifiedTicketsData>()
  useEffect(() => {
    const verifiedTickets = verifiedTicketsData?.filter( ticket => ticket.scanned === false)
    const scannedVerfiedTickets = verifiedTicketsData?.filter( ticket => ticket.scanned === true)
    setVerfiedTickets(() => verifiedTickets)
    setScannedVerfiedTickets(() => scannedVerfiedTickets)
  }, [])
  
  return (
    <div className={`sticky flex flex-col-reverse items-center w-screen h-fit bottom-0 ${noto.className} bg-orange-100`}>
            <div className='flex flex-row-reverse justify-between w-full p-2 border-b border-black'>
                <div className='flex flex-col items-center w-1/3'>
                  <p>{scannedTicketsNumber}</p>
                  <p>סרוקים</p>
                </div>
                <div className='flex flex-col items-center w-1/3'>
                  <p>{verifiedTicketsData?.length}</p>
                  <p>סה"כ</p>
                </div>
                <div className='flex flex-col items-center w-1/3'>
                  {scannedVerfiedTickets && lastScanned === "" ? scannedVerfiedTickets[scannedVerfiedTickets.length - 1]?.fullName : lastScanned}
                </div>
            </div>
            <div className='p-1'>
              <FontAwesomeIcon icon={showInfo ? faChevronDown : faChevronUp} onClick={() => setShowInfo(bool => !bool)} className='text-xs p-7 -m-7'/>
            </div>
              <div className={`flex flex-col ${!showInfo ? 'h-10' : 'h-64'} py-3 transition-all`}>
              {
                showInfo ?
                  <div className='flex flex-col w-screen h-full'>
                    <div className='flex w-full justify-center border-b-2 border-black'>
                      <button onClick={() => setTicketKind('scannedVerifiedTickets')} className='w-1/2'>פירוט סרוקים</button>
                      <button onClick={() => setTicketKind('verifiedTickets')} className='w-1/2'>פירוט ממתינים</button>
                    </div>
                    {ticketKind === 'verifiedTickets' ?
                    verfiedTickets?.length === 0 ?
                      <p>אין כאן כרטיסים</p>
                    :
                    verfiedTickets?.map(ticket => 
                      <div className='flex flex-row-reverse w-full text-center'>
                        <p className='w-1/3'>
                          {ticket.fullName}
                        </p>
                        <p className='w-1/3'>
                          {ticket.nationalId}
                        </p>
                        <div className='w-1/3'>
                          <button className='w-4/5'>
                            כרטיס
                          </button>
                        </div>
                      </div>
                    )
                    :
                    scannedVerfiedTickets?.length === 0 ?
                      <p>אין כאן כרטיסים</p>
                    :
                    scannedVerfiedTickets?.map(ticket => 
                      <div>{ticket.fullName}</div>
                    )}
                  </div>
                  :
                <p>פרטים נוספים</p>
              }
              </div>
    </div>
  )
}

export default ScanData

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const {params} = context
  const session = await getServerAuthSession({req: context.req ,res: context.res})

    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({session: session }), 
      transformer: SuperJSON
    });
    
    await helpers.boughtTickets.getManyVerifiedAndScannedByEvent.prefetch({eventName: params?.eventName as string})
    await helpers.boughtTickets.getManyVerifiedByEvent.prefetch({eventName: params?.eventName as string})
  
    return {
      props: {
        trpcState: helpers.dehydrate(),
      },
    };
  }
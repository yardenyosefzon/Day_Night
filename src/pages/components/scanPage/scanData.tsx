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

function ScanData({scannedTicketsNumber} : {scannedTicketsNumber: number}) {

  const {query: {eventName}} = useRouter()
  const {data: verifiedTicketsData} = api.boughtTickets.getManyVerifiedByEvent.useQuery({eventName: eventName as string})
  const {data: verifiedAndScannedTicketsData} = api.boughtTickets.getManyVerifiedAndScannedByEvent.useQuery({eventName: eventName as string})
  const [lastScanned, setLastScanned] = useState("")
  const [showInfo, setShowInfo] = useState(true)
  useEffect(() => {
    
  }, [])
  
  return (
    <div className={`absolute w-full h-fit bottom-0 ${noto.className} bg-orange-100`}>
         <div className='flex flex-col items-center'>
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
                  {verifiedAndScannedTicketsData && lastScanned === "" ? verifiedAndScannedTicketsData[verifiedAndScannedTicketsData.length - 1]?.fullName : lastScanned}
                </div>
            </div>
            <div className='flex flex-col p-1'>
              <FontAwesomeIcon icon={faChevronUp} className='text-xs'/>
              <p>פרטים נוספים</p>
            </div>
            {
              showInfo &&
              <div className='h-64'>

              </div>
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
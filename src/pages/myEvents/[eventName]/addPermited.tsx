import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import SuperJSON from 'superjson';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { Noto_Sans_Hebrew } from 'next/font/google';
import Spinner from '~/pages/components/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const noto = Noto_Sans_Hebrew({subsets: ['hebrew'], weight: '500'})

type Event = {
  eventName: string;
  slug: string;
  eventCreator: {
      hideQrEx: boolean;
  } | undefined 
}

function AddPermited() {
    const emailRef = useRef<HTMLInputElement>("" || null)
    const [email, setEmail] = useState('')
    const [event, setEvent] = useState<Event>()
    const [showError, setShowError] = useState(false)
    const { query: {eventName} } = useRouter()
    const {data: eventScannerData, refetch} = api.eventScanner.getManyByEventName.useQuery({eventName: eventName as string}, {refetchOnMount: false, refetchOnWindowFocus: false})
    const {mutateAsync: addEventScanner, isLoading: addEventLoading} = api.eventScanner.create.useMutation()
    const {mutateAsync: deleteEventScanner, isLoading: deleteEventLoading} = api.eventScanner.delete.useMutation()
    const {data: eventsData} = api.events.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
    

    const handleAddClick = () => {
        addEventScanner({email: email, eventName: event?.eventName as string })
        .then((res)=> {
          if(emailRef?.current?.value)
          emailRef.current.value = ""
          setShowError(false)
          refetch()
        })
        .catch((err) => {
          setShowError(true)
        })
    }

    const handleDeleteClick = (email: string) => {
      deleteEventScanner({eventName: eventName as string, email: email})
      .then(() => {
        refetch()
      })
    }
    
    useEffect(() => {
      setEvent(eventsData?.find(event => event.eventName === eventName))
    }, [])
    

    if(!event){
     return <div className='absolute min-h-screen h-fit mt-20'>
                <div className='h-screen'>Go Away</div>
            </div>
    }
  return (
    <div className={`flex flex-col justify-center items-center gap-24 min-h-screen h-screen w-screen bg-orange-50 ${noto.className}`}>
      {addEventLoading || deleteEventLoading ? <Spinner/> : null}
      <Link href={'/myEvents'}>
        <FontAwesomeIcon icon={faChevronRight} className='absolute top-0 right-0 pt-16 pr-5 sm:text-xl sm:pt-20 sm:pr-10'/>
      </Link>
          <div className='flex flex-col items-center text-center gap-4'>
               <p className='text-lg'>
                    הוסיפו משתמשים שיורשו לסרוק ברקודים של האירוע שלכם
               </p>
               <input placeholder='Email' ref={emailRef} onChange={() => setEmail(emailRef?.current?.value ? emailRef?.current?.value : "")} className={`border-2 ${!showError ? 'border-black' : 'border-red-500'}  rounded-lg p-2`} type="text" />
               <button onClick={handleAddClick} className='bg-orange-300 p-3 rounded-xl'>הוסף</button>
          </div>
          <p className={`-my-10 ${showError?'text-red-600' : 'text-orange-50'}`}>לא נמצא משתמש</p>
          <div className='flex flex-col items-center bg-white w-11/12 h-fit p-2 gap-4 shadow-lg rounded-lg sm:w-1/4'>
                {
                  eventScannerData?.length === 0 ?
                  <p> אין משתמשים מורשים </p>
                  :
                  <>                  
                    <p className='my-3'>
                    משתמשים מורשים
                    </p>
                    {eventScannerData?.map((eventScanner) => 
                    <div className='flex w-10/12 justify-between items-center'>
                      <button onClick={() => {handleDeleteClick(eventScanner?.userEmail)}} className=' p-2 px-4 rounded-lg bg-gradient-to-l from-white to-red-200'>הסר</button>
                      <p>{eventScanner?.userEmail}</p>
                    </div>
                )}
                </>
                }
          </div>
    </div>
  )
}

export default AddPermited

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const {params} = context
  const session = await getServerAuthSession({req: context.req ,res: context.res})

    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({session: session }), 
      transformer: SuperJSON
    });
    
    await helpers.events.getManyByUserId.prefetch()
    await helpers.eventScanner.getManyByEventName.prefetch({eventName: params?.eventName as string})
  
    return {
      props: {
        trpcState: helpers.dehydrate(),
      },
    };
  }
import { createServerSideHelpers } from '@trpc/react-query/server';
import React, {useEffect, useState} from 'react'
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { api } from '~/utils/api';
import Link from 'next/link';
import { getServerAuthSession } from '~/server/auth';
import { GetServerSidePropsContext } from 'next';
import { createInnerTRPCContext } from '~/server/api/trpc';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';


function MyEvents(){
    const {replace} = useRouter()
  
    const {data: eventsData, isLoading} = api.events.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })
    const {mutate} =api.users.updateHideQrExProp.useMutation()

    const [showPopup, setShowPopup] = useState(false);
    const [showDrop, setShowDrop] = useState(-1);
    const [eventName, setEventName] = useState('')
    const [hidePopupForever, setHidePopupForever] = useState(eventsData && eventsData[0]?.eventCreator.hideQrEx);

    const openPopup = (eventName: string) => {
      if(eventsData)
      if (!eventsData[0]?.eventCreator.hideQrEx) {
        setShowPopup(true);
        setEventName(eventName)
      }
      else{
        setEventName(eventName)
        replace(`/myEvents/${eventName}/scan`)
      }
    };

    const closePopup = () => {
      setShowPopup(false);
    };
  
    const handleCheckboxChange = () => {
      setHidePopupForever(!hidePopupForever);
    };

    useEffect(() => {
      return () => {
        if(eventsData){
          console.log(eventsData[0]?.eventCreator.hideQrEx)
          console.log(hidePopupForever)
        console.log(eventsData[0]?.eventCreator.hideQrEx !== hidePopupForever)
        if(eventsData[0]?.eventCreator.hideQrEx !== hidePopupForever){
          mutate({hideQrEx: hidePopupForever as boolean})
        }
      }
      }
    }, [hidePopupForever])
    
  if(isLoading) return <h1>Loading...</h1>

  return (
    <div className='absolute w-full min-h-screen h-screen bg-gradient-to-b from-orange-50 to-orange-100'>
       {/* Pop-up */}
       {showPopup && (
                      <div className='absolute w-full h-screen flex bg-gray-400 items-center justify-center bg-opacity-70 z-40'>
                        <div className='flex flex-col bg-white mx-4 p-6 rounded shadow-md relative text-right gap-3'>
                          {/* Close arrow */}
                          <div className='flex justify-end mb-2 -mr-2'>
                            <button onClick={closePopup}>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-6 w-6'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  d='M6 18L18 6M6 6l12 12'
                                />
                              </svg>
                            </button>
                          </div>
                          <div>
                            <p className='text-xl'>
                              !שימו לב
                            </p>
                          </div>
                          <div>
                            <p dir='rtl' className='text-xl'>
                              סריקת ברקוד דרך האיזור האישי תוסיף את הברקוד לרשימת הסרוקים.
                            </p>
                          </div>
                          <div>
                            <p dir='rtl' className='text-xl'>
                              במידה ואינכם מעוניינים בכך ניתן לסרוק את הברקוד בפשטות עם המצלמה של הטלפון.
                            </p>
                          </div>
                          <div className='flex justify-end text-xl'>
                            <label className='mr-3'>לעולם אל תראה שוב</label>
                              <input
                                type='checkbox'
                                className='w-5'
                                checked={hidePopupForever}
                                onChange={handleCheckboxChange}
                              />
                          </div>
                          <div className='flex justify-center w-full'>
                            <Link href={`/myEvents/${eventName}/scan`} className='bg-orange-300 text-white font-bold py-2 px-4 mt-4 rounded'>המשך</Link>
                          </div>
                        </div>
                      </div>
                    )}
      <div className='flex items-center h-fit mt-24'>
       
          <div className='flex flex-col w-full  items-center min-h-5/6 h-5/6 mx-3 rounded gap-9'>
            {
            eventsData?.map((event, index) =>
                <div key={index} className='flex justify-center w-full h-fit'>
                    <div className='flex flex-col w-full items-center border-black border-2 p-3 pb-2 rounded-md bg-white shadow-lg sm:w-2/4'>             
                        <div className='text-xl'>
                          <div>{event.eventName}</div>
                        </div>
                        <div className='flex mb-0 mt-0 justify-center hover:-mb-1 hover:mt-1 transition-all w-1/4 p-1'>
                          {
                            showDrop === index ?
                            <FontAwesomeIcon icon={faChevronUp} onClick={() => setShowDrop(-1)} className=''/>
                            :
                            <FontAwesomeIcon icon={faChevronDown} onClick={() => setShowDrop(index)} className=''/>
                          }
                        </div>
                        <div className={`flex flex-col w-full ${showDrop === index ? '' : "h-0"} items-center text-center overflow-hidden transition-transform gap-1`}>
                        <div className='w-11/12 mt-2 hover:shadow-sm hover:bg-orange-100 sm:w-3/12'>
                          <Link className='w-full p-1 px-2 rounded' href={`/events/${event.slug}`}>עבור לדף אירוע</Link> 
                        </div>
                        <div className='w-11/12 hover:shadow-sm hover:bg-orange-100 sm:w-3/12'>
                          <Link className='w-full p-1 px-2 rounded' href={`/myEvents/${event.eventName}/tickets`}>כרטיסים</Link>
                        </div>
                        <div className='w-11/12 hover:shadow-sm hover:bg-orange-100 sm:w-3/12'>
                          <button className='w-full p-1 px-2 rounded' onClick={() => openPopup(event.eventName)}>סרוק ברקודים</button>
                        </div>
                        <div className='w-11/12 hover:shadow-sm hover:bg-orange-100 sm:w-3/12'>
                          <Link className='w-full p-1 px-2 rounded' key={event.eventName} href={`/createAndModifyEvents?eventName=${event.eventName}`}>ערוך אירוע</Link>
                        </div>
                        </div>    
                  </div>
                </div>
            )
            }
          </div>
        </div>
      </div>
  )
}

export default MyEvents

export async function getServerSideProps(context: GetServerSidePropsContext) {
  
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({session: await getServerAuthSession({req: context.req ,res: context.res}) }), 
    transformer: superjson
  });
  
  // prefetch `events`
  await helpers.events.getManyByUserId.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}


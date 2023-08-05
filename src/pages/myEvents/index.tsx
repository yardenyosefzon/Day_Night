import { createServerSideHelpers } from '@trpc/react-query/server';
import React, {useState} from 'react'
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { api } from '~/utils/api';
import Link from 'next/link';
import { getServerAuthSession } from '~/server/auth';
import { GetServerSidePropsContext } from 'next';
import { createInnerTRPCContext } from '~/server/api/trpc';


function MyEvents(){
  
    const {data: eventsData, isLoading} = api.events.getManyByUserId.useQuery( undefined, { refetchOnMount: false, refetchOnWindowFocus: false })

    const [showPopup, setShowPopup] = useState(false);
    const [hidePopupForever, setHidePopupForever] = useState(false);

    const openPopup = () => {
      if (!hidePopupForever) {
        setShowPopup(true);
      }
    };

    const closePopup = () => {
      setShowPopup(false);
    };
  
    const handleCheckboxChange = () => {
      setHidePopupForever(!hidePopupForever);
    };

  if(isLoading) return <h1>Loading...</h1>

  return (
    <>
      <h1>האירועים שלי</h1>

      <div className='flex w-full justify-center mt-24'>
          {
          eventsData?.map((event, index) =>
              <div key={index} className='flex-col'>
                  <div className='border-black border-2 w-fit ml-auto flex-col relative p-3 rounded-md bg-emerald-100'>             
                      <div className='mt-2 text-xl border-b-2 border-black'>
                        <div>{event.eventName}</div>
                      </div>
                      <div className='mt-2'>
                      <Link className='block w-fit ml-auto' key={event.eventName} href={`/events/${event.eventName}`}>עבור לדף אירוע</Link> 
                      </div>
                      <div className='mt-2'>
                      <Link key={event.eventName} href={`/myEvents/${event.eventName}/tickets`}>כרטיסים עבור אירוע זה</Link>
                      </div>
                      <div className='mt-2'>
                      <button onClick={openPopup} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>סרוק ברקודים</button>
                      </div>
                      <div className='mt-2'>
                      <Link key={event.eventName} href={`/createAndModifyEvents?eventName=${event.eventName}`}>ערוך אירוע</Link>
                      </div>
                  </div>
                  {/* Pop-up */}
                  {showPopup && (
                    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                      <div className='bg-white p-6 rounded shadow-md relative'>
                        {/* Close arrow */}
                        <button
                          onClick={closePopup}
                          className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
                        >
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
            
                        <p className='mb-4'>
                         .שימו לב! סריקת ברקוד דרך האיזור האישי תוסיף את הברקוד לרשימת הסרוקים
                        </p>
                        <p className='mb-4'>
                          .במידה ואינכם מעוניינים בכך ניתן לסרוק את הברקוד בפשטות עם המצלמה של הטלפון
                        </p>
                        <label className='flex items-center'>
                          <input
                            type='checkbox'
                            className='form-checkbox mr-2'
                            checked={hidePopupForever}
                            onChange={handleCheckboxChange}
                          />
                          לעולם אל תראה שוב
                        </label>
                        <Link href={`/myEvents/${event.eventName}/scan`} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline'>המשך</Link>
                      </div>
                    </div>
                  )}
              </div>
          )
          }
      </div>
    </>
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


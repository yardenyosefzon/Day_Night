import Link from 'next/link';
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { api } from '~/utils/api';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Noto_Serif_Hebrew, Noto_Sans_Hebrew, IBM_Plex_Sans_Hebrew } from 'next/font/google';
import { prisma } from '~/server/db';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { faCalendarDays, faClock } from '@fortawesome/free-regular-svg-icons';

const notoSerif = Noto_Serif_Hebrew({subsets: ['hebrew'], weight: '600'})
const notoSans = Noto_Sans_Hebrew({subsets: ['hebrew'], weight: '300'})
const ibm = IBM_Plex_Sans_Hebrew({subsets: ['hebrew'], weight: '600'})

export default function EventPage( props: InferGetStaticPropsType<typeof getStaticProps>){
  const { eventName } = props;
  const {data: eventsData, isLoading} = api.events.getOneByName.useQuery({ eventName }, {refetchOnMount: false, refetchOnWindowFocus: false}); 
  const {data: schemaTicketsData, isLoading: schemaTicketsLoading} = api.schemaTickets.getManyByEventName.useQuery({eventName: eventsData?.eventName as string}, {refetchOnMount: false, refetchOnWindowFocus: false})
  if(isLoading) return <div>Loading...</div>
    return (
      <>
      <div className='flex flex-col bg-orange-100 min-h-screen bg-gradient-to-b pb-3 from-neutral-50 sm:items-center'>
        <div className='h-full sm:flex sm:bg-gradient-to-b sm:from-sky-50 sm:via-sky-300 sm:w-full sm:justify-center sm:bg-opacity-30 sm:pb-6 sm:pt-3 sm:rounded-md sm:p-4 sm:mt-14'>
          <Image
            className='sm:rounded-lg sm:shadow-md sm:shadow-black'
            width={720}
            height={480}
            src={eventsData?.image? eventsData.image : "/images/event_place_holder.jpg"}
            alt="Description of my image"
          />
        </div>
        <div className='text-center text-3xl mt-5'>
          <p className={`${ibm.className} sm:text-4xl`}>{eventsData?.eventName}</p>
        </div>
        <div className="flex p-2 justify-center text-lg sm:text-2xl">
              <div className="flex text-gray-400 justify-end">
                <p className="mx-2">{eventsData?.date.split('T')[1]}</p>
                <FontAwesomeIcon className="mt-1 mr-3" icon={faClock}/>
                <p className="mx-2">{eventsData?.date.split('T')[0]}</p>
                <FontAwesomeIcon className="mt-1" icon={faCalendarDays}/>
              </div>
        </div>
        <div className='flex text-2xl mr-2 justify-center'>
          <p >אמן: {eventsData?.artist} </p>
        </div>
        <div className='mx-3 my-9'>
          <QuillNoSSRWrapper className='border-0' readOnly={true} modules={{toolbar: false}}  value={eventsData?.description}/>
        </div>
        <div className='flex justify-center text-6xl'>
          <FontAwesomeIcon icon={faTicket}/>
        </div>
        <div className={schemaTicketsData?.length === 1 ? `flex justify-center mt-10 ` : `grid grid-cols-2 mx-8 mt-10`}>
          {schemaTicketsLoading?
            <div>Loading...</div>
            :
              schemaTicketsData?.map((_, index) => {
                return(
                  <div key={index} className="flex flex-col items-center justify-center mx-10">
                  <div className="max-w-md  mx-auto z-10 bg-orange-300 rounded-3xl">
                    <div className="flex flex-col ">
                      <div className="bg-white relative drop-shadow-2xl rounded-3xl p-5 m-2">
                        <div className="flex-none sm:flex">
                          <div className="flex-auto justify-evenly">
                            <div className="flex flex-col items-center justify-center">
                              <p className={`${notoSerif.className}`}>:סוג הכרטיס</p>
                              <p className={`${notoSans.className}`}>{schemaTicketsData[index]?.ticketName}</p>
                            </div>
                            <div className="border-b border-dashed border-b-2 my-1">
                            <div className="absolute rounded-full w-4 h-4 bg-orange-300 -mt-2 -left-2"></div>
                                <div className="absolute rounded-full w-4 h-4 bg-orange-300 -mt-2 -right-2"></div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                            <p className={`mt-2 ${notoSerif.className}`}>:מחיר</p>
                            <p className={`${notoSans.className} mt-2`}>{schemaTicketsData[index]?.price}</p>
                              </div>
                              <div className="border-b border-dashed border-b-2  pt-5">
                                <div className="absolute rounded-full w-4 h-4 bg-orange-300 -mt-2 -left-2"></div>
                                <div className="absolute rounded-full w-4 h-4 bg-orange-300 -mt-2 -right-2"></div>
                              </div>
                              <div className="flex justify-center">
                                <Link className={`${notoSans.className} underline`} href={`/buyTickets/${eventName}`}>
                                  לרכישה
                                </Link>
                              </div>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                
                  </div>
                )
              })
          }
        </div>
      </div>
      </>
     )
    }
    
  export async function getStaticProps(
    context: GetStaticPropsContext<{ eventName: string }>,
  ) {
    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: {session: null, prisma: prisma},
      transformer: superjson, // optional - adds superjson serialization
    });
    const eventName = context.params?.eventName as string;
  
    await helpers.events.getOneByName.prefetch({ eventName });
    await helpers.schemaTickets.getManyByEventName.prefetch({ eventName })

    return {
      props: {
        trpcState: helpers.dehydrate(),
        eventName,
      },
    };
  }

  export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await prisma.event.findMany({
      select: {
        eventName: true,
      },
    });
    return {
      paths: posts.map((post) => ({
        params: {
          eventName: post.eventName,
        },
      })),
      // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
      fallback: true
    };
  };
  
  const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
    ssr: false,
    loading: () => <p>Loading ...</p>,
    })
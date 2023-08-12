import Link from 'next/link';
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { api } from '~/utils/api';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { faChevronRight, faTicket } from '@fortawesome/free-solid-svg-icons';
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
  const { slug } = props;
  const {data: eventsData, isLoading} = api.events.getOneBySlug.useQuery({ slug: slug }, {refetchOnMount: false, refetchOnWindowFocus: false}); 
  const {data: schemaTicketsData, isLoading: schemaTicketsLoading} = api.schemaTickets.getManyByEventName.useQuery({eventName: eventsData?.eventName as string}, {refetchOnMount: false, refetchOnWindowFocus: false})
  if(isLoading) return <div>Loading...</div>
    return (
      <>
      <div className='flex flex-col bg-orange-100 min-h-screen bg-gradient-to-b pb-3 from-neutral-50 sm:items-center'>
      <div className="absolute top-0 right-0 mt-16 pr-1 z-40 sm:p-12 sm:pr-20 sm:mt-12">
          <Link href={'/'}>
            <FontAwesomeIcon icon={faChevronRight} className="text-xl sm:text-2xl"/>
          </Link>
        </div>
        <div className='h-full sm:flex bg-gradient-to-b from-sky-50 via-sky-300 mt-11 w-full p-5 sm:justify-center bg-opacity-30 pb-6 sm:pt-3 sm:rounded-md sm:mt-14'>
          <Image
            className='rounded-lg shadow-md shadow-black'
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
        <div className={schemaTicketsData?.length === 1 ? `flex justify-center mt-10 ` : `grid grid-cols-2 w-full mt-10 sm:w-1/3`}>
          {schemaTicketsLoading?
            <div>Loading...</div>
            :
              schemaTicketsData?.map((_, index) => {
                return(
                  <div key={index} className="flex flex-col items-center justify-center w-full">
                  <div className="mx-auto z-10 bg-orange-300 rounded-3xl">
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
                                <Link className={`${notoSans.className} underline`} href={`/buyTickets/${eventsData?.eventName}?ticketKind=${schemaTicketsData[index]?.ticketName}`}>
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
    context: GetStaticPropsContext<{ slug: string }>,
  ) {
    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: {session: null, prisma: prisma},
      transformer: superjson, // optional - adds superjson serialization
    });
    const slug = context.params?.slug as string;
  
    await helpers.events.getOneBySlug.prefetch({ slug });
    await helpers.schemaTickets.getManyBySlug.prefetch({ slug })

    return {
      props: {
        trpcState: helpers.dehydrate(),
        slug,
      },
    };
  }

  export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await prisma.event.findMany({
      select: {
        slug: true,
      },
    });
    return {
      paths: posts.map((event) => ({
        params: {
          slug: event.slug,
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
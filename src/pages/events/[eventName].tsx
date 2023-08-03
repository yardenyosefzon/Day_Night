import Link from 'next/link';
import type { GetStaticPaths, GetStaticPathsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import IsLoggedIn from '../components/isLoggedIn';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { createInnerTRPCContext } from '~/server/api/trpc';
import { CldImage } from 'next-cloudinary';

export default function EventPage(){
  const {query: {eventName}} = useRouter()
  const {data: eventsData, isLoading} = api.events.getAll.useQuery(undefined, {refetchOnMount: false, refetchOnWindowFocus: false}); 
  const event = eventsData?.find(event => event.eventName ==  eventName)
  const {data: schemaTicketsData, isLoading: schemaTicketsLoading} = api.schemaTickets.getManyByEventName.useQuery({eventName: event?.eventName as string})
  if(isLoading) return <div>Loading...</div>
    return (
     <>
        <div>{event?.eventName}</div>
        <div>{event?.artist} :אמן</div>
        {event?.image?
        <CldImage
          className='rounded-lg'
          width="960"
          height="600"
          src={event?.image as string}
          alt="Description of my image"
        />
        :
        <></>
        }
        {schemaTicketsLoading?
        <div>Loading...</div>
        :
        schemaTicketsData?.map((_, index) => {
          return(
        <div key={index} className=' border-black border-2 w-fit float-right p-2 rounded-lg'>
          <div>{schemaTicketsData[index]?.ticketName}</div>
          <div>מחיר: {schemaTicketsData[index]?.price}</div>
          {
            schemaTicketsData[index]?.notes === ""?
            <></>
            :
            <div>{schemaTicketsData[index]?.notes}</div>
          }
          {schemaTicketsData[index]?.numberOfTickets != 0?
          <IsLoggedIn actionA={<Link href={`/buyTickets/${event?.eventName as string}?ticketKind=${schemaTicketsData[index]?.ticketName}`} className='border-2 border-black rounded-lg p-1' >קנה כרטיס</Link>} actionB={<Link href={`/logInTo/logInToBuyTickets?callBackUrl=${event?.eventName as string}`} className='border-2 border-black rounded-lg p-1' >קנה כרטיס</Link>}/>
          :
          <></>
        }
        </div>
          )
        })
        }
      </>
     )
    }
    
  // export function getServerSideProps () {
  //   const helpers = createServerSideHelpers({
  //     router: appRouter,
  //     ctx: createInnerTRPCContext({session: null}), 
  //     transformer: superjson
  //   });
    
  //   // prefetch `events`
  //   helpers.events.getAll.prefetch()
  
  //   return {
  //     props: {
  //       trpcState: helpers.dehydrate(),
  //     },
  //   };
  // }

  export const getStaticProps = async ({params: []}) => {
    return {
      props: {}
    };
  },
  getStaticPaths: GetStaticPaths = () =>
    Promise.resolve({
      paths: [],
      fallback: 'blocking'
    });
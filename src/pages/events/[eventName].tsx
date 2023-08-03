import Link from 'next/link';
import type { GetStaticPaths, GetStaticPathsContext, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import IsLoggedIn from '../components/isLoggedIn';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import superjson from "superjson";
import { createInnerTRPCContext } from '~/server/api/trpc';
import { CldImage } from 'next-cloudinary';
import { prisma } from '~/server/db';
import dynamic from 'next/dynamic';

export default function EventPage( props: InferGetStaticPropsType<typeof getStaticProps>){
  const { eventName } = props;
  const {data: eventsData, isLoading} = api.events.getOneByName.useQuery({ eventName }, {refetchOnMount: false, refetchOnWindowFocus: false}); 
  // const event = eventsData?.find(event => event.eventName ==  eventName)
  const {data: schemaTicketsData, isLoading: schemaTicketsLoading} = api.schemaTickets.getManyByEventName.useQuery({eventName: eventsData?.eventName as string})
  if(isLoading) return <div>Loading...</div>
    return (
      <>
        <div>{eventsData?.eventName}</div>
        <div>{eventsData?.artist} :אמן</div>
        <QuillNoSSRWrapper className='float-right' readOnly={true} modules={{toolbar: false}}  value={eventsData?.description}/>
        {eventsData?.image?
        <CldImage
          className='rounded-lg'
          width="960"
          height="600"
          src={eventsData?.image as string}
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
          <IsLoggedIn actionA={<Link href={`/buyTickets/${eventsData?.eventName as string}?ticketKind=${schemaTicketsData[index]?.ticketName}`} className='border-2 border-black rounded-lg p-1' >קנה כרטיס</Link>} actionB={<Link href={`/logInTo/logInToBuyTickets?callBackUrl=${eventsData?.eventName as string}`} className='border-2 border-black rounded-lg p-1' >קנה כרטיס</Link>}/>
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
import Link from "next/link";
import { api } from "~/utils/api";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import UnderNavBar from "./components/underNavBar";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import {IBM_Plex_Sans_Hebrew, Cousine} from 'next/font/google'

const ibm = IBM_Plex_Sans_Hebrew({subsets: ['hebrew'], weight: '600'})

export default function Home() {

  const {data, isLoading} = api.events.getAll.useQuery(undefined, {refetchOnMount: false, refetchOnWindowFocus: false});
  if(isLoading)return <div>Loading...</div>

  return (
    <div className="w-full h-screen">
      <div className={`mx-6 mb-8 h-full sm:mx-20 sm:my-20 overflow-scroll ${ibm.className} sm:grid-cols-4 sm:overflow-auto sm:flex sm:justify-between`}>
        {data?.map(event => (
          <div className="relative flex flex-col items-end border-2 border-black rounded-b-3xl mx-3 rounded-t-xl my-14 h-2/6 sm:w-1/5 sm:h-2/5" key={event.eventName}>
            <div className="relative w-full h-4/6">
            <Link href={`/events/${event.eventName}`} key={event.eventName}>
              <Image className="rounded-t-lg" src={event.image? event.image : "/images/event_place_holder.jpg"} alt="eventImage" fill={true} objectFit="fill"></Image>
            </Link>
            </div>
            <div className="flex flex-col p-2">
              <div className="flex text-gray-400 justify-end">
                <p className="mx-2">{event.date.split('T')[1]}</p>
                <FontAwesomeIcon className="mt-1" icon={faClock}/>
                <p className="mx-2">{event.date.split('T')[0]}</p>
                <FontAwesomeIcon className="mt-1" icon={faCalendarDays}/>
              </div>
              <div className="flex justify-end">
                <div className="mx-2">{event.address}</div>
                <FontAwesomeIcon className="mt-1" icon={faMap}/>
              </div>
              <Link className="text-2xl underline hover:text-gray-500" href={`/events/${event.eventName}`} key={event.eventName}>{event.eventName}</Link>
            </div>
          </div> 
        ))}
      </div>
   
        <UnderNavBar/>

    </div>
  );
}

export async function getStaticProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    //@ts-ignore
    ctx: createInnerTRPCContext({}), 
    transformer: superjson
  });
  
  // prefetch `events`
  await helpers.events.getAll.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

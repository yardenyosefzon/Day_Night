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
    <div className="absolute w-full min-h-screen bg-orange-50">
      <div className={`flex flex-col mt-28 mx-9 ${ibm.className} sm:grid sm:grid-cols-4`}>
        {data?.map((event, index) => (
          <div key={index} className="mb-14 h-72 flex flex-col items-end border-2 border-black rounded-b-3xl rounded-t-xl w-full sm:w-11/12 sm:h-72 sm:place-self-center shadow-lg p-1 2xl:w-8/12 bg-white">
            <div className="relative w-full h-4/6">
            <Link href={`/events/${event.eventName}`} key={event.eventName}>
              <Image className="rounded-lg" src={event.image? event.image : "/images/event_place_holder.jpg"} alt="eventImage" fill={true} objectFit="cover"></Image>
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

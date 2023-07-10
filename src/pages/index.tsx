import Link from "next/link";
import { api } from "~/utils/api";
// import { createServerSideHelpers } from '@trpc/react-query/server';
// import { GetStaticPropsContext } from 'next';
// import { appRouter } from "~/server/api/root";
// import { createInnerTRPCContext } from "~/server/api/trpc";
// import superjson from "superjson";
// import NavBar from "./components/navBar";

export default function Home() {

  const {data, isLoading} = api.events.getAll.useQuery();
  if(isLoading)return <div>Loading...</div>

  return (
    <>
      <h1>אירועים קרובים</h1>
      {data?.map(event => (
        <div key={event.id}>
          <Link href={`/events/${event.id}`} key={event.id}>{event.eventName}</Link>
        </div> 
      ))}
      
    </>
  );
}

// export async function getStaticProps(
//   context: GetStaticPropsContext
// ) {
//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     //@ts-ignore
//     ctx: createInnerTRPCContext({}), 
//     transformer: superjson
//   });
  
//   // prefetch `events`
//   await helpers.events.getAll.prefetch()

//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//     },
//     revalidate:300,
//   };
// }
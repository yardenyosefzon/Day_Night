import { createServerSideHelpers } from "@trpc/react-query/server";
import { useRouter } from "next/router";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import { getServerAuthSession } from "~/server/auth";
import { GetServerSidePropsContext } from "next";

function EventCreatorPage() {
  return (
    <div>index</div>
  )
}

export default EventCreatorPage

export async function getServerSideProps (context: GetServerSidePropsContext) {

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
    
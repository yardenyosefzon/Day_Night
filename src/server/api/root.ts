import { createTRPCRouter } from "~/server/api/trpc";
import { eventsRouter } from "./routers/events";
import { usersRouter } from "./routers/users";
import { boughtTicketsRouter } from "./routers/boughtTickets";
import { schemaTicketsRouter } from "./routers/schemaTickets";
import { eventScanners } from "./routers/eventScanners";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  events: eventsRouter,
  users: usersRouter,
  boughtTickets: boughtTicketsRouter,
  schemaTickets: schemaTicketsRouter,
  eventScanner: eventScanners
});

// export type definition of API
export type AppRouter = typeof appRouter;

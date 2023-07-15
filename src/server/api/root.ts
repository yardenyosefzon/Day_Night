import { createTRPCRouter } from "~/server/api/trpc";
import { eventsRouter } from "./routers/events";
import { usersRouter } from "./routers/users";
import { ticketsRouter } from "./routers/tickets";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  events: eventsRouter,
  users: usersRouter,
  tickets: ticketsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

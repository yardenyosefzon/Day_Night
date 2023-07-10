import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  getAll: publicProcedure
    .query( async ({ctx}) => {
      return await ctx.prisma.event.findMany();
    }),
  getOne: publicProcedure
    .input(z.object({id: z.string()}))
    .query( async ({ input,ctx }) => {
      return await ctx.prisma.event.findUnique({
        where:{
          id: input.id
      }})
    })
});

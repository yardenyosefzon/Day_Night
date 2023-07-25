import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  create: publicProcedure
  .input(
    z.object({
      eventName: z.string(),
      date: z.string(),
      artist: z.string(),
      image: z.string(),
      address: z.string(),
      description: z.string(),
      minAge: z.number(),
    })
  )
  .mutation(({ctx, input}) => {
    return ctx.prisma.event.create({
      data: {
        eventName: input.eventName,
        date: input.date,
        artist: input.artist,
        image: input.image,
        address: input.address,
        description: input.description,
        minAge: input.minAge,
        eventCreatorId: ctx.session?.user.id as string
      }
    })
  }),
  getAll: publicProcedure
    .query( async ({ctx}) => {
      return await ctx.prisma.event.findMany({
        select: {
          artist: true,
          eventName: true,
          image: true
        }
      });
    }),
    getManyByUserId: publicProcedure
    .query(({ctx}) => {
      return ctx.prisma.event.findMany({
        where: {
          eventCreator: {
            id: ctx.session?.user.id
          }
        },
        select: {
          eventName:true
        }
      })
    }),
  getOneById: publicProcedure
    .input(z.object({id: z.string()}))
    .query( async ({ input,ctx }) => {
      return await ctx.prisma.event.findUnique({
        where:{
          id: input.id
      }})
    }),
    getOneByName: publicProcedure
    .input(
      z.object({
        eventName: z.string(),
      }))
    .query(({ctx, input}) => {
      ctx.prisma.event.findFirst({
        where: {
          eventName: input.eventName
        },
        select: {
          id: true
        }
      }).then(() =>{'foundONE'})
      .catch((error)=>{return error})
    })
});

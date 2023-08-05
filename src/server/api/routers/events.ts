import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  createOrUpdate: publicProcedure
  .input(
    z.object({
      eventName: z.string(),
      date: z.string(),
      artist: z.string(),
      image: z.string(),
      address: z.string(),
      description: z.string(),
      minAge: z.number(),
      slug: z.string()
    })
  )
  .mutation(({ctx, input}) => {
    return ctx.prisma.event.upsert({
      where: {
        slug: input.slug,
        eventCreatorId: ctx.session?.user.id
      },
      update: {
        eventName: input.eventName,
        date: input.date,
        artist: input.artist,
        image: input.image,
        address: input.address,
        description: input.description,
        minAge: input.minAge,
        eventCreatorId: ctx.session?.user.id as string
      },
      create: {
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
    .then((res) => {
      return res
    })
    .catch((error) => {
      console.log(error)
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
        return ctx.prisma.event.findFirst({
          where: {
            eventName: input.eventName
          },
          select: {
            eventName: true,
            date: true,
            artist: true,
            image: true,
            description: true,
            minAge: true,
            address: true,
            slug: true
          }
        });
    }),
    updateNumberOfScannedTicketsOfOneByName: publicProcedure
    .input(
      z.object({
        eventName: z.string(),
        scannedTicketsNumber: z.number()
      })
    )
    .mutation(({input, ctx}) => {
      return ctx.prisma.event.update({
        where: {
          eventName: input.eventName
        },
        data: {
          scannedTicketsNumber: input.scannedTicketsNumber + 1
        },
        select: {
          scannedTicketsNumber: true
        }
      })
    })
});

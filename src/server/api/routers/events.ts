import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
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
  }),
  getAll: publicProcedure
    .query( async ({ctx}) => {
      return await ctx.prisma.event.findMany({
        select: {
          slug: true,
          address:true,
          eventName: true,
          image: true,
          date: true,
          minAge: true
        }
      });
    }),
    getManyByUserId: protectedProcedure
    .query(({ctx}) => {
      return ctx.prisma.event.findMany({
        where: {
          eventCreator: {
            id: ctx.session?.user.id
          }
        },
        select: {
          scannedTicketsNumber: true,
          eventName: true,
          slug: true,
          views: true,
          eventCreator: {
            select: {
              hideQrEx: true
            }
          }
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
    getOneBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }))
      .query(({ctx, input}) => {
        return ctx.prisma.event.findFirst({
          where: {
            slug: input.slug
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
    }),
    updateViewsBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .mutation(async({ctx, input}) => {
      const event = await ctx.prisma.event.findFirst({
        where: {
          slug: input.slug
        }
      })
      return ctx.prisma.event.update({
        where: {
          slug: input.slug
        },
        data: {
          views: event?.views! + 1
        }
      })
    })
});

import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
export const eventScanners = createTRPCRouter({
    getManyByEventName: publicProcedure 
    .input(
        z.object({
            eventName: z.string()
        })
    )
    .query(({ctx, input}) => {
       return ctx.prisma.event_Scanner.findMany({
        where: {
            eventName: input.eventName
        },
        select: {
            userEmail: true
        }
       }) 
    }),
    getOneByEventNameAndEmail: publicProcedure 
    .input(
        z.object({
            userEmail: z.string(),
            eventName: z.string()
        })
    )
    .query(({ctx, input}) => {
       return ctx.prisma.event_Scanner.findFirst({
        where: {
            userEmail: input.userEmail,
            eventName: input.eventName
        },
        select: {
            userEmail: true
        }
       }) 
    }),
    create: publicProcedure 
    .input(
        z.object({
            email: z.string(),
            eventName: z.string()
        })
    )
    .mutation(async({ctx, input}) => {
        const user = await ctx.prisma.user.findFirst({
            where: {
                email: input.email
            }
        })
        if(!user) throw new Error('No user was found')
        return ctx.prisma.event_Scanner.create({
            data: {
                eventName: input.eventName,
                userEmail: input.email
            }
        })
    }),
    delete: publicProcedure
    .input(
        z.object({
            eventName: z.string(),
            email: z.string()
        })
    )
    .mutation(async({ctx, input}) => {
        const eventScanner = await ctx.prisma.event_Scanner.findFirst({
            where: {
                eventName: input.eventName,
                userEmail: input.email
            }
        })
        return ctx.prisma.event_Scanner.delete({
            where: {
               id: eventScanner?.id as string
            }
        })
    })
})
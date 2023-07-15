import { z } from "zod";
import { publicProcedure,createTRPCRouter } from "../trpc";

export const ticketsRouter = createTRPCRouter({
    create: publicProcedure
    .input(
        z.object({
            eventId: z.string(),
            userId: z.string()
        })
    )
    .query(({ctx,input}) => {
        return ctx.prisma.ticket.create({
            data: {
                eventId: input.eventId,
                userId: input.userId
            }
        })
    })
})
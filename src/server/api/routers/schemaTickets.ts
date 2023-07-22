import { z } from "zod";
import { publicProcedure,createTRPCRouter } from "../trpc";

export const schemaTicketsRouter = createTRPCRouter({
    create: publicProcedure
    .input(
            z.object({
                eventId: z.string(),
                schemaTicketsData: z.array(
                    z.object({
                        ticketName: z.string(),
                        price: z.number(),
                        numberOfTickets: z.number(),
                }))               
            })
    )
    .mutation(async({ctx,input}) => {  
        const dbArray = input.schemaTicketsData.map((schemaTicket) => ({
            ...schemaTicket,
            eventId: input.eventId
        }))
        return ctx.prisma.schemaTicket.createMany({
            data: dbArray
        })
    })
})
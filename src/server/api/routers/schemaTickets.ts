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
                        notes: z.string()
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
    }),
    getManyByEventName: publicProcedure
    .input(
        z.object({
            eventName: z.string()
        })
    )
    .query(async ({ctx, input}) => {
        const event = await ctx.prisma.event.findFirst({
            where: {
                eventName: input.eventName
            }
        })
        return ctx.prisma.schemaTicket.findMany({
            where: {
                eventId: event?.id
            },
            select: {
                numberOfTickets: true,
                price: true, 
                ticketName: true,
                notes: true
            }
        })
    }),
    changeNumberOfTicketsOfOneByEventAndTicketName: publicProcedure
    .input(
        z.object({
            ticketName: z.string(),
            eventName: z.string()
        })
    )
    .mutation(async({ ctx, input }) => {
        const ticketName = input.ticketName.replace('%20'," ")
        // First, retrieve the current number of tickets for the specified event
        const schemaTicket = await ctx.prisma.schemaTicket.findFirst({
            where: {
                ticketName: ticketName,
                event: {
                    eventName: input.eventName
                }
            }
        });

        if (!schemaTicket) {
            return ('event not found');
        }

        // Decrement the number of tickets by 1
        if(schemaTicket?.numberOfTickets == 0) return "ran out of tickets"
        
        const updatedNumberOfTickets = schemaTicket?.numberOfTickets - 1;

        // Now update the schemaTicket with the new number of tickets
        return await ctx.prisma.schemaTicket.update({
            where: {
                ticketName: ticketName,
                id: schemaTicket.id
            },
            data: {
                numberOfTickets: updatedNumberOfTickets
            }
        });
    }),
    updateDetails: publicProcedure
    .input(
        z.object({
            eventName: z.string(),
            schemaTicketsData: z.array(
                z.object({
                    ticketName: z.string(),
                    price: z.number(),
                    numberOfTickets: z.number(),
                    notes: z.string()
            }))               
        })
)
    .mutation( async({ctx, input}) => {
        console.log(input.eventName)
        const schemaTickets = await ctx.prisma.schemaTicket.findMany({
            where: {
                event: {
                    eventName: input.eventName
                }
            }
        })
        if(schemaTickets.length == 0) return new Error("no tickets were found")

             schemaTickets.map(async(schemaTicket, index) => {
             await ctx.prisma.schemaTicket.update({
                where: {
                  id: schemaTickets[index]?.id,
                },
                data: {
                    ticketName: input.schemaTicketsData[index]?.ticketName,
                    price: input.schemaTicketsData[index]?.price,
                    numberOfTickets: input.schemaTicketsData[index]?.numberOfTickets,
                    notes: input.schemaTicketsData[index]?.notes
                },
              })
        })
    })
})
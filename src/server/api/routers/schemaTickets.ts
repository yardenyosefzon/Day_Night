import { z } from "zod";
import { publicProcedure,createTRPCRouter, protectedProcedure } from "../trpc";
import { api } from "~/utils/api";

export const schemaTicketsRouter = createTRPCRouter({
    create: protectedProcedure
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
    .mutation(({ctx,input}) => {  
        const dbArray = input.schemaTicketsData.map((schemaTicket) => ({
            ...schemaTicket,
            eventId: input.eventId
        }))
        ctx.prisma.schemaTicket.createMany({
            data: dbArray
        })
        .then((res) => {
            console.log( res.count )
            return res
        })
        .catch((err) => {
            console.log(err)
            return err
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
    getManyBySlug: publicProcedure
    .input(
        z.object({
            slug: z.string()
        })
    )
    .query(async ({ctx, input}) => {
        const event = await ctx.prisma.event.findFirst({
            where: {
                slug: input.slug
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
    changeNumberOfBoughtTicketsOfOneByEventAndTicketName: publicProcedure
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
        const schemaTickets = await ctx.prisma.schemaTicket.findMany({
            where: {
                event: {
                    eventName: input.eventName
                }
            }
        })

        if(schemaTickets.length == 0) return new Error("no tickets were found")

        if(input.schemaTicketsData.length < schemaTickets.length){
            const deleteArr: string[] = []
            for(let i = 0; i < input.schemaTicketsData.length ; i++){
                for(let j = 0; j < schemaTickets.length ; j++){
                    if (input.schemaTicketsData[j]?.notes === schemaTickets[i]?.notes && input.schemaTicketsData[j]?.numberOfTickets === schemaTickets[i]?.numberOfTickets && input.schemaTicketsData[j]?.price === schemaTickets[i]?.price && input.schemaTicketsData[i]?.ticketName === schemaTickets[i]?.ticketName)
                    return
                    else if(j === input.schemaTicketsData.length - 1)
                    deleteArr.push(schemaTickets[i]?.id as string)
                }
            }
            deleteArr.map(async(_, index) =>
            await ctx.prisma.schemaTicket.delete(
                {
                    where: {
                        id: deleteArr[index]
                    }
                }) 
            )
        }
             return input.schemaTicketsData.map(async(_, index) => 
              await ctx.prisma.schemaTicket.upsert({
                where: {
                  id: schemaTickets[index]?.id ? schemaTickets[index]?.id : "s" 
                },
                update: {
                    ticketName: input.schemaTicketsData[index]?.ticketName,
                    price: input.schemaTicketsData[index]?.price,
                    numberOfTickets: input.schemaTicketsData[index]?.numberOfTickets,
                    notes: input.schemaTicketsData[index]?.notes
                },
                create: {
                    eventId: schemaTickets[0]?.eventId as string,
                    ticketName: input.schemaTicketsData[index]?.ticketName as string,
                    price: input.schemaTicketsData[index]?.price as number,
                    numberOfTickets: input.schemaTicketsData[index]?.numberOfTickets as number,
                    notes: input.schemaTicketsData[index]?.notes as string
                }
              })
        )
    })
})
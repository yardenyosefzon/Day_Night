import { z } from "zod";
import { publicProcedure,createTRPCRouter, protectedProcedure } from "../trpc";
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
                })),
                uids: z.array(
                    z.object({
                        tax: z.string(),
                        product: z.string()
                    })
                )            
            })
    )
    .mutation(({ctx,input}) => {  
        const dbArray = input.schemaTicketsData.map((schemaTicket, index) => ({
            ...schemaTicket,
            payPlusUid: input.uids[index]?.product as string,
            payPlusTaxUid: input.uids[index]?.tax as string,
            eventId: input.eventId
        }))
        return ctx.prisma.schemaTicket.createMany({
            data: dbArray
        })
    }),
    getOneBySlug : publicProcedure
    .input(
        z.object({
            slug: z.string() 
        })
    )
    .query(({ctx, input}) => {
        return ctx.prisma.schemaTicket.findUnique({
            where: {
                slug: input.slug
            },
            select: {
                price: true,
                ticketName: true,
                payPlusUid: true,
                payPlusTaxUid: true
            }
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
                notes: true,
                payPlusUid: true,
                payPlusTaxUid: true,
            }
        })
    }),
    getManyByEventSlug: publicProcedure
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
                notes: true,
                slug:true
            }
        })
    }),
    changeNumberOfBoughtTicketsOfOneByEventAndTicketName: publicProcedure
    .input(
        z.object({
            eventName: z.string(),
            ticketName: z.string(),
            number: z.number(),
        })
    )
    .mutation(async({ ctx, input }) => {
        // First, retrieve the current number of tickets for the specified event
        const schemaTicket = await ctx.prisma.schemaTicket.findFirst({
            where: {
                event: {
                    eventName: input.eventName
                },
                ticketName: input.ticketName
            }
        });

        if (!schemaTicket) {
            return ('schemaTicket not found');
        }

        if(schemaTicket?.numberOfTickets == schemaTicket?.numberOfBoughtTickets) return "ran out of tickets"
        
        const updatedNumberOfTickets = schemaTicket?.numberOfBoughtTickets + input.number;

        return await ctx.prisma.schemaTicket.update({
            where: {
                slug: schemaTicket.slug,
            },
            data: {
                numberOfBoughtTickets: updatedNumberOfTickets
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
                    notes: z.string(),
            }))                   
        })
)
    .mutation(async ({ctx, input}) => {
    
        const headers = {
            'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
            'Content-Type': 'application/json'
        };

        const schemaTickets = await ctx.prisma.schemaTicket.findMany({
            where: {
                event: {
                    eventName: input.eventName
                }
            }
        })

        if(schemaTickets.length == 0) return new Error("no tickets were found")
        if(input.schemaTicketsData.length < schemaTickets.length){
                const deleteArr: string[] = [];
                for (let i = 0; i < schemaTickets.length; i++) {
                  let found = false; // Flag to track if a match is found
                  for (let j = 0; j < input.schemaTicketsData.length; j++) {
                    if (
                      input.schemaTicketsData[j]?.notes === schemaTickets[i]?.notes &&
                      input.schemaTicketsData[j]?.numberOfTickets === schemaTickets[i]?.numberOfTickets &&
                      input.schemaTicketsData[j]?.price === schemaTickets[i]?.price &&
                      input.schemaTicketsData[j]?.ticketName === schemaTickets[i]?.ticketName
                    ) {
                      found = true; // Match found, no need to continue searching
                      break;
                    }
                  }
                  if (!found) {
                    deleteArr.push(schemaTickets[i]?.id as string);
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
        
            const schemaTicketsAfterUpsert = input.schemaTicketsData.map(async(_, index) => 
                await ctx.prisma.schemaTicket.upsert({
                    where: {
                    id: schemaTickets[index]?.id ? schemaTickets[index]?.id : "" 
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

        for (const schemaTicket of schemaTicketsAfterUpsert){
            const schemaTicketRes = await schemaTicket
            if(schemaTicketRes?.payPlusTaxUid == null){
                try{
                const [ticketResponse, taxResponse] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}Products/Add`, {
                      method: 'POST',
                      body: JSON.stringify({
                        'category_uid': `${process.env.NEXT_PUBLIC_TICKETS_UID}`,
                        'name': input.eventName + '_' + schemaTicketRes?.ticketName,
                        'price': schemaTicketRes?.price,
                        'currency_code': 'ILS',
                        'vat_type': 0,
                      }),
                      headers: headers
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}Products/Add`, {
                      method: 'POST',
                      headers: headers,
                      body: JSON.stringify({
                        'category_uid': `${process.env.NEXT_PUBLIC_TAX_UID}`,
                        'name': input.eventName + '_' + schemaTicketRes?.ticketName + '_tax',
                        'price': (schemaTicketRes?.price as number * 7 / 100).toFixed(2),
                        'currency_code': 'ILS',
                        'vat_type': 0,
                      })
                    })
                  ]);
                  
                  if(!ticketResponse.ok && !taxResponse.ok){
                    throw new Error('faild to add products')
                }
                
                const ticketResult = await ticketResponse.json();
                const taxResult = await taxResponse.json();

                const schema = await ctx.prisma.schemaTicket.update({
                    where: {
                        id: schemaTicketRes.id
                    },
                    data: {
                        payPlusUid: ticketResult.data.product_uid,
                        payPlusTaxUid: taxResult.data.product_uid
                    }
                })
                console.log(schema)
            }
            catch(error){
                console.log(error)
                throw new Error('this is an update error')
            }  
            }
            else{
                try{
                    const ticketResponse = await fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}Products/Update/${schemaTicketRes.payPlusUid}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            "category_uid": `${process.env.NEXT_PUBLIC_TICKETS_UID}`,
                            "name": input.eventName+'_'+schemaTicketRes.ticketName,
                            "price": schemaTicketRes.price,
                            "currency_code": "ILS",
                            "vat_type": 1
                        }),
                        headers: headers,
                    });
        
                    const taxResponse = await fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}Products/Update/${schemaTicketRes.payPlusTaxUid}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            'category_uid': `${process.env.NEXT_PUBLIC_TAX_UID}`,
                            'name': input.eventName + '_' + schemaTicketRes.ticketName + '_tax',
                            'price': (schemaTicketRes.price * 7 / 100).toFixed(2),
                            'currency_code': 'ILS',
                            'vat_type': 0,
                        }),
                        headers: headers,
                    });
                    
                    if(!ticketResponse.ok || !taxResponse.ok){
                        throw new Error('this is an update error')
                    }

                    const ticketResult = await ticketResponse.json()
                    const taxResult = await taxResponse.json()

                    console.log(ticketResult)
                    console.log(taxResult)
                }
                catch(error){
                    console.log(error)
                    throw new Error('this is an update error')
                }    
            }
        }
        return schemaTicketsAfterUpsert
    })
})
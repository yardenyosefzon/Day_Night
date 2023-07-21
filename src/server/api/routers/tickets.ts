import { z } from "zod";
import { publicProcedure,createTRPCRouter } from "../trpc";

export const ticketsRouter = createTRPCRouter({
    create: publicProcedure
    .input(
        z.object({
            userId: z.string(),
            usersTicket: z.boolean(),
            eventName: z.string(),
            ticketsArray: z.array(
                            z.object({
                                email: z.string(),
                                nationalId: z.string(),
                                birthDay: z.string(),
                                gender: z.string(),
                                phoneNumber: z.string(),
                                instaUserName: z.string(),
                            })
            )
        })
    )
    .query(async({ctx,input}) => {
        let nationalId: {
            nationalId: string;
        } | null
        if(ctx.session?.user.rememberMe){
            nationalId = await ctx.prisma.ticket.findFirst({
                where: {
                    userId: ctx.session?.user.id,
                    usersTicket: true
                },
                select: {
                    nationalId: true
                }
            })
        }
        const eventId = await ctx.prisma.event.findFirst({
            where: {
              eventName: input.eventName
            },
            select: {
              id: true
            }
          })        
        const dbArray = input.ticketsArray.map((ticket, index) => ({
            ...ticket,
            nationalId: nationalId?.nationalId ? nationalId.nationalId : input.ticketsArray[index]?.nationalId as string ,
            userId: input.userId,
            eventId: eventId?.id as string,
            usersTicket: input.usersTicket,
          }));
        return ctx.prisma.ticket.createMany({
            data: dbArray
        })
    }),
    getFirstById: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.ticket.findFirst({
          where: {
            userId: ctx.session?.user.id,
          },
          select: {
            event: {
                select: {
                    eventName:true
                }
            }
          }
        });
      }),
    getFirstByIdAndUsersTicket: publicProcedure
    .query(({ctx})=>{
        return ctx.prisma.ticket.findFirst({
            where: {
                userId: ctx.session?.user.id,
                usersTicket: true
            },
            select: {
              birthDay: true,
              gender: true,
              phoneNumber: true,
              instaUserName: true
            }
        })
    }),
    getManyByUserId: publicProcedure
    .query(({ctx}) => {
        console.log(ctx.session)
        return ctx.prisma.ticket.findMany({
            where: {
              userId: 
                 ctx.session?.user.id
            },
            select: {
                slug: true,
                event: {
                    select: {
                        eventName: true
                    }
                }
                
              },
          })
    }),
    getManyByEvent: publicProcedure
    .input(
        z.object({
            eventName: z.string()
        })
    )
    .query(({ctx, input}) => {
        return ctx.prisma.ticket.findMany({
            where: {
                event: {
                    eventName: input.eventName
                }
            },
            select: {
                email: true,
                gender: true,
                birthDay: true,
                verified: true,
                instaUserName: true,
                phoneNumber: true,
                rejected: true,
                slug:true,
                user: {
                    select: {
                        name: true
                    }
                }
            }
        })
    }),
    updateOneBySlug: publicProcedure
    .input(
        z.object({
            action: z.string(),
            slug: z.string()
        })
    )
    .mutation(async({ctx,input})=> { 
        let data
        const ticket = await ctx.prisma.ticket.findFirst({
            where: {
                slug: input.slug
            }
        })
        if (input.action == "verified")  data = {verified: true}
        else data = {rejected: true}
        return ctx.prisma.ticket.update({
            where: {
                slug: input.slug,
                id: ticket?.id
              },
              data: data
        })
    })
})
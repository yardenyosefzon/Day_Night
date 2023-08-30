import { z } from "zod";
import { publicProcedure,createTRPCRouter, protectedProcedure } from "../trpc";
import { uuid } from "uuidv4";

export const boughtTicketsRouter = createTRPCRouter({
    create: publicProcedure
    .input(
        z.object({
            userId: z.string(),
            usersTicket: z.boolean(),
            eventName: z.string(),
            ticketName: z.string(),
            ticketsArray: z.array(
                            z.object({
                                email: z.string(),
                                nationalId: z.string(),
                                birthDay: z.string(),
                                gender: z.string(),
                                phoneNumber: z.string(),
                                instaUserName: z.string(),
                                fullName: z.string()
                            })
            )
        })
    )
    .mutation(async({ctx,input}) => {

        let nationalId: {
            nationalId: string;
        } | null

        if(ctx.session?.user.rememberMe){
            nationalId = await ctx.prisma.boughtTicket.findFirst({
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
              id: true,
              minAge: true
            }
          }) 
          let correctAge = true       
          const dbArray = input.ticketsArray.map((boughtTicket, index) => {
            const slug = uuid(); // Generate a unique slug for each iteration  

            if(input.userId === "")
            return {
              ...boughtTicket,
              birthDay: input.ticketsArray[index]?.birthDay as string,
            //   age: age,
              nationalId: nationalId?.nationalId ? nationalId.nationalId : input.ticketsArray[index]?.nationalId as string,
              partialNationalId: nationalId?.nationalId ? (nationalId.nationalId).slice(nationalId.nationalId.length - 3, nationalId.nationalId.length) : input.ticketsArray[index]?.nationalId.slice(input.ticketsArray[index]?.nationalId.length! - 3, input.ticketsArray[index]?.nationalId.length) as string,
              eventId: eventId?.id as string,
              usersTicket: index === 0 ? input.usersTicket : false,
              ticketKind: input.ticketName,
              slug: slug,
              fullName: input.ticketsArray[index]?.fullName as string,
              qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://day-night-eight.vercel.app/qrCode/?params=${encodeURIComponent(nationalId?.nationalId ? nationalId.nationalId : input.ticketsArray[index]?.nationalId as string)}+_+${encodeURIComponent(slug)}`
            };
            return{
                ...boughtTicket,
                birthDay: input.ticketsArray[index]?.birthDay as string,
                // age: age,
                nationalId: nationalId?.nationalId ? nationalId.nationalId : input.ticketsArray[index]?.nationalId as string,
                partialNationalId: nationalId?.nationalId ? (nationalId.nationalId).slice(nationalId.nationalId.length - 3, nationalId.nationalId.length) : input.ticketsArray[index]?.nationalId.slice(input.ticketsArray[index]?.nationalId.length! - 3, input.ticketsArray[index]?.nationalId.length) as string,
                eventId: eventId?.id as string,
                userId: input.userId,
                usersTicket: index === 0 ? input.usersTicket : false,
                ticketKind: input.ticketName,
                slug: slug,
                fullName: input.ticketsArray[index]?.fullName as string,
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://day-night-eight.vercel.app/qrCode/?params=${encodeURIComponent(nationalId?.nationalId ? nationalId.nationalId : input.ticketsArray[index]?.nationalId as string)}+_+${encodeURIComponent(slug)}`
        }
          });
         return ctx.prisma.boughtTicket.createMany({
            data: dbArray,
        })
    }),
    getFirstById: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.boughtTicket.findFirst({
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
        return ctx.prisma.boughtTicket.findFirst({
            where: {
                userId: ctx.session?.user.id,
                usersTicket: true
            },
            select: {
              birthDay: true,
              gender: true,
              phoneNumber: true,
              instaUserName: true,
              partialNationalId: true
            }
        })
    }),
    getManyByUserId: protectedProcedure
    .query(({ctx}) => {
        console.log(ctx.session?.user.id)
        return ctx.prisma.boughtTicket.findMany({
            where: {
              userId: 
                 ctx.session?.user.id
            },
            select: {
                verified: true,
                slug: true,
                qrCode: true,
                fullName: true,
                email: true,
                phoneNumber: true,
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
        return ctx.prisma.boughtTicket.findMany({
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
                slug: true,
                ticketKind: true,
                qrCode: true,
                fullName: true
            }
        })
    }),
    getManyVerifiedByEvent: publicProcedure
    .input(
        z.object({
            eventName: z.string()
        })
    )
    .query(({ctx, input}) => {
        return ctx.prisma.boughtTicket.findMany({
            where: {
                event: {
                    eventName: input.eventName
                },
                verified: true
            },
            select: {
                email: true,
                gender: true,
                birthDay: true,
                // age: true,
                verified: true,
                instaUserName: true,
                phoneNumber: true,
                rejected: true,
                slug: true,
                ticketKind: true,
                qrCode: true,
                fullName: true,
                scanned: true,
                nationalId: true
            }
        })
    }),
    getManyVerifiedAndScannedByEvent: publicProcedure
    .input(
        z.object({
            eventName: z.string()
        })
    )
    .query(({ctx, input}) => {
        return ctx.prisma.boughtTicket.findMany({
            where: {
                event: {
                    eventName: input.eventName
                },
                verified: true,
                scanned: true
            },
            select: {
                email: true,
                gender: true,
                birthDay: true,
                verified: true,
                instaUserName: true,
                phoneNumber: true,
                rejected: true,
                slug: true,
                ticketKind: true,
                qrCode: true,
                fullName: true
            }
        })
    }),
    updateAprovelOfOneBySlug: publicProcedure
    .input(
        z.object({
            action: z.string(),
            slug: z.string()
        })
    )
    .mutation(async({ctx,input})=> { 
        let data
        const boughtTicket = await ctx.prisma.boughtTicket.findFirst({
            where: {
                slug: input.slug
            }
        })
        if (input.action == "verified")  data = {verified: true}
        else  if(input.action == "rejected") data = {rejected: true}
        else data = {rejected: false, verified: false}
        return ctx.prisma.boughtTicket.update({
            where: {
                slug: input.slug,
                id: boughtTicket?.id
              },
              data: data
        })
    }),
    getOneBySlug: publicProcedure
    .input(
        z.object({
            slug: z.string()
        })
    )
    .query(({ctx, input}) => {
        return ctx.prisma.boughtTicket.findFirst({
            where: {
                slug: input.slug
            },
            select: {
                verified: true,
                qrCode:true,
                fullName: true,
                scanned: true,
                event: {
                    select: {
                        eventName: true
                    }
                }
            }
        })
    }),
    updateScannedOfOneBySlug: publicProcedure
    .input(
        z.object({
            slug: z.string()
        })
    )
    .mutation(({input, ctx}) => {
        return ctx.prisma.boughtTicket.update({
            where:{
                slug: input.slug.trimEnd().trimStart()
            },
            data: {
                scanned: true,
                // qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://day-night-eight.vercel.app/qrCode/?params=${encodeURIComponent(?.nationalId ? nationalId.nationalId : input.ticketsArray[index]?.nationalId as string)}+_+${encodeURIComponent(slug)}+false`
            },
            select: {
                scanned: true,
                event: {
                    select: {
                        eventName: true,
                        scannedTicketsNumber: true
                    }
                }
            }
        })
    })
})
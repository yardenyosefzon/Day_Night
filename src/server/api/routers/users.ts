import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
export const usersRouter = createTRPCRouter({
  update: publicProcedure
  .input(
    z.object({
      nationalId: z.string(),
      birthDay: z.string(),
      gender: z.string(),
      phoneNumber: z.string(),
      instaUserName: z.string()
    })
  )
    .query( async ({input, ctx}) => {
      return await ctx.prisma.user.update({
        where: {
            email: ctx.session?.user.email as string
        },
        data: {
            nationalId: input.nationalId,
            birthDay: input.birthDay, 
            gender: input.gender,
            phoneNumber: input.phoneNumber,
            instaUserName: input.instaUserName,
        }
      });
    })
})
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
export const usersRouter = createTRPCRouter({
  getById: publicProcedure
  .query(({ctx}) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user.id
      }
    })
  }),
  updateRememberProp: publicProcedure
  .input(
    z.object({
      rememberMe: z.boolean()
    })
  )
    .query( async ({input, ctx}) => {
      return await ctx.prisma.user.update({
        where: {
            email: ctx.session?.user.email as string
        },
        data: {
           rememberMe: input.rememberMe
        }
      });
    })
})
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { GeneralLoginService } from "~/service/generalLogin/generalLoginService"
import { AuthorizedUsersDatabaseService } from "~/database/authorizedUsersDatabaseService"


export const generalLoginRouter = createTRPCRouter({
  userHasAccount: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const loginService = new GeneralLoginService(email)
    const data = await loginService.userHasAccount()

    return data
  }),

  getUserRole: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const loginService = new GeneralLoginService(email)
    const data = await loginService.getUserRole()

    return data
  }),

  getAuthorizedRole: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const authorizedUsersDbService = new AuthorizedUsersDatabaseService()
    const data = await authorizedUsersDbService.findByEmail(email)

    if (data == null) {
      return "not found"
    } else {
      return data.role
    }
  })
})
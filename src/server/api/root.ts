import { createTRPCRouter } from "~/server/api/trpc";
import { schoolsRouter } from "~/server/api/routers/schools"
import { internetServiceProvidersRouter } from "./routers/internetServiceProviders"
import { adminRouter } from "./routers/admin"
import { generalLoginRouter } from "./routers/generalLogin";
import { schoolAdminRouter } from "./routers/schoolAdmin";
import { superUserRouter } from "./routers/superUser";


export const appRouter = createTRPCRouter({
  schools: schoolsRouter,
  schoolAdmin: schoolAdminRouter,
  generalLogin: generalLoginRouter,
  internetServiceProviders: internetServiceProvidersRouter,
  admin: adminRouter,
  superUser: superUserRouter
})

export type AppRouter = typeof appRouter
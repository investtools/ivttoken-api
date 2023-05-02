import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { SchoolAdminService } from "~/service/schoolAdmin/schoolAdminService"
import { type CreateSchoolAdmin } from "~/service/schoolAdmin/interfaces/interfaces"
import { Role } from "@prisma/client"
import { SchoolsService } from "~/service/schools/schoolsService"
import { ConnectivityReportService } from "~/service/conectivityReport/conectivityReportService"
import { type CreateConnectivityReport } from "~/service/conectivityReport/interfaces/interfaces"
import { mapConnectionQuality, mapMonthsEnglish } from "~/utils/functions/schoolAdminFunctions"
import { InternetServiceProviderService } from "~/service/internetServiceProvider/internetServiceProviderService"
import { administratorNameMapping } from "~/utils/functions/adminFunctions"

export const schoolAdminRouter = createTRPCRouter({
  registerSchoolAdmin: protectedProcedure.input(
    z.object({
      name: z.string(),
      cnpj: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const data: CreateSchoolAdmin = {
        name: input.name,
        email,
        role: Role.SCHOOL
      }

      const schoolAdminService = new SchoolAdminService()
      const schoolAdminId = (await schoolAdminService.create(data)).id

      const schoolsService = new SchoolsService()
      return await schoolsService.relationWithSchoolAdmin(input.cnpj, schoolAdminId)
    }),

  isSchoolAdmin: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const schoolAdminService = new SchoolAdminService()
    const schoolAdmin = await schoolAdminService.findByEmail(email)

    if (schoolAdmin == null) {
      return false
    } else {
      return true
    }
  }),

  getMyConnectivityReports: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const schoolAdminService = new SchoolAdminService()
    const schoolAdminId = (await schoolAdminService.searchByEmail(email)).id

    const connectivityReportService = new ConnectivityReportService()
    const reports = await connectivityReportService.getAllReportsBySchoolAdminId(schoolAdminId)

    if (reports.length > 0) {
      const rsp = []

      for (const report of reports) {
        const data = {
          month: String(report.month),
          noInternetDays: report.noInternetDays,
          connectionQuality: String(report.connectionQuality),
          averageSpeed: report.averageSpeed,
          connectivityPercentage: report.connectivityPercentage,
          createdAt: String(report.createdAt)
        }
        rsp.push(data)
      }
      return rsp

    } else {
      return [{
        month: "NONE",
        noInternetDays: -1,
        connectionQuality: "NONE",
        averageSpeed: -1,
        connectivityPercentage: "NONE",
        createdAt: ""
      }]
    }
  }),

  getMySchool: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const schoolAdminService = new SchoolAdminService()
    const schoolAdminId = (await schoolAdminService.searchByEmail(email)).id

    const schoolService = new SchoolsService()
    const data = await schoolService.searchBySchoolAdminId(schoolAdminId)

    const ispService = new InternetServiceProviderService()
    let ispName

    if (data.internetServiceProviderId == null) {
      ispName = "-"
    } else {
      ispName = (await ispService.findById(data.internetServiceProviderId))?.name
    }

    const resp = {
      Name: data.name,
      State: data.state,
      City: data.city,
      ZipCode: data.zipCode,
      Address: data.address,
      CNPJ: data.cnpj,
      InepCode: data.inepCode,
      Admnistrator: administratorNameMapping(data.administrator),
      EMail: data.email,
      Tokens: data.tokens,
      Provider: ispName,
      Reports: data.connectivityReport.length
    }
    return resp
  }),

  createConnectivityReport: protectedProcedure.input(
    z.object({
      month: z.string(),
      noInternetDays: z.string(),
      averageSpeed: z.string(),
      connectionQuality: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })



      const schoolService = new SchoolsService()
      const schoolAdminService = new SchoolAdminService()

      const schoolAdminId = (await schoolAdminService.searchByEmail(email)).id
      const schoolId = (await schoolService.searchBySchoolAdminId(schoolAdminId)).id

      const month = mapMonthsEnglish(input.month)
      const connectionQuality = mapConnectionQuality(input.connectionQuality)

      if (!month) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid month to create connectivity report" })
      if (!connectionQuality) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid quality to create connectivity report" })

      const data: CreateConnectivityReport = {
        month,
        noInternetDays: Number(input.noInternetDays),
        connectionQuality: connectionQuality,
        averageSpeed: Number(input.averageSpeed),
        schoolId,
        schoolAdminId
      }


      const connectivityReportService = new ConnectivityReportService()
      const createConnectivityReport = await connectivityReportService.create(data)

      return createConnectivityReport
    }),

  schoolHasProvider: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const schoolAdminService = new SchoolAdminService()
    const schoolAdminId = (await schoolAdminService.searchByEmail(email)).id

    const schoolService = new SchoolsService()
    const data = await schoolService.searchBySchoolAdminId(schoolAdminId)

    const ispService = new InternetServiceProviderService()
    let ispName

    if (data.internetServiceProviderId == null) {
      ispName = "-"
    } else {
      ispName = (await ispService.findById(data.internetServiceProviderId))?.name
    }

    return ispName === "-" ? false : true
  }),
})
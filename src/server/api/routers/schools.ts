import { z } from "zod"
import { SchoolsService } from "~/service/schools/schoolsService"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { administratorNameMapping } from "~/utils/functions/adminFunctions"


export const schoolsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ }) => {
    const schoolsService = new SchoolsService()
    return await schoolsService.getAll()
  }),

  getAvailable: publicProcedure.query(async ({ }) => {
    const schoolsService = new SchoolsService()

    const available = await schoolsService.getAvailable()
    const rsp = []

    for (const school of available) {
      if (school.tokens != null && Number(school.tokens) > 0 && school.internetServiceProviderId == null) {
        rsp.push(school)
      }
    }
    return rsp
  }),

  getSchoolsWithTokens: publicProcedure.query(async ({ }) => {
    const schoolsService = new SchoolsService()
    const availableSchools = await schoolsService.getAvailable()

    const schoolsWithTokens = []

    for (const school of availableSchools) {
      if (school.tokens != null) {
        schoolsWithTokens.push(school)
      }
    }

    return schoolsWithTokens
  }),

  getNoTokensSchools: publicProcedure.query(async ({ }) => {
    const schoolsService = new SchoolsService()
    return await schoolsService.getNoTokensSchools()
  }),

  findSchoolNameByCnpj: publicProcedure.input(
    z.object({
      cnpj: z.string()
    })
  )
    .query(async ({ input }) => {
      if (!input.cnpj) throw new TRPCError({ code: "BAD_REQUEST", message: "CNPJ missing" })

      const schoolsService = new SchoolsService()

      return await schoolsService.searchSchoolNameByCnpj(input.cnpj)
    }),

  doesSchoolExist: publicProcedure.input(
    z.object({
      cnpj: z.string()
    })
  )
    .query(async ({ input }) => {
      if (!input.cnpj) throw new TRPCError({ code: "BAD_REQUEST", message: "CNPJ missing" })

      const schoolsService = new SchoolsService()
      const school = await schoolsService.findByCnpj(input.cnpj)

      if (school == null) {
        return false
      } else {
        return true
      }
    }),

  getSchoolByCnpj: publicProcedure.input(
    z.object({
      cnpj: z.string()
    })
  )
    .query(async ({ input }) => {
      if (!input.cnpj) throw new TRPCError({ code: "BAD_REQUEST", message: "CNPJ missing" })

      const schoolsService = new SchoolsService()
      const data = await schoolsService.searchByCnpj(input.cnpj)
      
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
        Provider: "-",
        Reports: data.connectivityReport.length
      }
      return resp
    })
})
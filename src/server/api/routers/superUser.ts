import { z } from "zod"
import { Role, Status } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { AdminService } from "~/service/admin/adminService"
import { type CreateSchool } from "~/service/schools/interfaces/interfaces"
import { SchoolsService } from "~/service/schools/schoolsService"
import { mapAdministrator } from "~/utils/functions/adminFunctions"
import { ContractsDatabaseService } from "~/database/contractsDatabaseService"
import { InternetServiceProviderService } from "~/service/internetServiceProvider/internetServiceProviderService"
import { SuperUserService } from "~/service/superUser/superUserService"


export const superUserRouter = createTRPCRouter({
  registerSuperUser: protectedProcedure.input(
    z.object({
      name: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      if (!input.name) throw new TRPCError({ code: "BAD_REQUEST", message: "One or more fields missing" })

      const data = {
        name: input.name,
        email
      }

      const superUserService = new SuperUserService()
      return await superUserService.create(data)
    }),

    isSuperUser: protectedProcedure.query(async ({ ctx }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })
  
      const superUserService = new SuperUserService()
      const superUser = await superUserService.findByEmail(email)
  
      if (superUser == null) {
        return false
      } else {
        return true
      }
    }),

  createSchool: protectedProcedure.input(
    z.object({
      name: z.string(),
      state: z.string(),
      city: z.string(),
      zipCode: z.string(),
      address: z.string(),
      cnpj: z.string(),
      inepCode: z.string(),
      email: z.string(),
      administrator: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const adminService = new AdminService()
      const adminId = await adminService.findByEmail(email)
      if (!adminId) throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not an admin" })

      if (!input.name || !input.state || !input.city || !input.zipCode || !input.address || !input.inepCode || !input.email || !input.administrator) throw new TRPCError({ code: "BAD_REQUEST", message: "One or more fields missing" })

      const administrator = mapAdministrator(input.administrator)
      if (!administrator) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid administrator to create school root" })

      const schoolData: CreateSchool = {
        name: input.name,
        state: input.state,
        city: input.city,
        zipCode: input.zipCode,
        address: input.address,
        cnpj: input.cnpj,
        inepCode: input.inepCode,
        email: input.email,
        role: Role.SCHOOL,
        administrator: administrator
      }

      const schoolsService = new SchoolsService()
      const createSchool = await schoolsService.create(schoolData)

      return createSchool
    }),

  assignTokensToSchool: protectedProcedure.input(
    z.object({
      cnpj: z.string(),
      tokens: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const adminService = new AdminService()
      const adminId = await adminService.findByEmail(email)
      if (!adminId) throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not an admin" })

      if (!input.cnpj || !input.tokens) throw new TRPCError({ code: "BAD_REQUEST", message: "One or more fields missing" })

      const schoolsService = new SchoolsService()
      const schoolName = await schoolsService.searchSchoolNameByCnpj(input.cnpj)
      console.log(schoolName)
      await schoolsService.quantifyTokensToSchool(input.cnpj, input.tokens)

      if (!schoolName) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Cannot access data" })

      return schoolName
    }),

  getPendingContracts: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const contractsDbService = new ContractsDatabaseService()
    const pendingContracts = await contractsDbService.getAllPendingContracts()

    if (pendingContracts.length > 0) {
      const rsp = []
      const schoolsService = new SchoolsService()
      const ispService = new InternetServiceProviderService()

      for (const contract of pendingContracts) {
        const data = {
          contractId: contract.id,
          schoolsId: (await schoolsService.findById(contract.schoolsId)).name,
          status: contract.status,
          createdAt: contract.createdAt,
          isp: (await ispService.searchById(contract.internetServiceProviderId)).name
        }
        rsp.push(data)
      }
      return rsp

    } else {
      return [{
        contractId: "NONE",
        schoolsId: "NONE",
        status: "NONE",
        createdAt: "NONE",
        isp: "NONE"
      }]
    }
  }),

  getAllConnectivityReports: protectedProcedure.input(
    z.object({
      cnpj: z.string() || null
    })
  )
    .query(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      if (input.cnpj == null) {
        return [{
          month: "LOADING",
          noInternetDays: 0,
          conexionQuality: "LOADING"
        }]
      }

      const schoolsService = new SchoolsService()
      const schoolInfo = await schoolsService.searchByCnpj(input.cnpj)
      const connectivityReports = schoolInfo.connectivityReport

      if (connectivityReports.length > 0) {
        return connectivityReports
      } else {
        return [{
          month: "NONE",
          noInternetDays: -1,
          conexionQuality: "NONE"
        }]
      }
    }),

  approveContract: protectedProcedure.input(
    z.object({
      contractId: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const adminService = new AdminService()
      const admin = await adminService.searchByEmail(email)

      const contractsDbService = new ContractsDatabaseService()
      return await contractsDbService.updateStatus(input.contractId, Status.APPROVED, admin.id)
    }),

  denyContract: protectedProcedure.input(
    z.object({
      contractId: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const adminService = new AdminService()
      const admin = await adminService.searchByEmail(email)

      const contractsDbService = new ContractsDatabaseService()
      return await contractsDbService.updateStatus(input.contractId, Status.DENIED, admin.id)
    }),

  getAllContracts: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const contractsDbService = new ContractsDatabaseService()
    const contracts = await contractsDbService.getAllContracts()

    if (contracts.length > 0) {
      const rsp = []
      const schoolsService = new SchoolsService()
      const ispService = new InternetServiceProviderService()
      const adminService = new AdminService()
      const admin = await adminService.searchByEmail(email)

      for (const contract of contracts) {
        const data = {
          reviewedAt: contract.updatedAt,
          adminName: admin.name,
          adminTeam: admin.entity,
          contractId: contract.id,
          schoolsId: (await schoolsService.findById(contract.schoolsId)).name,
          status: contract.status,
          createdAt: contract.createdAt,
          isp: (await ispService.searchById(contract.internetServiceProviderId)).name
        }
        rsp.push(data)
      }
      return rsp

    } else {
      return [{
        reviewedAt: "NONE",
        adminName: "NONE",
        adminTeam: "NONE",
        contractId: "NONE",
        schoolsId: "NONE",
        status: "PENDING",
        createdAt: "NONE",
        isp: "NONE"
      }]
    }
  }),
})
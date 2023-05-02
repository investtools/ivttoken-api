import { z } from "zod"
import { Entity, Role, Status } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { AdminService } from "~/service/admin/adminService"
import { type CreateSchool } from "~/service/schools/interfaces/interfaces"
import { SchoolsService } from "~/service/schools/schoolsService"
import { mapAdministrator, mapRole } from "~/utils/functions/adminFunctions"
import { ContractsDatabaseService } from "~/database/contractsDatabaseService"
import { InternetServiceProviderService } from "~/service/internetServiceProvider/internetServiceProviderService"
import { AuthorizedUsersDatabaseService } from "~/database/authorizedUsersDatabaseService"
import { approveContractTransaction } from "~/database/dbTransactions"


export const adminRouter = createTRPCRouter({
  authorizeUser: protectedProcedure.input(
    z.object({
      email: z.string(),
      role: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const adminService = new AdminService()
      const adminId = (await adminService.searchByEmail(email)).id

      const role = mapRole(input.role)
      if (!role) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid role" })

      const authorizedUsersDbService = new AuthorizedUsersDatabaseService()
      return await authorizedUsersDbService.create(input.email, role, adminId)
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
      await schoolsService.quantifyTokensToSchool(input.cnpj, input.tokens)

      if (!schoolName) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Cannot access data" })

      return schoolName
    }),

  registerAdmin: protectedProcedure.input(
    z.object({
      name: z.string(),
      entity: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })


      if (!input.name || !input.entity) throw new TRPCError({ code: "BAD_REQUEST", message: "One or more fields missing" })

      let entity: Entity = Entity.INVESTTOOLS
      if (input.entity.toLowerCase() == 'giga') {
        entity = Entity.GIGA
      }

      if (input.entity.toLowerCase() == 'unicef') {
        entity = Entity.UNICEF
      }

      if (input.entity.toLowerCase() == 'government') {
        entity = Entity.GOVERNMENT
      }

      if (input.entity.toLowerCase() == 'investtools') {
        entity = Entity.INVESTTOOLS
      }

      const data = {
        name: input.name,
        entity,
        email,
        role: Role.ADMIN
      }

      const adminService = new AdminService()
      const register = await adminService.create(data)

      return register
    }),

  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const adminService = new AdminService()
    const admin = await adminService.findByEmail(email)

    if (admin == null) {
      return false
    } else {
      return true
    }
  }),

  getAuthorizedUsers: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

    const authorizedUsersDbService = new AuthorizedUsersDatabaseService()
    const authorizedUsers = await authorizedUsersDbService.getAll()

    const adminService = new AdminService()

    if (authorizedUsers.length > 0) {
      const rsp = []

      for (const user of authorizedUsers) {
        const adminName = (await adminService.searchById(user.adminId)).name
        const adminTeam = (await adminService.searchById(user.adminId)).entity

        rsp.push({
          id: user.id,
          email: user.email,
          role: user.role,
          adminName: adminName,
          adminTeam: adminTeam,
          createdAt: user.createdAt
        })
      }

      return rsp
    } else {
      return [{
        id: "-",
        email: "-",
        role: "-",
        adminName: "-",
        adminTeam: "-",
        createdAt: "-"
      }]
    }
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
          month: "NONE",
          noInternetDays: -1,
          connectionQuality: "NONE",
          averageSpeed: -1,
          connectivityPercentage: "NONE",
          createdAt: ""
        }]
      }

      const schoolsService = new SchoolsService()
      const schoolInfo = await schoolsService.searchByCnpj(input.cnpj)
      const connectivityReports = schoolInfo.connectivityReport

      if (connectivityReports.length > 0) {
        const rsp = []

        for (const report of connectivityReports) {
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

  approveContract: protectedProcedure.input(
    z.object({
      contractId: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const adminService = new AdminService()
      const schoolsService = new SchoolsService()
      const ispService = new InternetServiceProviderService()
      const contractsDbService = new ContractsDatabaseService()

      const contract = await contractsDbService.searchById(input.contractId)
      const school = await schoolsService.findById(contract.schoolsId)
      const isp = await ispService.searchById(contract.internetServiceProviderId)
      const adminId = (await adminService.searchByEmail(email)).id

      if (school.tokens == null) throw new TRPCError({ code: "BAD_REQUEST", message: "No tokens found" })

      const newTotalTokenAmount = String(Number(isp.tokenAmount) + Number(school.tokens))
      const newLockedTokens = String(Number(isp.lockedTokens) + Number(school.tokens))

      return await approveContractTransaction(adminId, school.cnpj, contract.internetServiceProviderId, newTotalTokenAmount, newLockedTokens, contract.id)
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
      const adminId = (await adminService.searchByEmail(email)).id

      const contractsDbService = new ContractsDatabaseService()
      return await contractsDbService.updateStatus(input.contractId, Status.DENIED, adminId)
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
        status: "NONE",
        createdAt: "NONE",
        isp: "NONE"
      }]
    }
  }),
})
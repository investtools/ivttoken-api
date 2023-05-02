import { Role, Status } from '@prisma/client';
import { type CreateInternetServiceProvider } from './../../../service/internetServiceProvider/interfaces/interfaces';
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { InternetServiceProviderDatabaseService } from "~/database/internetServiceProviderDatabaseService"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { InternetServiceProviderService } from '~/service/internetServiceProvider/internetServiceProviderService';
import { SchoolsService } from '~/service/schools/schoolsService';
import { benefitPriceByName, mapBenefitType } from '~/utils/functions/benefitsFunctions';
import { ContractsDatabaseService } from '~/database/contractsDatabaseService';
import { ispBuyBenefitsTransaction } from '~/database/dbTransactions';

export const internetServiceProvidersRouter = createTRPCRouter({
  isIsp: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress
    if (!email) throw new TRPCError({ code: "UNAUTHORIZED" })

    const ispService = new InternetServiceProviderService()
    const isp = await ispService.findByEmail(email)

    if (isp == null) {
      return false
    } else {
      return true
    }
  }),

  getIspData: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress

    if (!email) throw new TRPCError({ code: "UNAUTHORIZED" })

    const ispDbService = new InternetServiceProviderDatabaseService()
    const ispData = await ispDbService.searchByEmail(email)

    return {
      tokenAmount: ispData.tokenAmount,
      unlockedTokens: ispData.unlockedTokens,
      lockedTokens: ispData.lockedTokens,
      spentTokens: ispData.spentTokens,
      tokensHistory: String(Number(ispData.tokenAmount) + Number(ispData.spentTokens))
    }
  }),

  getIspTransactions: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress

    if (!email) throw new TRPCError({ code: "UNAUTHORIZED" })

    const ispService = new InternetServiceProviderService()
    const ispTokenTransactions = (await ispService.searchByEmail(email)).tokenTransactions


    if (ispTokenTransactions.length > 0) {
      return ispTokenTransactions
    } else {
      return [{
        benefit: "NONE",
        benefitPrice: "NONE",
        createdAt: "NONE"
      }]
    }
  }),

  getIspContracts: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress

    if (!email) throw new TRPCError({ code: "UNAUTHORIZED" })

    const ispService = new InternetServiceProviderService()
    const ispContracts = (await ispService.searchByEmail(email)).contracts

    if (ispContracts.length > 0) {
      const rsp = []
      const schoolsService = new SchoolsService()

      for (const contract of ispContracts) {
        const data = {
          schoolsId: (await schoolsService.findById(contract.schoolsId)).name,
          status: contract.status,
          createdAt: contract.createdAt
        }
        rsp.push(data)
      }
      return rsp

    } else {
      return [{
        schoolsId: "NONE",
        status: "NONE",
        createdAt: "NONE"
      }]
    }
  }),

  registerISP: protectedProcedure.input(
    z.object({
      name: z.string(),
      cnpj: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const data: CreateInternetServiceProvider = {
        name: input.name,
        cnpj: input.cnpj,
        tokenAmount: '0',
        unlockedTokens: '0',
        lockedTokens: '0',
        spentTokens: '0',
        email,
        role: Role.ISP
      }

      const ispService = new InternetServiceProviderService()
      return await ispService.create(data)
    }),

  buyBenefits: protectedProcedure.input(
    z.object({
      selectedBenefit: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      if (input.selectedBenefit == undefined) throw new TRPCError({ code: "BAD_REQUEST", message: "Benefício de input undefined para comprar benefícios" })

      const ispService = new InternetServiceProviderService()
      const isp = await ispService.searchByEmail(email)
      const ispCnpj = isp.cnpj
      const ispId = isp.id

      const benefit = mapBenefitType(input.selectedBenefit)
      const benefitPrice = benefitPriceByName(input.selectedBenefit)

      if (Number(isp.unlockedTokens) < Number(benefitPrice)) {
        return false
      }

      const newSpentTokens = String(Number(isp.spentTokens) + Number(benefitPrice))
      const newUnlockedTokens = String(Number(isp.unlockedTokens) - Number(benefitPrice))
      const newTokenAmount = String(Number(isp.tokenAmount) - Number(benefitPrice))

      if (benefit === undefined) throw new TRPCError({ code: "BAD_REQUEST", message: "Mapeamento de benefício undefined para comprar benefícios" })
      if (benefitPrice === undefined) throw new TRPCError({ code: "BAD_REQUEST", message: "Mapeamento de preço undefined para comprar benefícios" })

      return await ispBuyBenefitsTransaction(ispCnpj, newSpentTokens, newUnlockedTokens, newTokenAmount, benefit, benefitPrice, ispId)
    }),

  ispUnlockedTokens: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress

    if (!email) throw new TRPCError({ code: "UNAUTHORIZED" })

    const ispService = new InternetServiceProviderService()

    const cnpj = (await ispService.searchByEmail(email)).cnpj
    const ispBalance = await ispService.balance(cnpj)
    return ispBalance.unlockedTokens
  }),

  createContract: protectedProcedure.input(
    z.object({
      schoolCnpj: z.string()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user?.emailAddresses[0]?.emailAddress
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no email" })

      const schoolsService = new SchoolsService()
      const ispService = new InternetServiceProviderService()

      const ispId = (await ispService.searchByEmail(email)).id
      const schoolId = (await schoolsService.searchByCnpj(input.schoolCnpj)).id

      const contractDbService = new ContractsDatabaseService()
      return await contractDbService.create(schoolId, ispId, Status.PENDING)
    }),

  getIspSchools: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.user?.emailAddresses[0]?.emailAddress

    if (!email) throw new TRPCError({ code: "UNAUTHORIZED" })

    const ispService = new InternetServiceProviderService()
    const ispCnpj = (await ispService.searchByEmail(email)).cnpj
    const schools = await ispService.ispSchools(ispCnpj)

    if (schools.length === 0) {
      return [{
        name: "-",
        state: "-",
        city: "-",
        zipCode: "-",
        address: "-",
        cnpj: "-",
        inepCode: "-",
        administrator: "-",
        email: "-",
        tokens: "-",
        connectivityReport: []
      }]
    } else {
      const rsp = []
      const schoolsService = new SchoolsService()

      for (const school of schools) {
        const connectivityReports = (await schoolsService.searchByCnpj(school.cnpj)).connectivityReport

        const data = {
          name: school.name,
          state: school.state,
          city: school.city,
          zipCode: school.zipCode,
          address: school.address,
          cnpj: school.cnpj,
          inepCode: school.inepCode,
          administrator: school.administrator,
          email: school.email,
          tokens: school.tokens,
          connectivityReport: connectivityReports
        }
        rsp.push(data)
      }
      return rsp
    }
  }),
})
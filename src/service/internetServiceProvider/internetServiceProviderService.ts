import { InternetServiceProviderDatabaseService } from "~/database/internetServiceProviderDatabaseService"
import { type CreateInternetServiceProvider } from "./interfaces/interfaces"
import { Role, type Benefits } from "@prisma/client"
import { TokenTransactionsService } from "../tokenTransactions/tokenTransactionsService"
import { TRPCError } from "@trpc/server"

export class InternetServiceProviderService {
    private readonly ispDbService: InternetServiceProviderDatabaseService

    constructor() {
        this.ispDbService = new InternetServiceProviderDatabaseService()
    }

    public async create(data: CreateInternetServiceProvider) {
        data.role = Role.ISP
        return await this.ispDbService.create(data.name, data.cnpj, data.tokenAmount, data.unlockedTokens, data.lockedTokens, data.spentTokens, data.email, data.role)
    }

    public async findByCnpj(cnpj: string) {
        return await this.ispDbService.findByCnpj(cnpj)
    }

    public async findById(id: string) {
        return await this.ispDbService.findById(id)
    }

    public async searchById(id: string) {
        return await this.ispDbService.searchById(id)
    }

    public async ispId(cnpj: string) {
        return (await this.findByCnpj(cnpj)).id
    }

    public async findByEmail(email: string) {
        return await this.ispDbService.findByEmail(email)
    }

    public async searchByEmail(email: string) {
        return await this.ispDbService.searchByEmail(email)
    }

    public async balance(cnpj: string) {
        const isp = await this.findByCnpj(cnpj)
        return {
            tokenAmount: isp.tokenAmount,
            unlockedTokens: isp.unlockedTokens,
            lockedTokens: isp.lockedTokens,
            spentTokens: isp.spentTokens
        }
    }

    public async ispSchools(cnpj: string) {
        const isp = await this.findByCnpj(cnpj)
        return isp.schools
    }

    public async ispContracts(cnpj: string) {
        const isp = await this.findByCnpj(cnpj)
        if (isp.contracts.length == 0) {
            return "Este provedor não tem contrato com nenhuma escola"
        }
        return isp.contracts
    }

    public async ispTokenTransactions(cnpj: string) {
        const isp = await this.findByCnpj(cnpj)
        if (isp.tokenTransactions.length == 0) {
            return "Este provedor ainda não fez nenhuma transação"
        }
        return isp.tokenTransactions
    }

    public async spendTokens(cnpj: string, tokensToSpend: string) {
        const isp = await this.findByCnpj(cnpj)

        if (Number(isp.unlockedTokens) < Number(tokensToSpend)) {
            return false
        }

        const spentTokens = Number(isp.spentTokens) + Number(tokensToSpend)
        await this.ispDbService.spentTokens(cnpj, String(spentTokens))

        const newUnlockedTokensBalance = Number(isp.unlockedTokens) - Number(tokensToSpend)
        await this.ispDbService.updateUnlockedTokens(cnpj, String(newUnlockedTokensBalance))

        const newTotalTokensAmountBalance = Number(isp.tokenAmount) - Number(tokensToSpend)
        await this.ispDbService.updateTotalTokensAmount(cnpj, String(newTotalTokensAmountBalance))

        return this.balance(cnpj)
    }

    public async unlockIspTokens(cnpj: string, tokensToUnlock: string) {
        const isp = await this.findByCnpj(cnpj)

        if (Number(tokensToUnlock) > Number(isp.lockedTokens)) {
            return false
        }

        const newUnlockedTokensBalance = Number(isp.unlockedTokens) + Number(tokensToUnlock)
        await this.ispDbService.updateUnlockedTokens(cnpj, String(newUnlockedTokensBalance))

        const newLockedTokensBalance = Number(isp.lockedTokens) - Number(tokensToUnlock)
        await this.ispDbService.updateLockedTokens(cnpj, String(newLockedTokensBalance))
    }

    public async mintTokensToIsp(ispId: string, tokenAmount: string) {
        const isp = await this.searchById(ispId)
        const cnpj = isp.cnpj

        const newTotalTokensBalance = Number(isp.tokenAmount) + Number(tokenAmount)
        await this.ispDbService.updateTotalTokensAmount(cnpj, String(newTotalTokensBalance))

        const newLockedTokensBalance = Number(isp.lockedTokens) + Number(tokenAmount)
        await this.ispDbService.updateLockedTokens(cnpj, String(newLockedTokensBalance))
    }

    public async buyBenefits(cnpj: string, benefit: Benefits, benefitPrice: string) {
        const isp = await this.findByCnpj(cnpj)

        const payForBenefits = await this.spendTokens(cnpj, benefitPrice)

        if (payForBenefits == false) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "ISP não tem tokens suficientes para comprar este benefício" })
        }

        const data = {
            benefit,
            benefitPrice,
            internetServiceProviderId: isp.id
        }

        const tokensTransactionsService = new TokenTransactionsService()
        const createTokenTransaction = await tokensTransactionsService.create(data)

        return {
            transactionId: createTokenTransaction.id,
            tokenAmount: payForBenefits.tokenAmount,
            unlockedTokens: payForBenefits.unlockedTokens,
            lockedTokens: payForBenefits.lockedTokens,
            spentTokens: payForBenefits.spentTokens
        }
    }

    public async ispHasAccount(email: string) {
        return (await this.findByEmail(email)) == null ? false : true
    }
}
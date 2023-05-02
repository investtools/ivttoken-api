import { type Benefits, Status } from "@prisma/client";
import { prisma } from "./prisma";

export async function approveContractTransaction(adminId: string, schoolCnpj: string, ispId: string, newTotalTokenAmount: string, newLockedTokens: string, contractId: string) {
    const relationSchoolWithISP = prisma.schools.update({
        where: {
            cnpj: schoolCnpj
        },
        data: {
            internetServiceProviderId: ispId
        }
    })

    const mintTokensToISP = prisma.internetServiceProvider.update({
        where: {
            id: ispId
        }, data: {
            lockedTokens: newLockedTokens,
            tokenAmount: newTotalTokenAmount
        }
    })

    const updateContractStatus = prisma.contracts.update({
        where: {
            id: contractId
        },
        data: {
            adminId,
            status: Status.APPROVED,
            updatedAt: new Date()
        }
    })
    
    return await prisma.$transaction([relationSchoolWithISP, updateContractStatus, mintTokensToISP])
}

export async function ispBuyBenefitsTransaction(ispCnpj: string, newSpentTokens: string, newUnlockedTokens: string, newTokenAmount: string, benefit: Benefits, benefitPrice: string, ispId: string) {
    const buyBenefit = prisma.internetServiceProvider.update({
        where: {
            cnpj: ispCnpj
        }, data: {
            spentTokens: newSpentTokens,
            unlockedTokens: newUnlockedTokens,
            tokenAmount: newTokenAmount
        }
    })

    const createTokenTransaction = prisma.tokenTransactions.create({
        data: {
            benefit,
            benefitPrice,
            internetServiceProviderId: ispId
        }
    })

    return await prisma.$transaction([buyBenefit, createTokenTransaction])
}
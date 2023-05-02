import type { Benefits } from "@prisma/client"
import { prisma } from "./prisma"

export class TokenTransactionsDatabaseService {
    db
    constructor() {
        this.db = prisma.tokenTransactions
    }

    create(benefit: Benefits, benefitPrice: string, internetServiceProviderId: string) {
        return this.db.create({
            data: {
                benefit,
                benefitPrice,
                internetServiceProviderId
            }
        })
    }
}
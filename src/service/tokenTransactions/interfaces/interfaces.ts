import { type Benefits } from "@prisma/client"

export interface CreateTokenTransactions {
    benefit: Benefits
    benefitPrice: string
    internetServiceProviderId: string
}
import type { Role } from "@prisma/client"
import { prisma } from "./prisma"

export class InternetServiceProviderDatabaseService {
    db
    constructor() {
        this.db = prisma.internetServiceProvider
    }

    create(name: string, cnpj: string, tokenAmount: string, unlockedTokens: string, lockedTokens: string, spentTokens: string, email: string, role: Role) {
        return this.db.create({
            data: {
                name,
                cnpj,
                tokenAmount,
                unlockedTokens,
                lockedTokens,
                spentTokens,
                email,
                role
            }
        })
    }

    findByCnpj(cnpj: string) {
        return this.db.findUniqueOrThrow({
            where: {
                cnpj
            },
            include: {
                schools: true,
                contracts: true,
                tokenTransactions: true
            }
        })
    }

    findById(id: string) {
        return this.db.findFirst({
            where: {
                id
            }
        })
    }

    searchById(id: string) {
        return this.db.findFirstOrThrow({
            where: {
                id
            }
        })
    }

    findByEmail(email: string) {
        return this.db.findUnique({
            where: {
                email
            },
            include: {
                schools: true,
                contracts: true,
                tokenTransactions: true                
            }
        })
    }

    searchByEmail(email: string) {
        return this.db.findUniqueOrThrow({
            where: {
                email
            },
            include: {
                schools: true,
                contracts: true,
                tokenTransactions: true                
            }
        })
    }

    spentTokens(cnpj: string, spentTokens: string) {
        return this.db.update({
            where: {
                cnpj
            },
            data: {
                spentTokens
            }
        })
    }

    updateUnlockedTokens(cnpj: string, unlockedTokens: string) {
        return this.db.update({
            where: {
                cnpj
            },
            data: {
                unlockedTokens
            }
        })
    }

    updateLockedTokens(cnpj: string, lockedTokens: string) {
        return this.db.update({
            where: {
                cnpj
            },
            data: {
                lockedTokens
            }
        })
    }

    updateTotalTokensAmount(cnpj: string, tokenAmount: string) {
        return this.db.update({
            where: {
                cnpj
            },
            data: {
                tokenAmount
            }
        })
    }

    
}
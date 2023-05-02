import { type Role } from "@prisma/client"

export interface CreateInternetServiceProvider { 
    name: string
    cnpj: string
    tokenAmount: string
    unlockedTokens: string
    lockedTokens: string
    spentTokens: string
    email: string
    role: Role
}
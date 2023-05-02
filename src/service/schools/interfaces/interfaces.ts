import type { Administrators, Role } from "@prisma/client"

export interface CreateSchool {
    name: string
    state: string
    city: string
    zipCode: string
    address: string
    cnpj: string
    inepCode: string
    email: string
    role: Role
    administrator: Administrators
}
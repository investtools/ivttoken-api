import type { Role } from "@prisma/client"

export interface CreateSchoolAdmin {
    name: string
    email: string
    role: Role
}
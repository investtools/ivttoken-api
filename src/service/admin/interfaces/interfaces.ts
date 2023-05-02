import type { Entity, Role } from "@prisma/client"

export interface CreateAdmin {
    name: string
    entity: Entity
    email: string
    role: Role
}
import type { Entity, Role } from "@prisma/client"
import { prisma } from "./prisma"

export class AdminDatabaseService {
    db
    constructor() {
        this.db = prisma.admin
    }

    create(name: string, entity: Entity, email: string, role: Role) {
        return this.db.create({
            data: {
                name,
                entity,
                email,
                role
            }
        })
    }

    findByEmail(email: string) {
        return this.db.findUnique({
            where: {
                email
            }
        })
    }

    searchByEmail(email: string) {
        return this.db.findUniqueOrThrow({
            where: {
                email
            }
        })
    }

    searchById(id: string) {
        return this.db.findUniqueOrThrow({
            where: {
                id
            }
        })
    }
}
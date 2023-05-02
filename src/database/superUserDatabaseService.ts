import type { Role } from "@prisma/client"
import { prisma } from "./prisma"

export class SuperUserDatabaseService {
    db
    constructor() {
        this.db = prisma.superUser
    }

    create(name: string, email: string, role: Role) {
        return this.db.create({
            data: {
                name,
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
}
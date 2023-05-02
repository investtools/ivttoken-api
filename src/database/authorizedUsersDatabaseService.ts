import { type Role } from "@prisma/client"
import { prisma } from "./prisma"

export class AuthorizedUsersDatabaseService {
    db
    constructor() {
        this.db = prisma.authorizedUsers
    }

    create(email: string, role: Role, adminId: string) {
        return this.db.create({
            data: {
                email, 
                role,
                adminId
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

    findByEmail(email: string) {
        return this.db.findUnique({
            where: {
                email
            }
        })
    }

    getAll() {
        return this.db.findMany()
    }
}
import type { Role } from "@prisma/client"
import { prisma } from "./prisma"

export class SchoolAdminDatabaseService {
    db
    constructor() {
        this.db = prisma.schoolAdmin
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
            }, 
            include: {
                schools: true
            }
        })
    }

    searchByEmail(email: string) {
        return this.db.findUniqueOrThrow({
            where: {
                email
            }, 
            include: {
                schools: true
            }
        })
    }
}
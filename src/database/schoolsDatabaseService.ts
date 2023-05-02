import type { Administrators, Role } from "@prisma/client"
import { prisma } from "./prisma"

export class SchoolsDatabaseService {
    db
    constructor() {
        this.db = prisma.schools
    }

    create(name: string, state: string, city: string, zipCode: string, address: string, cnpj: string, inepCode: string, email: string, role: Role, administrator: Administrators) {
        return this.db.create({
            data: {
                name,
                state,
                city,
                zipCode,
                address,
                cnpj,
                inepCode,
                email,
                role,
                administrator
            }
        })
    }

    findByCity(city: string) {
        return this.db.findMany({
            where: {
                city
            }
        })
    }

    findByState(state: string) {
        return this.db.findMany({
            where: {
                state
            }
        })
    }

    findByEmail(email: string) {
        return this.db.findUniqueOrThrow({
            where: {
                email
            }
        })
    }

    searchByCnpj(cnpj: string) {
        return this.db.findUniqueOrThrow({
            where: {
                cnpj
            },
            include: {
                connectivityReport: true
            }
        })
    }


    findByCnpj(cnpj: string) {
        return this.db.findUnique({
            where: {
                cnpj
            },
            include: {
                connectivityReport: true
            }
        })
    }

    findById(id: string) {
        return this.db.findUniqueOrThrow({
            where: {
                id
            }
        })
    }

    relationWithISP(cnpj: string, internetServiceProviderId: string) {
        return this.db.update({
            where: {
                cnpj
            },
            data: {
                internetServiceProviderId
            }
        })
    }

    relationWithSchoolAdmin(cnpj: string, schoolAdminId: string) {
        return this.db.update({
            where: {
                cnpj
            },
            data: {
                schoolAdminId
            }
        })
    }

    quantifyTokensToSchool(cnpj: string, tokens: string) {
        return this.db.update({
            where: {
                cnpj
            },
            data: {
                tokens
            }
        })
    }

    getAll() {
        return this.db.findMany({
            include: {
                connectivityReport: true
            }
        })
    }

    getAvailable() {
        return this.db.findMany({
            include: {
                internetServiceProvider: false,
                contracts: true
            }
        })
    }

    searchBySchoolAdminId(schoolAdminId: string) {
        return this.db.findFirstOrThrow({
            where: {
                schoolAdminId
            }, 
            include: {
                connectivityReport: true
            }
        })
    }
}
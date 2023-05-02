import { Status } from "@prisma/client"
import { prisma } from "./prisma"

export class ContractsDatabaseService {
    db
    constructor() {
        this.db = prisma.contracts
    }

    create(schoolsId: string, internetServiceProviderId: string, status: Status) {
        return this.db.create({
            data: {
                schoolsId,
                internetServiceProviderId,
                status
            }
        })
    }

    searchContractByIspId(internetServiceProviderId: string) {
        return this.db.findFirst({
            where: {
                internetServiceProviderId
            }
        })
    }

    getAllContracts() {
        return this.db.findMany()
    }

    getAllPendingContracts() {
        return this.db.findMany({
            where: {
                status: Status.PENDING
            }
        })
    }

    updateStatus(id: string, status: Status, adminId: string) {
        return this.db.update({
            where: {
                id
            }, 
            data: {
                adminId,
                status,
                updatedAt: new Date()
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
}
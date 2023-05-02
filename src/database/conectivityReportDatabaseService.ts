import { type ConnectionQuality, type Months } from "@prisma/client"
import { prisma } from "./prisma"

export class ConnectivityReportDatabaseService {
    db
    constructor() {
        this.db = prisma.connectivityReport
    }

    create(month: Months, noInternetDays: number, connectionQuality: ConnectionQuality, averageSpeed: number, schoolId: string, schoolAdminId: string, connectivityPercentage: string) {
        return this.db.create({
            data: {
                month,
                noInternetDays,
                connectionQuality,
                averageSpeed,
                schoolId,
                schoolAdminId,
                connectivityPercentage
            }
        })
    }

    getAllReportsBySchoolAdminId(schoolAdminId: string) {
        return this.db.findMany({
            where: {
                schoolAdminId
            }
        })
    }
}
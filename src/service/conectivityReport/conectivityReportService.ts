import { ConnectivityReportDatabaseService } from "~/database/conectivityReportDatabaseService"
import { type CreateConnectivityReport } from "./interfaces/interfaces"
import { calculateInternetAvailability } from "~/utils/functions/connectivityReportsFunctions"

export class ConnectivityReportService {
    private readonly connectivityReportDbService: ConnectivityReportDatabaseService

    constructor() {
        this.connectivityReportDbService = new ConnectivityReportDatabaseService()
    }

    public async create(data: CreateConnectivityReport) {
        const connectivityPercentage = calculateInternetAvailability(data.month, data.noInternetDays)
        return await this.connectivityReportDbService.create(data.month, data.noInternetDays, data.connectionQuality, data.averageSpeed, data.schoolId, data.schoolAdminId, `${connectivityPercentage.toFixed(1)}%`)
    }

    public async getAllReportsBySchoolAdminId(schoolAdminId: string) {
        return await this.connectivityReportDbService.getAllReportsBySchoolAdminId(schoolAdminId)
    }
}
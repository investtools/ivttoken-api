import { Role } from "@prisma/client"
import { type CreateSchoolAdmin } from "./interfaces/interfaces"
import { SchoolAdminDatabaseService } from "~/database/schoolAdminDatabaseService"

export class SchoolAdminService {
    private readonly schoolAdminDbService: SchoolAdminDatabaseService

    constructor() {
        this.schoolAdminDbService = new SchoolAdminDatabaseService()
    }

    public async create(data: CreateSchoolAdmin) {
        data.role = Role.SCHOOL
        return await this.schoolAdminDbService.create(data.name, data.email, data.role)
    }

    public async findByEmail(email: string) {
        return await this.schoolAdminDbService.findByEmail(email)
    }
 
    public async searchByEmail(email: string) {
        return await this.schoolAdminDbService.searchByEmail(email)
    }
}
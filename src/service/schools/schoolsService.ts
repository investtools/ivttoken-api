import { Role, Status } from "@prisma/client"
import { SchoolsDatabaseService } from "../../database/schoolsDatabaseService"
import { type CreateSchool } from "./interfaces/interfaces"

export class SchoolsService {
    private readonly schoolDbService: SchoolsDatabaseService

    constructor() {
        this.schoolDbService = new SchoolsDatabaseService()
    }

    public async create(data: CreateSchool) {
        data.role = Role.SCHOOL
        return await this.schoolDbService.create(data.name, data.state, data.city, data.zipCode, data.address, data.cnpj, data.inepCode, data.email, data.role, data.administrator)
    }

    public async getAll() {
        return await this.schoolDbService.getAll()
    }

    public async getAvailable() {
        const availableSchools = await this.schoolDbService.getAvailable()
        const available = []
        
        for (const school of availableSchools) {
            if (school.contracts.length === 0) {
                available.push(school) 
            } else if (school.contracts.length > 0) {
                for (const contract of school.contracts) {
                    const contractStatus = contract.status
                    if (contractStatus == Status.DENIED) {
                        available.push(school) 
                    }
                }
            }
        }
        
        return available
    }

    public async findByCity(city: string) {
        return await this.schoolDbService.findByCity(city)
    }

    public async findByState(state: string) {
        return await this.schoolDbService.findByState(state)
    }

    public async searchByCnpj(cnpj: string) {
        return await this.schoolDbService.searchByCnpj(cnpj)
    }

    public async findByCnpj(cnpj: string) {
        return await this.schoolDbService.findByCnpj(cnpj)
    }

    public async findById(id: string) {
        return await this.schoolDbService.findById(id)
    }

    public async relationWithISP(cnpj: string, internetServiceProviderId: string) {
        return await this.schoolDbService.relationWithISP(cnpj, internetServiceProviderId)
    }

    public async relationWithSchoolAdmin(cnpj: string, schoolAdminId: string) {
        return await this.schoolDbService.relationWithSchoolAdmin(cnpj, schoolAdminId)
    }

    public async quantifyTokensToSchool(cnpj: string, tokens: string) {
        return await this.schoolDbService.quantifyTokensToSchool(cnpj, tokens)
    }

    public async searchSchoolNameByCnpj(cnpj: string): Promise<string> {
        return (await this.searchByCnpj(cnpj)).name
    }

    public async sortSchools(field: string) {
        const schools = await this.getAvailable()
        schools.sort((a, b) => {
            if (field == "tokens") {
                return Number(a.tokens) - Number(b.tokens)
            } else if (field == "state") {
                return Number(a.state) - Number(b.state)
            } else {
                return Number(a.city) - Number(b.city)
            }
        })
    }

    public async getNoTokensSchools() {
        const schools = await this.getAvailable()
        const noTokensSchools = []

        for (const school of schools) {
            if (school.tokens == null) {
                noTokensSchools.push(school)
            }
        }
        return noTokensSchools
    }

    public async searchBySchoolAdminId(schoolAdminId: string) {
        return await this.schoolDbService.searchBySchoolAdminId(schoolAdminId)
    }
}
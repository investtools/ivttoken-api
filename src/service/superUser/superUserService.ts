import { type CreateSuperUser } from "./interfaces/interfaces"
import { Role } from "@prisma/client"
import { SuperUserDatabaseService } from "~/database/superUserDatabaseService"


export class SuperUserService {
    private readonly superUserDbService: SuperUserDatabaseService

    constructor() {
        this.superUserDbService = new SuperUserDatabaseService()
    }

    public async create(data: CreateSuperUser) {
        const role = Role.SUPER_USER
        return await this.superUserDbService.create(data.name, data.email, role)
    }

    public async findByEmail(email: string) {
        return await this.superUserDbService.findByEmail(email)
    }

    public async searchByEmail(email: string) {
        return await this.superUserDbService.searchByEmail(email)
    }

    public async loadId(email: string) {
        return (await this.searchByEmail(email)).id

    }

    public async isSuperUser(email: string) {
        const superUser = await this.superUserDbService.searchByEmail(email)
        if (superUser == null) {
            return false
        } else {
            return true
        }
    }

}
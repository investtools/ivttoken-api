import { AdminDatabaseService } from "~/database/adminDatabaseService"
import { type CreateAdmin } from "./interfaces/interfaces"
import { Role } from "@prisma/client"


export class AdminService {
    private readonly adminDbService: AdminDatabaseService

    constructor() {
        this.adminDbService = new AdminDatabaseService()
    }

    public async create(data: CreateAdmin) {
        data.role = Role.ADMIN
        return await this.adminDbService.create(data.name, data.entity, data.email, data.role)
    }

    public async findByEmail(email: string) {
        return await this.adminDbService.findByEmail(email)
    }

    public async searchByEmail(email: string) {
        return await this.adminDbService.searchByEmail(email)
    }

    public async loadIdByEmail(email: string) {
        return (await this.searchByEmail(email)).id

    }

    public async searchById(id: string) {
        return await this.adminDbService.searchById(id)
    }
}
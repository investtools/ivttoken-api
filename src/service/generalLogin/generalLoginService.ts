import { TRPCError } from "@trpc/server"
import { AdminDatabaseService } from "~/database/adminDatabaseService"
import { InternetServiceProviderDatabaseService } from "~/database/internetServiceProviderDatabaseService"
import { SchoolAdminDatabaseService } from "~/database/schoolAdminDatabaseService"
import { SuperUserDatabaseService } from "~/database/superUserDatabaseService"

export class GeneralLoginService {
    private readonly userEmail: string
    private readonly adminDbService: AdminDatabaseService
    private readonly superUserDbService: SuperUserDatabaseService
    private readonly schoolAdminDbService: SchoolAdminDatabaseService
    private readonly ispDbService: InternetServiceProviderDatabaseService

    constructor(userEmail: string) {
        this.userEmail = userEmail
        this.adminDbService = new AdminDatabaseService()
        this.superUserDbService = new SuperUserDatabaseService()
        this.schoolAdminDbService = new SchoolAdminDatabaseService()
        this.ispDbService = new InternetServiceProviderDatabaseService()
    }

    public async userHasAccount() {
        const searchIspDb = await this.ispDbService.findByEmail(this.userEmail)
        const searchAdminDb = await this.adminDbService.findByEmail(this.userEmail)
        const searchSuperUserDb = await this.superUserDbService.findByEmail(this.userEmail)
        const searchSchoolAdminDb = await this.schoolAdminDbService.findByEmail(this.userEmail)

        if (searchIspDb == null && searchAdminDb == null && searchSchoolAdminDb == null && searchSuperUserDb == null) {
            return false
        }
        return true
    }

    public async getUserRole() {
        const userHasAccount = await this.userHasAccount()

        if (userHasAccount) {
            const searchIspDb = await this.ispDbService.findByEmail(this.userEmail)
            const searchAdminDb = await this.adminDbService.findByEmail(this.userEmail)
            const searchSuperUserDb = await this.superUserDbService.findByEmail(this.userEmail)
            const searchSchoolAdminDb = await this.schoolAdminDbService.findByEmail(this.userEmail)

            if (searchIspDb != null) return searchIspDb.role
            if (searchAdminDb != null) return searchAdminDb.role
            if (searchSuperUserDb != null) return searchSuperUserDb.role
            if (searchSchoolAdminDb != null) return searchSchoolAdminDb.role
        } else throw new TRPCError({ code: "NOT_FOUND", message: "User has no account" })
    }

    public async getUserInfo() {
        const userHasAccount = await this.userHasAccount()

        if (userHasAccount) {
            const searchIspDb = await this.ispDbService.findByEmail(this.userEmail)
            const searchAdminDb = await this.adminDbService.findByEmail(this.userEmail)
            const searchSuperUserDb = await this.superUserDbService.findByEmail(this.userEmail)
            const searchSchoolAdminDb = await this.schoolAdminDbService.findByEmail(this.userEmail)

            if (searchIspDb != null) return searchIspDb
            if (searchAdminDb != null) return searchAdminDb
            if (searchSuperUserDb != null) return searchSuperUserDb
            if (searchSchoolAdminDb != null) return searchSchoolAdminDb
        } else throw new TRPCError({ code: "NOT_FOUND", message: "User has no account" })
    }
}
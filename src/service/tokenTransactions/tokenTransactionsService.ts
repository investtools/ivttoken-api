import { TokenTransactionsDatabaseService } from "~/database/tokenTransactionsDatabaseService"
import { type CreateTokenTransactions } from "./interfaces/interfaces"


export class TokenTransactionsService {
    private readonly tokenTransactionsDbService: TokenTransactionsDatabaseService

    constructor() {  
        this.tokenTransactionsDbService = new TokenTransactionsDatabaseService()
    }

    public async create(data: CreateTokenTransactions) {
        return await this.tokenTransactionsDbService.create(data.benefit, data.benefitPrice, data.internetServiceProviderId)
    }
}
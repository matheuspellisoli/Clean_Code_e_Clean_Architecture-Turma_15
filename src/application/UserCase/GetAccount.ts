import AccountRepository from "../../infra/repository/AccountRepository";

export default class GetAccount {
    constructor(readonly accountRepository: AccountRepository) { }

    async execulte(accountId: string) {
        if(accountId == "")
            throw new Error("Invalid accountId")
        const account = await this.accountRepository.getById(accountId);
        if(!account) throw new Error("Account does nor exist")
        return account 
    }
}
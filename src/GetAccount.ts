import AccountDAO from "./AccountDAO";

export default class GetAccount {
    constructor(readonly accountDAO: AccountDAO) { }

    async execulte(accountId: string) {
        this.checkAccountIdIsValid(accountId);
        const [account] = await this.accountDAO.getById(accountId);
        return account
    }

    private checkAccountIdIsValid(accountId: string) {
        if (accountId && accountId.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i)) return;
        throw new Error("Invalid accountId")
    }
}
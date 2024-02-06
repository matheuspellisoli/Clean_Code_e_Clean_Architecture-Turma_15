import Account from "../../domain/Account";
import AccountRepository from "../../infra/repository/AccountRepository";

export class Signup {
	constructor(readonly accountRepository: AccountRepository) { }

	async execulte(input: any) {
		const accountExisten = await this.accountRepository.getByEmail(input.email);
		const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate)
		if (accountExisten) throw new Error("Is account already exists")
		await this.accountRepository.save(account)
		return Promise.resolve({ accountId: account.accountId });
	}
}


// type input = {
// 	name: string
// 	email: string
// 	cpf: string
// 	carPlate: string
// 	isPassenger: boolean
// 	isDriver: boolean
// }


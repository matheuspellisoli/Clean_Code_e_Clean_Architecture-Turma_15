import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";


export class Signup {
	constructor(readonly accountDAO: AccountDAO) { }

	async execulte(input: any) {
		this.checkNameIsValid(input.name)
		this.checkMailIsValid(input.email)
		const [accountExisten] = await this.accountDAO.getByEmail(input.email);
		if (accountExisten) throw new Error("Is account already exists")
		this.checkCPFIsValid(input.cpf)
		if (input.isDriver) this.checkCarPlateIsValid(input.carPlate)
		input.id = this.genetionId();
		await this.accountDAO.save(input)
		return Promise.resolve({ accountId: input.id });
	}
	
	private genetionId() {
		return crypto.randomUUID();
	}

	private checkNameIsValid(name: string) {
		if (name && name.match(/[a-zA-Z] [a-zA-Z]+/)) return;
		throw new Error("Invalid name")
	}

	private checkMailIsValid(email: string) {
		if (email && email.match(/^(.+)@(.+)$/)) return;
		throw new Error("Invalid email")
	}

	private checkCPFIsValid(cpf: string) {
		if (!validateCpf(cpf))
			throw new Error("Invalid CPF")
	}

	private checkCarPlateIsValid(carPlate: any) {
		if (carPlate.match(/[A-Z]{3}[0-9]{4}/)) return;
		throw new Error("Invalid car plate")
	}
}


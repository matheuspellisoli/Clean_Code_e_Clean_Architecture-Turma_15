import crypto from "crypto"
import { validateCpf } from "./validateCpf";

export default class Account {
    private constructor(readonly accountId: string, readonly name: string, readonly email: string, readonly cpf: string, readonly isPassenger: boolean, readonly isDriver: boolean, readonly carPlate?: string) {
        if (this.isInvalidName(name)) throw new Error("Invalid name")
        if (this.isInvalidEmail(email)) throw new Error("Invalid email")
        if (this.isInvalidCPF(cpf)) throw new Error("Invalid CPF")
        if (isDriver && carPlate && this.isInvalidCarPlate(carPlate)) throw new Error("Invalid car plate")
    }

    static create(name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate)
    }

    static restore(accountId: string, name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string) {
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate)
    }

    private isInvalidName(name: string) :boolean{
		return !name.match(/[a-zA-Z] [a-zA-Z]+/);
	}

	private isInvalidEmail(email: string) :boolean {
		return !email.match(/^(.+)@(.+)$/)
	}

    private isInvalidCPF(cpf: string) :boolean {
		return !validateCpf(cpf)
	}

	private checkCPFIsValid(cpf: string) {
		if (!validateCpf(cpf))
			throw new Error("Invalid CPF")
	}

	private isInvalidCarPlate(carPlate: any) {
		return !carPlate.match(/[A-Z]{3}[0-9]{4}/)
	}
}
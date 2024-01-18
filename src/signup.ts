import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import pgPromise from "pg-promise";


export async function signup(input: any): Promise<any> {
	const connection = getConnection();
	try {
		checkNameIsValid(input.name)
		checkMailIsValid(input.email)
		checkCPFIsValid(input.cpf)
		await checkIsAccountAlreadyExists(input.email)
		const id = genetionId();
		if (input.isDriver) return await createDriverAccount(input, id)
		else return await createPassengerAccount(input, id)
	} finally {
		await connection.$pool.end();
	}
}

function getConnection() {
	return pgPromise()("postgres://postgres:123456@localhost:5432/app")
}

function genetionId() {
	return crypto.randomUUID();
}

async function checkIsAccountAlreadyExists(email: string): Promise<void> {
	if (!email) return;
	const connection = await getConnection();
	const [account] = await connection.query("select * from cccat15.account where email = $1", email);
	if (!account) return;
	throw new Error("Is account already exists")
}

function checkNameIsValid(name: string) {
	if (name && name.match(/[a-zA-Z] [a-zA-Z]+/)) return;
	throw new Error("Invalid name")
}

function checkMailIsValid(email: string) {
	if (email && email.match(/^(.+)@(.+)$/)) return;
	throw new Error("Invalid email")
}

function checkCPFIsValid(cpf: string) {
	if (!validateCpf(cpf))
		throw new Error("Invalid CPF")
}

function checkCarPlateIsValid(carPlate: any) {
	if (carPlate.match(/[A-Z]{3}[0-9]{4}/)) return;
	throw new Error("Invalid car plate")
}

async function createDriverAccount(input: any, id: string): Promise<any> {
	checkCarPlateIsValid(input.carPlate)
	const connection = await getConnection();
	await connection.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
	return Promise.resolve({ accountId: id });
}

async function createPassengerAccount(input: any, id: string): Promise<any> {
	const connection = await getConnection();
	await connection.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
	return Promise.resolve({ accountId: id });
}
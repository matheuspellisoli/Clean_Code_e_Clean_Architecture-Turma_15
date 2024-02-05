import pgPromise from "pg-promise";
import { Signup } from "../../src/application/UserCase/Signup";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import GetAccount from "../../src/application/UserCase/GetAccount";

let signup: Signup;
let getAccount: GetAccount;
let connection: DatabaseConnection = new PgPromiseAdapter();
beforeEach(() => {
    const accountRepository = new AccountRepositoryDatabase(connection);
    signup = new Signup(accountRepository);
    getAccount = new GetAccount(accountRepository);
})

afterAll(() => {
    connection.close()
})

test("Deve testar se a criação de conta ocorreu com sucesso quando for motorista", async () => {
    const email =  `jose${Math.random()}@teste.com.br`
    const input = { name: "Jose Silva", email: email, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true }
    const account = await signup.execulte(input)
    expect(account).toHaveProperty('accountId', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i))
    const accountSaved = await getAccount.execulte(account.accountId)
    expect(accountSaved.accountId).toBe(account.accountId)
    expect(accountSaved.name).toBe("Jose Silva")
    expect(accountSaved.carPlate).toBe("JYV2601")
    expect(accountSaved.cpf).toBe("840.862.960-39")
    expect(accountSaved.email).toBe(email)
    expect(accountSaved.isDriver).toBe(true)
    expect(accountSaved.isPassenger).toBe(false)
})

test("Deve testar se a criação de conta ocorreu com sucesso quando for passageiro", async () => {
    const email =  `antonio${Math.random()}@teste.com.br`
    const input = { name: "Antonio Silva", email: email, cpf: "343.151.010-87", carPlate: null, isPassenger: true, isDriver: false }
    const account = await signup.execulte(input)
    expect(account).toHaveProperty('accountId', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i))
    const accountSaved = await getAccount.execulte(account.accountId)
    expect(accountSaved.accountId).toBe(account.accountId)
    expect(accountSaved.name).toBe("Antonio Silva")
    expect(accountSaved.carPlate).toBe(null)
    expect(accountSaved.cpf).toBe("343.151.010-87")
    expect(accountSaved.email).toBe(email)
    expect(accountSaved.isDriver).toBe(false)
    expect(accountSaved.isPassenger).toBe(true)
})

test("Deve testar se a criação de conta ocorreu com erro quando CPF for invalido", async () => {
    const signup = new Signup(new AccountRepositoryDatabase(connection))
    const input = { name: "Jose Silva", email: "jose2@teste.com.br", cpf: "000.000.000-000", carPlate: "JYV2601", isPassenger: false, isDriver: true };
    await expect(async () =>{await signup.execulte(input)}).rejects.toThrow(new Error("Invalid CPF"))
})

test("Deve testar se a criação de conta ocorreu com erro quando email for invalido", async () => {
    const signup = new Signup(new AccountRepositoryDatabase(connection))
    const input = { name: "Jose Silva", email: "joseteste.com.br", cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true };
    await expect(async () =>{await signup.execulte(input)}).rejects.toThrow(new Error("Invalid email"))
})

test("Deve testar se a criação de conta ocorreu com erro quando nome for invalido", async () => {
    const signup = new Signup(new AccountRepositoryDatabase(connection))
    const input = { name: "Jose", email: "jose3@teste.com.br", cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true };
    await expect(async () =>{await signup.execulte(input)}).rejects.toThrow(new Error("Invalid name"))
})


test("Deve testar se a criação de conta ocorreu com erro quando já existir o email cadastrado", async () => {
    const signup = new Signup(new AccountRepositoryDatabase(connection))
    const email =  `jose${Math.random()}@teste.com.br`
    await signup.execulte({ name: "Jose Silva", email: email, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true })
    const input = { name: "Jose Silva", email: email, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true };
    await expect(async () =>{await signup.execulte(input)}).rejects.toThrow(new Error("Is account already exists"))
})


test("Deve testar se a criação de conta ocorreu com erro quando placa do carro for invalida ", async () => {
    const signup = new Signup(new AccountRepositoryDatabase(connection))
    const email =  `jose${Math.random()}@teste.com.br`
    const input = { name: "Jose Silva", email: email, cpf: "840.862.960-39", carPlate: "JY9601", isPassenger: false, isDriver: true };
    await expect(async () =>{await signup.execulte(input)}).rejects.toThrow(new Error("Invalid car plate"))
})

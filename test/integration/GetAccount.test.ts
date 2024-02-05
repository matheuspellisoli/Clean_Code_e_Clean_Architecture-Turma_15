import pgPromise from "pg-promise";
import crypto from "crypto";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import GetAccount from "../../src/application/UserCase/GetAccount";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { Signup } from "../../src/application/UserCase/Signup";

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

test("Deve testar se a busaca de conta ocorreu com sucesso", async () => {
    const email =  `jose${Math.random()}@teste.com.br`
    const input = { name: "Jose Silva", email: email, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true }
    const account = await signup.execulte(input)
    const accountSaved = await getAccount.execulte(account.accountId)

    expect(accountSaved.accountId).toBe(account.accountId)
    expect(accountSaved.carPlate).toBe("JYV2601")
    expect(accountSaved.cpf).toBe("840.862.960-39")
    expect(accountSaved.email).toBe(email)
    expect(accountSaved.isDriver).toBe(true)
    expect(accountSaved.isPassenger).toBe(false)
    expect(accountSaved.name).toBe("Jose Silva")
})

test("Deve testar se a busaca de conta ocorreu com erro quando accountId for null", async () => {
    try {
        await getAccount.execulte("")
    } catch (error: any) {
        expect(error.message).toBe("Invalid accountId")
    }
})

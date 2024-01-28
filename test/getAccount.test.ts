import pgPromise from "pg-promise";
import crypto from "crypto";
import { AccountDAODatabase } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
function genetionId() {
    return crypto.randomUUID();
}

async function createAccount(id: string) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query(`INSERT INTO cccat15.account
    (account_id, "name", email, cpf, car_plate, is_passenger, is_driver)
    VALUES('${id}'::uuid, 'Jose Silva', 'jose5@teste.com.br', '840.862.960-39', 'JYV2601', false, true);`);
    return account;
}

beforeAll(async () => {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("TRUNCATE cccat15.account");
})

test("Deve testar se a busaca de conta ocorreu com sucesso", async () => {
    const id = genetionId();
    await createAccount(id)
    const getAccount = new GetAccount(new AccountDAODatabase())
    const account = await getAccount.execulte(id)

    expect(account.account_id).toBe(id)
    expect(account.car_plate).toBe("JYV2601")
    expect(account.cpf).toBe("840.862.960-39")
    expect(account.email).toBe("jose5@teste.com.br")
    expect(account.is_driver).toBe(true)
    expect(account.is_passenger).toBe(false)
    expect(account.name).toBe("Jose Silva")
})


test("Deve testar se a busaca de conta ocorreu com erro quando accountId for null", async () => {

    try {
        const getAccount = new GetAccount(new AccountDAODatabase())
        await getAccount.execulte("")
    } catch (error: any) {
        expect(error.message).toBe("Invalid accountId")
    }
})

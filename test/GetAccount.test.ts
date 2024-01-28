import pgPromise from "pg-promise";
import crypto from "crypto";
import { AccountDAODatabase } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
function genetionId() {
    return crypto.randomUUID();
}

async function createAccount(id: string, email: string) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query(`INSERT INTO cccat15.account
    (account_id, "name", email, cpf, car_plate, is_passenger, is_driver)
    VALUES('${id}'::uuid, 'Jose Silva', '${email}', '840.862.960-39', 'JYV2601', false, true);`);
    return account;
}

test("Deve testar se a busaca de conta ocorreu com sucesso", async () => {
    const id = genetionId();
    const email = `jose${genetionId()}@teste.com.br`

    await createAccount(id, email)
    const getAccount = new GetAccount(new AccountDAODatabase())
    const account = await getAccount.execulte(id)

    expect(account.accountId).toBe(id)
    expect(account.carPlate).toBe("JYV2601")
    expect(account.cpf).toBe("840.862.960-39")
    expect(account.email).toBe(email)
    expect(account.isDriver).toBe(true)
    expect(account.isPassenger).toBe(false)
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

import pgPromise from "pg-promise";
import { signup } from "../src/signup"

async function getAccount(id: string) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query("select * from cccat15.account where account_id = $1", id);
    return account;
}

beforeAll(async () => {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("TRUNCATE cccat15.account");
})

test("Deve testar se a criação de conta ocorreu com sucesso quando for motorista", async () => {
    const input = { name: "Jose Silva", email: "jose@teste.com.br", cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true }
    const account = await signup(input)
    expect(account).toHaveProperty('accountId', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i))
    const accountSaved = await getAccount(account.accountId)
    expect(accountSaved.account_id).toBe(account.accountId)
    expect(accountSaved.name).toBe("Jose Silva")
    expect(accountSaved.car_plate).toBe("JYV2601")
    expect(accountSaved.cpf).toBe("840.862.960-39")
    expect(accountSaved.email).toBe("jose@teste.com.br")
    expect(accountSaved.is_driver).toBe(true)
    expect(accountSaved.is_passenger).toBe(false)
})

test("Deve testar se a criação de conta ocorreu com sucesso quando for passageiro", async () => {
    const input = { name: "Antonio Silva", email: "antonio@teste.com.br", cpf: "343.151.010-87", carPlate: null, isPassenger: true, isDriver: false }
    const account = await signup(input)
    expect(account).toHaveProperty('accountId', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i))
    const accountSaved = await getAccount(account.accountId)
    expect(accountSaved.account_id).toBe(account.accountId)
    expect(accountSaved.name).toBe("Antonio Silva")
    expect(accountSaved.car_plate).toBe(null)
    expect(accountSaved.cpf).toBe("343.151.010-87")
    expect(accountSaved.email).toBe("antonio@teste.com.br")
    expect(accountSaved.is_driver).toBe(false)
    expect(accountSaved.is_passenger).toBe(true)
})

test("Deve testar se a criação de conta ocorreu com erro quando CPF for invalido", async () => {
    const input = { name: "Jose Silva", email: "jose2@teste.com.br", cpf: "000.000.000-000", carPlate: "JYV2601", isPassenger: false, isDriver: true };
    try {
        await signup(input)
    } catch (error: any) {
        expect(error.message).toBe("Invalid CPF")
    }
})



test("Deve testar se a criação de conta ocorreu com erro quando email for invalido", async () => {
    const input = { name: "Jose Silva", email: "joseteste.com.br", cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true };
    try {
        await signup(input)
    } catch (error: any) {
        expect(error.message).toBe("Invalid email")
    }
})

test("Deve testar se a criação de conta ocorreu com erro quando nome for invalido", async () => {
    const input = { name: "Jose", email: "jose3@teste.com.br", cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true };
    try {
        await signup(input)
    } catch (error: any) {
        expect(error.message).toBe("Invalid name")
    }
})


test("Deve testar se a criação de conta ocorreu com erro quando já existir o email cadastrado", async () => {
    await signup({ name: "Jose Silva", email: "jose4@teste.com.br", cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true })
    const input = { name: "Jose Silva", email: "jose4@teste.com.br", cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true };
    try {
        await signup(input)
    } catch (error: any) {
        expect(error.message).toBe("Is account already exists")
    }
})


test("Deve testar se a criação de conta ocorreu com erro quando placa do carro for invalida ", async () => {
    const input = { name: "Jose Silva", email: "jose1@teste.com.br", cpf: "840.862.960-39", carPlate: "JY9601", isPassenger: false, isDriver: true };
    try {
        await signup(input)
    } catch (error: any) {
        expect(error.message).toBe("Invalid car plate")
    }

})
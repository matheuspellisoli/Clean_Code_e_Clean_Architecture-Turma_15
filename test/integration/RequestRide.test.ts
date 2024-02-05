import pgPromise from "pg-promise";
import crypto from "crypto";
import GetAccount from "../../src/application/UserCase/GetAccount";
import RequestRide from "../../src/application/UserCase/RequestRide";
import AccountRepository, { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import RideRepository, { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { Signup } from "../../src/application/UserCase/Signup";
import GetRide from "../../src/application/UserCase/GetRide";


let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let connection: DatabaseConnection = new PgPromiseAdapter();
beforeEach(() => {
    const accountRepository = new AccountRepositoryDatabase(connection);
    const rideRepository = new RideRepositoryDatabase(connection);

    signup = new Signup(accountRepository);
    requestRide = new RequestRide(accountRepository, rideRepository);
    getRide = new GetRide(accountRepository, rideRepository)
})

afterAll(() => {
    connection.close()
})

test("Deve estar a solicitação uma viagem com sucesso", async () => {
    const email = `jose${Math.random()}@teste.com.br`
    const inputSignup = { name: "Jose Silva", email: email, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: true, isDriver: false }
    const account = await signup.execulte(inputSignup)

    const input = {
        "passengerId": account.accountId,
        "from": {
            "lat": -30.0495304,
            "long": -51.2313074
        },
        "to": {
            "lat": -30.0802953,
            "long": -51.2215673
        }
    }
    const ride = await requestRide.execulte(input)
    expect(ride).toHaveProperty('rideId', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i))
    const rideSaved = await getRide.execulte(ride.rideId)
    expect(rideSaved.distance).toBe(null)
    expect(rideSaved.driverId).toBe(null)
    expect(rideSaved.fromLat).toBe("-30.0495304",)
    expect(rideSaved.fromLong).toBe("-51.2313074")
    expect(rideSaved.passengerId).toBe(account.accountId)
    expect(rideSaved.rideId).toBe(ride.rideId)
    expect(rideSaved.status).toBe("requested")
    expect(rideSaved.toLat).toBe("-30.0802953")
    expect(rideSaved.toLong).toBe("-51.2215673")
    expect(rideSaved.fare).toBe(null)
})


test("Deve testar a solicitação uma viagem com erro quando a conta for de motorista", async () => {
    const email = `jose${Math.random()}@teste.com.br`
    const inputSignup = { name: "Jose Silva", email: email, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true }
    const account = await signup.execulte(inputSignup)

    const input = {
        "passengerId": account.accountId,
        "from": {
            "lat": -30.0495304,
            "long": -51.2313074
        },
        "to": {
            "lat": -30.0802953,
            "long": -51.2215673
        }
    }
    await expect(async () => { await requestRide.execulte(input) }).rejects.toThrow(new Error("User is not a passenger"))
})

test("Deve testar a solicitação uma viagem com erro quando já tiver uma viagem", async () => {
    const email = `jose${Math.random()}@teste.com.br`
    const inputSignup = { name: "Jose Silva", email: email, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: true, isDriver: false }
    const account = await signup.execulte(inputSignup)
    const input = {
        "passengerId": account.accountId,
        "from": {
            "lat": -30.0495304,
            "long": -51.2313074
        },
        "to": {
            "lat": -30.0802953,
            "long": -51.2215673
        }
    }
    await requestRide.execulte(input)
    await expect(async () => { await requestRide.execulte(input) }).rejects.toThrow(new Error("There is no longer a ride for passengers"))
})
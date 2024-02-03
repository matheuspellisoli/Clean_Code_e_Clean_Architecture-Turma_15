import pgPromise from "pg-promise";
import crypto from "crypto";
import GetAccount from "../../src/application/UserCase/GetAccount";
import RequestRide from "../../src/application/UserCase/RequestRide";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";



function genetionId() {
    return crypto.randomUUID();
}

const connection = new PgPromiseAdapter()
afterAll(() => {
    connection.close()
})

async function createAccount(id: string, isDriver: boolean) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    const email = `jose${genetionId()}@teste.com.br`
    const [account] = await connection.query(`INSERT INTO cccat15.account
    (account_id, "name", email, cpf, car_plate, is_passenger, is_driver)
    VALUES('${id}'::uuid, 'Jose Silva', '${email}', '840.862.960-39', 'JYV2601', ${!isDriver}, ${isDriver});`);
    return account;
}

async function getRide(id: string) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    const [ride] = await connection.query("select * from cccat15.ride where ride_id = $1", id);
    return ride;
}

test("Deve estar a solicitação uma viagem com sucesso", async () => {
    const passengerId = genetionId();
    await createAccount(passengerId, false)
    const input = {
        "passengerId": passengerId,
        "from": {
            "lat": -30.0495304,
            "long": -51.2313074
        },
        "to": {
            "lat": -30.0802953,
            "long": -51.2215673
        }
    }
    const requestRide = new RequestRide(new AccountRepositoryDatabase(connection), new RideRepositoryDatabase(connection))
    const ride = await requestRide.execulte(input)
    expect(ride).toHaveProperty('rideId', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i))
    const rideSaved = await getRide(ride.rideId)
    expect(rideSaved.distance).toBe(null)
    expect(rideSaved.driver_id).toBe(null)
    expect(rideSaved.from_lat).toBe("-30.0495304",)
    expect(rideSaved.from_long).toBe("-51.2313074")
    expect(rideSaved.passenger_id).toBe(passengerId)
    expect(rideSaved.ride_id).toBe(ride.rideId)
    expect(rideSaved.status).toBe("requested")
    expect(rideSaved.to_lat).toBe("-30.0802953")
    expect(rideSaved.to_long).toBe("-51.2215673")
    expect(rideSaved.fare).toBe(null)

})


test("Deve testar a solicitação uma viagem com erro quando a conta for de passageiro", async () => {
    const connection = new PgPromiseAdapter()
    const passengerId = genetionId();
    await createAccount(passengerId, true)
    const input = {
        "passengerId": passengerId,
        "from": {
            "lat": -30.0495304,
            "long": -51.2313074
        },
        "to": {
            "lat": -30.0802953,
            "long": -51.2215673
        }
    }
    const requestRide = new RequestRide(new AccountRepositoryDatabase(connection), new RideRepositoryDatabase(connection))
    await expect(async () =>{await requestRide.execulte(input)}).rejects.toThrow(new Error("User is not a passenger"))
    await connection.close()
})

test("Deve testar a solicitação uma viagem com erro quando já tiver uma viagem", async () => {
    const passengerId = genetionId();
    await createAccount(passengerId, false)
    const input = {
        "passengerId": passengerId,
        "from": {
            "lat": -30.0495304,
            "long": -51.2313074
        },
        "to": {
            "lat": -30.0802953,
            "long": -51.2215673
        }
    }
    const requestRide = new RequestRide(new AccountRepositoryDatabase(connection), new RideRepositoryDatabase(connection))
    await requestRide.execulte(input)
    await expect(async () =>{await requestRide.execulte(input)}).rejects.toThrow(new Error("There is no longer a ride for passengers"))
})
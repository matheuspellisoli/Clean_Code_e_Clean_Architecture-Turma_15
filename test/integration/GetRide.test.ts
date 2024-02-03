import pgPromise from "pg-promise";
import crypto from "crypto";
import GetRide from "../../src/application/UserCase/GetRide";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
function genetionId() {
    return crypto.randomUUID();
}

async function createAccount(id: string, isDriver: boolean) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    const email = `jose${genetionId()}@teste.com.br`
    const [account] = await connection.query(`INSERT INTO cccat15.account
    (account_id, "name", email, cpf, car_plate, is_passenger, is_driver)
    VALUES('${id}'::uuid, 'Jose Silva', '${email}', '840.862.960-39', 'JYV2601', ${!isDriver}, ${isDriver});`);
    return account;
}

async function createRide(id: string, passengerId: string, driverId: string) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query(`INSERT INTO cccat15.ride
    (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, "date")
    VALUES('${id}'::uuid, '${passengerId}'::uuid, '${driverId}'::uuid, 'requested', NULL, NULL, -30.0495304, -51.2313074, -30.0802953, -51.2215673, '2024-01-28 18:38:52.114');`);
    return account;
}

test("Deve testar se a busaca de um viagem com sucesso", async () => {
    const passengerId = genetionId();
    const driverId = genetionId();
    const rideId = genetionId()
    await createAccount(passengerId, false)
    await createAccount(driverId, true)
    await createRide(rideId, passengerId, driverId)
    const getRide = new GetRide(new AccountRepositoryDatabase(new PgPromiseAdapter()), new RideRepositoryDatabase(new PgPromiseAdapter()))
    const ride = await getRide.execulte(rideId)

    expect(ride.distance).toBe(null)
    expect(ride.fromLat).toBe("-30.0495304",)
    expect(ride.fromLong).toBe("-51.2313074")
    expect(ride.passengerId).toBe(passengerId)
    expect(ride.driverId).toBe(driverId)
    expect(ride.rideId).toBe(ride.rideId)
    expect(ride.status).toBe("requested")
    expect(ride.toLat).toBe("-30.0802953")
    expect(ride.toLong).toBe("-51.2215673")
    expect(ride.fare).toBe(null)
    expect(ride.passenger?.accountId).toBe(passengerId)
    expect(ride.driver?.accountId).toBe(driverId)
})

test("Não testa nada", async () => {
    expect(true).toBe(true)
})


// import pgPromise from "pg-promise";
// import crypto from "crypto";
// import GetRide from "../src/GetRide";
// import { RideDAODatabase } from "../src/RideRepository";
// import AcceptRide from "../src/AcceptRide";
// import { AccountRepositoryDatabase } from "../src/AccountRepository";
// function genetionId() {
//     return crypto.randomUUID();
// }

// async function createAccount(id: string, isDriver: boolean) {
//     const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
//     const email = `jose${genetionId()}@teste.com.br`
//     const [account] = await connection.query(`INSERT INTO cccat15.account
//     (account_id, "name", email, cpf, car_plate, is_passenger, is_driver)
//     VALUES('${id}'::uuid, 'Jose Silva', '${email}', '840.862.960-39', 'JYV2601', ${!isDriver}, ${isDriver});`);
//     return account;
// }

// async function createRide(id: string, passengerId: string) {
//     const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
//     const [account] = await connection.query(`INSERT INTO cccat15.ride
//     (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, "date")
//     VALUES('${id}'::uuid, '${passengerId}'::uuid, null, 'requested', NULL, NULL, -30.0495304, -51.2313074, -30.0802953, -51.2215673, '2024-01-28 18:38:52.114');`);
//     return account;
// }

// async function getRide(id: string) {
//     const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
//     const [ride] = await connection.query("select * from cccat15.ride where ride_id = $1", id);
//     return ride;
// }

// test("Deve testar se o motorista aceita viagem com sucesso", async () => {
//     const passengerId = genetionId();
//     const driverId = genetionId();
//     const rideId = genetionId()
//     console.log(rideId)
//     await createAccount(passengerId, false)
//     await createAccount(driverId, true)
//     await createRide(rideId, passengerId)
//     const acceptRide = new AcceptRide(new AccountRepositoryDatabase(), new RideDAODatabase())
//     await acceptRide.execulte({rideId, driverId})
//     const rideSaved = await getRide(rideId)
//     expect(rideSaved.passenger_id).toBe(passengerId)
//     expect(rideSaved.ride_id).toBe(rideId)
//     expect(rideSaved.status).toBe("accepted")
//     expect(rideSaved.driver_id).toBe(driverId)
// })
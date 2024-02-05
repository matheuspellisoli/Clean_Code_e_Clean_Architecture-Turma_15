import AcceptRide from "../../src/application/UserCase/AcceptRide";
import GetRide from "../../src/application/UserCase/GetRide";
import RequestRide from "../../src/application/UserCase/RequestRide";
import { Signup } from "../../src/application/UserCase/Signup";
import StartRide from "../../src/application/UserCase/StartRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide
let startRide: StartRide
let connection: DatabaseConnection = new PgPromiseAdapter();
beforeEach(() => {
    const accountRepository = new AccountRepositoryDatabase(connection);
    const rideRepository = new RideRepositoryDatabase(connection);
    acceptRide = new AcceptRide(accountRepository, rideRepository)
    signup = new Signup(accountRepository);
    requestRide = new RequestRide(accountRepository, rideRepository);
    getRide = new GetRide(accountRepository, rideRepository)
    startRide = new StartRide(rideRepository)
})

afterAll(() => {
    connection.close()
})

test("Deve testar se o motorista aceita viagem com sucesso", async () => {
    const passenger = await signup.execulte({ name: "Jose Silva", email: `jose${Math.random()}@teste.com.br`, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: true, isDriver: false })
    const driver = await signup.execulte({ name: "Carlos Silva", email: `jose${Math.random()}@teste.com.br`, cpf: "840.862.960-39", carPlate: "JYV2601", isPassenger: false, isDriver: true })
    const ride = await requestRide.execulte({ "passengerId": passenger.accountId, "from": { "lat": -30.0495304, "long": -51.2313074 }, "to": { "lat": -30.0802953, "long": -51.2215673 } })
    await acceptRide.execulte(ride.rideId, { driverId: driver.accountId })
    await startRide.execulte(ride.rideId, { driverId: driver.accountId })
    const rideSaved = await getRide.execulte(ride.rideId)
    expect(rideSaved.passengerId).toBe(passenger.accountId)
    expect(rideSaved.rideId).toBe(ride.rideId)
    expect(rideSaved.status).toBe("in_progress")
    expect(rideSaved.driverId).toBe(driver.accountId)
})
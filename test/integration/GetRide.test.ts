import GetRide from "../../src/application/UserCase/GetRide";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { Signup } from "../../src/application/UserCase/Signup";
import RequestRide from "../../src/application/UserCase/RequestRide";

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

test("Deve testar se a busaca de um viagem com sucesso", async () => {
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

    const output = await requestRide.execulte(input)
    const ride = await getRide.execulte(output.rideId)
    expect(ride.distance).toBe(null)
    expect(ride.fromLat).toBe("-30.0495304",)
    expect(ride.fromLong).toBe("-51.2313074")
    expect(ride.passengerId).toBe(account.accountId)
    expect(ride.rideId).toBe(ride.rideId)
    expect(ride.status).toBe("requested")
    expect(ride.toLat).toBe("-30.0802953")
    expect(ride.toLong).toBe("-51.2215673")
    expect(ride.fare).toBe(null)
    expect(ride.passenger?.accountId).toBe(account.accountId)
    expect(ride.driver?.accountId).toBe(undefined)
})
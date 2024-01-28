import { DateTime } from "luxon";
import AccountDAO from "./AccountDAO";
import RideDAO from "./RideDAO";
import crypto from "crypto";

export default class RequestRide {

    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) { }

    async execulte(input: any,) {
        const account = await this.accountDAO.getById(input.passengerId)
        if (account && !account.isPassenger ) throw Error("User is not a passenger")
        const ridesNotCompletd = await this.rideDAO.getByPassengerIdAndNotCompleted(input.passengerId)
        if (ridesNotCompletd) throw Error("There is no longer a ride for passengers")
        input.id = crypto.randomUUID();
        input.status = "requested";
        input.date = DateTime.now().toISO()
        await this.rideDAO.save(input)
        return { rideId: input.id }
    }
}
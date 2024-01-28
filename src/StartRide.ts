
import AccountDAO from "./AccountDAO";
import RideDAO from "./RideDAO";

export default class StartRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) { }

    async execulte(input: any) {
        const driver = await this.accountDAO.getById(input.driverId);
        const ride = await this.rideDAO.getById(input.rideId);
        if (ride.status != "accepted") throw new Error("Ride not accepted");
        if (ride.driverId != driver.accountId) throw new Error("The driver is not responsible for the ride");
        ride.status = "in_progress";
        ride.driverId = input.driverId;
        await this.rideDAO.update(ride)
    }
}
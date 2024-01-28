import AccountDAO from "./AccountDAO";
import RideDAO from "./RideDAO";

export default class AcceptRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) { }

    async execulte(input: any) {
        const driver = await this.accountDAO.getById(input.driverId);
        if (!driver.isDriver) throw new Error("To accept a ride you need to be a driver");
        const rideNotComplet = await this.rideDAO.getByDriverIdAndNotCompleted(input.driverId);
        if (rideNotComplet) throw new Error("There are pending rides");
        const ride = await this.rideDAO.getById(input.rideId);
        if (ride.status != "requested") throw new Error("Ride not pending");
        ride.status = "accepted";
        ride.driverId = input.driverId;
        await this.rideDAO.update(ride)
    }
}
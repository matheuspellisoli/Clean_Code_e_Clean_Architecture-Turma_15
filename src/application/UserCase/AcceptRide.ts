import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) { }
    async execulte(rideId: string, input: any) {
        const driver = await this.accountRepository.getById(input.driverId);
        if (driver && !driver.isDriver) throw new Error("To accept a ride you need to be a driver");
        const rideNotComplet = await this.rideRepository.getActiveRidesByDriverId(input.driverId);
        if (rideNotComplet && rideNotComplet.length > 0) throw new Error("There are pending rides");
        const ride = await this.rideRepository.getById(rideId);
        if(!ride) throw new Error("Ride does nor exist")
        if (ride.getStatus() != "requested") throw new Error("Ride not pending");
        ride.accept(input.driverId)
        await this.rideRepository.update(ride)
    }
}
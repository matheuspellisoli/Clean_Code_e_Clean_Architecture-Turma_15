import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class StartRide {
    constructor(readonly rideRepository: RideRepository) { }

    async execulte(rideId: string, input: any) {
        const ride = await this.rideRepository.getById(rideId);
        if (ride?.getStatus() != "accepted") throw new Error("Ride not accepted");
        if (ride.getDriverId() != input.driverId) throw new Error("The driver is not responsible for the ride");
        ride.start()
        await this.rideRepository.update(ride)
    }
}
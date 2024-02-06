import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class StartRide {
    constructor(readonly rideRepository: RideRepository) { }

    async execulte(rideId: string, input: any) {
        const ride = await this.rideRepository.getById(rideId);
        if (!ride) throw new Error("Ride does nor exist")
        if (ride.getDriverId() != input.driverId) throw new Error("The driver is not responsible for the ride");
        ride.start()
        await this.rideRepository.update(ride)
    }
}

// type input = {
//     driverId: string
// }
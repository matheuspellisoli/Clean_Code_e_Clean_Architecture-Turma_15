import AccountRepository from "../../infra/repository/AccountRepository";
import Ride from "../../domain/Ride";
import RideRepository from "../../infra/repository/RideRepository";

export default class RequestRide {

    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) { }
    async execulte(input: any,) {
        const account = await this.accountRepository.getById(input.passengerId)
        if (account && !account.isPassenger ) throw Error("User is not a passenger")
        const activeRides = await this.rideRepository.getActiveRidesByPassengerId(input.passengerId)
        if (activeRides.length > 0) throw Error("There is no longer a ride for passengers")
        const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long)
        await this.rideRepository.save(ride)
        return { rideId: ride.rideId }
    }
}
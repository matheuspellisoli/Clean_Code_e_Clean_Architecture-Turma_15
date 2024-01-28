import AccountDAO from "./AccountDAO";
import RideDAO from "./RideDAO";

export default class GetRide {

    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) { }

    async execulte(rideId: string) {
        let ride = await this.rideDAO.getById(rideId)
        if (ride.passengerId) ride.passenger = await this.accountDAO.getById(ride.passengerId)
        if (ride.driverId) ride.driver = await this.accountDAO.getById(ride.driverId)
        return ride
    }
}
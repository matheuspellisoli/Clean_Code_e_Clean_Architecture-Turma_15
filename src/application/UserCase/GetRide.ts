import Account from "../../domain/Account";
import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {

    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) { }
    async execulte(rideId: string) {
        let outPut: any = {}
        let ride = await this.rideRepository.getById(rideId)
        if (!ride) throw new Error("Ride does nor exist")
        if (ride.passengerId) {
            const passenger = await this.accountRepository.getById(ride.passengerId)
            outPut.passenger = { accountId: passenger?.accountId, name: passenger?.name, email: passenger?.email }
        }
        const driverId = ride.getDriverId()
        if (driverId) {
            const driver = await this.accountRepository.getById(driverId)
            outPut.driver = { accountId: driver?.accountId, name: driver?.name, email: driver?.email }
        }

        return { ...ride, ...outPut }
    }
}
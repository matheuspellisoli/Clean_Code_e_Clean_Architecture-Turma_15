import Account from "../../domain/Account";
import AccountRepository from "../../infra/repository/AccountRepository";
import RideDAO from "../../infra/repository/RideRepository";

export default class GetRide {

    constructor(readonly accountRepository: AccountRepository, readonly rideDAO: RideDAO) { }
    async execulte(rideId: string) {
        let outPut: any = {}
        let ride = await this.rideDAO.getById(rideId)
        if(!ride) throw new Error("Ride does nor exist")
        const passenger = await this.accountRepository.getById(ride.passengerId)
        if(passenger){
            outPut.passenger = { accountId: passenger?.accountId, name: passenger?.name, email: passenger?.email}
        }
        if(ride.driverId){
            const driver = await this.accountRepository.getById(ride.driverId)
            outPut.driver = { accountId: driver?.accountId, name: driver?.name, email: driver?.email}
        }
        return {...ride, ...outPut}
    }
}
// import AccountRepository from "./AccountRepository";
// import RideRepository from "./RideRepository";
// import RideDAO from "./RideRepository";

// export default class AcceptRide {
//     constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) { }

//     async execulte(input: any) {
//         const driver = await this.accountRepository.getById(input.driverId);
//         if (driver && !driver.isDriver) throw new Error("To accept a ride you need to be a driver");
//         const rideNotComplet = await this.rideRepository.getActiveRidesByDriverId(input.driverId);
//         if (rideNotComplet) throw new Error("There are pending rides");
//         const ride = await this.rideRepository.getById(input.rideId);
//         if(!ride) throw new Error("Ride does nor exist")
//         if (ride.status != "requested") throw new Error("Ride not pending");
//         ride.toAccept(input.driverId)
        
//         await this.rideRepository.update(ride)
//     }
// }
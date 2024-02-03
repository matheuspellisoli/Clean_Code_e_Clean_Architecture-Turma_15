import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
    save(ride: Ride): Promise<void>
    getById(rideId: string): Promise<Ride | undefined>
    getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
    getActiveRidesByDriverId(driverId: string): Promise<Ride[]>;
}

export class RideRepositoryDatabase implements RideRepository {
    constructor(readonly connection: DatabaseConnection){}
    
    async save(ride: Ride): Promise<void> {
        await this.connection.query("INSERT INTO cccat15.ride (ride_id, passenger_id,  status, from_lat, from_long, to_lat, to_long, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8::timestamp);",
            [ride.rideId, ride.passengerId, ride.status, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
    }

    async getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]> {
        let activeRidesData = await this.connection.query("select * from cccat15.ride where passenger_id = $1 and status = 'requested'", passengerId).catch(e => { console.log(e) });
        const activeRides: Ride[] = []
        for (const activeRideData of activeRidesData) {
            activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, activeRideData.status, activeRideData.from_lat, activeRideData.from_long, activeRideData.to_lat, activeRideData.to_long, activeRideData.date, activeRideData.driver_id, activeRideData.fare, activeRideData.distance))
        }
        return activeRides;
    }

    async  getActiveRidesByDriverId(driverId: string): Promise<Ride[]> {
        let activeRidesData = await this.connection.query("select * from cccat15.ride where driver_id = $1 and status != 'completed'", driverId).catch(e => { console.log(e) });
        const activeRides: Ride[] = []
        for (const activeRideData of activeRidesData) {
            activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, activeRideData.status, activeRideData.from_lat, activeRideData.from_long, activeRideData.to_lat, activeRideData.to_long, activeRideData.date, activeRideData.driver_id, activeRideData.fare, activeRideData.distance))
        }
        return activeRides;
    }

    async getById(ride_id: string): Promise<any> {
        let [ride] = await this.connection.query("select * from cccat15.ride where ride_id = $1", ride_id).catch(e => { console.log(e) });
        if (!ride) return;
        return Ride.restore(ride.ride_id, ride.passenger_id, ride.status, ride.from_lat, ride.from_long, ride.to_lat, ride.to_long, ride.date, ride.driver_id, ride.fare, ride.distance)
    }
}

    // async update(ride: any): Promise<void> {
    //     const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
    //     await connection.query(`
    //     UPDATE cccat15.ride
    //     SET passenger_id='${ride.passengerId}'::uuid, 
    //     driver_id='${ride.driverId}', 
    //     status='${ride.status}', 
    //     fare=${ride.fare}, 
    //     distance=${ride.distance}, 
    //     from_lat=${ride.from.lat}, 
    //     from_long=${ride.from.long}, 
    //     to_lat=${ride.to.lat}, 
    //     to_long=${ride.to.long}
    //     WHERE ride_id='${ride.rideId}'::uuid;
    //     `).catch(e => { console.log(e) });
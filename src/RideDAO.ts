import { DateTime } from "luxon";
import pgPromise from "pg-promise";

export default interface RideDAO {
    save(ride: any): Promise<void>
    update(ride: any): Promise<void>
    getById(ride_id: string): Promise<any>
    getByPassengerIdAndNotCompleted(passengerId: string): Promise<any>
    getByDriverIdAndNotCompleted(driverId: string): Promise<any>
}


export class RideDAODatabase implements RideDAO {
    async update(ride: any): Promise<void> {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        await connection.query(`
        UPDATE cccat15.ride
        SET passenger_id='${ride.passengerId}'::uuid, 
        driver_id='${ride.driverId}', 
        status='${ride.status}', 
        fare=${ride.fare}, 
        distance=${ride.distance}, 
        from_lat=${ride.from.lat}, 
        from_long=${ride.from.long}, 
        to_lat=${ride.to.lat}, 
        to_long=${ride.to.long}
        WHERE ride_id='${ride.rideId}'::uuid;
        `).catch(e => { console.log(e) });

    }
    async getByDriverIdAndNotCompleted(driverId: string): Promise<any> {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        let [ride] = await connection.query("select * from cccat15.ride where driver_id = $1 and status != 'completed'", driverId).catch(e => { console.log(e) });
        await connection.$pool.end();
        if (ride)
            return {
                rideId: ride.ride_id, passengerId: ride.passenger_id, driverId: ride.driver_id, status: ride.status, fare: ride.fare, distance: ride.distance, from: !ride.from_lat ? null : { lat: ride.from_lat, long: ride.from_long }, to: !ride.to_lat ? null : { lat: ride.to_lat, long: ride.to_long }, date: new Date(ride.date)
            }
        return undefined
    }
    async getByPassengerIdAndNotCompleted(passengerId: string): Promise<any> {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        let [ride] = await connection.query("select * from cccat15.ride where passenger_id = $1 and status != 'completed'", passengerId).catch(e => { console.log(e) });
        await connection.$pool.end();
        if (ride)
            return {
                rideId: ride.ride_id, passengerId: ride.passenger_id, driverId: ride.driver_id, status: ride.status, fare: ride.fare, distance: ride.distance, from: !ride.from_lat ? null : { lat: ride.from_lat, long: ride.from_long }, to: !ride.to_lat ? null : { lat: ride.to_lat, long: ride.to_long }, date: new Date(ride.date)
            }
        return undefined
    }
    async save(ride: any): Promise<void> {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        await connection.query("INSERT INTO cccat15.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::timestamp);",
            [ride.id, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.from.lat, ride.from.long, ride.to.lat, ride.to.long, ride.date]);
        await connection.$pool.end();
    }
    async getById(ride_id: string): Promise<any> {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        let [ride] = await connection.query("select * from cccat15.ride where ride_id = $1 and status != 'completed'", ride_id).catch(e => { console.log(e) });
        
        if (ride)
            return {
                rideId: ride.ride_id, passengerId: ride.passenger_id, driverId: ride.driver_id, status: ride.status, fare: ride.fare, distance: ride.distance, from: !ride.from_lat ? null : { lat: ride.from_lat, long: ride.from_long }, to: !ride.to_lat ? null : { lat: ride.to_lat, long: ride.to_long }, date: new Date(ride.date)
            }
        return undefined
    }
}


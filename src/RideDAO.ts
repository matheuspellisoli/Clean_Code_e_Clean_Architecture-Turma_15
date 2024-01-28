import pgPromise from "pg-promise";

export default interface RideDAO {
    save(ride: any): Promise<void>
    getById(ride_id: string): Promise<any>
    getByPassengerIdAndNotCompleted(passengerId: string): Promise<any>
}


export class RideDAODatabase implements RideDAO{
    async getByPassengerIdAndNotCompleted(passengerId: string): Promise<any> {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        let [ride] = await connection.query("select * from cccat15.ride where passenger_id = $1 and status != 'completed'", passengerId).catch(e => { console.log(e) });
        await connection.$pool.end();
        return ride 
    }
    async save(ride: any): Promise<void> {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        await connection.query("INSERT INTO cccat15.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::timestamp);",
         [ride.id, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.from.lat, ride.from.long, ride.to.lat, ride.to.long, ride.date]);
        await connection.$pool.end();
    }
    async getById(ride_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}


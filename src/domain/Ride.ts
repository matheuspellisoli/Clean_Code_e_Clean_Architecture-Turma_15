import crypto from "crypto"

export default class Ride {
    
    private constructor(readonly rideId: string, readonly passengerId: string, readonly status: string,
        readonly fromLat: number, readonly fromLong: number, readonly toLat: number, readonly toLong: number, readonly date: Date, readonly driverId: string | undefined, readonly fare: number | undefined, readonly distance: number| undefined ) {

    }

    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const status = "requested"
        const date = new Date()
        return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date, undefined, undefined, undefined)
    }

    static restore(rideId: string, passengerId: string, status: string,
        fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date,  driverId?: string, fare?: number, distance?: number) {
        return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date, driverId, fare, distance)
    }
}

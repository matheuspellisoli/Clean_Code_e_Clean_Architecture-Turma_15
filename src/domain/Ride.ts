import crypto from "crypto"

export default class Ride {

    private constructor(readonly rideId: string, readonly passengerId: string, private status: string,
        readonly fromLat: number, readonly fromLong: number, readonly toLat: number, readonly toLong: number, readonly date: Date, private driverId: string | undefined, readonly fare: number | undefined, readonly distance: number | undefined) {

    }

    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const status = "requested"
        const date = new Date()
        return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date, undefined, undefined, undefined)
    }

    static restore(rideId: string, passengerId: string, status: string,
        fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date, driverId?: string, fare?: number, distance?: number) {
        return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date, driverId, fare, distance)
    }

    public accept(driverId: string) {
        if (this.status != "requested") throw new Error("Ride not pending");
        this.status = "accepted"
        this.driverId = driverId;
    }

    public start() {
        if (this.status != "accepted") throw new Error("Ride not accepted");
        this.status = "in_progress"
    }
    public getStatus(): string {
        return this.status;
    }

    public getDriverId(): string | undefined {
        return this.driverId;
    }
}

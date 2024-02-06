import GetAccount from "../../application/UserCase/GetAccount";
import GetRide from "../../application/UserCase/GetRide";
import { HttpServer } from "./HttpServer";
import RequestRide from "../../application/UserCase/RequestRide";
import { Signup } from "../../application/UserCase/Signup";
import AcceptRide from "../../application/UserCase/AcceptRide";
import StartRide from "../../application/UserCase/StartRide";

export class MainController {

    constructor(httpServer: HttpServer, signup: Signup, getAccount: GetAccount, requestRide: RequestRide, getRide: GetRide, acceptRide: AcceptRide, startRide: StartRide) {
        httpServer.register("get", '/', async function (_params: any, body: any) {
            return "Turma 15"
        })
        httpServer.register("post", '/accounts', async function (_params: any, body: any) {
            return await signup.execulte(body)
        })

        httpServer.register("get", '/accounts/:accountId', async function (params: any, body: any) {
            return await getAccount.execulte(params.accountId)
        })

        httpServer.register("post", '/rides', async function (_params: any, body: any) {
            return await requestRide.execulte(body)
        })

        httpServer.register("get", '/rides/:rideId', async function (params: any, body: any) {
            return await getRide.execulte(params.rideId)
        })

        httpServer.register("put", '/rides/:rideId/accept', async function (params: any, body: any) {
            return await acceptRide.execulte(params.rideId, body)
        })

        httpServer.register("put", '/rides/:rideId/start', async function (params: any, body: any) {
            return await startRide.execulte(params.rideId, body)
        })
    }
}
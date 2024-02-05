import GetAccount from "../../application/UserCase/GetAccount";
import GetRide from "../../application/UserCase/GetRide";
import { HttpServer } from "./HttpServer";
import RequestRide from "../../application/UserCase/RequestRide";
import { Signup } from "../../application/UserCase/Signup";

export class MainController {

    constructor(httpServer: HttpServer, signup: Signup, getAccount: GetAccount, requestRide: RequestRide, getRide: GetRide) {
        httpServer.register("get", '/', async function (params: any, body: any) {
            return "Turma 15"
        })
        httpServer.register("post", '/accounts', async function (params: any, body: any) {
            return await signup.execulte(body)
        })

        httpServer.register("get", '/accounts/:accountId', async function (params: any, body: any) {
            return await getAccount.execulte(params.accountId)
        })

        httpServer.register("post", '/rides', async function (params: any, body: any) {
            return await requestRide.execulte(body)
        })

        httpServer.register("get", '/rides/:rideId', async function (params: any, body: any) {
            return await getRide.execulte(params.rideId)
        })
    }
}
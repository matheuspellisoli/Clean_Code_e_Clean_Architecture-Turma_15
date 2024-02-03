import { Request, Response } from "express"
import { Signup } from "./application/UserCase/Signup"
import GetAccount from "./application/UserCase/GetAccount"
import RequestRide from "./application/UserCase/RequestRide"
import dotenv from "dotenv";
import path from "path";
import GetRide from "./application/UserCase/GetRide"
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";
import DatabaseConnection, { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { MainController } from "./infra/http/MainController";
import { ExpressAdapter, HttpServer } from "./infra/http/HttpServer";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const connection: DatabaseConnection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const rideRepository = new RideRepositoryDatabase(connection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)
const requestRide = new RequestRide(accountRepository, rideRepository)
const getRide = new GetRide(accountRepository, rideRepository)
const httpServer: HttpServer = new ExpressAdapter()
new  MainController(httpServer, signup, getAccount, requestRide, getRide)
httpServer.listen(8081)


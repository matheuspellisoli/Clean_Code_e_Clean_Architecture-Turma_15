import { Request, Response } from "express"
import { Signup } from "./Signup"
import { AccountDAODatabase } from "./AccountDAO"
import GetAccount from "./GetAccount"
import RequestRide from "./RequestRide"
import { RideDAODatabase } from "./RideDAO"
import dotenv from "dotenv";
import path from "path";
import GetRide from "./GetRide"
import AcceptRide from "./AcceptRide"
import StartRide from "./StartRide"

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 8081
app.use(bodyParser.json())
const accountDAO = new AccountDAODatabase()
const rideDAO = new RideDAODatabase()
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)
const requestRide = new RequestRide(accountDAO, rideDAO)
const getRide = new GetRide(accountDAO, rideDAO)
const acceptRide = new AcceptRide(accountDAO, rideDAO)
const startRide = new StartRide(accountDAO, rideDAO)

app.get('/', async function (req: Request, res: Response) {
  res.status(200).send("Turma 15")
})

app.post('/accounts', async function (req: Request, res: Response) {
  try {
    const account = await signup.execulte(req.body)
    res.status(201).send(account)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})


app.get('/accounts/:accountId', async function (req: Request, res: Response) {
  try {
    const account = await getAccount.execulte(req.params.accountId)
    res.status(200).send(account)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

app.post('/rides', async function (req: Request, res: Response) {
  try {
    const ride = await requestRide.execulte(req.body)
    res.status(201).send(ride)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

app.get('/rides/:rideId', async function (req: Request, res: Response) {
  try {
    const account = await getRide.execulte(req.params.rideId)
    res.status(200).send(account)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})


app.put('/rides/accept', async function (req: Request, res: Response) {
  try {
    await acceptRide.execulte(req.body)
    res.status(200).send()
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})


app.put('/rides/start', async function (req: Request, res: Response) {
  try {
    await startRide.execulte(req.body)
    res.status(200).send()
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

app.listen(port, () => {
  console.log(`APP listening on port ${port}`)
})
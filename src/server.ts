import { Request, Response } from "express"
import { Signup } from "./Signup"
import { AccountDAODatabase } from "./AccountDAO"
import GetAccount from "./GetAccount"

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 8081
app.use(bodyParser.json())
const accountDAO = new AccountDAODatabase()
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)

app.get('/', async function (req: Request, res: Response) {
  res.status(200).send("Turma 15")
})

app.post('/accounts', async function (req: Request, res: Response) {
  try {
    const account = await signup.execulte(req.body)
    res.status(201).send(account)
  } catch (err) {
    res.status(400).send(err)
  }
})


app.get('/accounts/:accountId', async function (req: Request, res: Response) {
  try {
    const account = await getAccount.execulte(req.params.accountId)
    res.status(200).send(account)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.listen(port, () => {
  console.log(`APP listening on port ${port}`)
})
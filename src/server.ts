import { Request, Response } from "express"
import { signup } from "./signup"
import { getAccount } from "./getAccount"

const bodyParser = require('body-parser')
const express = require('express')
var app = express()

app.use(bodyParser.json())
app.post('/accounts', async function (req: Request, res: Response) {
  const account = await signup(req.body)
  res.status(201).send(account)
})


app.get('/accounts/:accountId', async function (req: Request, res: Response) {
  const account = await getAccount(req.params.accountId)
  res.status(200).send(account)
})

app.listen(8081)
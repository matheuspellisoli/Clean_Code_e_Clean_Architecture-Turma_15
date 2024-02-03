import axios from "axios"
import crypto from "crypto";

test("Deve testar se cria uma conta de passageiro com sucesso", async () => {
    const email = `jose${crypto.randomUUID()}@teste.com.br`
    const input = {
        "name": "Carlos Silva",
        "email": email,
        "cpf": "840.862.960-39",
        "isPassenger": true,
        "isDriver": false
    }

    const account = await axios.post('http://localhost:8081/accounts', input)
    const accountId = account.data.accountId
    const response = await axios.get(`http://localhost:8081/accounts/${accountId}`)
    const output = response.data
    expect(output.name).toBe("Carlos Silva")
    expect(output.cpf).toBe("840.862.960-39")
    expect(output.email).toBe(email)
    expect(output.isDriver).toBe(false)
    expect(output.isPassenger).toBe(true)
})

test("Deve criar uma conta de motorista", async () => {
    const email = `jose${crypto.randomUUID()}@teste.com.br`
    const input = {
        "name": "Carlos Silva",
        "email": email,
        "cpf": "840.862.960-39",
        "isPassenger": false,
        "isDriver": true,
        "carPlate": "JYV2601"
    }

    const account = await axios.post('http://localhost:8081/accounts', input)
    const accountId = account.data.accountId
    const response = await axios.get(`http://localhost:8081/accounts/${accountId}`)
    const output = response.data
    expect(output.name).toBe("Carlos Silva")
    expect(output.cpf).toBe("840.862.960-39")
    expect(output.email).toBe(email)
    expect(output.isDriver).toBe(true)
    expect(output.isPassenger).toBe(false)
    expect(output.carPlate).toBe("JYV2601")
})

test("Deve testar se não cria uma conta quando ja existe um conta com o mesmo email", async () => {
    const email = `jose${crypto.randomUUID()}@teste.com.br`
    const input = {
        "name": "Carlos Silva",
        "email": email,
        "cpf": "840.862.960-39",
        "isPassenger": false,
        "isDriver": true,
        "carPlate": "JYV2601"
    }

    await axios.post('http://localhost:8081/accounts', input)
    await expect(async () => { await await axios.post('http://localhost:8081/accounts', input) }).rejects.toThrow(new Error("Request failed with status code 422"))

})



test("Deve testar se cria uma viagem com sucesso", async () => {
    const email = `jose${crypto.randomUUID()}@teste.com.br`
    const inputAccount = {
        "name": "Carlos Silva",
        "email": email,
        "cpf": "840.862.960-39",
        "isPassenger": true,
        "isDriver": false
    }

    const account = await axios.post('http://localhost:8081/accounts', inputAccount)
    const accountId = account.data.accountId

    const inputRide = {
        "passengerId": accountId,
        "from": {
            "lat":-30.0495304,
            "long": -51.2313074
        },
        "to": {
            "lat": -30.0802953,
            "long": -51.2215673
        }
    }

    const ride = await axios.post('http://localhost:8081/rides', inputRide)
    const rideId = ride.data.rideId

    const response = await axios.get(`http://localhost:8081/rides/${rideId}`)
    const output = response.data
    expect(output.passengerId).toBe(accountId)
    expect(output.status).toBe("requested")
    expect(output.fromLat).toBe("-30.0495304")
    expect(output.fromLong).toBe("-51.2313074")
    expect(output.toLat).toBe("-30.0802953")
    expect(output.toLong).toBe("-51.2215673")
    expect(output.passenger.accountId).toBe(accountId)
    expect(output.passenger.name).toBe("Carlos Silva")
    expect(output.passenger.email).toBe(email)
})
import pgPromise from "pg-promise";

export default interface AccountDAO {
    save(account: any): Promise<void>
    getByEmail(email: string): Promise<any>
    getById(id: string): Promise<any>
}


export class AccountDAODatabase implements AccountDAO {
    async save(account: any) {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        await connection.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.id, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
        await connection.$pool.end();

    }

    async getByEmail(email: string) {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        let [account] = await connection.query("select * from cccat15.account where email = $1", email).catch(e => { console.log(e) });
        await connection.$pool.end();
        if (account) {
            return { accountId: account.account_id, name: account.name, email: account.email, cpf: account.cpf, carPlate: account.car_plate, isPassenger: account.is_passenger, isDriver: account.is_driver }
        }
        return undefined
    }

    async getById(id: string) {
        const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
        let [account] = await connection.query("select * from cccat15.account where account_id = $1", id).catch(e => { console.log(e) });
        await connection.$pool.end();
        if (account) {
            return { accountId: account.account_id, name: account.name, email: account.email, cpf: account.cpf, carPlate: account.car_plate, isPassenger: account.is_passenger, isDriver: account.is_driver }
        }
        return undefined
    }
}
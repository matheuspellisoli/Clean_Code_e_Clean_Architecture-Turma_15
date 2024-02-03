import pgPromise from "pg-promise";

export default interface DatabaseConnection {
    query(statement: string, params: any): Promise<any>
    close(): Promise<any>
}


export class PgPromiseAdapter implements DatabaseConnection {
    readonly connection: any

    constructor() {
        this.connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
    }

    async query(statement: string, params: any): Promise<any> {
        return await this.connection.query(statement, params)
    }

    async close(): Promise<any> {
        return await this.connection.$pool.end();
    }
}
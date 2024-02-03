import express from 'express'

export interface HttpServer {
    listen(port: number): void
    register(method: string, url: string, callback: Function): void;
}

export class ExpressAdapter implements HttpServer {
    app: any

    constructor() {
        this.app = express()
        this.app.use(express.json())
    }

    listen(port: number): void {
        this.app.listen(port)
    }

    register(method: string, url: string, callback: Function): void {
        this.app[method](url, async function (req: any, res: any) {
            try {
                const output = await callback(req.params, req.body)
                res.status(200).json(output)
            } catch (e: any) {
                res.status(422).json({message: e.message})
            }
        })
    }

}
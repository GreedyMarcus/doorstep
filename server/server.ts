import express, { Request, Response } from 'express'
import cors from 'cors'
import config from './config'
import { createConnection } from 'typeorm'

class Server {
  private app: express.Application
  private port: number
  private env: string

  constructor() {
    createConnection()

    this.app = express()
    this.port = config.PORT
    this.env = config.NODE_ENV
  }

  configure() {
    this.app.use(
      cors({
        origin: true,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )
    this.app.use(express.json())

    this.app.get('/', (req: Request, res: Response) => res.send('Doorstep'))
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server running in ${this.env} mode on port ${this.port}!`)
    })
  }
}

export default Server

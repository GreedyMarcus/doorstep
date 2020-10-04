import express from 'express'
import cors from 'cors'
import config from './config'
import apiRouter from './routes'
import { createConnection } from 'typeorm'
const ormconfig = require('./ormconfig')

class Server {
  private app: express.Application
  private port: number
  private env: string

  constructor() {
    this.app = express()
    this.port = config.port
    this.env = config.env
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
    this.app.use('/api', apiRouter)
  }

  start() {
    createConnection(ormconfig)
      .then(() => {
        this.app.listen(this.port, () => {
          console.log(`Server running in ${this.env} mode on port ${this.port}!`)
        })
      })
      .catch(error => console.log(error))
  }
}

export default Server

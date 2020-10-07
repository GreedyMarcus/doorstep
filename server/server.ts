const ormconfig = require('./ormconfig')
import express from 'express'
import cors from 'cors'
import config from './config'
import apiRouter from './routes'
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware'
import { createConnection } from 'typeorm'

class Server {
  private app: express.Application
  private port: number
  private env: string

  constructor() {
    this.app = express()
    this.port = config.server.port
    this.env = config.server.env
  }

  public configure() {
    this.app.use(
      cors({
        origin: true,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )
    this.app.use(express.json())
    this.app.use('/api', apiRouter)
    this.app.use(errorHandlerMiddleware)
  }

  public start() {
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

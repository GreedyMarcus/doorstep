import express, { Request, Response } from 'express'
import cors from 'cors'
import config from './config'
import ormconfig from './ormconfig'
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

    // Server static assets in production
    if (config.server.env === 'production') {
      this.app.use(express.static(__dirname.replace('build/server', 'client/build')))
      this.app.get('*', (req: Request, res: Response) => {
        res.sendFile(__dirname.replace('build/server', 'client/build/index.html'))
      })
    }

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

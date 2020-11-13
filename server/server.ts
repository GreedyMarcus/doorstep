import express, { Request, Response } from 'express'
import cors from 'cors'
import config from './config'
import ormconfig from './ormconfig'
import apiRouter from './routes'
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware'
import { createConnection } from 'typeorm'
import { isProduction } from './utils'

class Server {
  private app: express.Application
  private port: number
  private env: string

  constructor() {
    this.app = express()
    this.port = config.server.port
    this.env = config.server.env
  }

  /**
   * Configures the different middlewares and routes for the Express application.
   */
  public configure(): void {
    this.app.use(
      cors({
        origin: true,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )
    this.app.use(express.json())
    this.app.use('/api', apiRouter)

    // Serve static assets in production
    if (isProduction()) {
      this.app.use(express.static(__dirname.replace('build/server', 'client/build')))
      this.app.get('*', (req: Request, res: Response) => {
        res.sendFile(__dirname.replace('build/server', 'client/build/index.html'))
      })
    }

    this.app.use(errorHandlerMiddleware)
  }

  /**
   * Starts the Express application.
   */
  public start(): void {
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

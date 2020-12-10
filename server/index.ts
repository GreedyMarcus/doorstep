import 'reflect-metadata'
import Server from './server'

// Create a new server instance and start it.
const server = new Server()
server.configure()
server.start()

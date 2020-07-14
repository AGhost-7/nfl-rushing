import http from "http"
import objection from "objection"
import knex from "./knex.js"
import Koa from "koa"
import createRoutes from "./routes/index.js"
import bodyParser from "koa-bodyparser"

class Server {
  constructor(config) {
    this.config = config
  }

  _startServer(app) {
    return new Promise((resolve) => {
      this._server = http.createServer(app.callback())
      const address = this._server.listen(this.config.port, "0.0.0.0", () => {
        resolve(address)
      })
    })
  }

  _stopServer() {
    return new Promise((resolve) => {
      if (this._server) {
        this._server.close(() => resolve())
      } else {
        resolve()
      }
    })
  }

  async start() {
    objection.Model.knex(knex)

    if (!knex.client.pool) {
      await knex.initialize()
    }
    // wait for db connection to be established before accepting connections
    await knex.raw("select 1")

    const app = new Koa()

    this._app = app

    app.use(bodyParser())
    const routes = createRoutes(this.config)
    app.use(routes.routes(), routes.allowedMethods())

    return this._startServer(app)
  }

  async stop() {
    await this._stopServer()
    await knex.destroy()
  }
}

export default Server

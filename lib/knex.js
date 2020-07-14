import objection from "objection"
import Knex from "knex"
import config from "./config.js"

export default Knex({
  ...config.db,
  ...objection.knexSnakeCaseMappers(),
})

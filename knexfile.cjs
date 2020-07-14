/**
 * Configuration used by the knex command line tool. Unfortunately
 * esm doesnt seem to work properly so falling back to commonjs.
 */

module.exports = async () => {
  const config = await import("./lib/config.js")
  return config.default.db
}

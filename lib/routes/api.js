import csvStringify from "csv-stringify"
import Player from "../models/player.js"
import Router from "@koa/router"
import { Transform } from "stream"

async function listPlayers(ctx) {
  const page = Number(ctx.query.page) || 1
  const sorts = [].concat(ctx.query.sort || "totalRushingYards")
  const orders = [].concat(ctx.query.order || "desc")
  const query = Player.query()

  if (isNaN(page) || page < 1 || Math.floor(page) !== page) {
    ctx.status = 400
    return
  }

  for (let i = 0; i < sorts.length; i++) {
    const sort = sorts[i]
    const order = orders[i]

    if (!["desc", "asc"].includes(order)) {
      ctx.status = 400
      return
    }

    switch (sort) {
      case "totalRushingYards":
      case "longestRush":
      case "longestRushTouchdown":
      case "totalRushingTouchdowns":
        query.orderBy(sort, order)
        break
      default:
        ctx.status = 400
        return
    }
  }

  query.offset(page * 20)
  query.limit(20)

  ctx.body = await query
}

async function exportPlayers(ctx) {
  const mappings = [
    ["player", "Player"],
    ["team", "Team"],
    ["position", "Position"],
    ["rushing_attempts_per_game_average", "Rushing Attempts Per Game Average"],
    ["rushing_attempts", "Rushing Attempts"],
    ["total_rushing_yards", "Total Rushing Yards"],
    ["rushing_average_yards_per_attempt", "Rushing Average Yards Per Attempt"],
    ["rushing_yards_per_game", "Rushing Yards Per Game"],
    ["total_rushing_touchdowns", "Total Rushing Touchdowns"],
    ["longest_rush", "Longest Rush"],
    ["longest_rush_touchdown", "Longest Rush Touchdown"],
    ["rushing_first_downs", "Rushing First Downs"],
    ["rushing_first_down_percentage", "Rushing First Down Percentage"],
    ["rushing_twenty_yards_each", "Rushing 20 Yards Each"],
    ["rushing_forty_yards_each", "Rushing 40 Yards Each"],
    ["rushing_fumbles", "Rushing Fumbles"],
  ]

  const dbStream = Player.query().toKnexQuery().stream()
  const transform = new Transform({ objectMode: true, highWaterMark: 100 })
  transform._transform = (data, encoding, callback) => {
    const row = mappings.map((mapping) => data[mapping[0]])
    callback(null, row)
  }
  const csvStream = csvStringify({
    header: true,
    columns: mappings.map((mapping) => mapping[1]),
  })

  dbStream.pipe(transform)
  transform.pipe(csvStream)
  ctx.body = csvStream
  ctx.set("Content-Disposition", 'attachment; filename="export.csv"')
}

export default (config, router) => {
  const apiRouter = new Router()

  apiRouter.get("/players", listPlayers)
  apiRouter.get("/players/export", exportPlayers)
  router.use("/api", apiRouter.routes(), apiRouter.allowedMethods())
}

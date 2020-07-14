const assert = require("assert")
const data = require("../../rushing")

/*
 * `Player` (Player's name)
 * `Team` (Player's team abbreviation)
 * `Pos` (Player's postion)
 * `Att/G` (Rushing Attempts Per Game Average)
 * `Att` (Rushing Attempts)
 * `Yds` (Total Rushing Yards)
 * `Avg` (Rushing Average Yards Per Attempt)
 * `Yds/G` (Rushing Yards Per Game)
 * `TD` (Total Rushing Touchdowns)
 * `Lng` (Longest Rush -- a `T` represents a touchdown occurred)
 * `1st` (Rushing First Downs)
 * `1st%` (Rushing First Down Percentage)
 * `20+` (Rushing 20+ Yards Each)
 * `40+` (Rushing 40+ Yards Each)
 * `FUM` (Rushing Fumbles)
 */

const number = (input) => {
  if (typeof input === "number") return input
  const result = Number(input.replace(/,/g, ""))
  assert(!isNaN(result))
  return result
}

const integer = (input) => {
  const result = number(input)
  assert.equal(Math.floor(result), result)
  return result
}

const decimal = number

exports.seed = async function (knex) {
  await knex("player").del()
  const rows = data.map((item) => {
    const match = /^(\d+)(T)?$/.exec(item["Lng"])
    return {
      player: item["Player"],
      team: item["Team"],
      position: item["Pos"],
      rushing_attempts_per_game_average: decimal(item["Att/G"]),
      rushing_attempts: integer(item["Att"]),
      total_rushing_yards: integer(item["Yds"]),
      rushing_average_yards_per_attempt: decimal(item["Avg"]),
      rushing_yards_per_game: decimal(item["Yds/G"]),
      total_rushing_touchdowns: integer(item["TD"]),
      longest_rush: match ? integer(match[1]) : item["Lng"],
      longest_rush_touchdown: match && match[2] === "T",
      rushing_first_downs: integer(item["1st"]),
      rushing_first_down_percentage: decimal(item["1st%"]),
      rushing_twenty_yards_each: integer(item["20+"]),
      rushing_forty_yards_each: integer(item["40+"]),
      rushing_fumbles: integer(item["FUM"]),
    }
  })
  await knex("player").insert(rows)
}

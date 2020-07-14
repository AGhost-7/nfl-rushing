exports.up = async function (knex) {
  await knex.schema.createTable("player", (table) => {
    table.text("player").primary()
    table.text("team")
    table.text("position")
    table.decimal("rushing_attempts_per_game_average")
    table.integer("rushing_attempts")
    table.integer("total_rushing_yards")
    table.decimal("rushing_average_yards_per_attempt")
    table.decimal("rushing_yards_per_game")
    table.integer("total_rushing_touchdowns")
    table.integer("longest_rush")
    table.boolean("longest_rush_touchdown")
    table.integer("rushing_first_downs")
    table.decimal("rushing_first_down_percentage")
    table.integer("rushing_twenty_yards_each")
    table.integer("rushing_forty_yards_each")
    table.integer("rushing_fumbles")
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("player")
}

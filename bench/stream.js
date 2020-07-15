/**
 * Benchmark generates ten million records which can be used to test the
 * CSV export.
 */

import crypto from 'crypto'
import Player from '../lib/models/player.js'
import objection from 'objection'
import knex from '../lib/knex.js'

objection.Model.knex(knex)
;(async () => {
  const template = (await Player.query().limit(1))[0].$toJson()
  for (let times = 0; times < 10000; times++) {
    const rows = Array.from(Array(1000), () =>
      Object.assign({}, template, {
        player: crypto.randomBytes(16).toString('hex'),
      })
    )
    await Player.query().insert(rows)
  }
})().then(
  () => {
    process.exit(0)
  },
  (err) => {
    console.error(err)
    process.exit(1)
  }
)

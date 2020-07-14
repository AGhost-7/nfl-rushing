#!/usr/bin/env node

/**
 * Main for the backend.
 */

import config from "../lib/config.js"
import Server from "../lib/server.js"

const server = new Server(config)

;(async () => {
  const socket = await server.start()
  console.log("listening on %s.", socket.address().port)
})()

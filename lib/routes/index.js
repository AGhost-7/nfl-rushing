import Router from '@koa/router'

import createApi from './api.js'

export default (config) => {
  const router = new Router()
  createApi(config, router)

  return router
}

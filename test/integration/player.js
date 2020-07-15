import assert from 'assert'
import supertest from 'supertest'
import config from '../../lib/config.js'
import Server from '../../lib/server.js'

describe('integration#player', () => {
  const server = new Server(config)
  let address, agent

  before(async () => {
    address = await server.start()
    agent = supertest.agent(address)
  })
  after(() => server.stop())

  describe('list', () => {
    const assertDescending = (records, key) => {
      for (let i = 0; i < records.length - 1; i++) {
        assert(records[i][key] >= records[i + 1][key])
      }
    }

    it('returns a list of players', async () => {
      const response = await agent.get('/api/players').expect(200)

      assert(Array.isArray(response.body))
      assert.equal(response.body.length, 20)
      assertDescending(response.body, 'totalRushingYards')
    })

    it('sorts', async () => {
      const response = await agent
        .get('/api/players?sort=longestRush&order=desc')
        .expect(200)
      assertDescending(response.body, 'longestRush')
    })

    it('allows sorting on multiple fields', async () => {
      const response = await agent
        .get(
          '/api/players?sort=longestRush&sort=longestRushTouchdown&order=desc&order=desc'
        )
        .expect(200)
      assertDescending(response.body, 'longestRush')
    })

    it('handles different pages', async () => {
      const { body: pageOne } = await agent.get('/api/players').expect(200)
      const { body: pageTwo } = await agent
        .get('/api/players?page=2')
        .expect(200)

      for (const pageOneItem of pageOne) {
        const match = pageTwo.find(
          (pageTwoItem) => pageTwoItem.player === pageOneItem.player
        )
        assert(!match, `${match && match.player} is in both pages`)
      }
    })
  })

  describe('export', () => {
    let data
    before('fetch csv', async () => {
      const response = await agent.get('/api/players/export').expect(200)
      data = response.body.toString()
    })

    it('contains the headers', () => {
      const lines = data.split('\n')
      assert(lines[0].includes('Player'))
    })

    it('contains player names', () => {
      assert(/Johnny/.test(data))
    })
  })
})

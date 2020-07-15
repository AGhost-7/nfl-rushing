import objection from 'objection'

export default class Player extends objection.Model {
  static get tableName() {
    return 'player'
  }
  static get idColumn() {
    return 'player'
  }
}

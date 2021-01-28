'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DemoUserSchema extends Schema {
  up () {
    this.create('demo_users', (table) => {
      table.increments()
      table.string('device_id', 100)
      table.timestamps()
    })
  }

  down () {
    this.drop('demo_users')
  }
}

module.exports = DemoUserSchema

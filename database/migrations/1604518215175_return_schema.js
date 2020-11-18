'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReturnSchema extends Schema {
  up () {
    this.create('returns', (table) => {
      table.increments()
      table.integer('order_id').unsigned().unique()
      table.integer('user_id').unsigned()
      table.string('reason').notNullable()
      table.string('description')
      table.string('status').notNullable()
      table.integer('action') //1=refund 2=replacement
      table.string('action_status').notNullable().default('Processing')
      table.foreign('order_id').references('orders.id').onDelete('cascade')
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('returns')
  }
}

module.exports = ReturnSchema

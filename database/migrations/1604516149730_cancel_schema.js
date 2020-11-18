'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CancelSchema extends Schema {
  up () {
    this.create('cancels', (table) => {
      table.increments()
      table.integer('order_id').unsigned().unique()
      table.integer('user_id').unsigned()
      table.string('reason').notNullable()
      table.string('description')
      table.foreign('order_id').references('orders.id').onDelete('cascade')
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('cancels')
  }
}

module.exports = CancelSchema

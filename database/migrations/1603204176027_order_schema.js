'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.integer('address_id').unsigned()
      table.string('payment_mode').notNullable()
      table.string('payment_status').notNullable()
      table.string('status')
      table.integer('pending').default(0)
      table.float('amount').notNullable()
      table.string('order_uid').unique().notNullable()
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.foreign('address_id').references('addresses.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrderSchema

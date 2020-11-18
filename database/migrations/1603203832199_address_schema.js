'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('pin', 6).notNullable()
      table.string('add_1').notNullable()
      table.string('add_2')
      table.string('landmark')
      table.string('name').notNullable()
      table.string('phone', 10).notNullable()
      table.string('alt_phone', 10)
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressSchema

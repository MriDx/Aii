'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PincodeSchema extends Schema {
  up () {
    this.create('pincodes', (table) => {
      table.increments()
      table.string('pin').notNullable().unique()
      table.string('address')
      table.timestamps()
    })
  }

  down () {
    this.drop('pincodes')
  }
}

module.exports = PincodeSchema

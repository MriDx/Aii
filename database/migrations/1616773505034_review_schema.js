'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReviewSchema extends Schema {
  up () {
    this.table('reviews', (table) => {
      // alter table
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id')
    })
  }

  down () {
    this.table('reviews', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ReviewSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StockSchema extends Schema {
  up () {
    this.table('stocks', (table) => {
      // alter table
      table.integer('category_id').unsigned()
      table.foreign("category_id").references("categories.id").onDelete('cascade')
    })
  }

  down () {
    this.table('stocks', (table) => {
      // reverse alternations
    })
  }
}

module.exports = StockSchema

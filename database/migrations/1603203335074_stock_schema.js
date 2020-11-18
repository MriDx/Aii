'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StockSchema extends Schema {
  up () {
    this.create('stocks', (table) => {
      table.increments()
      table.integer('product_id').unsigned()
      table.foreign("product_id").references("products.id").onDelete('cascade')
      table.integer('size_id').unsigned()
      table.foreign('size_id').references("sizes.id").onDelete('cascade')
      table.integer('stock').unsigned()
      table.float('price')
      table.float('mrp')
      table.float('discount')
      table.timestamps()
    })
  }

  down () {
    this.drop('stocks')
  }
}

module.exports = StockSchema

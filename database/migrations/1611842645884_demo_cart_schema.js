'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DemoCartSchema extends Schema {
  up () {
    this.create('demo_carts', (table) => {
      table.increments()
      table.integer('demo_id').unsigned()
      table.integer('product_id').unsigned()
      table.integer('size_id').unsigned()
      table.integer('qty').unsigned()
      table.string('status')
      table.foreign('demo_id').references('demo_users.id').onDelete('cascade')
      table.foreign('product_id').references('products.id').onDelete('cascade')
      table.foreign('size_id').references('sizes.id').onDelete('cascade')
      table.integer('stock_id').unsigned()
      table.foreign('stock_id').references('stocks.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('demo_carts')
  }
}

module.exports = DemoCartSchema

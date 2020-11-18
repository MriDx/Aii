'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CartSchema extends Schema {
  up () {
    this.create('carts', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.integer('product_id').unsigned()
      table.integer('size_id').unsigned()
      table.integer('qty').unsigned()
      table.string('status')
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.foreign('product_id').references('products.id').onDelete('cascade')
      table.foreign('size_id').references('sizes.id').onDelete('cascade')
      table.integer('stock_id').unsigned()
      table.foreign('stock_id').references('stocks.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('carts')
  }
}

module.exports = CartSchema

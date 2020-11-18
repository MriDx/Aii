'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderItemSchema extends Schema {
  up () {
    this.create('order_items', (table) => {
      table.increments()
      table.integer('order_id').unsigned()
      table.integer('product_id').unsigned()
      table.integer('size_id').unsigned()
      table.float('price')
      table.float('mrp')
      table.foreign('order_id').references('orders.id').onDelete('cascade')
      table.foreign('product_id').references('products.id').onDelete('cascade')
      table.foreign('size_id').references('sizes.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('order_items')
  }
}

module.exports = OrderItemSchema

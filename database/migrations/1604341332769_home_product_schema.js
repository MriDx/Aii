'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HomeProductSchema extends Schema {
  up () {
    this.create('home_products', (table) => {
      table.increments()
      table.integer('product_id').unsigned().unique()
      table.foreign('product_id').references('products.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('home_products')
  }
}

module.exports = HomeProductSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('color')
      table.string('stock')
      table.integer('category_id').unsigned()
      table.foreign('category_id').references('categories.id')
      table.string("brand_name")
      table.string('tags')
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema

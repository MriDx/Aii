'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductDescriptionSchema extends Schema {
  up () {
    this.create('product_descriptions', (table) => {
      table.increments()
      table.integer('product_id').unique().unsigned()
      table.string('unit', 50).default('1')
      table.string('material', 40).default('n/a')
      table.string('color', 30).default('n/a')
      table.string('fit', 20).default('n/a')
      table.string('sleeve', 20).default('n/a')
      table.string('pattern', 50).default('n/a')
      table.string('description')
      table.foreign('product_id').references('products.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('product_descriptions')
  }
}

module.exports = ProductDescriptionSchema

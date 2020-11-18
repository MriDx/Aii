'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeaturedSchema extends Schema {
  up () {
    this.create('featureds', (table) => {
      table.increments()
      table.integer('product_id').unsigned()
      table.string('banner')
      table.foreign('product_id').references('products.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('featureds')
  }
}

module.exports = FeaturedSchema

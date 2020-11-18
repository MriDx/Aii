'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReviewSchema extends Schema {
  up () {
    this.create('reviews', (table) => {
      table.increments()
      table.string('user')
      table.integer('product_id')
      table.string('title')
      table.string('review')
      table.integer('star')
      table.integer('like').default(0)
      table.integer('dislike').default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('reviews')
  }
}

module.exports = ReviewSchema

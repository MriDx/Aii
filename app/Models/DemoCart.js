'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DemoCart extends Model {

	demo() {
		return this.belongsTo('App/Models/DemoUser')
	}

	product() {
		return this.belongsTo('App/Models/Product')
	}

	stock() {
		return this.belongsTo('App/Models/Stock')
	}

}

module.exports = DemoCart

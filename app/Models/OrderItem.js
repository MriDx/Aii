'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderItem extends Model {

	order() {
		return this.belongsTo('App/Models/Order')
	}

	product() {
		return this.belongsTo('App/Models/Product')
	}

	size() {
		return this.belongsTo('App/Models/Size')
	}



}

module.exports = OrderItem

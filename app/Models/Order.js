'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

	user() {
		return this.belongsTo('App/Models/User')
	}

	products() {
		return this.hasMany('App/Models/Product')
	}

	stocks() {
		return this.hasMany('App/Models/Stock')
	}

	address() {
		return this.belongsTo('App/Models/Address')
	}

	status() {
		return this.belongsTo('App/Models/OrderStatus')
	}

	orderitems() {
		return this.hasMany('App/Models/OrderItem')
	}

	cancel() {
		return this.hasOne('App/Models/Cancel')
	}

	return() {
		return this.hasOne('App/Models/Return')
	}

}

module.exports = Order

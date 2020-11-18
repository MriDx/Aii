'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Return extends Model {

	order() {
		return this.belongsTo('App/Models/Order')
	}

	user() {
		return this.belongsTo('App/Models/User')
	}

}

module.exports = Return

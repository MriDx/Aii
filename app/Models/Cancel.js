'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cancel extends Model {

	order() {
		return this.belongsTo('App/Model/Order')
	}

	user() {
		return this.belongsTo('App/Models/User')
	}

}

module.exports = Cancel

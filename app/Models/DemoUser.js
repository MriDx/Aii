'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')


class DemoUser extends Model {

	cart() {
		return this.hasMany('App/Models/Cart')
	}

}

module.exports = DemoUser

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Review extends Model {

	product() {
		return this.hasOne('App/Models/Product')
	}

	user() {
		return this.belongsTo('App/Models/User')
	}



}

module.exports = Review

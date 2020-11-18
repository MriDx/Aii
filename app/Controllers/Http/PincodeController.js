'use strict'

const Pincode = use('App/Models/Pincode')

class PincodeController {

	async store({request, response}) {

		return await Pincode.create(request.all())

	}

}

module.exports = PincodeController

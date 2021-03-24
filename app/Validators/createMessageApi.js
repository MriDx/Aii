'use strict'

class CreateMessageApi {
	get rules() {
		return {
			name: 'required',
			email: 'required|number',
			message: 'required'
		}
	}

	/* get messages() {
		return {
			'required': '{{field}} is required',
			'number': '{{field}} must be 10 digit number '
		}
	}

	async fails(error) {
		return this.ctx.response.send(error)
	} */

}

module.exports = CreateMessageApi


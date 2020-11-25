'use strict'

const Message = use('App/Models/Message')

class MessageController {

	async create({request, response, session, view}) {
		const {name, email, message} = request.all()
		try {
			await Message.create({
				name: name,
				email: email,
				message: message
			})

			session.flash({ message: 'Your message has been posted !' });
			return response.redirect('back');
		} catch (error) {
			session.flash({ message: 'something went wrong !å' });
			return response.redirect('back');
		}

	}

}

module.exports = MessageController

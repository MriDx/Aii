'use strict'

const Message = use('App/Models/Message')

class MessageController {

	async create({request, response, auth, session, view}) {
		const {name, email, message} = request.all()
		try {
			//const user = await auth.login(email, name)

			await Message.create({
				name: name,
				email: email,
				message: message
			})

			session.flash({ message: 'Your message has been posted ! ' + user });
			return response.redirect('back');
		} catch (error) {
			session.flash({ message: 'something went wrong !' + error });
			return response.redirect('back');
		}

	}

}

module.exports = MessageController

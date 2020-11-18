'use strict'

const User = use('App/Models/User')

class AuthController {

	async register({ request, auth, response }) {
		try {
			let u = await User.findBy('email', request.body.email)
			if (u != null) {
        		let token = await auth.generate(u)
				return response.json({
					status: 'success',
					user: token
				})
			}
		  const user = await User.create(request.all())
		  let token = await auth.generate(user)
		  Object.assign(user, token)
		  return response.json({
			status: "success",
			message: "user registered",
			user: user
		  })
		} catch (error) {
		  return response.status(401).json({
			status: "error",
			message: "failed to create account"
		  })
		}
	}

	async login({request, auth, response}) {
		let {email, password} = request.all()
		try {
			if (await auth.attempt(email, password)) {
				let user = await User.findBy("email", email);
        		let token = await auth.generate(user);
				return token
			}
		} catch (error) {
			return response.status(403).json({
				status: 'failed',
				error
			})
		}
	}

	async me({request, auth, response}) {
		try {
			const user = await auth.getUser()
			/* const userdata = await User.query().where('id', user.id)
			.with('cart')
			.with('addresses')
			.with('orders', function(builder) {
				builder.with('orderitems')
			})
			.first() */
			//return userdata
			return user
		} catch (error) {
			return response.status(403).json({
				status: 'failed',
				error
			})
		}
	}

	async logout({ request, auth , response}) {
		try {
			const check = await auth.check();

			if (check) {
			  const token = await auth.getAuthHeader();
			  await auth.authenticator("jwt").revokeTokens([token]);
			  return response.status(200).send({ message: "Logout successfully!" });
			}
		  } catch (error) {
			return response.send({ message: "Invalid jwt token" });
		  }
	}

}

module.exports = AuthController

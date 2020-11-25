'use strict'

class CreateUser {
  get rules () {
    return {
      'name':'required',
      'email':'required|unique:users',
      'password':'required'
    }
  }

  getMessages() {
    return {
      'required': 'Woah now, {{ field }} is required.',
      'unique': 'Wait a second, the {{ field }} already exists'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll()

    return this.ctx.response.redirect('back')
  }

}

module.exports = CreateUser

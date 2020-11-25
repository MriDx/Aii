'use strict'

class CreateMessage {
  get rules () {
    return {
      // validation rules
      name: 'required',
      email: 'required',
      message: 'required'
    }
  }

  get messages() {
    return {
      'required': 'Hold up, the {{ field }} is required.'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll();

    return this.ctx.response.redirect('back');
  }
}

module.exports = CreateMessage

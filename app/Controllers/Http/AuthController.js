'use strict'

const User = use('App/Models/User')
const DemoCart = use('App/Models/DemoCart')
const DemoUser = use('App/Models/DemoUser')

const Database = use('Database')

class AuthController {
  async register({ request, auth, response }) {
    try {
      let u = await User.findBy('email', request.body.email)
      if (u != null) {
        if (await auth.attempt(request.body.email, request.body.password)) {
          let token = await auth.generate(u)
          return response.json({
            status: 'success',
            user: token,
          })
        }
      }
      const user = await User.create(request.all())
      let token = await auth.generate(user)
      Object.assign(user, token)
      return response.json({
        status: 'success',
        message: 'user registered',
        user: user,
      })
    } catch (error) {
      return response.status(401).json({
        status: 'error',
        message: 'failed to create account',
      })
    }
  }

  async login({ request, auth, response }) {
    let { email, password } = request.all()
    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email)
        let token = await auth.generate(user)
        return token
      }
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error,
      })
    }
  }

  async me({ request, auth, response }) {
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
        error,
      })
    }
  }

  async logout({ request, auth, response }) {
    try {
      const check = await auth.check()

      if (check) {
        const token = await auth.getAuthHeader()
        await auth.authenticator('jwt').revokeTokens([token])
        return response.status(200).send({ message: 'Logout successfully!' })
      }
    } catch (error) {
      return response.send({ message: 'Invalid jwt token' })
    }
  }

  async migrateDemoUser({ request, auth, response }) {
    var token = request.headers().authorization.split(' ')[1]
    if (token == 'a101mk') {
      const trx = await Database.beginTransaction()
      try {
        //migrate user
        let { email, password, name, demo_id } = request.all()
        let u = await User.findBy('email', email)
        if (u == null) {
          //user not exist
          u = new User()
          u.email = email
          u.password = password
          u.name = name
          await u.save(trx)
          //user registered
        } else if (await auth.attempt(email, password)) {
          //auth done
        }
        //user registered
        //migrate data
        let carts = await DemoCart.query(trx).where('demo_id', demo_id).fetch()
        //console.log(carts)
        let t = []

        for (let i = 0; i < carts.rows.length; i++) {
          let x = carts.rows[i]
          /* let v = await u.cart().where({ product_id: x.product_id, size_id: x.size_id, stock_id: x.stock_id }).first()
          console.log('user cart ' + v) */
          if (await u.cart().where({ product_id: x.product_id, size_id: x.size_id, stock_id: x.stock_id }).first() == null) {
            let o = {
              product_id: x.product_id,
              size_id: x.size_id,
              qty: x.qty,
              status: x.status,
              stock_id: x.stock_id,
            }
            t[i] = o
          }
        }
        let c = await u.cart().createMany(t, trx)
        //let c = await u.cart().fetch()
        await DemoUser.query(trx).where('id', demo_id).delete()
        await DemoCart.query(trx).where('demo_id', demo_id).delete()
        let tk = await auth.generate(u)
        await trx.commit()
        return response.json({
          status: 'success',
          user: Object.assign(u, tk),
          cart: c
        })
      } catch (error) {
        await trx.rollback()
        return response.status(403).json({
          status: 'error',
          message: 'failed to create account',
          error
        })
      }
    } else {
      console.log('un -auth')
    }
  }
}

module.exports = AuthController

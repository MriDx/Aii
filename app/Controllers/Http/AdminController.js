'use strict'

const Product = use('App/Models/Product')
const Order = use('App/Models/Order')
const Admin = use('App/Models/Admin')
const Category = use('App/Models/Category')

const WebAdmin = use('App/Models/WebAdmin')

class AdminController {

	async check({ request, view, auth, response }) {
		try {
			await auth.check()
			//let user = await auth.getUser()
			return response.redirect('/dashboard')

		} catch (error) {
			return view.render('index')
		}
	}

	async register({ request, response, auth }) {
		//const user = await User.create(request.only(['name', 'email', 'password']))
		const user = await WebAdmin.create(request.only(['name', 'email', 'password']))

		await auth.login(user)
		return response.redirect('/dashboard')
	}

	async login({ request, auth, response, session }) {
		const { email, password } = request.all()
		try {
			await auth.attempt(email, password)
			return response.redirect('/dashboard')
		} catch (error) {
			session.flash({ loginError: 'These credentials do not work' })
			return response.redirect('/')
		}
	}

	async home({request, auth, response}) {
		try {
			const user = await auth.getUser()
			let admin = await Admin.findByOrFail('id', user.id)
			let products = await Product.query().getCount()
			let orders = await Order.query().getCount()
			let pendingOrders = await Order.query().where('pending', '0').getCount()

			return response.json({
				products: products,
				orders : orders,
				pendingOrders: pendingOrders
			})

		} catch (error) {
			return response.status(401).json({
				status: 'failed',
				message: 'baba ... auth loge thosu ... :D'
			})
		}

	}

	async products({request, params: {page}, auth, response}) {
		try {
			const user = await auth.getUser()
			let admin = await Admin.findByOrFail('id', user.id)
			let products = await Product.query()
			.with('image', function(builder) {
				builder.select('images.id', 'images.product_id', 'images.url')
			})
			.with('stock', function(builder) {
				builder.with('size')
			})
			.orderBy('id', 'desc')
			.paginate(page, 10)

			return products

		} catch (error) {
			return response.status(401).json({
				status: 'failed',
				message: 'baba ... auth loge thosu ... :D'
			})
		}

	}

	async productsC({request, params: {page, limit}, auth, response}) {
		try {
			const user = await auth.getUser()
			let admin = await Admin.findByOrFail('id', user.id)
			let products = await Product.query()
			.with('image', function(builder) {
				builder.select('images.id', 'images.product_id', 'images.url')
			})
			.with('stock', function(builder) {
				builder.with('size')
			})
			.orderBy('id', 'desc')
			.paginate(page, limit)

			return products

		} catch (error) {
			return response.status(401).json({
				status: 'failed',
				message: 'baba ... auth loge thosu ... :D'
			})
		}

	}


	async orders({request, params: {page}, auth, response}) {
		try {
			const user = await auth.getUser()
			let admin = await Admin.findByOrFail('id', user.id)
			let orders = await Order.query()
			.with('orderitems')
			.with('user', b => {
				b.select('users.name', 'users.email')
			})
			.orderBy('id', 'desc')
			.paginate(page, 10)
			return orders

		} catch (error) {
			return response.status(401).json({
				status: 'failed',
				message: 'baba ... auth loge thosu ... :D'
			})
		}
	}

	async ordersC({request, params: {page, limit}, auth, response}) {
		try {
			const user = await auth.getUser()
			let admin = await Admin.findByOrFail('id', user.id)
			let orders = await Order.query()
			.with('orderitems')
			.with('user', b => {
				b.select('users.name', 'users.email')
			})
			.orderBy('id', 'desc')
			.paginate(page, limit)
			return orders

		} catch (error) {
			return response.status(401).json({
				status: 'failed',
				message: 'baba ... auth loge thosu ... :D'
			})
		}
	}

	async categories({request, auth, response}) {
		try {
			//const user = await auth.getUser()
			//let admin = await Admin.findByOrFail('id', user.id)
			return await Category.all()
		} catch (error) {
			return response.status(401).json({
				status: 'failed',
				message: 'baba ... auth loge thosu ... :D'
			})
		}
	}

	async cancelOrder({request, params: {id}, auth, response}) {
    const trx = await Database.beginTransaction()
    let {reason, desc} = request.all()
    try {
      const user = await auth.getUser()
      //return id
      let order = await user.orders(trx)
      .where('id', id)
      //.with('orderitems')
      .first()
      order.status = 'Cancelled'
      await order.save(trx)

      let orderItems = await OrderItem.query(trx).where('order_id', id).fetch()

      for (let i = 0; i < orderItems.rows.length; i++) {
        const ord = orderItems.rows[i]
        let productId = ord.product_id
        let sizeId =  ord.size_id
        let stock = await Stock.findByOrFail({'product_id': productId, 'size_id': sizeId})
        stock.stock = stock.stock + 1
        await stock.save(trx)
        await Product.query(trx).where('id', productId).update({'stock': 1})
        console.info(stock)
      }

      console.info('before cancel')
      await order.cancel().create({
        'reason': reason,
        'description':desc,
        'user_id': order.user_id
      },trx)

      console.info('after cancel')

      await trx.commit()
      return response.json({
        status: 'success',
        message: 'order cancelled'
      })
    } catch (error) {
      await trx.rollback()
      return response.status(403).json({
        status: 'failed',
        error: error
      })
    }
  }

}

module.exports = AdminController

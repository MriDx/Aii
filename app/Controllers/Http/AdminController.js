'use strict'

const Product = use('App/Models/Product')
const Order = use('App/Models/Order')
const Admin = use('App/Models/Admin')
const Category = use('App/Models/Category')

class AdminController {

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

}

module.exports = AdminController

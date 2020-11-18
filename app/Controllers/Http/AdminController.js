'use strict'

const Product = use('App/Models/Product')
const Order = use('App/Models/Order')

class AdminController {

	async home({request, auth, response}) {
		let products = await Product.query().getCount()
		let orders = await Order.query().getCount()
		let pendingOrders = await Order.query().where('status', 'Processing').getCount()

		return response.json({
			products: products,
			orders : orders,
			pendingOrders: pendingOrders
		})

	}

	async products({request, params: {page}, auth, response}) {
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
	}

	async productsC({request, params: {page, limit}, auth, response}) {
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
	}


	async orders({request, params: {page}, auth, response}) {
		let orders = await Order.query()
		.with('orderitems')
		.with('user', b => {
			b.select('users.name', 'users.email')
		})
		.orderBy('id', 'desc')
		.paginate(page, 10)
		return orders
	}

	async productsC({request, params: {page, limit}, auth, response}) {
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
	}

}

module.exports = AdminController

'use strict'


const Category = use('App/Models/Category')

const Product = use('App/Models/Product')

const Featured = use('App/Models/Featured')

const Cart = use('App/Models/Cart')

const HomeProduct = use('App/Models/HomeProduct')

class HomeController {

	async index({request, auth, response}) {
		try {
			const user = await auth.getUser()
			const featured = await Featured.query()
			.with('product', function(builder) {
				builder.with('image', function(builder) {
					builder.select('images.id', 'images.product_id', 'images.url')
				})
				.with('stock', function(builder) {
					builder.with('size')
				})
				.with('category')
			})
			.fetch()
			let category = await Category.query().withCount('products').fetch()
			/* const products = await Product.query()
				.where('stock', '1')
				.with('image', function(builder) {
					builder.select('images.id', 'images.product_id', 'images.url')
				})
				.with('stock', function(builder) {
					builder.with('size')
				})
				.with('category')
				.fetch(); */
			const products = await HomeProduct.query()
			.with('product', b => {
				b.where('stock', '1')
				.with('image', function(builder) {
					builder.select('images.id', 'images.product_id', 'images.url')
				})
				.with('stock', function(builder) {
					builder.with('size')
				})
				.with('category')
			})
			.orderBy('id', 'desc')
			.limit(20)
			.fetch()
			const cart = await Cart.query().where('user_id', user.id).fetch()
			let data = {featured: featured, categories : category, products: products, cart: cart}
			return response.json({
				status: 'success',
				data : data
			})
		} catch (error) {
			return response.status(403).json({status: 'failed', error})
		}
	}

}

module.exports = HomeController

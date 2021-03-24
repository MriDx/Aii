'use strict'

const Route = use('Route')

//Route.get('/', 'JobController.home')


Route.post('/write-to-us', 'MessageController.create').validator('CreateMessage')
Route.post('/write-to-us', 'MessageController.store').validator('createMessageApi').prefix('api/v1')

//Products
Route.group(() => {
	Route.get('products', 'ProductController.index')

	Route.get('products/:page', 'ProductController.index')

	Route.get('product/:id', 'ProductController.show')

	Route.get('product/:id/wc', 'ProductController.showWC') // get product by id along with cart

	Route.get('product/:id/wc/:demoId', 'ProductController.showWCD') // get product by id along with cart

	Route.get('product/:id/meta', 'ProductController.meta')

	Route.get('product/:product_id/:size_id', 'StockController.checkStock')
}).prefix('api/v1/')

//product advance operations
Route.group(() => {

	Route.get('price-below/:price', 'ProductController.byprice_below')

	Route.get('price-below/:price/:catId', 'ProductController.byprice_below_catId')

	Route.get('price-above/:price', 'ProductController.byprice_above')

	Route.get('price-above/:price/:catId', 'ProductController.byprice_above_catId')

}).prefix('api/v1/products/query')


// Cart operations
Route.group(function () {
	Route.post('addToCart', 'CartController.add') //add to cart
	Route.get('cartItems', 'CartController.cartItems') //cart items
	Route.get('cart/remove/:itemId', 'CartController.removeCart') //remove from cart item
	Route.post('order', 'OrderController.store') //create order
	//Route.get('orders', 'OrderController.index')
	Route.post('address', 'AddressController.store') //create address
	Route.get('addresses', 'AddressController.index') //address listing
	Route.get('search/:query', 'ProductController.search') //product search
	Route.get('orders', 'OrderController.orders') //order list
	Route.get('order/:id', 'OrderController.orderData') //order data
	Route.post('order/cancel/:id', 'OrderController.cancelOrder') //cancel order
	Route.post('order/return/:id', 'OrderController.orderReturn') //return order
	Route.post('product/review', 'ReviewController.store') //add product review

}).middleware('auth').prefix('api/v1/')

// user operations
Route.post('register', 'AuthController.register').prefix('/api/v1') //register user
Route.post('login', 'AuthController.login').prefix('/api/v1') //login user

Route.get('cartCount', 'CartController.count').middleware('auth').prefix('api/v1')
Route.get('cartCount/:id', 'DemoCartController.count').prefix('api/v1/demo')

Route.group(() => {
	Route.get('me', 'AuthController.me') //get user
	Route.get('logout', 'AuthController.logout') //logout user
})
	.middleware('auth')
	.prefix('/api/v1')

//app home page
Route.get('home', 'HomeController.index').middleware('auth').prefix('api/v1')

Route.get('featured', 'FeaturedController.index')
	.middleware('auth')
	.prefix('api/v1')
Route.post('featured/add', 'FeaturedController.store')
	.middleware('auth')
	.prefix('api/v1')

Route.get('category/products/:id/:page', 'ProductController.bycategory').prefix(
	'api/v1'
)

//add product to homepage
Route.post('customize/home/product', 'HomeProductController.add')
	.prefix('api/v1/')

Route.post('customize/home/products', 'HomeProductController.addMultiple'
).prefix('api/v1/')

Route.group('adminapp', () => {
	Route.get('home', 'AdminController.home')
	Route.get('products/:page', 'AdminController.products')
	Route.get('products/:page/:limit', 'AdminController.productsC')
	Route.get('orders/:page', 'AdminController.orders')
	Route.get('orders/:page/:limit', 'AdminController.ordersC')
	Route.post('pincode/add', 'PincodeController.store')

	//product
	Route.post('add/product', 'ProductController.store')
	Route.post('product/desc/:id', 'ProductController.addDesc')

	//categories
	Route.get('categories', 'AdminController.categories')
	Route.post('category/add', 'CategoryController.store')
	//Route.get('categories', 'CategoryController.index')
	Route.post('category/:id', 'CategoryController.update')
	Route.post('createCategory', 'CategoryController.createCategory')
	Route.post('updateCategory', 'CategoryController.updateCategory')

	//sizes
	Route.post('size', 'SizeController.store')
	Route.get('sizes', 'SizeController.index')

	//stock
	Route.post('addStock', 'StockController.store')

	//image upload
	Route.post('addImage', 'FileController.upload')
	Route.post('upload', 'FileController.upload')
	Route.get('content/:file', 'FileController.tmpImage')
	Route.post('saveImage/:id', 'ImageController.saveBulk')
	Route.post('product/addImage', 'ImageController.store')
	//Route.get('content/:dir/:file', 'FileController.file')
}).prefix('admin/api/v1/')


//api version 1 with demo
Route.group(function () {

	Route.get('home/:id', 'HomeController.products') //home un-authenticated

	Route.get('products', 'ProductController.index') //list products

	Route.get('products/:page', 'ProductController.index') //products page navigate

	Route.get('product/:id', 'ProductController.show') //single product

	Route.get('product/:product_id/:size_id', 'StockController.checkStock') //check single product stock

	Route.post('login', 'DemoUserController.login')
	Route.post('addToCart', 'DemoCartController.addToCart')
	Route.get('carts/:id', 'DemoCartController.cart')
	Route.get('/carts/:id/remove/:cartId', 'DemoCartController.removeCart')
	Route.post('register', 'AuthController.migrateDemoUser')

	Route.get('sign', 'AuthController.sign')

}).prefix('api/v1/demo')

Route.get('.well-known/assetlinks.json', 'FileController.assetsLink')
Route.get('.wellknown/assetlinks.json', 'FileController.assetsLink1')


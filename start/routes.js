'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('aii')

//Route.get('/', 'JobController.home')

Route.on('/write-to-us').render('forms.writeus')
Route.post('/write-to-us', 'MessageController.create').validator('CreateMessage')

/* Route.on('/signup').render('auth.signup')
Route.post('/signup', 'UserController.create').validator('CreateUser')

Route.on('/login').render('auth.login')
Route.post('/login', 'UserController.login').validator('LoginUser')

Route.get('/logout', async ({auth, response}) => {
  await auth.logout()
  return response.redirect('/')
})

Route.get('/post-a-job', 'JobController.userIndex')
Route.get('/post-a-job/delete/:id', 'JobController.delete')
Route.get('/post-a-job/edit/:id', 'JobController.edit')
Route.post('/post-a-job/update/:id', 'JobController.update').validator('CreateJob')
Route.post('/post-a-job', 'JobController.create').validator('CreateJob') */




//Products
Route.group(() => {

  Route.get('products', 'ProductController.index')

  Route.get('products/:page', 'ProductController.index')

  Route.get('product/:id', 'ProductController.show')

  Route.get('product/:product_id/:size_id', 'StockController.checkStock')

  //Route.post('addStock', 'StockController.store')

  //Route.post('product/addImage', 'ImageController.store')

  //Route.post('product/tag/:id', 'ProductController.addTags')

}).prefix('api/v1/')


//Route.post('updateStock/:product_id/:size_id', 'StockController.updateStock')

//Route.post('upload', 'FileController.upload');

//Route.post('uploadMultiple', 'FileController.uploadMultiple');

Route.get('download/:fileName', 'FileController.download');

//Route.post('addImage', 'ImageController.store')

Route.group(() => {
  Route.get('content/:dir/:file', 'FileController.file')
})


Route.group(function(){
  Route.post('addToCart', 'CartController.add')
  Route.get('cartItems', 'CartController.cartItems')
  Route.get('cart/remove/:itemId', 'CartController.removeCart')
  Route.post('order', 'OrderController.store')
  //Route.get('orders', 'OrderController.index')
  Route.post('address', 'AddressController.store')
  Route.get('addresses', 'AddressController.index')
  Route.get('search/:query', 'ProductController.search')
  Route.get('orders', 'OrderController.orders')
  Route.get('order/:id', 'OrderController.orderData')
  Route.post('order/cancel/:id', 'OrderController.cancelOrder')
  Route.post('order/return/:id', 'OrderController.orderReturn')

  Route.post('product/review', 'ReviewController.store')
}).middleware('auth').prefix('api/v1/')

Route.post("register", "AuthController.register").prefix("/api/v1")
Route.post("login", "AuthController.login").prefix("/api/v1")
Route.group(() => {
  Route.get("me", "AuthController.me")
  Route.get('logout', 'AuthController.logout')
}).middleware('auth').prefix("/api/v1")



//Route.get('login/facebook', 'LoginController.redirect')
//Route.get('facebook/callback', 'LoginController.callback')


/* Route.post('address', 'AddressController.store').middleware('auth')

Route.post('addToCart', 'CartController.add').middleware('auth').prefix('api/v1')

Route.get('cartItems', 'CartController.cartItems')

Route.post('order', 'OrderController.store').middleware('auth')

Route.get('orders', 'OrderController.index').middleware('auth') */

/* Route.group(function() {
  Route.post('category/add', 'CategoryController.store').middleware('auth')
  Route.get('categories', 'CategoryController.index')
  Route.post('category/:id', 'CategoryController.update')
}).prefix('api/v1/') */

Route.get('home', 'HomeController.index').middleware('auth').prefix('api/v1')


Route.get('featured', 'FeaturedController.index').middleware('auth').prefix('api/v1')
//Route.post('featured/add', 'FeaturedController.store').middleware('auth').prefix('api/v1')

Route.get('category/products/:id/:page', 'ProductController.bycategory').prefix('api/v1')


//Route.post('checksum/generate', 'PaytmController.checksum').prefix('api/v1/')
//Route.post('checksum/validate', 'PaytmController.validate').prefix('api/v1/')


//add product to homepage
Route.post('customize/home/product', 'HomeProductController.add').prefix('api/v1/')
Route.post('customize/home/products', 'HomeProductController.addMultiple').prefix('api/v1/')


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
  Route.get('content/:dir/:file', 'FileController.file')
}).prefix('admin/api/v1/')

Route.on('/*').render('welcome')

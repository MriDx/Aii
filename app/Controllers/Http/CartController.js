'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const Cart = use('App/Models/Cart')
const Stock = use('App/Models/Stock')

/**
 * Resourceful controller for interacting with carts
 */
class CartController {
  /**
   * Show a list of all carts.
   * GET carts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new cart.
   * GET carts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new cart.
   * POST carts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single cart.
   * GET carts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing cart.
   * GET carts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update cart details.
   * PUT or PATCH carts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a cart with id.
   * DELETE carts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }



  async add({request, auth, response}) {
    let {product_id, qty, size_id} = request.all()
    let message
    try {
      const user = await auth.getUser()
      let m = await Cart.query().where('user_id', user.id).where({'product_id': product_id, 'size_id': size_id}).first()
      if (m == null) {
        let stock = await Stock.query().where({'product_id': product_id, 'size_id': size_id}).first()
        if (stock != null && stock.stock > 0) {
          m = await user.cart().create(request.all())
          message = "Product added to cart !"
          return response.json({
            status: 'success',
            cartItem : m,
            code: "DI",
            message: message
          })
        } else {
          message = "Product is out-of-stock"
          throw "Product is out of stock"
        }
      }
      return response.json({
        status: 'success',
        code: 'DE',
        message: message
      })
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        message: message,
        error
      })
    }
  }

  async cartItems({request, auth, response}) {
    try {
      const user = await auth.getUser()
      let items = await user.cart()
      .with('product', (b) => {
        b.with('image')
      })
      .with('stock', function(builder) {
        builder.with('size')
      })
      .fetch()
      return items
    } catch (error) {
      return error
    }
  }

  async removeCart({params: {itemId}, request, auth, response}) {
    try {
      const user = await auth.getUser()
      let rows = await user.cart().where('id', itemId).delete()
      let items = await user.cart()
      .with('product', (b) => {
        b.with('image')
      })
      .with('stock', function(builder) {
        builder.with('size')
      })
      .fetch()
      return response.json({
        status: 'success',
        rows_deleted: rows,
        items : items
      })
    } catch (error) {
      return response.status(403).json({
        status: failed,
        error
      })
    }
  }

}

module.exports = CartController

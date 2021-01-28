'use strict'


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const DemoCart = use('App/Models/DemoCart')
const Stock = use('App/Models/Stock')
const Cart = use('App/Models/Cart')

/**
 * Resourceful controller for interacting with democarts
 */
class DemoCartController {
  /**
   * Show a list of all democarts.
   * GET democarts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new democart.
   * GET democarts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new democart.
   * POST democarts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single democart.
   * GET democarts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing democart.
   * GET democarts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update democart details.
   * PUT or PATCH democarts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a democart with id.
   * DELETE democarts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }


  async addToCart({ request, response }) {
    var token = request.headers().authorization.split(' ')[1]
    let message
    if (token == 'a101mk') {
      //auth done
      let { product_id, qty, size_id, demo_id, status, stock_id } = request.all()
      try {
        let m = await DemoCart.query().where('demo_id', demo_id).where({ 'product_id': product_id, 'size_id': size_id }).first()
        if (m == null) {
          let stock = await Stock.query().where({ 'product_id': product_id, 'size_id': size_id }).first()

          if (stock != null && stock.stock > 0) {
            console.log('inside stock != null')
            let m = new DemoCart()
            m.demo_id = demo_id
            m.product_id = product_id
            m.size_id = size_id
            m.qty = qty
            m.status = status
            m.stock_id = stock_id

            await m.save()

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
  }

  async cart({ request, response }) {
    let carts = await DemoCart.query().where('demo_id', 1).fetch()
    let t =[]

    for (let i = 0; i < carts.rows.length; i++) {
      let x = carts.rows[i]
      let o = {
        product_id: x.product_id,
        size_id: x.size_id,
        qty: x.qty,
        status: x.status,
        stock_id: x.stock_id
      }
      t[i] = o
    }
    await Cart.createMany(t)
    return t
  }
}

module.exports = DemoCartController

'use strict'

const { query } = require('../../Models/User')

//const OrderItem = require('../../Models/OrderItem')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const OrderItem = use('App/Models/OrderItem')
const Cart = use('App/Models/Cart')
const Order = use('App/Models/Order')
const Stock = use('App/Models/Stock')
const Product = use('App/Models/Product')
const Cancel = use('App/Models/Cancel')
const Return = use('App/Models/Return')

const Database = use('Database')

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, auth, response, view }) {
    try {
      const user = await auth.getUser()
      const data = await user.orders()
      return data
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error
      })
    }
  }

  /**
   * Render a form to be used for creating a new order.
   * GET orders/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {
    let {address_id, payment_mode, payment_status, order_uid, amount, items} = request.all()
    const trx = await Database.beginTransaction()
    let message
    try {
      const user = await auth.getUser()
      let x

      for (let i = 0; i < items.length; i++) {
        const element = items[i];
        const stock = await Stock.findByOrFail({product_id: element.product_id, size_id: element.size_id})
        x = stock
        let s = stock.stock
        if (s  == 0)  {
          message = "One or more product is out of stock. Please go back to cart and remove out of stock products"
          throw "One or more product is out of stock"
        }
        if (s == 1) {
          //update product table
          const stocks = await Stock.query(trx).where('product_id', element.product_id).fetch()
          let pStk = 0
          for (let j = 0; j < stocks.rows.length; j++) {
            //const data =  stocks.rows[j]
            pStk = stocks.rows[j].stock + pStk
          }
          if (pStk == 1) {
            await Product.query(trx).where('id', element.product_id).update({'stock': 0})
          }
        }
        stock.stock = s - 1
        await stock.save(trx)
      }

      const order = await user.orders().create({
        'address_id': address_id,
        'payment_mode':payment_mode,
        'payment_status':payment_status,
        //'status_id': 1,
        'status': 'Processing',
        'order_uid':order_uid,
        'amount': amount
      }, trx)

      let orders = await order.orderitems().createMany(items, trx)
      await Cart.query(trx).where('user_id', user.id).delete()

      await trx.commit()

      message = "Order Placed !"

      let d = {items: orders}

      return response.json({
        status: 'success',
        message: message,
        data: Object.assign(order, d)
      })
    } catch (error) {
      await trx.rollback()
      return response.status(403).json({status: 'failed',message: message, error})
    }

  }

  /**
   * Display a single order
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: {id}, auth, response, view }) {
    try {
      const user = await auth.getUser()
      const data = await user.orders()
      return data
      return response.json({status: 'success', data: data})
    } catch (error) {
      return response.status(403).json({status: 'failed', error})
    }

  }

  /**
   * Render a form to update an existing order.
   * GET orders/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async orders({request, auth, response}) {
    try {
      const user = await auth.getUser()
      //let orders = await user.orders().fetch()
      let orders = await Order.query()
      .where('user_id', user.id)
      //.with('status')
      //.with('address')
      //.with('orderitems')
      .withCount('orderitems')
      .orderBy('id', 'desc')
      .fetch()
      return orders
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error: error
      })
    }
  }

  async orderData({request, auth, params: {id}, response}) {
    try {
      const user = await auth.getUser()
      const data = await user.orders()
            .where('id', id)
            .with('orderitems', function(b) {
              b.with('product', i =>
              i.with('image')
              )
              .with('size')
            })
            .with('return')
            .with('cancel')
            .first()
      return response.json({status: 'success', data: data})
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error: error
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

  async orderReturn({request, params:{id}, auth, response}) {
    const trx = await Database.beginTransaction()
    let {reason, desc, action} = request.all()
    try {
      const user = await auth.getUser()
      let order = await user.orders(trx)
      .where('id', id)
      //.with('orderitems')
      .first()
      //order.status = 'Return in process'
      //await order.save(trx)

      await order.return().create({
        'user_id': user.id,
        'reason': reason,
        'description':desc,
        'status': 'Processing',
        'action': action
      }, trx)

      await trx.commit()
      return response.json({
        status: 'success',
        'message':'return request placed'
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

module.exports = OrderController

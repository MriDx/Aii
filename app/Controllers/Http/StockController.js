'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Stock = use('App/Models/Stock')
const Product = use('App/Models/Product')

/**
 * Resourceful controller for interacting with stocks
 */
class StockController {
  /**
   * Show a list of all stocks.
   * GET stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {

    try {
      const stock = await Stock.query()
      //.select('product_id')
      //.groupBy('product_id')
      .with('product', function(builder) {
        builder.select('products.id', 'products.name');
      })
      .with('size', function(builder) {
        builder.select('sizes.id', 'sizes.name', 'sizes.slug');
      })
      .fetch();
      return stock;
    } catch (error) {
      return response.json({
        status: 'failed'
      })
    }

  }

  /**
   * Render a form to be used for creating a new stock.
   * GET stocks/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new stock.
   * POST stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      let m = await Stock.findBy({product_id: request.body.product_id, size_id: request.body.size_id})
      if (m == null) {
        m = await Stock.create(request.all())
      }
      let r
      if (await m.stock > 0) {
        r = await Product.query().where('id', m.product_id).update({'stock': true});
      } else {
        r = await Product.query().where('id', m.product_id).update({'stock': false});
      }
      return response.json({
        status: 'success',
        stock: m,
        affected: r
      })
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error
      })
    }

  }

  async updateStock({params: {product_id, size_id}, request, response}) {
    try {
      const stock = await Stock.findByOrFail({product_id: product_id, size_id: size_id})
      const s = await Stock.query()
      .where({'product_id': product_id, 'size_id': size_id})
      .update({
        'stock': (Number(request.body.stock) + stock.stock),
        'price': request.body.price,
        'mrp': request.body.mrp,
        'discount': request.body.discount
      })
      return s;
    } catch (error) {
      return response.json({
        status: 'failed',
        error
      });
    }
  }

  /**
   * Display a single stock.
   * GET stocks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params :{id}, request, response }) {
    try {
      const product = await Stock.query()
      .where('product_id', id)
      .fetch()
      return product;
    } catch (error) {
      return response.json({
        status: 'failed'
      })
    }
  }

  /**
   * Render a form to update an existing stock.
   * GET stocks/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update stock details.
   * PUT or PATCH stocks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a stock with id.
   * DELETE stocks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async checkStock({params: { product_id, size_id }, request}) {
    try {
      const stock = await Stock.query()
      .where('product_id', product_id)
      .where('size_id', size_id)
      .fetch();
      return stock;
    } catch (error) {
      return response.json({
        status: 'failed'
      })
    }
  }

}

module.exports = StockController

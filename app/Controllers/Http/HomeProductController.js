'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const HomeProduct = use('App/Models/HomeProduct')

const Database = use('Database')

/**
 * Resourceful controller for interacting with homeproducts
 */
class HomeProductController {
  /**
   * Show a list of all homeproducts.
   * GET homeproducts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new homeproduct.
   * GET homeproducts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new homeproduct.
   * POST homeproducts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

  }

  /**
   * Display a single homeproduct.
   * GET homeproducts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing homeproduct.
   * GET homeproducts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update homeproduct details.
   * PUT or PATCH homeproducts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a homeproduct with id.
   * DELETE homeproducts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async add({request, response}) {
    try {
      await HomeProduct.create(request.all())
      return response.json({status: 'success'})
    } catch (error) {
      return response.status(403).json({status: 'failed'})
    }
  }

  async addMultiple({request, response}) {
    const trx = await Database.beginTransaction()
    try {
      let {ids} = request.all()
      await HomeProduct.createMany(ids, trx)
      await trx.commit()
      return response.json({status: 'success'})
    } catch (error) {
      await trx.rollback()
      return response.status(403).json({status: 'failed', error})
    }
  }

}

module.exports = HomeProductController

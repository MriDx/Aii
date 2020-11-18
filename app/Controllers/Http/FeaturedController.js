'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Featured = use('App/Models/Featured')
const Helpers = use('Helpers')
const Drive = use('Drive')

/**
 * Resourceful controller for interacting with featureds
 */
class FeaturedController {
  /**
   * Show a list of all featureds.
   * GET featureds
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, auth, response, view }) {

    try {
      await auth.getUser()
      const featured = await Featured.query().with('product').fetch()
      return featured
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error
      })
    }

  }

  /**
   * Render a form to be used for creating a new featured.
   * GET featureds/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new featured.
   * POST featureds
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {
    try {
      let {product_id, image} = request.all()
      const user = await auth.getUser()
      const imageFile = `tmp_uploads/${image}`
      const isExist = await Drive.exists(imageFile)
      const dest = `banner/${product_id}_${new Date().getTime()}.png`
      if (isExist) {
        if (await Drive.exists(Helpers.publicPath(dest))) {
           await Drive.delete(Helpers.publicPath(dest))
        }
        let f = await Drive.move(imageFile, Helpers.publicPath(dest))

        const featured = await Featured.create({
          product_id: product_id,
          banner: dest
        })
        return featured
      }
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error
      })
    }

  }

  /**
   * Display a single featured.
   * GET featureds/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing featured.
   * GET featureds/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update featured details.
   * PUT or PATCH featureds/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a featured with id.
   * DELETE featureds/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = FeaturedController

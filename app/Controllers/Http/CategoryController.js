'use strict'



/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const Category = use('App/Models/Category')

const Helpers = use('Helpers');
const Drive = use('Drive');

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {

    try {
      const categories = await Category.query().withCount('products as product_count').fetch()
      return categories
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error
      })
    }

  }

  /**
   * Render a form to be used for creating a new category.
   * GET categories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {

    let {name, image} = request.all()
    try {
      const user = await auth.getUser()
      if (await Category.findBy('name', name) != null) {
        return response.status(403).json({
          status: 'failed',
          msg: 'category already exist. you can only update it now'
        })
      }
      const imageFile = `tmp_uploads/${image}`
      const isExist = await Drive.exists(imageFile)
      let imageName = name.replace(/\s/g, "")
      if (isExist) {
      if (await Drive.exists(Helpers.publicPath(`category/${imageName}.png`))) await Drive.delete(Helpers.publicPath(`category/${imageName}.png`))
      let f = await Drive.move(imageFile, Helpers.publicPath(`category/${imageName}.png`))
      if (!f) {
        return response.status(404).json({
          status: 'failed',
          msg: 'image file not found'
        })
      }
      let category = await Category.create({
        name:name,
        image: `category/${imageName}.png`
      })
      return response.json({
        status: 'created',
        category
      })
    } else {
      return response.status(404).json({
        status: 'failed',
        msg: 'image file not found'
      })
    }
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error
      })
    }

  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params :{id}, request, response, view }) {

    return id

  }

  /**
   * Render a form to update an existing category.
   * GET categories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params : {id}, request, auth, response }) {
    let {image} = request.all()
    try {
      await auth.getUser()
      const category = await Category.findByOrFail('id', id)
      const imageFile = `tmp_uploads/${image}`
      const imgName = category.name.replace(/\s/g, "")
      const newImg = `category/${imgName}.png`
      if (await Drive.exists(Helpers.tmpPath(imageFile))) {
        if (await Drive.exists(Helpers.publicPath(category.image))) await Drive.delete(Helpers.publicPath(category.image))
        let f = await Drive.move(imageFile, Helpers.publicPath(newImg))
        if (!f) {
          return response.status(404).json({
            status: 'failed',
            msg: 'image file not found'
          })
        }
        let c = await Category.query()
        .where('id', id)
        .update({image: newImg})
        return response.json({
          status: 'created',
          c
        })
      }
      return response.json({
        status: 'failed',
        msg: 'image file not found'
      })
    } catch (error) {
      return response.json({
        status: 'failed',
        error
      })
    }
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

}

module.exports = CategoryController

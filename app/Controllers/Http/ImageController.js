'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Image = use('App/Models/Image')
const Helpers = use('Helpers')
const Drive = use('Drive')

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Show a list of all images.
   * GET images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new image.
   * GET images/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new image.
   * POST images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {
    let product_id = request.body.product_id
    try {
      //const user = await auth.getUser()
      //let admin = await Admin.findByOrFail('id', user.id)
      const validationOptions = {
        types: ['image'],
        size: '1mb',
      }
      const imageFile = request.file('image', validationOptions)
      await imageFile.move(Helpers.publicPath('product'), {
        name: `${product_id}_${new Date().getTime()}.${imageFile.subtype}`,
        overwrite: true,
      })
      if (!imageFile.moved()) {
        throw imageFile.error()
      }
      const img = await Image.create({product_id: product_id, url: `product/${imageFile.fileName}`})
      return response.json({
        status: 'success',
        img
      })
    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        error: error
      })
    }

  }

  /**
   * Display a single image.
   * GET images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing image.
   * GET images/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update image details.
   * PUT or PATCH images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a image with id.
   * DELETE images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async saveBulk({request, params:{id}, auth, response}) {
    try {
      //const user = await auth.getUser()
      //let admin = await Admin.findByOrFail('id', user.id)
      let images = request.body.images

      for (i=0; i < images.length(); i++) {
        console.info(images[i])
        let imageFile = Drive.tmpPath(`tmp_uploads/${images[i]}`)
        console.log(imageFile)
        const newImg = `product/${id}_${new Date().getTime()}.${imageFile.subtype}`

        await Drive.move(Helpers.tmpPath(`tmp_uploads/${images[i]}`), Helpers.publicPath(newImg))

      }

      return response.json({
        status: 'success',
        message: 'images added'
      })

    } catch (error) {
      return response.status(403).json({
        status: 'failed',
        message: 'failed to add images'
      })
    }
  }
}

module.exports = ImageController

'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Review = use('App/Models/Review')
const Order = use('App/Models/Order')

/**
 * Resourceful controller for interacting with reviews
 */
class ReviewController {
  /**
   * Show a list of all reviews.
   * GET reviews
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new review.
   * GET reviews/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new review.
   * POST reviews
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {

    let { order_id, product_id, title, review, star, like } = request.all()
    let message = ''
    try {
      const user = await auth.getUser()
      console.info(user)
      let order = await user.orders().where({ id: order_id, status: 'Delivered'}).first()
      if (order == null) {
        message = 'you are not authorized !'
        throw new Error('you are not authorized')
      }
      /* return order
      if (order.status != 'Delivered') {
        message = 'your orders is not yet delivered ! Review only allowed after successfull order delivery.'
        throw new Error(message)
      } */
      let orderItem = await order.orderitems().where('product_id', product_id).first()
      if (orderItem == null) {
        message = 'product is not in order item'
        //message = 'you are not authorized !'
        throw new Error('you are not authorized')
      }
      let data = await Review.create({
        user_id: user.id,
        user: user.name,
        product_id: product_id,
        title: title,
        review: review,
        star: star,
        like: like,
        dislike: 0
      })
      return response.json({
        status: 'success',
        message: 'Review Added',
        review: data
      })
    } catch (error) {
      response.status(403).json({
        status: 'failed',
        message: message
      })
    }


  }

  /**
   * Display a single review.
   * GET reviews/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing review.
   * GET reviews/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params: { id }, request, auth, response, view }) {
    const { review, title, star } = request.all()
    try {
      const user = await auth.getUser()
      const reviewObj = await user.reviews().where('id', id).first()
      //return reviewObj
      reviewObj.review = review
      reviewObj.title = title
      reviewObj.star = star
      await reviewObj.save()
      return response.status(200).json({status: 'success'})
    } catch (error) {
      return response.status(403).json({status: 'failed'})
    }
  }

  /**
   * Update review details.
   * PUT or PATCH reviews/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a review with id.
   * DELETE reviews/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async delete({ request, params: { id }, auth, response }) {
    try {
      const user = await auth.getUser()
      const reviewObj = await user.reviews().where('id', id).first()
      await reviewObj.delete()
      return response.status(200).json({ status: 'success' })
    } catch (error) {
      return response.status(403).json({ status: 'failed' })
    }
  }

}

module.exports = ReviewController

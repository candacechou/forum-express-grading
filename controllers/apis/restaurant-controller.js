const restaurantServices = require('../../services/restaurant-services')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTopRestaurants: (req, res, next) => {
    restaurantServices.getTopRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRestaurantComment: (req, res, next) => {
    restaurantServices.getRestaurantComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getFavoritedRestaurant: (req, res, next) => {
    restaurantServices.getFavoritedRestaurant(req, (err, restaurant) => err ? next(err) : res.json({ status: 'success', restaurant }))
  },
  getCommentRestaurant: (req, res, next) => {
    restaurantServices.getCommentRestaurant(req, (err, restaurant) => err ? next(err) : res.json({ status: 'success', restaurant }))
  }
}
module.exports = restaurantController

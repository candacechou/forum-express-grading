const adminServices = require('../../services/admin-services')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putRestaurant: (req, res, next) => {
    adminServices.putRestaurant(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, users) => err ? next(err) : res.json({ status: 'success', users }))
  },
  patchUser: (req, res, next) => {
    adminServices.patchUser(req, err => err ? next(err) : res.json({ status: 'success' }))
  }
}
module.exports = restaurantController

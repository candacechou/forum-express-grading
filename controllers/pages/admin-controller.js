const { Restaurant, Category } = require('../../models')
const adminServices = require('../../services/admin-services')
const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, restaurants) => err ? next(err) : res.render('admin/restaurants', restaurants))
  },
  createRestaurant: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created')
      req.session.createdData = data
      return res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err
      ? next(err)
      : res.render('admin/restaurant', { restaurant: data }))
  },
  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        raw: true
      }),
      Category.findAll({ raw: true })
    ])

      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    adminServices.putRestaurant(req, err => {
      if (err) {
        next(err)
      } else {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      }
    })
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.session.deletedData = data
      return res.redirect('/admin/restaurants')
    })
  },
  patchUser: (req, res, next) => {
    adminServices.patchUser(req, err => {
      if (err) return next(err)
      else {
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      }
    })
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, users) => {
      if (err) next(err)
      else {
        res.render('admin/user', { users })
      }
    })
  }
}
module.exports = adminController

const categoryServices = require('../../services/category-services')
const categoryController = {
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postCategory: (req, res, next) => {
    categoryServices.postCategory(req, err => {
      err ? next(err) : res.json({ status: 'success' })
    })
  },
  putCategory: (req, res, next) => {
    categoryServices.putCategory(req, err => {
      err ? next(err) : res.json({ status: 'success' })
    })
  },
  deleteCategory: (req, res, next) => {
    categoryServices.deleteCategory(req, err => {
      err ? next(err) : res.json({ status: 'success' })
    })
  }
}

module.exports = categoryController

const categoryServices = require('../../services/category-services')
const categoryController = {
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req, (err, categories) => {
      if (err) next(err)
      else {
        if (req.params.id) {
          const category = categories.categories.find(category => category.id == req.params.id)
          return res.render('admin/categories', { categories: categories.categories, category })
        } else {
          return res.render('admin/categories', { categories: categories.categories })
        }
      }
    })
  },
  postCategory: (req, res, next) => {
    categoryServices.postCategory(req, err => {
      if (err) { next(err) } else {
        req.flash('success_messages', 'category was successfully created')
        res.redirect('/admin/categories')
      }
    })
  },
  putCategory: (req, res, next) => {
    categoryServices.putCategory(req, err => {
      if (err) next(err)
      else {
        req.flash('success_messages', 'category was successfully modified')
        res.redirect('/admin/categories')
      }
    })
  },
  deleteCategory: (req, res, next) => {
    categoryServices.deleteCategory(req, err => {
      if (err) next(err)
      else {
        req.flash('success_messages', 'category is successfully deleted')
        res.redirect('/admin/categories')
      }
    })
  }
}

module.exports = categoryController

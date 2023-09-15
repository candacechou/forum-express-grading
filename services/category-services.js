const { Category } = require('../models')
const categoryServices = {
  getCategories: (req, cb) => {
    Category.findAll({ raw: true }).then(categories => cb(null, { categories }))
      .catch(err => cb(err))
  },
  postCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.create({ name })
      .then(() => cb(null))
      .catch(err => cb(err))
  },
  putCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        category.update({ name }).then(() => cb(null))
      })
      .catch(err => cb(err))
  },
  deleteCategory: (req, cb) => {
    console.log(req.params.id)
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) cb(Error("Category didn't exist!"))
        category.destroy().then(() => cb(null))
      })

      .catch(err => cb(err))
  }
}

module.exports = categoryServices

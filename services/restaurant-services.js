const { Restaurant, Category, User, Comment, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantServices = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurantsId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        return cb(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      }).catch(err => cb(err))
  },

  getRestaurant: (req, cb) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restuarant didn't exist!")
      return restaurant.increment({
        viewCount: 1
      }).then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(fe => fe.id === req.user.id)
        const data = restaurant.toJSON()
        data.isFavorited = isFavorited
        data.isLiked = isLiked
        return cb(null, { data })
      })
    }).catch(err => cb(err))
  },
  getTopRestaurants: (req, cb) => {
    Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(topRestaurants => {
        const restaurants = topRestaurants.map(r => ({
          ...r.toJSON(),
          description: r.description ? (r.description.length >= 150 ? r.description.substring(0, 147) + '...' : r.description) : ' ',
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        return cb(null, { restaurants })
      })
      .catch(err => cb(err))
  },

  getCommentRestaurant: (req, cb) => {
    Comment.findAll({
      where: { userId: req.params.userId },
      raw: true
    }).then(comment => {
      const commentResID = comment.map(obj => obj.restaurantId)
      Restaurant.findAll({
        where: {
          id: commentResID
        },
        raw: true
      }).then(restaurant => cb(null, restaurant))
    }).catch(err => { cb(err) })
  },

  getFavoritedRestaurant: (req, cb) => {
    const userId = req.params.userId
    Favorite.findAll({
      where: { userId: userId },
      raw: true
    }).then(favorite => {
      const FavoriteResID = favorite.map(obj => obj.restaurantId)
      Restaurant.findAll({
        where: {
          id: FavoriteResID
        },
        raw: true
      }).then(restaurant => cb(null, restaurant))
    }).catch(err => cb(err))
  }
}

module.exports = restaurantServices

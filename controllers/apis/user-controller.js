const jwt = require('jsonwebtoken')
const userServices = require('../../services/user-services')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, err => err ? next(err) : res.json({ status: 'success' }))
  },

  followingUser: (req, res, next) => {
    userServices.followingUser(req, (err, following) => err ? next(err) : res.json({ status: 'success', following }))
  },
  followedUser: (req, res, next) => {
    userServices.followedUser(req, (err, followers) => err ? next(err) : res.json({ status: 'success', followers }))
  },

  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  getFavoritedRestuarant: (req, res, next) => {
    userServices.userFavoritedRestuarant(req, (err, restaurant) => err ? next(err) : res.json({ status: 'success', restaurant }))
  },
  getUserComments: (req, res, next) => {
    userServices.userComments(req, (err, comments) => err ? next(err) : res.json({ status: 'success', comments }))
  },
  getUserCommentRestaurant: (req, res, next) => {
    userServices.userCommentRestaurant(req, (err, restaurant) => err ? next(err) : res.json({ status: 'success', restaurant }))
  }

}

module.exports = userController

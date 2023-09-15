const { Restaurant, User, Favorite, Followship, Like, Comment } = require('../models')
const bcrypt = require('bcryptjs')
const { localFileHandler } = require('../helpers/file-helpers')
const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        cb(null)
      })
      .catch(err => cb(err))
  },
  addFavorite: (req, cb) => {
    const { restaurantId } = req.params
    Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ]).then(([restaurant, favorite]) => {
      if (!restaurant) throw new Error("Restauarant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      Favorite.create({
        userId: req.user.id,
        restaurantId
      }).then(() => cb(null))
    })
      .catch(err => cb(err))
  },
  removeFavorite: (req, cb) => {
    Promise.all([
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      }),
      Restaurant.findByPk(req.params.restaurantId)
    ]).then(([favorite, restaurant]) => {
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      favorite.destroy().then(() => cb(null))
    }).catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const { userId } = req.params
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        Followship.create({
          followerId: req.user.id,
          followingId: userId
        }).then(() => cb(null))
      }).catch(err => cb(err))
  },

  removeFollowing: (req, cb) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy().then(() => cb(null))
      })

      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const { restaurantId } = req.params
    Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ]).then(([restaurant, like]) => {
      if (!restaurant) throw new Error("Restauarant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')
      Like.create({
        userId: req.user.id,
        restaurantId
      }).then(() => cb(null))
    })
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    Promise.all([
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })
    ]).then(like => {
      if (!like) throw new Error("You haven't liked this restaurant")

      return like.destroy().then(() => cb(null))
    }).catch(err => cb(err))
  },
  getTopUsers: (req, cb) => {
    User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(followers => {
      const result = followers.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.some(f => f.id === user.id)
      })).sort((a, b) => b.followerCount - a.followerCount)
      return cb(null, { result })
    }).catch(err => cb(err))
  },

  putUser: (req, cb) => {
    const { name } = req.body
    const { file } = req
    if (req.user.id !== Number(req.params.id)) throw new Error('只能更改自己的資料！')
    Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        user.update({
          name,
          image: filePath || user.image
        }).then(() => cb(null))
      })
      .catch(err => cb(err))
  },
  userCommentRestaurant: (req, cb) => {
    Comment.findAll({
      where: { userId: req.user.id },
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

  userFavoritedRestuarant: (req, cb) => {
    const userId = req.user.id
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
  },
  userComments: (req, cb) => {
    const userId = req.user.id
    Comment.findAll({
      where: { userId: userId },
      raw: true,
      nest: true
    }).then(comment => cb(null, comment))
      .catch(err => cb(err))
  },
  followingUser: (req, cb) => {
    const userId = req.params.userId
    User.findByPk(userId, {
      include: [
        { model: User, as: 'Followings', attributes: ['id', 'name'] }
      ],
      raw: true,
      nest: true
    }).then(user => {
      const Following = user.Followings
      return cb(null, { Following })
    }).catch(err => cb(err))
  },

  followedUser: (req, cb) => {
    const userId = req.params.userId
    User.findByPk(userId, {
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'name'] }
      ],
      raw: true,
      nest: true
    }).then(user => {
      const Followed = user.Followers
      return cb(null, { Followed })
    }).catch(err => cb(err))
  }
}
module.exports = userServices

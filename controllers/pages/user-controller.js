const { Comment, User, Restaurant } = require('../../models')
const userServices = require('../../services/user-services')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, err => {
      if (err) {
        next(err)
      } else {
        req.flash('success_messages', '成功註冊！')
        res.redirect('back')
      }
    })
  },

  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Comment.findAll({
        where: { userId: req.params.id },
        raw: true
      })
    ])
      .then(async ([user, comment]) => {
        if (!user) throw new Error("User didn't exist!")
        const commentResID = comment.map(obj => obj.restaurantId)
        const restaurant = await Restaurant.findAll({
          where: {
            id: commentResID
          },
          raw: true
        })
        const numRestaurant = restaurant.length
        res.render('users/profile', { user: user.toJSON(), num_restaurant: numRestaurant, restaurant: restaurant })
      }).catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id).then(user => {
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user: user.toJSON() })
    }).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, err => {
      if (err) next(err)
      else {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      }
    })
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, err => err ? next(err) : res.redirect('back'))
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, err => err ? next(err) : res.redirect('back'))
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, err => err ? next(err) : res.redirect('back'))
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, err => err ? next(err) : res.redirect('back'))
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, result) => {
      if (err) next(err)
      else {
        res.render('top-users', { users: result.result })
      }
    })
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, err => err ? next(err) : res.redirect('back'))
  },

  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, err => err ? next(err) : res.redirect('back'))
  }
}

module.exports = userController

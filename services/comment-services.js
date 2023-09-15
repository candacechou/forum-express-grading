const { Restaurant, User, Comment } = require('../models')
const commentServices = {
  getTopComments: (req, cb) => {
    Comment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [User, Restaurant],
      raw: true,
      nest: true
    })
      .then(topComment => {
        return cb(null, { topComment })
      })
      .catch(err => cb(err))
  },
  postComment: (req, cb) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id

    if (!text) throw new Error('Comment text is required!')

    Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        Comment.create({
          text,
          restaurantId,
          userId
        }).then(() => cb(null))
      }).catch(err => cb(err))
  },
  deleteComment: (req, cb) => {
    Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!")
        comment.destroy().then(() => cb(null))
      })
      .catch(err => cb(err))
  }

}

module.exports = commentServices

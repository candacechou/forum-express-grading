const commentServices = require('../../services/comment-services')
const commentController = {

  postComment: (req, res, next) => {
    const { restaurantId } = req.body
    commentServices.postComment(req, err => err ? next(err) : res.redirect(`/restaurants/${restaurantId}`))
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, err => err ? next(err) : res.redirect('back'))
  }
}

module.exports = commentController

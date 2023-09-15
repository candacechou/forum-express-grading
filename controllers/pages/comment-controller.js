const commentServices = require('../../services/comment-services')
const commentController = {

  postComment: (req, res, next) => {
    const { restaurantId } = req.body
    commentServices.postComment(req, err => err ? next(err) : res.redirect(`/restaurants/${restaurantId}`))
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, err => err ? next(err) : res.redirect('back'))
  },
  getUserComments: (req, res, next) => {
    commentServices.getuserComments(req, (err, comments) => err ? next(err) : res.json({ status: 'success', comments }))
  }
}

module.exports = commentController

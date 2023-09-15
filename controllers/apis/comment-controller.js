const commentServices = require('../../services/comment-services')
const commentController = {
  getTopComments: (req, res, next) => {
    commentServices.getTopComments(req, (err, topComment) => err ? next(err) : res.json({ status: 'success', topComment }))
  },
  postComment: (req, res, next) => {
    commentServices.postComment(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  getUserComments: (req, res, next) => {
    commentServices.getUserComments(req, (err, comments) => err ? next(err) : res.json({ status: 'success', comments }))
  }
}

module.exports = commentController

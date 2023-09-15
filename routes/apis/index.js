const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const adminController = require('../../controllers/apis/admin-controller')
const commentController = require('../../controllers/apis/comment-controller')
const userController = require('../../controllers/apis/user-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const upload = require('../../middleware/multer')
const { apiErrorHandler } = require('../../middleware/error-handler')
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.post('/comments', authenticated, commentController.postComment)
router.get('/comments/top', authenticated, commentController.getTopComments)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

router.get('/comments/restaurants/:id', authenticated, restController.restaurantComment)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.get('/users/following/:userId', authenticated, userController.followingUser)

router.get('/users/followed/:userId', authenticated, userController.followedUser)

router.get('/users/comments', authenticated, userController.getUserComments)
router.get('/users/comments/restaurants', authenticated, userController.getUserCommentRestaurant)

router.get('/users/favorites/restaurants', authenticated, userController.getFavoritedRestuarant)

router.use('/', apiErrorHandler)
module.exports = router

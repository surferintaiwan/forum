const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryContorller')
const multer = require('multer')
const upload = multer({dest: 'temp/'})

router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)

router.get('/admin/categories', categoryController.getCategories)
router.get('/admin/categories/:id', categoryController.getCategories)

router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

module.exports = router
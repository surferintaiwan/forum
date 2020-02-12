const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

module.exports = app => {
    // 前台路由
    app.get('/', (req, res) => {
        res.redirect('/restaurants')
    })
    app.get('/restaurants', restController.getRestaurants)
    
    // 後台路由
    app.get('/admin', (req, res) => {
        res.redirect('/admin/restaurants')
    })
    app.get('/admin/restaurants', adminController.getRestaurants)
    
    // 使用者註冊、登入路由
    app.get('/signup', userController.signUpPage)
    app.post('/signup', userController.signUp)
}
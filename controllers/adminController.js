const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminServices.js')

module.exports = {
    getRestaurants: (req, res, data) => {
        adminService.getRestaurants(req, res, (data) => {
            return res.render('admin/restaurants', data)
        })
    },
    createRestaurant:(req, res) => {
        Category.findAll({raw: true})
                .then(categories => {
                    return res.render('admin/create', {categories: categories})
                })
    },
    postRestaurant: (req, res) => {
        adminService.postRestaurant(req, res, data => {
            if (data.status === 'Error') {
                req.flash('error_messages', data.message)
                return res.redirect('back')
            }
            req.flash('success_messages', data.message)
            return res.redirect('/admin/restaurants')
            
        }) 
    },
    getRestaurant: (req, res) => {
        adminService.getRestaurant(req, res, data=>{
            res.render('admin/restaurant', data)
        })
        
        Restaurant.findByPk(req.params.id, {include: [Category]})
                    .then(restaurant => {
                        return res.render('admin/restaurant', JSON.parse(JSON.stringify({restaurant: restaurant})))
                    })
                    
    },
    editRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        Category.findAll({raw:true})
                                .then(categories=>{
                                    return res.render('admin/create',  {
                                        categories: categories, 
                                        restaurant: restaurant.get()}
                                    )
                                })
                    })
    },
    putRestaurant: (req, res) => {
        if (!req.body.name) {
            req.flash('error_messages', '請輸入餐廳名稱')
            return res.redirect('back')
        }
        const {file} = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img)=> {
                return Restaurant.findByPk(req.params.id)
                .then(restaurant => {
                    restaurant.update({
                        name: req.body.name,
                        tel: req.body.tel,
                        address: req.body.address,
                        opening_hours: req.body.opening_hours,
                        description: req.body.description,
                        image: file ? img.data.link : restaurant.image,
                        CategoryId: req.body.categoryId
                    })
                })
                .then(restaurant => {
                    req.flash('success_messages', 'restaurant was successfully updated')
                    res.redirect('/admin/restaurants')
                }) 
            })
        } else {
            Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        restaurant.name = req.body.name,
                        restaurant.tel = req.body.tel,
                        restaurant.address = req.body.address,
                        restaurant.opening_hours = req.body.opening_hours,
                        restaurant.description = req.body.description
                        restaurant.CategoryId = req.body.categoryId
                        return restaurant.save()
                        /* 也可以寫成這樣
                        restaurant => {
                            restaurant.update({
                            name: req.body.name,
                            tel: req.body.tel,
                            address: req.body.address,
                            opening_hours: req.body.opening_hours,
                            description: req.body.description
                            image: restaurant.image
                          })
                        
                        */
                    })
                    .then(restaurant => {
                        req.flash('success_messages', '餐廳資料已更新')
                        res.redirect('/admin/restaurants')
                    })
        }
    },
    deleteRestaurant: (req, res) => {
        adminService.deleteRestaurant(req, res, data => {
            if (data.status === 'Success') {
                res.redirect('/admin/restaurants')
            }
        })
    },

    getUsers: (req, res) => {
        User.findAll()
            .then(users => {
                console.log(users)
                res.render('admin/users', JSON.parse(JSON.stringify({users: users})))
            })
    },
    putUsers: (req, res) => {
        User.findByPk(req.params.id)
            .then(user => {
                if (user.isAdmin) {
                    user.update({
                        isAdmin: false
                    })
                } else {
                    user.update({
                        isAdmin: true
                    })
                }
                return user
            }).then(user => {
                res.redirect('/admin/users')
            })
    }
}
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
        adminService.putRestaurant(req, res, data => {
            if (data.status === 'Error') {
                req.flash('error_messages', data.message)
                return res.redirect('back')
            } 
            req.flash('success_messages', data.message)
            return res.redirect('/')
        })
    },

    deleteRestaurant: (req, res) => {
        adminService.deleteRestaurant(req, res, data => {
            if (data.status === 'Success') {
                res.redirect('/admin/restaurants')
            }
        })
    },

    getUsers: (req, res) => {
        adminService.getUsers(req, res, data=> res.render('admin/users', data))
    },
    putUsers: (req, res) => {
        adminService.putUsers(req, res, data => res.redirect('/admin/users'))
    }
}
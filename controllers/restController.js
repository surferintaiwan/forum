const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Comment = db.Comment
const Category = db.Category
const restService = require('../services/restServices')

module.exports = {
    getRestaurants: (req, res) => {
        restService.getRestaurants(req, res, data => {
            return res.render('restaurants', data)
        })

    },
    getRestaurant: (req, res) => {
        restService.getRestaurant(req, res, data=> res.render('restaurant', data))
    },
    getFeeds: (req, res) => {
        restService.getFeeds(req, res, data => res.render('feeds', data))
    },
    getDashboard: (req, res) => {
        restService.getDashboard(req, res, data => res.render('restaurantDashboard', data)) 
    },
    getTopRestaurants: (req, res) => {
        restService.getTopRestaurants(req, res, data => res.render('topRestaurants', data))
    }
}
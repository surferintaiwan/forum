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
        restService.getRestaurant(req, res, data=> res.render('restaurant'))
    },
    getFeeds: (req, res) => {
        restService.getFeeds(req, res, data => res.render('feeds', data))
    },
    getDashboard: (req, res) => {
        Restaurant.findByPk(req.params.id, {raw: true, nest: true, include: [Category]})
                    .then(restaurant => {
                        Comment.findAndCountAll({where: {RestaurantId: req.params.id}})
                                .then(comments => {
                                    let commentsAmount = comments.count
                                    return res.render('restaurantDashboard', {
                                        restaurant: restaurant,
                                        commentsAmount: commentsAmount
                                    })
                                }) 
                    })
    },
    /*這樣寫也是可以，但restaurantDashboard那邊顯示評論數要改成{{restaurant.Comments.length}}
    getDashboard: (req, res) => {
        Restaurant.findByPk(req.params.id, {include: [Category, Comment]})
                    .then(restaurant => {
                        return res.render('restaurantDashboard', {restaurant: restaurant})
                    })
    }
    */
    getTopRestaurants: (req, res) => {
        restService.getTopRestaurants(req, res, data => res.render('topRestaurants', data))
    }
}
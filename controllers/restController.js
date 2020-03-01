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
        Restaurant.findByPk(req.params.id, {
            include: [
                Category,
                {model: Comment, raw:true, nest:true ,include: User},
                {model: User, as: 'FavoritedUsers'} ,
                {model: User, as: 'LikedUsers'}
            ]
        }).then(restaurant => {
            const isFavorited = restaurant.FavoritedUsers.map(r => r.id).includes(req.user.id)
            const isLiked = restaurant.LikedUsers.map(r => r.id).includes(req.user.id)
            restaurant.update({
                viewCounts: restaurant.viewCounts + 1
            })
            return res.render('restaurant', {
                restaurant: JSON.parse(JSON.stringify(restaurant)),
                isFavorited: isFavorited,
                isLiked: isLiked
            })
        })
        /*
        Restaurant.findByPk(req.params.id, {raw: true, nest: true, include: Category})
                    .then(restaurant => {
                        return res.render('restaurant' , {
                            restaurant: restaurant
                        })
                    })
        */
    },
    getFeeds: (req, res) => {
        Restaurant.findAll({
            raw: true,
            nest: true,
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [Category]
        }).then(restaurants => {
            Comment.findAll({
                raw: true,
                nest: true,
                limit:10,
                order: [['createdAt', 'DESC']],
                include: [User, Restaurant]
            }).then(comments=> {
                return res.render('feeds', {
                    restaurants: restaurants,
                    comments:comments
                })
            })
        })
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
        Restaurant.findAll({
            include: [{model: User, as: 'FavoritedUsers'}]
        })
        .then(restaurants => {
            let favoriteCount = 0
            // 重組成新陣列
            restaurants = restaurants.map(restaurant => {
                return {
                    ...restaurant.dataValues,
                    favoriteCount: restaurant.FavoritedUsers.length,
                    // 下面這個陣列用map跟includes一筆一筆比對有沒有被現在登入的使用者加入最愛過
                    isFavorited: restaurant.FavoritedUsers.map(user => user.id).includes(req.user.id)
                }
            })
            //排序
            restaurants = restaurants.sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 10)
            return res.render('topRestaurants', {
                restaurants: restaurants
            })
        })
    }
}
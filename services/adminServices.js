const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

module.exports = {
    getRestaurants: (req, res, callback) => {
        Restaurant.findAll({include: [Category]})
                  .then(restaurants => {
                      callback(JSON.parse(JSON.stringify({restaurants: restaurants})))
                  })
    },
    getRestaurant:(req, res, callback) => {
        Restaurant.findByPk(req.params.id, {include: [Category]})
                    .then(restaurant => {
                        callback(JSON.parse(JSON.stringify({restaurant: restaurant})))
                    })
    }

}
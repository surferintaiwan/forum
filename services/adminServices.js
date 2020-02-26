const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

module.exports = {
    getRestaurants: (req, res, callback) => {
        Restaurant.findAll({include: [Category]})
                  .then(restaurants => {
                      callback(JSON.parse(JSON.stringify({restaurants: restaurants})))
                  })
    }
}
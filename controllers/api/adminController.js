const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

module.exports = {
    getRestaurants: (req, res) => {
        Restaurant.findAll({include: [Category]})
                  .then(restaurants => {
                      res.json({restaurants: restaurants})
                  })
    }
}
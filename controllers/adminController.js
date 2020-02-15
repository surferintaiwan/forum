const db = require('../models')
const Restaurant = db.Restaurant

module.exports = {
    getRestaurants: (req, res) => {
        Restaurant.findAll()
                  .then(restaurants => {
                      console.log(restaurants)
                      return res.render('admin/restaurants', {
                          restaurants: restaurants
                      })
                  })
    }
}
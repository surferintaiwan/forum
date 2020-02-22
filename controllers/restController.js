const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

module.exports = {
    getRestaurants: (req, res) => {
        Restaurant.findAll({ include: Category })
                    .then(restaurants => {
                        // 把description拿出來處理，變成50個字元再存進去，最後給view用
                        const data = restaurants.map(r => { 
                            return {
                            ...r.dataValues,
                            description: r.description.substring(0, 50)
                        }})
                        console.log(data)
                        return res.render('restaurants', {
                            restaurants: JSON.parse(JSON.stringify(data))
                        })
                    })
    }
}

/*
// 其實也可以寫成這樣
const resController = {
    getRestaurants: (req, res) => {
        res.render('restaurants')
    }
}

module.exports = restController
*/
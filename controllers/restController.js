const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

module.exports = {
    getRestaurants: (req, res) => {
        // 如果選擇"全部"分類，categoryId就會是一開始宣告的空字串，就不會帶條件進去findAll裡面撈資料        
        let whereQuery = {}
        let categoryId = ''
        if (req.query.categoryId) {
            categoryId = Number(req.query.categoryId)
            whereQuery['CategoryId'] = categoryId
            console.log(whereQuery)
        }
        Restaurant.findAll({ include: Category, where: whereQuery})
                    .then(restaurants => {
                        // 把description拿出來處理，變成50個字元再存進去，最後給view用
                        const data = restaurants.map(r => { 
                            return {
                            ...r.dataValues,
                            description: r.description.substring(0, 50)
                        }})
                        Category.findAll({raw: true})
                                .then(categories => {
                                    return res.render('restaurants', {
                                        restaurants: JSON.parse(JSON.stringify(data)),
                                        categories: categories,
                                        categoryId: categoryId
                                    })
                                })
                    })
    },
    getRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id, {raw: true, nest: true, include: Category})
                    .then(restaurant => {
                        return res.render('restaurant' , {
                            restaurant: restaurant
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
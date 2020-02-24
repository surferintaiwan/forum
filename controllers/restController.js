const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Comment = db.Comment
const Category = db.Category
const pageLimit = 10

module.exports = {
    getRestaurants: (req, res) => {
        // 如果選擇"全部"分類，categoryId就會是一開始宣告的空字串，就不會帶條件進去findAll裡面撈資料        
        let whereQuery = {}
        let categoryId = ''
        let offset = 0
        if (req.query.categoryId) {
            categoryId = Number(req.query.categoryId)
            whereQuery['CategoryId'] = categoryId
        }
        
        // ---進行分頁處理(供撈資料用)---
        // 判斷如果"不是首次"進來的，就另外計算撈資料用的offset參數，因為如果是第一次進來的，它的網址會是/restaurants而已，req.query.page會沒資料是個undefined
        if (req.query.page - 1) {
            offset = (req.query.page - 1) * pageLimit || 0
        }
        Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit})
                    .then(restaurants => {
                        // ---進行分頁處理(供前端顯示頁碼或前後一頁使用)---
                        let page = Number(req.query.page) || 1 
                        let pages = Math.ceil(restaurants.count / pageLimit)
                        // 這是頁碼
                        let totalPages = Array.from({length: pages }).map((item, index) => index + 1)
                        let prev = page - 1 < 1 ? 1 : page - 1
                        let next = page + 1 > pages ? pages : page + 1
                        
                        // 把description拿出來處理，變成50個字元再存進去，最後給view用
                        const data = restaurants.rows.map(r => { 
                            return {
                            ...r.dataValues,
                            description: r.description.substring(0, 50)
                        }})
                        Category.findAll({raw: true})
                                .then(categories => {
                                    return res.render('restaurants', {
                                        restaurants: JSON.parse(JSON.stringify(data)),
                                        categories: categories,
                                        categoryId: categoryId,
                                        page: page,
                                        totalPages : totalPages,
                                        prev: prev,
                                        next: next
                                    })
                                })
                    })
    },
    getRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id, {
            include: [
                Category,
                {model: Comment, raw:true, nest:true ,include: User} 
            ]
        }).then(restaurant => {
            return res.render('restaurant', {
                restaurant: JSON.parse(JSON.stringify(restaurant))
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
                                    res.render('restaurantDashboard', {
                                        restaurant: restaurant,
                                        commentsAmount: commentsAmount
                                    })
                                }) 
                    })
    }
}
const db = require('../models')
const Restaurant = db.Restaurant

module.exports = {
    getRestaurants: (req, res) => {
        Restaurant.findAll()
                  .then(restaurants => {
                      return res.render('admin/restaurants', 
                          JSON.parse(JSON.stringify({restaurants:restaurants}))
                      )
                  })
    },
    createRestaurant:(req, res) => {
        res.render('admin/create')
    },
    postRestaurant: (req, res) => {
        if (!req.body.name) {
            req.flash('error_messages', '請輸入餐廳名稱')
            return res.redirect('back')
        }
        newRestaurant = new Restaurant({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description
        })
        newRestaurant.save().then(restaurant => {
            req.flash('success_messages', '已新增餐廳')
            res.redirect('/admin/restaurants')
        })
    },
    getRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        return res.render('admin/restaurant', JSON.parse(JSON.stringify({restaurant: restaurant})))
                    })
                    
    },
    editRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        return res.render('admin/create' , JSON.parse(JSON.stringify({restaurant: restaurant})))
                    })
    },
    putRestaurant: (req, res) => {
        if (!req.body.name) {
            req.flash('error_messages', '請輸入餐廳名稱')
            return res.redirect('back')
        }

        Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        restaurant.name = req.body.name,
                        restaurant.tel = req.body.tel,
                        restaurant.address = req.body.address,
                        restaurant.opening_hours = req.body.opening_hours,
                        restaurant.description = req.body.description
                        return restaurant.save()
                        /* 也可以寫成這樣
                        restaurant.update({
                            name: req.body.name,
                            tel: req.body.tel,
                            address: req.body.address,
                            opening_hours: req.body.opening_hours,
                            description: req.body.description
                          })
                        */
                    })
                    .then(restaurant => {
                        req.flash('success_messages', '餐廳資料已更新')
                        res.redirect('/admin/restaurants')
                    })
    },
    deleteRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        restaurant.destroy()
                    })
                    .then(restaurant => {
                        res.redirect('/admin/restaurants')
                    })
    }
}
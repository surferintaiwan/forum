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
    createRestaurant:(req, res)=>{
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
    }
}
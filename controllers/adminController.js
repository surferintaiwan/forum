const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '7c48630cb5a6a56'

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
        const {file} = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err,img) => {
                return Restaurant.create({
                    name: req.body.name,
                    tel: req.body.tel,
                    address: req.body.address,
                    opening_hours: req.body.opening_hours,
                    description: req.body.description,
                    image: file ? img.data.link: null
                })
                .then(restaurant => {
                    req.flash('success_messages', 'restaurant was successfully created')
                    return res.redirect('/admin/restaurants')
                })
            })
            
            /* 還沒上傳到imgur以前的寫法
            fs.readFile(file.path, (err, data)=>{
                if (err) console.log('Error: ', err)    
                fs.writeFile(`upload/${file.originalname}`, data, ()=>{
                    Restaurant.create({
                        name: req.body.name,
                        tel: req.body.tel,
                        address : req.body.address,
                        opening_hours: req.body.opening_hours,
                        description: req.body.description,
                        image: file ? `/upload/${file.originalname}`: null
                    }).then((restaurant) => {
                        req.flash('success_messages', 'restaurant was successfully created')
                        res.redirect('/admin/restaurants')
                    })
                })
            })
            */
        } else {
            newRestaurant = new Restaurant({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: null
            })
            newRestaurant.save().then(restaurant => {
                req.flash('success_messages', '已新增餐廳')
                res.redirect('/admin/restaurants')
            })
        }


        
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
        const {file} = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img)=> {
                return Restaurant.findByPk(req.params.id)
                .then(restaurant => {
                    restaurant.update({
                        name: req.body.name,
                        tel: req.body.tel,
                        address: req.body.address,
                        opening_hours: req.body.opening_hours,
                        description: req.body.description,
                        image: file ? img.data.link : restaurant.image
                    })
                })
                .then(restaurant => {
                    req.flash('success_messages', 'restaurant was successfully updated')
                    res.redirect('/admin/restaurants')
                }) 
            })
            
            /*
            圖片還沒上傳到imgur以前的作法
            fs.readFile(file.path, (err, data) => {
                if (err) console.log('Error:', err)
                fs.writeFile(`upload/${file.originalname}`, data, () => {
                    Restaurant.findByPk(req.params.id)
                    .then(restaurant=> {
                        restaurant.update({
                            name: req.body.name,
                            tel: req.body.tel,
                            address: req.body.address,
                            opening_hours: req.body.opening_hours,
                            description: req.body.description,
                            image: file ? `/upload/${file.originalname}` : null
                        })
                    })
                    .then(restaurant => {
                        req.flash('success_messages', 'restaurant was successfully updated')
                        res.redirect('/admin/restaurants')
                    })
                })
            })
            */ 
            
        } else {
            Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        restaurant.name = req.body.name,
                        restaurant.tel = req.body.tel,
                        restaurant.address = req.body.address,
                        restaurant.opening_hours = req.body.opening_hours,
                        restaurant.description = req.body.description
                        return restaurant.save()
                        /* 也可以寫成這樣
                        restaurant => {
                            restaurant.update({
                            name: req.body.name,
                            tel: req.body.tel,
                            address: req.body.address,
                            opening_hours: req.body.opening_hours,
                            description: req.body.description
                            image: restaurant.image
                          })
                        
                        */
                    })
                    .then(restaurant => {
                        req.flash('success_messages', '餐廳資料已更新')
                        res.redirect('/admin/restaurants')
                    })
        }
    },
    deleteRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        restaurant.destroy()
                    })
                    .then(restaurant => {
                        res.redirect('/admin/restaurants')
                    })
    },

    getUsers: (req, res) => {
        User.findAll()
            .then(users => {
                console.log(users)
                res.render('admin/users', JSON.parse(JSON.stringify({users: users})))
            })
    },
    putUsers: (req, res) => {
        User.findByPk(req.params.id)
            .then(user => {
                if (user.isAdmin) {
                    user.update({
                        isAdmin: false
                    })
                } else {
                    user.update({
                        isAdmin: true
                    })

                }
                return user
            }).then(user => {
                res.redirect('/admin/users')
            })
    }
}
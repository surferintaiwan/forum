const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

module.exports = {
    getRestaurants: (req, res, callback) => {
        Restaurant.findAll({include: [Category]})
                  .then(restaurants => {
                      callback(JSON.parse(JSON.stringify({restaurants: restaurants})))
                  })
    },
    getRestaurant: (req, res, callback) => {
        Restaurant.findByPk(req.params.id, {include: [Category]})
                    .then(restaurant => {
                        callback(JSON.parse(JSON.stringify({restaurant: restaurant})))
                    })
    },
    deleteRestaurant: (req, res, callback) => {
        Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        restaurant.destroy()
                    })
                    .then(restaurant => {
                        callback({status: 'Success', message: ''})
                    })
    },
    postRestaurant: (req, res, callback) => {
        if (!req.body.name) {
            return callback({status: 'Error', message: '請輸入餐廳名稱'})
        }
        const {file} = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                return Restaurant.create({
                    name: req.body.name,
                    tel: req.body.tel,
                    address: req.body.address,
                    opening_hours: req.body.opening_hours,
                    description: req.body.description,
                    image: file ? img.data.link: null,
                    CategoryId: req.body.categoryId
                })
                .then(restaurant => {
                    return callback({status: 'Success', message: '已新增餐廳'})
                })
            })
        } else {
            newRestaurant = new Restaurant({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: null,
                CategoryId: req.body.categoryId
            })
            newRestaurant.save().then(restaurant => {
                return callback({status: 'Success', message: '已新增餐廳'})
            })
        }
        
    },
    putRestaurant: (req, res, callback) => {
        if (!req.body.name) {
            return callback({status: 'Error', message: '請輸入餐廳名稱'})       
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
                        image: file ? img.data.link : restaurant.image,
                        CategoryId: req.body.categoryId
                    })
                })
                .then(restaurant => {
                    return callback({status: 'Success', message: '已更新餐廳'})
                }) 
            })
        } else {
            Restaurant.findByPk(req.params.id)
                    .then(restaurant => {
                        restaurant.name = req.body.name,
                        restaurant.tel = req.body.tel,
                        restaurant.address = req.body.address,
                        restaurant.opening_hours = req.body.opening_hours,
                        restaurant.description = req.body.description
                        restaurant.CategoryId = req.body.categoryId
                        return restaurant.save()
                    })
                    .then(restaurant => {
                        return callback({status: 'Success', message: '已更新餐廳'})
                    })
        }
    }
}
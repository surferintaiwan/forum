const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Followership = db.Followership
const Like = db.Like
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userService = require('../services/userServices')
/* 如果是想要把temp資料夾內的圖片複製到upload就要載入fs
const fs = require('fs')
*/

const userController = {
    signUpPage: (req, res) => {
        res.render('signup')
    },
    signUp: (req, res) => {
        name = req.body.name
        email = req.body.email
        password = req.body.password
        passwordCheck = req.body.passwordCheck
        // 驗證兩次密碼是否相同
        if (password !== passwordCheck) {
            req.flash('error_messages', '兩次密碼不相符')
            return res.redirect('/signup')
        } else {
        // 查詢帳號是否已註冊
            User.findOne({where: {email: email}})
                .then(user=>{
                    // 有註冊過就跳出error訊息
                    if (user) {
                        req.flash('error_messages', '這個帳號註冊過囉!')
                        return res.redirect('/signup')
                    } else {
                        // 沒註冊過則存進資料庫
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(password, salt, function(err, hash) {
                                // Store hash in your password DB.
                                const newUser = new User({
                                    name: name,
                                    email: email,
                                    password: hash
                                })
                                newUser
                                .save()
                                .then(user => {
                                    req.flash('success_messages', '註冊成功囉!')
                                    return res.redirect('/signin')
                                })
                            })
                        })
                    }     
                })
        }
    },
    signInPage: (req,res) => {
        res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_messages', '登入成功')
        res.redirect('/restaurants')
    },
    logOut:(req, res) => {
        req.flash('success_messages', '登出成功')
        req.logout()
        res.redirect('/signin')
    },
    getUser: (req, res)=>{
        userService.getUser(req, res, data => res.render('userProfile', data))
    },
    editUser: (req, res) => {
        res.render('editProfile')
    },
    putUser: (req, res, data) => {
        userService.putUser(req, res, data => {
            if (data.status === 'Error') {
                req.flash('error_messages', data.message)
                return res.redirect('back')
            }
            req.flash('success_messages', data.message)
            return res.redirect(`/users/${req.params.id}`)
        })
    },
    addFavorite: (req, res) => {
        userService.addFavorite(req, res, data => res.redirect('back'))
    },
    removeFavorite: (req, res) => {
        userService.removeFavorite(req, res, data => res.redirect('back'))
    },
    addLike: (req, res) => {
        Like.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        })
        .then(like => {
            return res.redirect('back')
        })
    },
    removeLike: (req, res) => {
        Like.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.restaurantId
            }
        })
        .then(like => {
            like.destroy()
                .then(like => {
                    return res.redirect('back')
                })
        })
    },
    getTopUser: (req, res) => {
        userService.getTopUser(req, res, data => res.render('topUser', data))
    },
    addFollowing: (req, res) => {
        Followership.create({
            followerId: req.user.id,
            followingId: req.params.userId
        })
        .then(followship => {
            return res.redirect('back')
        })
    },
    removeFollowing: (req, res) => {
        Followership.findOne({
            where: {
                followerId: req.user.id,
                followingId: req.params.userId
            }
        })
        .then(followership => {
            followership.destroy()
                        .then(followship => {
                            return res.redirect('back')
                        })
        })
    }
}

module.exports = userController
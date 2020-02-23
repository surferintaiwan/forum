const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
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
        User.findByPk(req.params.id)
            .then(user => {
                let commentsAmounts = 0
                Comment.findAndCountAll({include: Restaurant, where: {UserId: req.params.id}})
                        .then(comments => {
                            commentsAmounts = comments.count
                            return res.render('userProfile', {
                                requestUser: user.get(),
                                commentsAmounts: commentsAmounts,
                                comments: JSON.parse(JSON.stringify(comments.rows))
                            })
                        })
            })
        
    },
    editUser: (req, res) => {
        res.render('editProfile')
    },
    putUser: (req, res) => {
        if (!req.body.name) {
            req.flash('error_messages', '請輸入使用者名稱')
            return res.redirect('back')
        }
        const {file} = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                User.findByPk(req.params.id)
                        .then(user => {
                            user.update({
                                name: req.body.name,
                                image: file ? img.data.link : null
                            })
                            .then(user => {
                                req.flash('success_messages', 'restaurant was successfully created')
                                return res.redirect(`/users/${req.params.id}`)
                            })
                        })
            })
        /* 這是把檔案從temp複製到upload的寫法
        if (file) {
            fs.readFile(file.path, (err, data) => {
                if (err) console.log('Error:', err)
                fs.writeFile(`upload/${file.originalname}`, data, ()=>{
                    User.findByPk(req.params.id)
                        .then(user => {
                            user.update({
                                name: req.body.name,
                                image: file ? `/upload/${file.originalname}` : null
                            })
                            .then(user => {
                                req.flash('success_messages', 'restaurant was successfully created')
                                return res.redirect(`/users/${req.params.id}`)
                            })
                        })
                })
            })
        */
        } else {
            User.findByPk(req.params.id)
                .then(user => {
                    user.update({
                        name:req.body.name
                    }).then(user => {
                        req.flash('success_messages', 'restaurant was successfully created')
                        return res.redirect(`/users/${req.params.id}`)
                    })
                })
        }
    }
}

module.exports = userController
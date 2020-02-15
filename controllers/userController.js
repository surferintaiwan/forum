const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
    }
}

module.exports = userController
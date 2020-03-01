const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const userService = require('../../services/userServices')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const Jwtstrategy = passportJWT.Strategy


let userController = {
    signIn: (req, res) => {
        // 檢查必要資料
        if (!req.body.email || !req.body.password) {
            return res.json({status: 'Error', message: '帳號或密碼沒有填寫'})
        }
        // 檢查user是否存在與密碼是否正確
        let username = req.body.email
        let password = req.body.password

        User.findOne({where: {email: username}})
            .then(user => {
                if (!user) return res.status(401).json({status: 'error', message: '沒有這個使用者'})
                if (!bcrypt.compareSync(password, user.password)) {
                    return res.status(401).json({status: 'Error', message: '密碼錯誤'})
                }
                // 簽發token
                let payload = {id: user.id}
                let token = jwt.sign(payload, process.env.JWT_SECRET)
                return res.json({
                    status: 'Success',
                    message: 'ok',
                    token: token,
                    user: {
                        id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
                    }
                })
            })
    },
    signUp: (req, res) => {
        name = req.body.name
        email = req.body.email
        password = req.body.password
        passwordCheck = req.body.passwordCheck
        // 驗證兩次密碼是否相同
        if (password !== passwordCheck) {
            res.json({status: 'Error', message: '兩次密碼不相符'})
        } else {
        // 查詢帳號是否已註冊
            User.findOne({where: {email: email}})
                .then(user=>{
                    // 有註冊過就跳出error訊息
                    if (user) {
                        res.json({status: 'Error', message: '這個帳號註冊過囉!'})
      
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
                                    res.json({status: 'Error', message: '註冊成功囉!'})
                                })
                            })
                        })
                    }     
                })
        }
    },
    getUser: (req, res)=>{
        userService.getUser(req, res, data => res.json(data))
    },
    putUser: (req, res, data) => {
        userService.putUser(req, res, data => res.json(data))
    },
    getTopUser: (req, res) => {
        userService.getTopUser(req, res, data => res.json(data))
    },
}

module.exports = userController
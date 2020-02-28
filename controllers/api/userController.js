const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

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
    }
}

module.exports = userController
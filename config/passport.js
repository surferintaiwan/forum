const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ where: {email: username}})
            .then(user => {
                if (!user) {
                    return done(null, false, req.flash('error_messages', '帳號還沒註冊'))
                }
                bcrypt.compare(password, user.password, function(err, isMatch) {
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤' ))
                    }
                })
            })
    }
))

passport.serializeUser(function(user, done) {
    done(null, user.id)
})
  
passport.deserializeUser(function(id, done) {
    User.findByPk(id)
        .then(user => {
            done(null, user)
        })
})

module.exports = passport
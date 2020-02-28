const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

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
    User.findByPk(id, {
        include: [
            {model: Restaurant, as: 'FavoritedRestaurants'},
            {model: Restaurant, as: 'LikedRestaurants'},
            {model: User, as: 'Followers'},
            {model: User, as: 'Followings'}
        ]
    })
    .then(user => {
       return done(null, user.toJSON())
    })
})

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    User.findByPk(jwt_payload.id, {
        include: [
            {model: db.Restaurant, as: 'FavoritedRestaurants'},
            {model: db.Restaurant, as: 'LikedRestaurants'},
            {model: User, as: 'Followers'},
            {model: User, as: 'Followings'}
        ]
    }).then(user => {
        if (!user) return next(null, false)
        return next(null, user)
    })
})

passport.use(strategy)

module.exports = passport
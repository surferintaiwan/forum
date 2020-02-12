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
                    res.redirect('/signin')
                })
            })
            
        })
    }
}

module.exports = userController
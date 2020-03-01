const db = require('../models')
const User = db.User

module.exports = {
    getTopUser: (req, res, callback) => {
        User.findAll({
            include: [
                {model: User, as: 'Followers'}
            ]
        })
        .then(users => {
            users = users.map(user => { 
                return {
                ...user.dataValues,
                FollowerCount: user.Followers.length,
                isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
                }
            })
            users = users.sort((a, b) =>  b.FollowerCount - a.FollowerCount)
            return callback({users: users})
        })
    },
}
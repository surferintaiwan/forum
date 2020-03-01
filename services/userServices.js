const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant

module.exports = {
    getUser: (req, res, callback)=>{
        User.findByPk(req.params.id)
            .then(user => {
                Comment.findAndCountAll({include: Restaurant, where: {UserId: req.params.id}})
                        .then(comments => {
                            let commentsAmounts = comments.count
                            return callback({
                                requestUser: user.get(),
                                commentsAmounts: commentsAmounts,
                                comments: JSON.parse(JSON.stringify(comments.rows))
                            })
                        })
            })
    },
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
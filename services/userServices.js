const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Followership = db.Followership
const Like = db.Like
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    putUser: (req, res, callback) => {
        if (!req.body.name) {
            return callback({status: 'Error', message: '請輸入使用者名稱'})
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
                                return callback({status: 'Success', message:'使用者資料已修改'})
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
                        return callback({status: 'Success', message:'使用者資料已修改'})
                    })
                })
        }
    },
    addFavorite: (req, res, callback) => {
        return Favorite.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        })
        .then((favorite)=> {
            return callback({status: 'Success', message: ''})
        })
    },
    removeFavorite: (req, res, callback) => {
        return Favorite.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.restaurantId
            }
        })
        .then(favorite => {
            favorite.destroy()
                    .then(favorite => {
                        return callback({status: 'Success', message: ''})
                    })
            
        })
    },
    addLike: (req, res, callback) => {
        Like.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        })
        .then(like => {
            return callback({status: 'Success', message: ''})
        })
    },
    removeLike: (req, res, callback) => {
        Like.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.restaurantId
            }
        })
        .then(like => {
            like.destroy()
                .then(like => {
                    return callback({status: 'Success', message: ''})
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
    addFollowing: (req, res, callback) => {
        Followership.create({
            followerId: req.user.id,
            followingId: req.params.userId
        })
        .then(followship => {
            return callback({status: 'Success', message: ''})
        })
    },
    removeFollowing: (req, res, callback) => {
        Followership.findOne({
            where: {
                followerId: req.user.id,
                followingId: req.params.userId
            }
        })
        .then(followership => {
            followership.destroy()
                        .then(followship => {
                            return callback({status: 'Success', message: ''})
                        })
        })
    }
}
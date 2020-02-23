const db = require('../models')
const Comment = db.Comment

module.exports = {
    postComment: (req, res) => {
        Comment.create({
            text: req.body.text,
            RestaurantId: req.body.restaurantId,
            UserId: req.user.id
        }).then(comment => {
            res.redirect(`/restaurants/${req.body.restaurantId}`)
        })
    },
    deleteComment: (req, res) => {
        Comment.findByPk(req.params.id)
                .then(comment => {
                    comment.destroy()
                            .then(comment=>{
                                res.redirect(`/restaurants/${comment.RestaurantId}`)
                            })
                })
    }
}
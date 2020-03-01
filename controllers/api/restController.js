const restService = require('../../services/restServices')


module.exports = {
    getRestaurants: (req, res) => {
        restService.getRestaurants(req, res, data => {
            return res.json(data)
        })
    },
    getFeeds: (req, res) => {
        restService.getFeeds(req, res, data => res.json(data))
    },
    getTopRestaurants: (req, res) => {
        restService.getTopRestaurants(req, res, data => res.json(data))
    }
}
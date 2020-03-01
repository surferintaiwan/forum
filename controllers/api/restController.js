const restService = require('../../services/restServices')


module.exports = {
    getRestaurants: (req, res) => {
        restService.getRestaurants(req, res, data => {
            return res.json(data)
        })

    }
}
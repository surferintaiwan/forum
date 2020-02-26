const adminService = require('../../services/adminServices.js')

module.exports = {
    getRestaurants: (req, res) => {
        adminService.getRestaurants(req, res, data => {
            res.json(data)
        })
    }
}
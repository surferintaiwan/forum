const adminService = require('../../services/adminServices.js')

module.exports = {
    getRestaurants: (req, res) => {
        adminService.getRestaurants(req, res, data => {
            res.json(data)
        })
    },
    getRestaurant: (req, res) => {
        adminService.getRestaurant(req, res, data =>{
            res.json(data)
        })
    },
    deleteRestaurant: (req, res) => {
        adminService.deleteRestaurant(req, res, data => {
            res.json(data)
            }
        )
    }
}
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
    postRestaurant: (req, res) => {
        adminService.postRestaurant(req, res, data => {
            res.json(data)
        })
    },
    deleteRestaurant: (req, res) => {
        adminService.deleteRestaurant(req, res, data => {
            res.json(data)
        })
    },
    putRestaurant: (req, res) => {
        adminService.putRestaurant(req, res, data => {
            return res.json(data)
        })
    },
    getUsers: (req, res) => {
        adminService.getUsers(res, res, data => res.json(data))
    },
    putUsers: (req, res) => {
        adminService.putUsers(req, res, data => res.json(data))
    }
}
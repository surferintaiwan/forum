const db = require('../../models')
const Category = db.Category
const categoryService = require('../../services/categoryServices')

module.exports = {
    getCategories: (req, res) => {
        categoryService.getCategories(req, res, data => {
            return res.json(data)
        })
    },
    postCategory: (req, res) => {
        categoryService.postCategory(req, res, data => {
            return res.json(data)
        })
    },
    putCategory: (req, res) =>{
        categoryService.putCategory(req, res, data => {
            res.json(data)
        })
    }
}
const db = require('../../models')
const Category = db.Category
const categoryService = require('../../services/categoryServices')

module.exports = {
    getCategories: (req, res) => {
        categoryService.getCategories(req, res, data => {
            return res.json(data)
        })
    }
}
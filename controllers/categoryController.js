const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryServices')

module.exports = {
    getCategories: (req, res) => {
        categoryService.getCategories(req, res, data => {
            return res.render('admin/categories', data)
        })
        
    },
    postCategory: (req, res) => {
        categoryService.postCategory(req, res, data => {
            if (data.status === 'Success') {
                return res.redirect('/admin/categories')
            }
            req.flash('error_messages', data.message)
            return res.redirect('back')
        })
    },
    putCategory: (req, res) =>{
        categoryService.putCategory(req, res, data => {
            if (data.status === 'Success') {
                req.flash('success_messages', data.message)
                return res.redirect('/admin/categories')
            }
            req.flash('error_messages', data.message)
            return res.redirect('/admin/categories')
        })
    },
    deleteCategory: (req, res) => {
        categoryService.deleteCategory(req, res, data => {
            res.redirect('/admin/categories')
        })
    }
}
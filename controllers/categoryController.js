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
        if (req.body.categoryName) {
            Category.findByPk(req.params.id)
                .then(category => {
                    category.update({
                        name: req.body.categoryName
                    }).then(category => {
                        req.flash('success_messages', '更新分類名稱成功')
                        return res.redirect('/admin/categories')
                    })
                })
        } else {
            req.flash('error_messages', '請輸入分類名稱')
            return res.redirect('/admin/categories')
        }
        
    },

    deleteCategory: (req, res) => {
        Category.findByPk(req.params.id)
                .then(category => {
                    category.destroy()
                            .then(category => {
                                res.redirect('/admin/categories')
                            })
                })
    }
}
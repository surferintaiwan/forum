const db = require('../models')
const Category = db.Category

module.exports = {
    getCategories: (req, res) => {
        Category.findAll({raw: true})
                .then(categories => {       
                    if (req.params.id) {   
                        Category.findByPk(req.params.id)
                                .then(category => {
                                return res.render('admin/categories', {categories: categories, category: category.get()})
                                })
                    } else {
                        return res.render('admin/categories', {categories: categories})
                    }
                })
    },

    postCategory: (req, res) => {
        if (req.body.categoryName) {
            Category.create({
                name: req.body.categoryName
            }).then(category => {
                return res.redirect('/admin/categories')
            })
        } else {
            req.flash('error_messages', '請輸入分類名稱')
            res.redirect('back')
        }
        
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
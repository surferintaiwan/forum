const db = require('../models')
const Category = db.Category

module.exports = {
    getCategories: (req, res, callback) => {
        Category.findAll({raw: true})
                .then(categories => {       
                    if (req.params.id) {   
                        Category.findByPk(req.params.id)
                                .then(category => {
                                callback({categories: categories, category: category.get()})
                                })
                    } else {
                        callback({categories: categories})
                    }
                })
    },
    postCategory: (req, res, callback) => {
        if (req.body.categoryName) {
            Category.create({
                name: req.body.categoryName
            }).then(category => {
              return callback({status: 'Success', message: '分類新增成功'})
            })
        } else {
            return callback({status: 'Error', message: '請輸入分類名稱'})
        }
        
    },
    putCategory: (req, res, callback) =>{
        if (req.body.categoryName) {
            Category.findByPk(req.params.id)
                .then(category => {
                    category.update({
                        name: req.body.categoryName
                    }).then(category => {
                        callback({status: 'Success', message: '更新分類名稱成功'})
                    })
                })
        } else {
            callback({status: 'Error', message: '請輸入分類名稱'})
        }  
    }
}
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
    }
}
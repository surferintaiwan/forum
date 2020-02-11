module.exports = {
    getRestaurants: (req, res) => {
        res.render('restaurants')
    }
}

/*
// 其實也可以寫成這樣
const resController = {
    getRestaurants: (req, res) => {
        res.render('restaurants')
    }
}

module.exports = restController
*/
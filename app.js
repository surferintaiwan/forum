const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, ()=>{
    db.sequelize.sync()
    console.log(`app listening`)
})

require('./routes/index.js')(app)
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const db = require('./models')

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.listen(port, ()=>{
    db.sequelize.sync()
    console.log(`app listening`)
})

require('./routes/index.js')(app)
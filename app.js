const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const passport = require('./config/passport.js')

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers.js') 
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))

app.use('/upload', express.static(__dirname + '/upload'))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req,res,next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    res.locals.user = req.user
    next()
})

app.use(methodOverride('_method'))

app.listen(port, ()=>{
    db.sequelize.sync()
    console.log(`app listening`)
})

require('./routes')(app)
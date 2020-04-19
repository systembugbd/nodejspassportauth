const express           = require('express')
const mongoose          = require('mongoose')
const expressLayouts    = require('express-ejs-layouts')
const db                = require('./config/keyes').mongoURI
const flash             = require('connect-flash')
const session           = require('express-session')
const passport          = require('passport')

require('./config/passport')(passport)

//init Express to app
const app = express()

app.use(expressLayouts)
app.set('view engine','ejs')



//BodyParser
app.use(express.urlencoded({ extended: false }))

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

//Connect flash
app.use(flash())

//Global Vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//routes 
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT)
    //DB connection
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log("MongoDB Connected...")
    })
    .catch(err => console.log(err))
})
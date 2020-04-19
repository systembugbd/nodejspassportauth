const express = require('express')
const User = require('../models/User')
const bcript = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.get('/register', (req, res, next) => {
    res.render('register')
})

// Register Handler
router.post('/register', (req, res, next) => {
    
    let {name, email, password, password2} = req.body

    let errors = []

    //check required fields

    if(!name || !email || !password){
        errors.push({msg: "Please filled all fields"})
    }else if(password !== password2){
        errors.push({msg: "Password does'nt match"})
    }else if(password.length < 6){
        errors.push({msg: "Passwrod should be atleast 6 Characters"})
    }
    
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
      //Validation pass
        User.findOne({email: email})
            .then(user => {
                if(user){
                    errors.push({ msg: 'Email Already Registered'})
                    
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                  // Hash Password
                  bcript.genSalt(10, (err, salt) => bcript.hash(newUser.password, salt, (err, hash) =>{
                    if(err) throw err
                    //set password to hash
                    newUser.password = hash
                    //Save user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', "You are now registerd and can login")
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
                  }))
                }
            })
            .catch(err => console.log(err))
    }
})

//Login Handle 
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res, next) =>{
    req.logout()
    req.flash('success_msg', 'Your are logged out')
    res.redirect('/users/login')
})


module.exports = router
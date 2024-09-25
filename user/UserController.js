const express = require('express')
const router = express.Router()
const User = require('./user')
const bcrypt = require('bcryptjs')

router.get('/admin/users',(req,res) => {
    User.findAll().then( users => {
        res.render('admin/users/index',{users: users})
    })
})

router.get('/admin/users/new',(req,res) => {
    res.render('admin/users/create')
})

router.post('/users/create',(req,res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where: {email:email}}).then( users => {
        if(users == undefined){
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password,salt)

            User.create({
                email: email,
                password: hash
            }).then( () => {
                res.redirect('/admin/users')
            }).catch( err => {
                res.redirect('/admin/users/new')
            })
        } else {
            res.redirect('/admin/users/new')
        }
    })
})

router.post('/users/delete', (req,res) => {
    let id = req.body.id

    if(isNaN(id)){
        res.redirect('/admin/users')
    }

    if(id != undefined) {
        if(!isNaN(id)){
            User.destroy({where:{id:id}}).then(()=> {
                res.redirect('/admin/users')
            })
        } else {
            res.redirect('/admin/users')
        }
    } else {
        res.redirect('/admin/users')
    }
})

router.get('/admin/users/edit/:id',(req,res) => {
    let id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/users')
    }

    User.findByPk(id).then( users => {
        if(users != undefined){
            res.render('admin/users/edit',{users: users})
        } else {
            res.redirect('/admin/users')
        }
    }).catch( err => {
        res.redirect('/admin/users')
    })
})

router.post('/users/update',(req,res) => {
    let email = req.body.email
    let id = req.body.id

    User.update({email:email},{where:{id:id}}).then( () => {
        res.redirect('/admin/users')
    })
})

router.get('/login',(req,res) => { 
    res.render('admin/users/login')
})

router.post('/authenticate',(req,res) => {
    let email = req.body.email
    let password = req.body.password 

    User.findOne({where: {email: email}}).then( user => {
        if(user != undefined){
            var validate = bcrypt.compareSync(password, user.password)

            if (validate){
                req.session.user = {
                    id : user.id,
                    email : user.email
                }
                res.redirect('/admin/articles')
            } else { 
                res.redirect('/login')
            }
        } else { 
            res.redirect('/login')
        }
    })
})

router.get('/logout',(req,res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const connection = require('./database/database')
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const userController = require('./user/UserController')
const Article = require('./articles/Article')
const Category = require('./categories/category')
const User = require('./user/user')

app.set('view engine','ejs')
app.use(express.static('public'))

app.use(session({
    secret: 'algumtermo', cookie:{ maxAge: 3000000 }
}))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

connection.authenticate().then(() => {
    console.log('Connection Success!')
}).catch((err) => {
    console.log(err)
})

app.use('/',categoriesController)
app.use('/',articlesController)
app.use('/',userController)

app.get('/session', (req,res) => {
    req.session.treinamento = 'Treinamento Node.js'
    req.session.ano = 2024
    req.session.email = 'raphael@gmail.com'
    req.session.user = {
        username: 'Raphael',
        email: 'raphael@gmail.com',
        id: 202
    }
    res.send('Sessão Gerada!')
})

app.get('/leitura', (req,res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano : req.session.ano,
        email : req.session.email,
        user: req.session.user
    })
})

app.get('/',(req,res) => {
    Article.findAll({order : [['id','DESC']],limit: 4}).then( articles => {
        Category.findAll().then( categories => {
            res.render('index',{articles: articles, categories: categories})
        })
    })
})

app.get('/:slug',(req,res) => {
    let slug = req.params.slug

    Article.findOne({ where: { slug : slug} }).then( articles => {
        if (articles != undefined){
            Category.findAll().then( categories => {
                res.render('article',{articles: articles, categories: categories})
            })
        } else { 
            res.redirect('/')
        }
    }).catch( err => {
        res.redirect('/')
    })
})

app.get('/category/:slug',(req,res) => {
    let slug = req.params.slug

    Category.findOne({where : {slug:slug}, include: {model: Article}}).then( category => {
        if (category != undefined) {
            Category.findAll().then( categories => {
                res.render('index',{articles: category.articles, categories: categories})
            })
        } else {
            res.redirect('/')    
        }
    }).catch( err => {
        res.redirect('/')
    })
})

app.listen(8080,() => {
    console.log('Server is running')
})
const Sequelize = require('sequelize')


const connection = new Sequelize('blog_db','root','1q2w3e',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})


module.exports = connection
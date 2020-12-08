const express = require("express")
const compression = require('compression')
const bodyParser = require("body-parser")
const _where = require("lodash.where")
const sql = require('mssql')
const app = express()
app.use(bodyParser.json())
app.use(compression())
const server = app.listen(3000, a =>{
    console.log('listening at http://localhost:3000')
})

//untuk assign folder sebagai static assets
app.use('/', express.static('./public'));


const DB_CONFIG = {
    user: "bootcamp",
    password: "bootcamp*123",
    server: "206.189.80.195",
    database:"populasi"
}


var WithDB = function WithDB(req,res,next){
    res.setHeader('Content-Type','application/json')
    new sql.ConnectionPool(DB_CONFIG).connect().then(pool => {
        return pool.query('SELECT * FROM [populasi].[dbo].[ari_panji]')
    }).then(result => {
        return res.send(result.recordset)
    }).catch(err => {
        return res.send(err)
    })
}

app.get('/db',WithDB)
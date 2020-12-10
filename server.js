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
    password: "Bootcamp*123",
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

app.post('/simpan-data', function(req, res){

    const { namaMahasiswa, mataKuliah, nilai } = req.body;

    new sql.ConnectionPool(DB_CONFIG).connect().then(pool => {
        const sql = `
            INSERT INTO populasi.dbo.ari_panji 
            (NamaMahasiswa, MataKuliah, Nilai, Idx, Status)
            VALUES ('${namaMahasiswa}', '${mataKuliah}', '${nilai}', 
            CASE WHEN Nilai < '20' THEN 'E'
            WHEN Nilai < '40' THEN 'D'
            WHEN Nilai < '60' THEN 'C'
            WHEN Nilai < '80' THEN 'B'
            WHEN Nilai < '100' THEN 'A'
            END,
            CASE WHEN Idx < '60' THEN 'Tidak Lulus'
           	ELSE 'Lulus' END);`

        return pool.query(sql)
    }).then(result => {
        return res.send(result)
    }).catch(err => {
        return res.send(err)
    })

})

app.delete('/hapus-data/:id',  (req, res) => {
    const { id } = req.params
    new sql.ConnectionPool(DB_CONFIG).connect().then(pool => {
        const sql = `
            Delete from populasi.dbo.ari_panji where id = '${id}'`

        return pool.query(sql)
    }).then(result => {
        return res.send(result)
    }).catch(err => {
        return res.send(err)
    })
});
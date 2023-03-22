var express = require('express');
var router = express.Router();
const pool = require('./db_server');


router.get('/switchDatabase/:databaseName', (req, res) => {
    const databaseName = req.params.databaseName
    const query = `USE ${databaseName}`
  
    req.session.databaseName = databaseName
  
    pool.request().query(query, (err, result) => {
      if (err) {
        console.log(`Error changing database: ${err}`)
        return res.status(500).send('Error changing database')
      }
      console.log(`Database changed to ${databaseName}`)
      return res.status(200).send(`Database changed to ${databaseName}`)
    })
  })


module.exports = router;
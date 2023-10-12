var express = require('express');
var router = express.Router();
const pool = require('./db_server');


router.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


router.get('/db/:databaseName', (req, res) => {
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
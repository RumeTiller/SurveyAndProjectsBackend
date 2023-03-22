var express = require('express');
var router = express.Router();

const config = require('../DBConnection/db_server');

router.get("/piechart", async (req, res) => {
    try {
  
      const NoQuery = await config.query(`SELECT count(OBJECTID)
      FROM ${req.session.databaseName}.dbo.ROAD_CL`);
      res.json(NoQuery.recordsets);
  
    } catch (err) {
      console.error(err.message);
    }
  });

module.exports = router;
  
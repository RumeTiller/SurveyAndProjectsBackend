const { response } = require('express');
var express = require('express');
var router = express.Router();

const config = require('../db_server');


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


//Update PieChart

router.get("/extent", async (req, res) => {
  // router.get("/extent/:project/", async (req, res) => {
  try {
    const projectName = req.query.project;
    const location = req.query.location;
    const phaseId = req.query.phase;
    console.log(projectName);

    formateBbox = (text) => {
      return text.match(/\(([^)]+)\)/)[1].split(/[ ,]+/).filter(function (v) { return v !== '' }).join(',')
    }



    if (location !== undefined) {
      if (phaseId !== undefined) {
        const bBoxQuery = await config.query(`select st_extent(ST_Transform(geom, 4326)) as bbox from public.grid_${projectName} where location = '${location}' and phase_no = ${phaseId}`);
        const bBox = bBoxQuery.rows[0].bbox;
        res.json(formateBbox(bBox));
      } else {
        const bBoxQuery = await config.query(`select st_extent(ST_Transform(geom, 4326)) as bbox from public.grid_${projectName} where location = '${location}'`);
        const bBox = bBoxQuery.rows[0].bbox;
        res.json(formateBbox(bBox));
      }
    } else {
      const bBoxQuery = await config.query(`select st_extent(ST_Transform(geom, 4326)) as bbox from public.grid_${projectName}`);
      const bBox = bBoxQuery.rows[0].bbox;
      res.json(formateBbox(bBox));
    }





  } catch (err) {
    console.error(err.message);
  }
});


module.exports = router;

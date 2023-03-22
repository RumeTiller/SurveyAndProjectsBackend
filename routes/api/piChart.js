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
router.get("/survey_count/:project/overall", async (req, res) => {
  const project = req.params.project;
  const location = req.query.location;
  const phase = req.query.phase;

  try {
    if (phase != undefined) {
      const noQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='No' And location = '${location}' And phase_no = ${phase}`);
      const totalNo = noQuery.rows[0].count;

      const yesQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='Yes' And location = '${location}' And phase_no = ${phase}`);
      const totalYes = yesQuery.rows[0].count;

      const ongoingQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='Ongoing' And location = '${location}' And phase_no = ${phase}`);
      const totalOngoing = ongoingQuery.rows[0].count;

      const SurveyStat = {
        Yes: [`${totalYes}`],
        No: [`${totalNo}`],
        Ongoing: [`${totalOngoing}`],
      };

      res.json(SurveyStat);

    }else if (location != undefined) {
      const noQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='No' And location = '${location}'`);
      const totalNo = noQuery.rows[0].count;

      const yesQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='Yes' And location = '${location}'`);
      const totalYes = yesQuery.rows[0].count;

      const ongoingQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='Ongoing' And location = '${location}'`);
      const totalOngoing = ongoingQuery.rows[0].count;

      const SurveyStat = {
        Yes: [`${totalYes}`],
        No: [`${totalNo}`],
        Ongoing: [`${totalOngoing}`],
      };

      res.json(SurveyStat);

    } else {

      const noQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='No'`);
      const totalNo = noQuery.rows[0].count;

      const yesQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='Yes'`);
      const totalYes = yesQuery.rows[0].count;

      const ongoingQuery = await config.query(`SELECT count(*) FROM public.grid_${project} where survey ='Ongoing'`);
      const totalOngoing = ongoingQuery.rows[0].count;

      const SurveyStat = {
        Yes: [`${totalYes}`],
        No: [`${totalNo}`],
        Ongoing: [`${totalOngoing}`],
      };
      res.json(SurveyStat);

    }


  } catch (err) {
    console.error(err.message);
  }
});


module.exports = router;

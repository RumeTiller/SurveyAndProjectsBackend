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


//Update Grid 
//VS 
router.post("/vs/:project/:location/:phase/:grid", async (req, res) => {
  const project = req.params.project;
  const location = req.params.location;
  const phase = req.params.phase;
  const gridNo = req.params.grid;
  console.log(req.body);
  try {
    await config.query(`
    UPDATE public.grid_${project}
    SET  

    vs_check_by='${req.body.vs_check_by ? req.body.vs_check_by : null}', 
    vs_end_date='${req.body.vs_end_date ? req.body.vs_end_date : new Date().toISOString()}', 
    vs_structure='${parseInt(req.body.vs_structure)}',
    vs_other_structure='${parseInt(req.body.vs_other_structure)}',
    vs_roads='${parseInt(req.body.vs_roads)}', 
    vs_waterbodies='${parseInt(req.body.vs_waterbodies)}',
    vs_polygon='${parseInt(req.body.vs_polygon)}', 
    vs_flood='${parseInt(req.body.vs_flood)}', 
    vs_drain='${parseInt(req.body.vs_drain)}', 
    survey = 'Yes'

    WHERE grid_no = ${gridNo} and phase_no = ${phase} and location = '${location}';`
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/fc/:project/:location/:phase/:grid", async (req, res) => {
  const project = req.params.project;
  const location = req.params.location;
  const phase = req.params.phase;
  const gridNo = req.params.grid;

  try {
    await config.query(`
    UPDATE public.grid_${project}

    SET  
    fc_date='${req.body.vs_structure ? req.body.vs_structure : new Date().toISOString()}}',
    fc_wrong_structure ='${req.body.fc_wrong_structure ? req.body.fc_wrong_structure : 0}',
    fc_missing_structure='${req.body.fc_missing_structure ? req.body.fc_missing_structure : 0}',
    fc_wrong_other_structure='${req.body.fc_wrong_other_structure ? req.body.fc_wrong_other_structure : 0}',
    fc_wrong_road='${req.body.fc_wrong_road ? req.body.fc_wrong_road : 0}',
    fc_missing_road='${req.body.fc_missing_road ? req.body.fc_missing_road : 0}',
    fc_wrong_waterbody='${req.body.fc_wrong_waterbody ? req.body.fc_wrong_waterbody : 0}',
    fc_missing_waterbody='${req.body.fc_missing_waterbody ? req.body.fc_missing_waterbody : 0}',
    fc_wrong_polygon='${req.body.fc_wrong_polygon ? req.body.fc_wrong_polygon : 0}',
    fc_missing_polygon='${req.body.fc_missing_polygon ? req.body.fc_missing_polygon : 0}',
    fc_wrong_flood_works='${req.body.fc_wrong_flood_works ? req.body.fc_wrong_flood_works : 0}',
    fc_missing_flood_works='${req.body.fc_missing_flood_works ? req.body.fc_missing_flood_works : 0}',
    fc_wrong_drain='${req.body.fc_wrong_drain ? req.body.fc_wrong_drain : 0}',
    fc_missing_drain='${req.body.fc_missing_drain ? req.body.fc_missing_drain : 0}',
    fc_missing_boundary_wall='${req.body.fc_missing_boundary_wall ? req.body.fc_missing_boundary_wall : 0}',
    fc_missing_utility='${req.body.fc_missing_utility ? req.body.fc_missing_utility : 0}',
    fc_missing_other_structure='${req.body.fc_missing_other_structure ? req.body.fc_missing_other_structure : 0}',
    fc_status='Yes'

    WHERE grid_no = ${gridNo} and phase_no = ${phase} and location = '${location}';`
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/asignsurveyor/:project/:location/:phase/:grid", async (req, res) => {
  const project = req.params.project;
  const location = req.params.location;
  const phase = req.params.phase;
  const gridNo = req.params.grid;
  console.log(req.body.vs_surveyor_name);
  try {
    await config.query(`
    UPDATE public.grid_${project}

    SET  
    team_no='${req.body.team_no}',
    vs_start_date='${req.body.vs_start_date}',
    vs_surveyor_name ='${req.body.vs_surveyor_name}',
    coordinator_name='${req.body.coordinator}',
    srvr_aisgn_by='${req.body.srvr_aisgn_by}',
    survey = 'Ongoing'

    WHERE grid_no = ${gridNo} and phase_no = ${phase} and location = '${location}';`
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
  }
});



module.exports = router;

const { response } = require('express');
var express = require('express');
var router = express.Router();

const config = require('./DBConnection/db_server');


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


//Error List

router.get("/errorcount/:projectname", async (req, res) => {
  const projectName = req.params.projectname;
  const location = req.query.location;
  const phaseNo = req.query.phase;
  const teamNo = req.query.team;
  const surveyorName = req.query.surveyor;


  try {
    const errorQuery = await config.query(`select MIN(vs_surveyor_name) as Name, MIN(team_no) as teamNo,  MIN(phase_no) as phase,
    MIN(location) as Location,  
    count(vs_surveyor_name) as surveyed,
    SUM("vs_structure" + "vs_other_structure" +
      "vs_roads" + "vs_waterbodies" +
      "vs_polygon" + "vs_flood" + "vs_drain") as totalVSError,
	  
	  SUM("fc_wrong_structure" + "fc_missing_structure" +
      "fc_wrong_other_structure" + "fc_wrong_road" +
      "fc_missing_road" + "fc_wrong_waterbody" + "fc_missing_waterbody" +
		 "fc_wrong_polygon" + "fc_missing_polygon" + "fc_wrong_flood_works" +
		  "fc_missing_flood_works" + "fc_wrong_drain" + "fc_missing_drain" + 
		  "fc_missing_boundary_wall" + "fc_missing_utility" + "fc_missing_other_structure") as totalFCError 
	  
      from grid_${projectName}
       where  survey= 'Yes' 
       ${location ? ` and location = '${location}'` : ''} 
       ${phaseNo ? ` and phase_no = '${phaseNo}'` : ''} 
       ${teamNo ? ` and team_no = '${teamNo}'` : ''} 
       ${surveyorName ? ` and vs_surveyor_name = '${surveyorName}'` : ''} 
       group by vs_surveyor_name order by surveyed DESC`);
    const ErrorInfo = errorQuery.rows;

    res.json(ErrorInfo);

  } catch (err) {
    console.error(err.message);
  }
});


module.exports = router;

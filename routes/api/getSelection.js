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


//Select Project
router.get("/projectlist", async (req, res) => {

    try {

        const getProjectQuery = await config.query('select project_name, project_url,project_details from public.project_list');
        const getProjectRes = getProjectQuery.rows;

        res.json(getProjectRes);

    } catch (err) {
        console.error(err.message);
    }
});



//Select Location
router.get("/location/:projectname", async (req, res) => {

    try {
        const projectName = req.params.projectname;

        const getLocationQuery = await config.query(`select DISTINCT  location from public.grid_${projectName} `);
        const getLocationRes = getLocationQuery.rows;

        res.json(getLocationRes);

    } catch (err) {
        console.error(err.message);
    }
});


//Select Phase
router.get("/phase/:projectname/:location", async (req, res) => {

    try {
        const projectName = req.params.projectname;
        const Location = req.params.location

        const getPhaseQuery = await config.query(`select DISTINCT  phase_no from public.grid_${projectName} where location ='${Location}' order by phase_no`);
        const getPhaseRes = getPhaseQuery.rows;

        res.json(getPhaseRes);

    } catch (err) {
        console.error(err.message);
    }
});

//Select Grid
router.get("/grids/:projectname/:location/:phase", async (req, res) => {

    try {
        const projectName = req.params.projectname;
        const Location = req.params.location;
        const Phase = req.params.phase;

        const getPhaseQuery = await config.query(`select grid_no from public.grid_${projectName} where location ='${Location}' and phase_no = '${Phase}' order by grid_no`);
        const getPhaseRes = getPhaseQuery.rows;

        res.json(getPhaseRes);

    } catch (err) {
        console.error(err.message);
    }
});

//Select team Number

router.get("/teams/:projectname/:location/", async (req, res) => {

    try {
        const projectName = req.params.projectname;
        const Location = req.params.location;

        const getTeamQuery = await config.query(`select distinct team from public.team_information  where project = '${projectName}' and location ='${Location}' order by team`);
        const getTeamRes = getTeamQuery.rows;

        res.json(getTeamRes);

    } catch (err) {
        console.error(err.message);
    }
});

//Select team Member

router.get("/teammember/:projectname/:location/:team", async (req, res) => {
    const projectName = req.params.projectname;
    const Location = req.params.location;
    const TeamNo = req.params.team
    const position = req.query.position;

    try {
        if (position) {
            const getTeamQuery = await config.query(`select name, emp_id from public.team_information  where project = '${projectName}' and location ='${Location}' and position = '${position}' ${position != 'Coordinator' ? `and team = ${TeamNo}` : ''} and status ='active' ORDER BY emp_id ASC`);
            const getTeamRes = getTeamQuery.rows;
            res.json(getTeamRes);
        } else {
            const getTeamQuery = await config.query(`select name, emp_id from public.team_information  where project = '${projectName}' and location ='${Location}' and team = ${TeamNo} and status ='active' ORDER BY emp_id ASC`);
            const getTeamRes = getTeamQuery.rows;
            res.json(getTeamRes);
        }

    } catch (err) {
        console.error(err.message);
    }
});

//Get All Running Project

router.get("/all/:projectname", async (req, res) => {

    try {
        const projectName = req.params.projectname;


        const getTeamQuery = await config.query(`select name, emp_id,location, position, team from public.team_information  where project = '${projectName}' order by emp_id`);
        // const getTeamRes = getTeamQuery.rows;
        // const getTeamQuery = await config.query(`select name, emp_id from public.team_information  where project = '${projectName}'`);
        const getTeamRes = getTeamQuery.rows;

        res.json(getTeamRes);

    } catch (err) {
        console.error(err.message);
    }
});

//Get All Running Project Location

router.get("/all/:projectname/:location", async (req, res) => {

    try {
        const projectName = req.params.projectname;
        const Location = req.params.location;

        const getTeamQuery = await config.query(`select name, emp_id, position, location, team from public.team_information  where project = '${projectName}' and location = '${Location}'  order by emp_id`);
        const getTeamRes = getTeamQuery.rows;

        res.json(getTeamRes);

    } catch (err) {
        console.error(err.message);
    }
});


router.get("/member/:empId", async (req, res) => {

    try {
        const projectName = req.params.projectname;
        const empId = req.params.empId;

        const getTeamQuery = await config.query(`select name, emp_id, position, location, team from public.team_information where emp_id = '${empId}'`);
        const getTeamRes = getTeamQuery.rows;

        res.json(getTeamRes);

    } catch (err) {
        console.error(err.message);
    }
});


// Get VS Sureyor Name and VS Check By

router.get("/vsinfo/:project/:location/:phase/:grid", async (req, res) => {
    const project = req.params.project;
    const location = req.params.location;
    const phase = req.params.phase;
    const gridNo = req.params.grid;
    const checked_by = req.query.chk
    try {
        const getTeamQuery = await config.query(`select vs_surveyor_name ${checked_by ? ', vs_check_by' : ''} FROM public.grid_${project} where grid_no = ${gridNo} and phase_no = ${phase} and location = '${location}'`);
        const getTeamRes = getTeamQuery.rows[0];

        res.json(getTeamRes);

    } catch (err) {
        console.error(err.message);
    }
});
module.exports = router;

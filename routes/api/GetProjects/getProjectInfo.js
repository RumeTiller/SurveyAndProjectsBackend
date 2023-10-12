var express = require('express');
var router = express.Router();
const sql = require('mssql');
const config = require('../DBConnection/db_server');

const configBasicDB = {
    server: '192.168.0.150',
    database: 'projectdetails',
    user: 'sa',
    password: 'Tiller_@159',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

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

//all projects
router.get("/projectlist", async (req, res) => {
    sql.connect(configBasicDB, (err) => {
        if (err) console.log(err);
        else console.log('Connected to Projectdetails DB');
    });
    try {
        const NoQuery = await sql.query(`select * from [dbo].[project_list]`);
        res.json(NoQuery.recordsets.reduce(function (r, a) { return r.concat(a); }));
    } catch (err) {
        console.error(err.message); 
    }
});

// get layers 
router.get("/layerlist", async (req, res) => {
    try {
        const Query = await config.query(`SELECT * FROM ${req.session.databaseName}.[dbo].[layer_list] where visibility ='true'`);
        res.json(Query.recordsets.reduce(function (r, a) { return r.concat(a); }));
    } catch (err) {
        console.error(err.message); 
    }
});

// get Location
router.get("/locationlist", async (req, res) => {
    try {
        console.log(req.session);
        const Query = await config.query(`SELECT DISTINCT  location FROM ${req.session.databaseName}.[dbo].[SURVEY_GRIDS]`);
        res.json(Query.recordsets.reduce(function (r, a) { return r.concat(a); }));
    } catch (err) {
        console.error(err.message);
    }
});

// get Phase
router.get("/phaselist/:location", async (req, res) => {
    try {
        const Location = req.params.location
        const Query = await config.query(`SELECT DISTINCT phase_no FROM ${req.session.databaseName}.[dbo].[SURVEY_GRIDS] where location = '${Location}' order by phase_no ASC`);
        res.json(Query.recordsets.reduce(function (r, a) { return r.concat(a); }));
    } catch (err) {
        console.error(err.message);
    }
});


// get Grid List
router.get("/gridlist/:location/:phase", async (req, res) => {
    try {
        const Location = req.params.location;
        const Phase = req.params.phase;
        const Query = await config.query(`SELECT DISTINCT grid_no FROM ${req.session.databaseName}.[dbo].[SURVEY_GRIDS] where location = '${Location}'  and phase_no = '${Phase}' order by grid_no ASC`);
        res.json(Query.recordsets.reduce(function (r, a) { return r.concat(a); }));
    } catch (err) {
        console.error(err.message);
    }
});

//Select team Number

router.get("/teams/:location", async (req, res) => {
    try {

        const Location = req.params.location;
        const Query = await config.query(`select distinct team from ${req.session.databaseName}.[dbo].surveyor_information  where location ='${Location}' order by team`);
        res.json(Query.recordsets.reduce(function (r, a) { return r.concat(a); }));

    } catch (err) {
        console.error(err.message);
    }
});


//Select team Member

router.get("/teammember/:location/:team", async (req, res) => {
    const Location = req.params.location;
    const TeamNo = req.params.team
    const position = req.query.position;

    try {
       
            const Query = await config.query(`select name,position, emp_id from ${req.session.databaseName}.[dbo].surveyor_information  where location ='${Location}' and status ='active' and team = '${TeamNo}'  ${position ? `and position = ${position}` : ''}  ORDER BY emp_id ASC`);
            res.json(Query.recordsets.reduce(function (r, a) { return r.concat(a); }));

    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
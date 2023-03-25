var express = require('express');
var router = express.Router();

const config = require('../DBConnection/db_server');

router.get("/getcheckedby/:location/:phase/:grid", async (req, res) => {
    const location = req.params.location;
    const phase = req.params.phase;
    const gridNo = req.params.grid;
    const checked_by = req.query.chk
    try {
        const Query = await config.query(`select vs_surveyor_name ${checked_by ? ', vs_check_by' : ''} FROM  ${req.session.databaseName}.[dbo].[SURVEY_GRIDS] where grid_no = ${gridNo} and phase_no = ${phase} and location = '${location}'`);
        res.json(Query.recordsets.reduce(function (r, a) { return r.concat(a); }).reduce(function (r, a) { return r.concat(a); })
        );

        res.json(getTeamRes);

    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;

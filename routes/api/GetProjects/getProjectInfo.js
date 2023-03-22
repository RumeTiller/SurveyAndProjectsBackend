var express = require('express');
var router = express.Router();
const sql = require('mssql');

const configDB2 = {
    server: 'localhost',
    database: 'projectdetails',
    user: 'sa',
    password: 'Tiller_@159',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};


//all projects
router.get("/projectlist", async (req, res) => {
    sql.connect(configDB2, (err) => {
        if (err) console.log(err);
        else console.log('Connected to database2');
    });
    try {

        const NoQuery = await sql.query(`select * from [dbo].[project_list]`);
        res.json(NoQuery.recordsets);

    } catch (err) {
        console.error(err.message);
    }
});

router.get("/layerlist", async (req, res) => {
    sql.connect(configDB2, (err) => {
        if (err) console.log(err);
        else console.log('Connected to database2');
    });
    try {

        const NoQuery = await sql.query(` select a.id,a.project_name,a.project_url, a.project_details,b.id as layer_id, b.layer_name, b.layer_group
        from [dbo].[project_list] as a
        INNER JOIN(select *
      FROM [dbo].[layer_list]  
          CROSS APPLY STRING_SPLIT(project_id, ',')) as b ON a.id= b.value
          where a.project_url = 'cda' and a.project_status=1`);
        res.json(NoQuery.recordsets);

    } catch (err) {
        console.error(err.message);
    }
})


module.exports = router;
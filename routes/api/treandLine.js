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


//Day Wise Update TreanLine
router.get("/:project/daywiseinfo", async (req, res) => {
  console.log('Tiller');

  const inputDate = req.query.inputdate;
  const projectName = req.params.project;

  let now;
  if (inputDate != undefined) {
    now = new Date(inputDate);
  } else now = new Date();

  const weekdays = [now.toLocaleDateString('zh-Hans-CN')];
  for (i = 1; i < 8; i++) {
    const days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    // console.log(days);
    weekdays.push(days.toLocaleDateString('zh-Hans-CN', { day: '2-digit', month: '2-digit', year: 'numeric' }));
  };
  try {

    const dayTotal = [];
    const Team1Total = [];
    const Team2Total = [];

    for (i = 0; i < 7; i++) {
      const totalQuery = await config.query(`SELECT count(*) FROM public.grid_${projectName} where survey ='Yes' and vs_end_date  = '${weekdays[i]}'`);
      const TotalNo = totalQuery.rows[0].count;
      dayTotal.push(TotalNo);
      // console.log(weekdays[i], dayTotal[i])
      const Team1Query = await config.query(`SELECT count(*) FROM public.grid_${projectName} where survey ='Yes' and team_no = '1' and vs_end_date  = '${weekdays[i]}'`);
      const Team1Count = Team1Query.rows[0].count;
      Team1Total.push(Team1Count)

      const Team2Query = await config.query(`SELECT count(*) FROM public.grid_${projectName} where survey ='Yes' and team_no = '2' and vs_end_date  = '${weekdays[i]}'`);
      const Team2Count = Team2Query.rows[0].count;
      Team2Total.push(Team2Count)
    }

    function teams(team1, team2) {
      return { team1, team2 }
    }



    function surveyInfo(date, total, team_1, team_2) {
      this.date = date;
      this.total = total;



      this.teams = teams(team_1, team_2);
    }

    let fullInfo = [];

    for (i = 0; i < 7; i++) {

      fullInfo.push(new surveyInfo(weekdays[i], dayTotal[i], Team1Total[i], Team2Total[i]))
    }
    res.json(fullInfo);

  } catch (err) {
    console.error(err.message);
  }
});


module.exports = router;

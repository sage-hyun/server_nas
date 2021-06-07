var express = require('express');
const models = require("../models");
const { Op } = require('sequelize');
const verifyToken = require("./middlewares/auth").verifyToken;
const addMonths = require("./middlewares/calc_date").addMonths;


var router = express.Router();
   
router.get('/', verifyToken, async(req, res) =>{
    try {
        const family_id = req.familyId;

        const selectedYearMonth = req.query.yearMonth;        
        if (!selectedYearMonth) {
            var startDay = new Date(); // today
        }
        else {
            var startDay = new Date(Date.parse(selectedYearMonth));
        }
        startDay.setHours(0,0,0,0);
        startDay.setDate(1);

        const data = await models.calendar.findAll({
            where: {
                family_id: family_id,
                date: {
                    [Op.gte]: startDay,
                    [Op.lt]: addMonths(startDay, 1)
                }
            },
            attributes: ["date","user_count_total","user_count_diary","user_count_comments"],
            raw: true
        });
        res.send(JSON.stringify(data)); //주의: data는 Array
    }
    catch(error) {
      console.error(error);
      next(error);
    }
});

module.exports = router;
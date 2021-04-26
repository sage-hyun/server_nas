var express = require('express');
const app = require('../app');
const models = require("./models");


var router = express.Router();

/* GET diary listing. */
app.get('/', function(req, res) { 
    return res.send('/');
});
   
app.get('/:familyId', function(req, res) {
    var family_id = req.params.familyId;

    var data = models.diary.findAll({
        where: {
            family_id: family_id
        }});
    
    return res.send(JSON.stringify(data));
});


app.post('/create', function(req, res) { 
    var post = req.body;

    models.diary.create({
        writer: post.writer,
        description: post.description,
        emotion: post.emotion,
        create_time: post.create_time
    });
});
   
app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
});



module.exports = router;
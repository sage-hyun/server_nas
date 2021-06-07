require('dotenv').config();
const env = process.env;
const port = env.NODE_PORT;

var createError = require('http-errors');
var express = require('express');
var path = require('path');

var usersRouter = require('./routes/users');
var diaryRouter = require('./routes/diary');
var commentsRouter = require('./routes/comments');
var calendarRouter = require('./routes/calendar');
var https = require('https');
var fs = require('fs');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/diary', diaryRouter);
app.use('/comments', commentsRouter);
app.use('/calendar', calendarRouter);


// https.createServer({
//   cert: fs.readFileSync(),
//   key:fs.readFileSync(),
//   ca: [fs.readFileSync(), fs.readFileSync()]
// },app).listen(3000, function() {
//   console.log('Example app listening on port 3000!')
// });

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 500 error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;

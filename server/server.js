(function() {

	'use strict';

	var config = require('./config/config');
	var express = require('express');
	var path = require('path');
	var logger = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');
	var passport = require('passport');
	var nodemailer = require('nodemailer');


	// All the Routes
	// ---------------------------
	var router = express.Router();
	var todoRoutes = require('./routes/todos');
	var authRoutes = require('./routes/auth');
	var teamsRoutes = require('./routes/teams');
	var playersRoutes = require('./routes/players');
	var leaguesRoutes = require('./routes/leagues');
	var Teams = require('./models/teams');
	var http = require('http');

	var Users = require('./models/users');
	var configPassport = require('./config/passport');

	var app = express();
	mongoose.connect(config.db);

	// the secret variable
	app.set('superSecret', config.secret);


	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');

	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(cookieParser());

	app.use(express.static(path.join(__dirname, '../client')));

	app.use(passport.initialize());


	// Get the home page
	router.get('/', function(req, res){
		res.render('index');
	});


	// Scheduler
	var schedule = require('node-schedule');
	var Update = require('./schedule/update');

	var rule = new schedule.RecurrenceRule();
	rule.hour = 1;
	rule.minute = 1;

	schedule.scheduleJob(rule, function(){
		console.log('this is the scheduled cron job');
		Update.updateTeams();
	});

// Update.updateTeams();


	// Set the homepage
	app.use('/', router);

	// Set the Todo routes
	app.use('/api/todos', todoRoutes);

	// Set the auth routes
	app.use('/api/auth', authRoutes);

	// Set the teams routes
	app.use('/api/teams', teamsRoutes);

	// Set the players routes
	app.use('/api/players', playersRoutes);

	// Set the leagues routes
	app.use('/api/leagues', leaguesRoutes);


	app.set('port', process.env.PORT || 8080);

	var server = app.listen(app.get('port'), function() {
		console.log('Express server listening on port ' + server.address().port);
	});

	module.exports = app;

}());
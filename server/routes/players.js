(function() {

	'use strict';

	var config = require('../config/config');
	var express = require('express');
	var playersRouter = express.Router();
	var mongoose = require('mongoose');
	var passport = require('passport');
	var jwt = require('express-jwt');
	var async = require('async');


	// Http request
	var http = require('http');

	var auth = jwt({secret: config.secret, userProperty: 'payload'});

	var Teams = require('../models/teams');
	var Players = require('../models/players');
	var Update = require('../schedule/update');

	var db = mongoose.connection;




// Routes for User Authentication
// -----------------------------------------
	


	// Get the list of teams
	// ----------------------------
	playersRouter.get('/', auth, function(req, res, next) {
		Players.find(function(err, players){
			if(err) {res.json(err);}

			res.json(players);
		});
	});




	module.exports = playersRouter;


}());
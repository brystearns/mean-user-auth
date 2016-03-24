(function() {

	'use strict';

	var config = require('../config/config');
	var express = require('express');
	var leaguesRouter = express.Router();
	var mongoose = require('mongoose');
	var passport = require('passport');
	var jwt = require('express-jwt');
	var jwtVerify = require('jsonwebtoken');
	var async = require('async');


	// Http request
	var http = require('http');

	var auth = jwt({secret: config.secret, userProperty: 'payload'});

	var Leagues = require('../models/leagues');
	var User = require('../models/users');
	var Teams = require('../models/teams');
	var Players = require('../models/players');

	var db = mongoose.connection;




// Routes for User Authentication
// -----------------------------------------
	


	// Get the league managed by the admin account
	// ----------------------------
	leaguesRouter.get('/', auth, function(req, res, next) {
	  if(req.payload.admin){
	  	Leagues.find({admin_name: req.payload.username}, function(err, leagues){
				if(err) {res.json(err);}

				if(leagues.length) {
					return res.json(leagues);
				} else {
					res.status(400).json({message: 'You have no active leagues'});
				}
			});
	  }
	});


	// Get the league based on its ID
	// ----------------------------
	leaguesRouter.get('/:id', auth, function(req, res, next) {
		if(req.payload.admin){
			Leagues.findOne({_id: req.params.id}, function(err, league){
				if(err) {res.json(err);}

				if(league){
					return res.json(league);
				} else {
					return res.status(400).json({message: 'This league no longer exists.'});
				}
			});
		}
	});




	// Create a new League under the admin user
	// ---------------------------------------
	leaguesRouter.post('/', auth, function(req, res, next){
		jwtVerify.verify(req.body.token, config.secret, function(err, decoded) {
			if(!decoded.admin){
				return res.status(400).json({message: 'You are not an admin user and cannot create a league.'});
			}

			User.findOne({username: decoded.username}, function(err,user){
				Leagues.findOne({name: req.body.name}, function(err,league){
					if(err) { return next(err); }

					if(league){
						res.status(400).json({message: 'League name already exists, please choose a new name'});
					} else {
						var league = new Leagues();

						league.name = req.body.name;
						league.admin_name = user.username;
						league.admin_id = user._id;
						league.admin_email = user.email;

						var member = {
							username: user.username,
							id: user._id
						}
						league.members.push(member);

						league.save(function(err) {
							if(err){ return next(err); }
							league.sendRegistrationEmail();

							return res.json(league);
						});
					}
				});
			})
				
		});
	});



	// Update the league with a new box
	// ---------------------------------
	leaguesRouter.put('/:id/create-box', auth, function(req, res, next) {
		if(req.payload.admin){
			Leagues.findOne({_id: req.params.id}, function(err, league){
				if(err) {res.json(err);}

				if(league){
					league.updateLeague(req.body);
					console.log('League Updated');
				} else {
					return res.status(400).json({message: 'This league no longer exists.'});
				}
			});
		}
	});



	module.exports = leaguesRouter;


}());
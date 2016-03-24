(function() {

	'use strict';

	var config = require('../config/config');
	var express = require('express');
	var router = express.Router();
	var mongoose = require('mongoose');
	var passport = require('passport');
	var jwt = require('express-jwt');

	var auth = jwt({secret: config.secret, userProperty: 'payload'});

	var User = require('../models/users');

	var db = mongoose.connection;




// Routes for User Authentication
// -----------------------------------------
	


	// Register a User Account
	// ----------------------------
	router.post('/register', function(req, res, next) {
		if(!req.body.username || !req.body.email || !req.body.password) {
			return res.status(400).json({message: 'Please fill out all fields'});
		}

		User.findOne({$or:[{username: req.body.username},{email: req.body.email}]}, function(err, user){
			if(err) {res.json(err);}

			else if(user) {
				if(user.email === req.body.email && user.username === req.body.username){
					res.status(400).json({message: 'Username and email already exists'});
				} else if(user.email === req.body.email){
					res.status(400).json({message: 'Email already exists'});
				} else if(user.username === req.body.username){
					res.status(400).json({message: 'Username already exists'});
				}
			}

			else {
				if(req.body.adminPassword){
					if(req.body.adminPassword != 'This is the Admin Password'){
						return res.status(400).json({message: 'Admin password does not match. Please try again or sign up as a Team Manager.'});
					}
				}
				var user = new User();

				user.username = req.body.username;
				user.email = req.body.email;
				user.setPassword(req.body.password);
				if(req.body.adminPassword === 'This is the Admin Password'){
					user.admin = true;
				}

				user.save(function(err) {
					if(err){ return next(err); }//res.send(err);}
					user.sendRegistrationEmail();

					return res.json({token: user.generateJWT() });
				});
			}
		});

	});
	



	// Login in a User
	// ----------------------------
	router.post('/login', function(req, res, next) {
		if(!req.body.username || !req.body.password) {
			return res.status(400).json({message: 'Please fill out all fields'});
		}

		passport.authenticate('local', function(err, user, info){
			if(err){ return next(err); }

			if(user) {
				return res.json({
					token: user.generateJWT(),
					resetPassword: user.resetPasswordToken,
					admin: user.admin,
					pool: user.pool || false
				});
			} else {
				return res.status(401).json(info);
			}
		})(req, res, next);
	});




	// Send a registered user an email 
	// to reset their account password
	// --------------------------------
	router.post('/forgot', function(req, res, next) {
		if(!req.body.email) {
			return res.status(400).json({message: 'Please enter your email'});
		}

		User.findOne({email: req.body.email}, function(err, user) {
			if(err) {res.json(err);}

			if(user) {
				var token = user.resetJWT();
				user.resetPasswordToken = token;

				user.save(function(err) {
					if(err){ res.send(err);}
					user.sendResetEmail();

					return res.json({message: 'An email has been sent to reset your password.' });
				});
			} else {
				res.status(400).json({message: 'That email address does not exist.'});
			}
		});
	});




	// When user hits the reset page, Check 
	// to make sure their token is still valid
	// ----------------------------------------
	router.get('/reset/:token', auth, function(req, res, next){

		if(!req.params.token) {
			console.log('Your token has expired');
			return res.status(400).json({
				message: 'Your token has expired',
				verified: false
			});
		}

		User.findOne({resetPasswordToken: req.params.token}, function(err, user){
			if(!user){
				console.log('NO USER FOUND');
				return res.status(400).json({
					message: 'Your token has expired',
					verified: false
				});
			}

			console.log('Your token is solid and still useful');
			return res.json({
				message: 'Your token is solid and still useful',
				verified: true 
			});
		});
	});




	// Reset a users Password
	// ----------------------------
	router.put('/reset/:token', auth, function(req, res, next){

		if(!req.params.token) {
			console.log('Your token has expired');
			return res.status(400).json({message: 'Your token has expired and cannot reset the password.'});
		}


		User.findOne({resetPasswordToken: req.body.token}, function(err, user){
			if(!user){
				console.log('no user was found')
				return res.status(400).json({message: 'Your token has expired and cannot reset the password.'});
			}

			user.resetPasswordToken = null;
			user.setPassword(req.body.password);
			user.save(function(err) {
				if(err){ res.send(err);}
				console.log('Reset your password, token is no longer valid');
				return res.json({message: 'Your password has been reset.' });
			});
		});
	});




	module.exports = router;


}());
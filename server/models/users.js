var config = require('../config/config');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var crypto = 	require('crypto');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var poolSchema = new Schema({
	player_name: String,
	id: Number,
	points: Number,
	goals: Number,
	assists: Number
});

var UserSchema = new Schema({

	username: {type: String, lowercase: true, unique: true},
	email: {type: String, lowercase: true, unique: true, index: true},
	hash: String,
	salt: String,
	admin: {type:Boolean, default: false},
	resetPasswordToken: String,
	resetPasswordExpire: Date,

	pool: {
		total: Number,
		team_name: {type: String, unique: true, sparse: true},
		players: [poolSchema],
	}

});


// Create the salt and the hash for the password, so we aren't storing the actual password in plain text
UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(256).toString('hex');

	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 128).toString('hex');
};


// check to see if the entered password matches the stored password
UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 128).toString('hex');

	return this.hash === hash;
};



// setup jsonwebtoken
UserSchema.methods.generateJWT = function() {
	// set expiration to 1 day
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 1);


	// this is the payload that gets signed. Both server and client have access
	return jwt.sign({
		_id: this._id,
		username: this.username,
		admin: this.admin,
		exp: parseInt(exp.getTime() / 1000)
	}, config.secret);
	// SECRET is 2nd argument. It is the secret used to sign tokens. Should not be hardcoded, use an environment variable and keep it out of the codebase. Is currently stored in the config.js file
};



UserSchema.methods.resetJWT = function() {
	// set expiration to 1 day
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 1);

	return jwt.sign({
		_id: this._id,
		exp: parseInt(exp.getTime() / 1000)
	}, config.secret);
};




// Send user an email upon registration
UserSchema.methods.sendRegistrationEmail = function() {

	// The service that sends the email. Currently works for gmail, should be configured to work with SMTP or something else so it can be sent from a server. The email login info should be put in a config file similar to the app secret, and left out of the codebase version control
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: config.emailAddress,
			pass: config.emailPassword
		}
	});


	// The actual email itself, and all the info that needs to be sent
	var mailOptions = {
		from: config.emailAddress,
		to: this.email,
		subject: 'Thanks ' + this.username + ' for registering!',
		text: 'Thanks for Registering!',
		html: '<h1>Thanks for Registering!</h1><p>We are happy to have you as a member. Your login details are below:</p><ul><li>Username: ' + this.username + '</li><li>Password: ENTERED AT SIGN UP</li></ul>'
	};

	transporter.sendMail(mailOptions, function(err, data){
		if(err){ console.log(err) }
		else {
			console.log('Message sent: ' + data.response);
		}
	});
};

UserSchema.methods.sendResetEmail = function() {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: config.emailAddress,
			pass: config.emailPassword
		}
	});


	// The actual email itself, and all the info that needs to be sent
	var mailOptions = {
		from: config.emailAddress,
		to: this.email,
		subject: 'Password Reset Request',
		text: this.resetPasswordToken,
		html: '<a href="http://localhost:3000/#/reset/' + this.resetPasswordToken + '">' + this.resetPasswordToken + '</a>'
	};

	transporter.sendMail(mailOptions, function(err, data){
		if(err){ console.log(err) }
		else {
			console.log('Message sent: ' + data.response);
		}
	});
};



module.exports = mongoose.model('Users', UserSchema);
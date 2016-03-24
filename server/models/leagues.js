var config = require('../config/config');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

var Schema = mongoose.Schema;

var memberSchema = new Schema({
	username: {type: String, lowercase: true},
	id: {type: String}
});

var boxSchema = new Schema({
	box_name: {type: String},
	players: [{
		player_name: {type: String},
		player_id: {type: String}
	}]
});

var LeagueSchema = new Schema({

	name: {type: String, unique: true},
	admin_name: {type: String, lowercase: true},
	admin_id: {type: String, lowercase: true},
	admin_email: {type: String, lowercase: true},
	members: [memberSchema],
	boxes: [boxSchema],

	created: {type: Date, default: Date.now},
	updated: {type: Date, default: Date.now}

});




// Update the League
// -----------------------
LeagueSchema.methods.updateLeague = function(league){
	console.log(league);
	this.name = league.name;
	this.admin_name = league.admin_name;
	this.admin_id = league.admin_id;
	this.admin_email = league.admin_email;
	this.members = [];
	this.boxes = [];
	
	league.members.forEach(function(member, i){
		console.log(this);
		this.members[i].username = member.username;
		this.members[i].id = member.id;
	});

	league.boxes.forEach(function(box, i){
		this.boxes[i].box_name = member.box_name;

		box.players.forEach(function(player, k){
			this.boxes[i].players[k].player_name = player.player_name;
			this.boxes[i].players[k].player_id = player.player_id;
		});
	});

	this.updated = new Date();
};



// Send user an email upon registration
LeagueSchema.methods.sendRegistrationEmail = function() {

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
		to: this.admin_email,
		subject: 'your league has been created!',
		text: 'Thanks ' + this.admin_name + ' for creating a league!',
		html: '<h1>Thanks ' + this.admin_name + ' for creating a league!</h1><p>We are happy to have you as a member. Your league details are below:</p><ul><li>League Name: ' + this.name + '</li></ul>'
	};

	transporter.sendMail(mailOptions, function(err, data){
		if(err){ console.log(err) }
		else {
			console.log('Message sent: ' + data.response);
		}
	});
};



module.exports = mongoose.model('Leagues', LeagueSchema);
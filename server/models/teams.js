/***********************

Mongoose Schema for the Teams

- this will store all the teams and their data
- the users draft list will reference this schema for their points and roster
- below are the api links for the score
		https://api.thescore.com/nhl/standings/
		https://api.thescore.com/nhl/standings/ + standings_id

		https://api.thescore.com/nhl/teams/
		https://api.thescore.com/nhl/teams/ + id
		https://api.thescore.com/nhl/teams/ + id + /players

		https://api.thescore.com/nhl/players/ + id
		https://api.thescore.com/nhl/players/ + id + /statistics

***********************/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
	age: String,
	birth_city: String,
	birth_country: String,
	birth_state: String,
	birthdate: String,
	draft_pick: Number,
	draft_round: String,
	draft_year: Number,
	first_initial_and_last_name: String,
	first_name: String,
	full_name: String,
	handedness: String,
	headshots: {
		large: String,
		small: String
	},
	height: Number,
	height_feet: Number,
	height_inches: Number,
	id: Number,
	injury: Boolean,
	last_name: String,
	number: Number,
	position: String,
	position_abbreviation: String,
	rookie_year: Number,
	suspended: Boolean,
	weight: Number,

	created: {type: Date, default: Date.now},
	updated: {type: Date, default: Date.now}
});





var TeamsSchema = new Schema({

	// inside the 'team' object of the score api
	// if called from standings
	abbreviation: String,
	conference: String,
	division: String,
	full_name: String,
	id: Number,
	standings_id: Number,
	location: String,
	logos: {
		large: String,
		small: String
	},
	medium_name: String,
	search_name: String,
	short_name: String,


	// inside the main object called
	// if called from standings
	conference_rank: Number,
	division_rank: Number,
	formatted_rank: String,
	league_rank: Number,
	short_conference_record: String,
	short_division_record: String,
	short_home_record: String,
	short_record: String,
	short_road_record: String,
	streak: String,
	streak_losing: Number,
	streak_lossless: Number,
	streak_winless: Number,
	streak_winning: Number,

	games_played: Number,
	goal_differential: Number,
	goal_for: Number,
	goals_against: Number,
	last_ten_games_record: String,
	losses: Number,
	overtime_losses: Number,
	overtime_wins: Number,
	points: Number,
	regulation_plus_overtime_wins: Number,
	shootout_losses: Number,
	shootout_wins: Number,
	ties: Number,
	winning_percentage: Number,
	wins: Number,

	roster: [playerSchema],

	created: {type: Date, default: Date.now},
	updated: {type: Date, default: Date.now}

});


TeamsSchema.methods.setTeamStats = function(team){
	this.abbreviation = team.team.abbreviation;
	this.conference = team.team.conference;
	this.division = team.team.division;
	this.full_name = team.team.full_name;
	this.id = team.team.id;
	this.standings_id = team.id;
	this.location = team.team.location;
	this.logos.large = team.team.logos.large;
	this.logos.small = team.team.logos.small;
	this.medium_name = team.team.medium_name;
	this.search_name = team.team.search_name;
	this.short_name = team.team.short_name;
	this.conference_rank = team.conference_rank;
	this.division_rank = team.division_rank;
	this.formatted_rank = team.formatted_rank;
	this.league_rank = team.league_rank;
	this.short_conference_record = team.short_conference_record;
	this.short_division_record = team.short_division_record;
	this.short_home_record = team.short_home_record;
	this.short_record = team.short_record;
	this.short_road_record = team.short_road_record;
	this.streak = team.streak;
	this.streak_losing = team.streak_losing;
	this.streak_lossless = team.streak_lossless;
	this.streak_winless = team.streak_winless;
	this.streak_winning = team.streak_winning;

	this.games_played = team.games_played;
	this.goal_differential = team.goal_differential;
	this.goal_for = team.goal_for;
	this.goals_against = team.goals_against;
	this.last_ten_games_record = team.last_ten_games_record;
	this.losses = team.losses;
	this.overtime_losses = team.overtime_losses;
	this.overtime_wins = team.overtime_wins;
	this.points = team.points;
	this.regulation_plus_overtime_wins = team.regulation_plus_overtime_wins;
	this.shootout_losses = team.shootout_losses;
	this.shootout_wins = team.shootout_wins;
	this.ties = team.ties;
	this.winning_percentage = team.winning_percentage;
	this.wins = team.wins;

	this.roster = [];

	this.updated = new Date();
}



TeamsSchema.methods.setTeamRoster = function(player){
	var newPlayer = {};
	newPlayer.age = player.age;
	newPlayer.birth_city = player.birth_city;
	newPlayer.birth_country = player.birth_country;
	newPlayer.birth_state = player.birth_state;
	newPlayer.birthdate = player.birthdate;
	newPlayer.draft_pick = player.draft_pick;
	newPlayer.draft_round = player.draft_round;
	newPlayer.draft_year = player.draft_year;
	newPlayer.first_initial_and_last_name = player.first_initial_and_last_name;
	newPlayer.first_name = player.first_name;
	newPlayer.full_name = player.full_name;
	newPlayer.handedness = player.handedness;
	newPlayer.headshots = {};
	newPlayer.headshots.large = player.headshots.original;
	newPlayer.headshots.small = player.headshots.small;
	newPlayer.height = player.height;
	newPlayer.height_feet = player.height_feet;
	newPlayer.height_inches = player.height_inches;
	newPlayer.id = player.id;
	newPlayer.injury = player.injury;
	newPlayer.last_name = player.last_name;
	newPlayer.number = player.number;
	newPlayer.position = player.position;
	newPlayer.position_abbreviation = player.position_abbreviation;
	newPlayer.rookie_year = player.rookie_year;
	newPlayer.suspended = player.suspended;
	newPlayer.weight = player.weight;

	this.roster.push(newPlayer);
}






module.exports = mongoose.model('Teams', TeamsSchema);
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
	team: {
		abbreviation: String,
		id: Number,
		full_name: String
	},


	// Stats
	assists: Number,
	blocks: Number,
	faceoff_winning_percentage: Number,
	faceoffs_lost: Number,
	faceoffs_won: Number,
	first_stars: Number,
	game_tying_goals: Number,
	game_winning_goals: Number,
	games_played: Number,
	goals: Number,
	hits: Number,
	overtime_goals: Number,
	penalties: Number,
	penalties_major: Number,
	penalties_minor: Number,
	penalty_minutes: Number,
	plus_minus: Number,
	points: Number,
	power_play_assists: Number,
	power_play_goals: Number,
	season_short_name: String,
	season_type: String,
	second_stars: Number,
	shifts: Number,
	shooting_percentage: Number,
	shootout_goal_attempts: Number,
	shootout_goals: Number,
	shootout_scoring_percentage: Number,
	short_handed_assists: Number,
	shots_on_goal: Number,
	third_stars: Number,
	time_on_ice: Number,
	time_on_ice_minutes: Number,
	time_on_ice_seconds: Number,
	turnovers_giveaways: Number,
	turnovers_takeaways: Number,


	empty_net_goals_against: Number,
	games_started: Number,
	goals_against: Number,
	goals_against_average: String,
	losses: Number,
	overtime_losses: Number,
	power_play_goals_against: Number,
	save_percentage: String,
	seconds: Number,
	shootout_goals_against: Number,
	shootout_goals_against_attempts: Number,
	shootout_save_percentage: Number,
	short_handed_goals_against: Number,
	shots_against: Number,
	shutouts: Number,
	winning_percentage: Number,
	wins: Number,
	

	created: {type: Date, default: Date.now},
	updated: {type: Date, default: Date.now}
});



playerSchema.methods.setPlayerStats = function(teamPlayer, player){

	this.age = teamPlayer.player.age;
	this.birth_city = teamPlayer.player.birth_city;
	this.birth_country = teamPlayer.player.birth_country;
	this.birth_state = teamPlayer.player.birth_state;
	this.birthdate = teamPlayer.player.birthdate;
	this.draft_pick = teamPlayer.player.draft_pick;
	this.draft_round = teamPlayer.player.draft_round;
	this.draft_year = teamPlayer.player.draft_year;
	this.first_initial_and_last_name = teamPlayer.player.first_initial_and_last_name;
	this.first_name = teamPlayer.player.first_name;
	this.full_name = teamPlayer.player.full_name;
	this.handedness = teamPlayer.player.handedness;
	
	this.headshots = {};
	this.headshots.large = teamPlayer.player.headshots.large;
	this.headshots.small = teamPlayer.player.headshots.small;

	this.height = teamPlayer.player.height;
	this.height_feet = teamPlayer.player.height_feet;
	this.height_inches = teamPlayer.player.height_inches;
	this.id = teamPlayer.player.id;
	this.injury = teamPlayer.player.injury;
	this.last_name = teamPlayer.player.last_name;
	this.number = teamPlayer.player.number;
	this.position = teamPlayer.player.position;
	this.position_abbreviation = teamPlayer.player.position_abbreviation;
	this.rookie_year = teamPlayer.player.rookie_year;
	this.suspended = teamPlayer.player.suspended;
	this.weight = teamPlayer.player.weight;

	this.team = {};
	this.team.abbreviation = teamPlayer.abbreviation;
	this.team.id = teamPlayer.id;
	this.team.full_name = teamPlayer.full_name;


	this.assists = player.assists;
	this.blocks = player.blocks;
	this.faceoff_winning_percentage = player.faceoff_winning_percentage;
	this.faceoffs_lost = player.faceoffs_lost;
	this.faceoffs_won = player.faceoffs_won;
	this.first_stars = player.first_stars;
	this.game_tying_goals = player.game_tying_goals;
	this.game_winning_goals = player.game_winning_goals;
	this.games_played = player.games_played;
	this.goals = player.goals;
	this.hits = player.hits;
	this.overtime_goals = player.overtime_goals;
	this.penalties = player.penalties;
	this.penalties_major = player.penalties_major;
	this.penalties_minor = player.penalties_minor;
	this.penalty_minutes = player.penalty_minutes;
	this.plus_minus = player.plus_minus;
	this.points = player.points;
	this.power_play_assists = player.power_play_assists;
	this.power_play_goals = player.power_play_goals;
	this.season_short_name = player.season_short_name;
	this.season_type = player.season_type;
	this.second_stars = player.second_stars;
	this.shifts = player.shifts;
	this.shooting_percentage = player.shooting_percentage;
	this.shootout_goal_attempts = player.shootout_goal_attempts;
	this.shootout_goals = player.shootout_goals;
	this.shootout_scoring_percentage = player.shootout_scoring_percentage;
	this.short_handed_assists = player.short_handed_assists;
	this.shots_on_goal = player.shots_on_goal;
	this.third_stars = player.third_stars;
	this.time_on_ice = player.time_on_ice;
	this.time_on_ice_minutes = player.time_on_ice_minutes;
	this.time_on_ice_seconds = player.time_on_ice_seconds;
	this.turnovers_giveaways = player.turnovers_giveaways;
	this.turnovers_takeaways = player.turnovers_takeaways;


	this.empty_net_goals_against = player.empty_net_goals_against;
	this.games_started = player.games_started;
	this.goals_against = player.goals_against;
	this.goals_against_average = player.goals_against_average;
	this.losses = player.losses;
	this.overtime_losses = player.overtime_losses;
	this.power_play_goals_against = player.power_play_goals_against;
	this.save_percentage = player.save_percentage;
	this.seconds = player.seconds;
	this.shootout_goals_against = player.shootout_goals_against;
	this.shootout_goals_against_attempts = player.shootout_goals_against_attempts;
	this.shootout_save_percentage = player.shootout_save_percentage;
	this.short_handed_goals_against = player.short_handed_goals_against;
	this.shots_against = player.shots_against;
	this.shutouts = player.shutouts;
	this.winning_percentage = player.winning_percentage;
	this.wins = player.wins;

}



module.exports = mongoose.model('Players', playerSchema);
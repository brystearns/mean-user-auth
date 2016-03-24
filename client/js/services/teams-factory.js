module.exports = ['$http', 'auth', function($http, auth) {
	var scoreApi = 'https://api.thescore.com/nhl/';
	var urlBase = '/api/teams';

	var Teams = {};



	// Get the list of teams and standings from the Score API
	// -----------------------------------
	Teams.getTeams = function(){
		// console.log('Attempting to get teams from the DB');

		return $http.get(urlBase, { 
		// return $http.get(scoreApi + '/players/107/statistics', { 
			headers: {Authorization: 'Bearer ' + auth.getToken()} 
		}).success(function(data){
			// console.log(data);
			
			if(data.length){
				// console.log('Teams successfully retrieved from the DB');

				Teams.teams = data;
			}
			else {
				// console.log('Something went wrong, there are no teams.');
			}
		}).error(function(error){
			console.log(error);
		});
	};



	// Get the roster for each individual team
	// -----------------------------------
	Teams.getTeamRoster = function(team){};



	// Get the statistics for each individual player
	// -----------------------------------
	Teams.getPlayerStats = function(player){};



	return Teams;
}];
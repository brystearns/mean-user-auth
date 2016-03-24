module.exports = ['$http', '$window', 'auth', function($http, $window, auth){
	var urlBase = '/api/players';

	var Players = {};

	Players.players = [];



	// Get the list of teams and standings from the Score API
	// -----------------------------------
	Players.getAllPlayers = function(){

		return $http.get(urlBase, { 
		// return $http.get(scoreApi + '/players/107/statistics', { 
			headers: {Authorization: 'Bearer ' + auth.getToken()} 
		}).success(function(data){
			if(data.length){
				Players.players = data;
			}
			else {
				console.log('Something went wrong, there are no teams.');
			}
		}).error(function(error){
			console.log(error);
		});
	};



	return Players;
}];
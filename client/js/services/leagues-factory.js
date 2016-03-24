module.exports = ['$http', '$window', 'auth', function($http, $window, auth){

	var leagues = this;

	leagues.getLeagues = function(){
		var token = auth.getToken();

		return $http.get('/api/leagues', {
			headers: {Authorization: 'Bearer ' + token}
		})
		.success(function(data){
			leagues.createdLeagues = data;
		})
		.error(function(data){
			leagues.createdLeagues = [];
			leagues.message = data.message;
		});
	};

	leagues.getLeague = function(id){
		var token = auth.getToken();

		return $http.get('/api/leagues/' + id, {
			headers: {Authorization: 'Bearer ' + token}
		})
		.success(function(data){
			leagues.currentLeague = data;
		})
		.error(function(data){
			leagues.message = data.message;
		});
	};


	leagues.createLeague = function(name){
		var payload = {
			name: name,
			token: auth.getToken()
		};

		return $http.post('/api/leagues', payload, {
			headers: {Authorization: 'Bearer ' + payload.token}
		}).success(function(data){
			console.log(data);
			leagues.newLeagues = 'Your league has been created!';
			leagues.createdLeagues.push(data);
		});
	};



	leagues.updateLeague = function(league) {
		var payload = {
			league: league,
			token: auth.getToken()
		};

		return $http.put('/api/leagues/' + league._id + '/create-box', league, {
			headers: {Authorization: 'Bearer ' + payload.token}
		}).success(function(data){
			console.log(data);
		});
	}

	return leagues;

}];
module.exports = function($http, $window){
	var auth = this;

	// Uncomment this function when debugging login and registration issues to force a logout
	// auth.logOut = function(){
	// 	$window.localStorage.removeItem('todo-app-token');
	// };
	// auth.logOut();

	auth.saveToken = function(token) {
		$window.localStorage['todo-app-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['todo-app-token'];
	};

	auth.isAdmin = function(){
		if(auth.user.admin){
			return true;
		} else {
			return false;
		}
	};

	auth.isLoggedIn = function(){
		var token = auth.getToken();

		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload;
		} else {
			return false;
		}
	};

	auth.register = function(user) {
		return $http.post('/api/auth/register', user).success(function(data){
			if(data.token){
				auth.saveToken(data.token);
				auth.user = auth.currentUser();
			}
		});
	};

	auth.logIn = function(user) {
		return $http.post('/api/auth/login', user).success(function(data){
			console.log(data);

			auth.saveToken(data.token);
			auth.user = auth.currentUser();
		});
	};

	auth.logOut = function(){
		$window.localStorage.removeItem('todo-app-token');
		auth.user = auth.currentUser();
	};

	auth.forgotPassword = function(email) {
		return $http.post('/api/auth/forgot', email).success(function(data){
			auth.forgotConfirm = data;
		});
	};


	auth.resetVoid = function(token) {
		return $http.get('/api/auth/reset/' + token, {
			headers: {Authorization: 'Bearer ' + token}
		})
		.success(function(data){
			console.log(data);
			auth.resetToken = token;
			auth.verified = data.verified;
			return auth.verified;
		})
		.error(function(data){
			auth.verified = data.verified;
			return auth.verified;
		});
	}



	auth.reset = function(user) {
		return $http.put('/api/auth/reset/' + user.token, user, {
			headers: {Authorization: 'Bearer ' + user.token}
		}).success(function(data){
			console.log(data);

			auth.resetToken = null;
		});
	}

	auth.user = auth.currentUser();

	return auth;
};
module.exports = ['$rootScope', '$scope', 'teams', 'auth', function($rootScope, $scope, teams, auth) {

	var vm = this;

	vm.teams = teams;
	vm.auth = auth;

	vm.hasPoolTeam = function(){
		return auth.user.pool;
	}

	console.log(vm);

	return vm;
}];
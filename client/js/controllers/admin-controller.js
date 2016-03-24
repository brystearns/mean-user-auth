'use strict';


// -------------------------
// 
// Controller for setting up the league/admin user
// 
// -------------------------

module.exports = function($rootScope, $scope, teams, auth, leagues, players) {

	var vm = this;

	vm.leagues = leagues;
	vm.players = players;
	vm.teams = teams;
	vm.newBox = {
		name: '',
		players: []
	};

	vm.createLeague = function(leagueName){
		if(!leagueName){
			leagues.message = 'League must have a name';
			return;
		}
		leagues.createLeague(leagueName);
	};




	vm.addToBox = function(player) {
		vm.msgShow = false;

		var index = vm.newBox.players.indexOf(player);
		if(index < 0){
			vm.newBox.players.push(player);
		}
	};



	vm.removeFromBox = function(player) {
		vm.msgShow = false;
		var index = vm.newBox.players.indexOf(player);
  	vm.newBox.players.splice(index, 1); 
	}


	vm.saveBox = function(){
		vm.msgShow = false;

		if(vm.newBox.players.length < 6){
			vm.msg = 'Each box must have at least 6 players. Please add ' + (6 - vm.newBox.players.length) + ' more players to the box.';
			vm.msgType = 'btn-warning';
			vm.msgShow = true;
			return;
		}

		leagues.updateLeague(vm.leagues.currentLeague);
	}

	// console.log(vm);

	return vm;

};
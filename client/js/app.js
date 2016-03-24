'use strict';


// Include all dependencies
// ------------------------------

var angular = require('angular');




var app = angular.module('hockeyApp', [require('angular-ui-router').default])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/partials/teams-home.html',
				controller: 'TeamsCtrl',
				onEnter: ['$state', 'teams', function($state, teams){
					teams.getTeams();
				}]
			})
			.state('login', {
				url: '/login',
				templateUrl: '/partials/login.html',
				controller: 'AuthCtrl as authCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if(auth.isLoggedIn()){
						$state.go('home');
					}
				}]
			})
			.state('register', {
				url: '/register',
				templateUrl: '/partials/register.html',
				controller: 'AuthCtrl as authCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if(auth.isLoggedIn()){
						$state.go('home');
					}
				}]
			})
			.state('forgot', {
				url: '/forgot',
				templateUrl: '/partials/forgot.html',
				controller: 'AuthCtrl as authCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if(auth.isLoggedIn()){
						$state.go('home');
					}
				}]
			})
			.state('reset', {
				url: '/reset/:_token',
				templateUrl: '/partials/reset.html',
				controller: 'AuthCtrl as authCtrl',
				onEnter: ['$state', '$stateParams', 'auth', function($state, $stateParams, auth){
					auth.resetVoid($stateParams._token);

					if(auth.isLoggedIn()){
						$state.go('home');
					}
				}]
			})
			.state('league-admin', {
				url: '/league-admin',
				templateUrl: '/partials/league-admin.html',
				onEnter: ['$state', '$stateParams', 'auth', 'leagues', function($state, $stateParams, auth, leagues){
					if(!auth.isLoggedIn() || !auth.isAdmin()){
						$state.go('home');
					} else {
						leagues.getLeagues();
					}
				}]
			})
			.state('manage-league', {
				url: '/league/:_id',
				templateUrl: '/partials/single-league.html',
				onEnter: ['$state', '$stateParams', 'auth', 'leagues', function($state, $stateParams, auth, leagues){
					if(!auth.isLoggedIn() || !auth.isAdmin()){
						$state.go('home');
					} else {
						leagues.getLeague($stateParams._id);
					}
				}]
			})
			.state('create-box', {
				url: '/league/:_id/create-box',
				templateUrl: '/partials/create-box.html',
				onEnter: ['$state', '$stateParams', 'auth', 'leagues', 'players', 'teams', function($state, $stateParams, auth, leagues, players, teams){
					if(!auth.isLoggedIn() || !auth.isAdmin()){
						$state.go('home');
					} else {
						leagues.getLeague($stateParams._id);
						players.getAllPlayers();
						teams.getTeams();
					}
				}]
			});

		$urlRouterProvider.otherwise('home');
	}]);


// Require all the angular directories
// -----------------------------------

require('./services');
require('./controllers');
// require('./directives');
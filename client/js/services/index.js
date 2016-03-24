'use strict';


// Require Angular and the App
// ------------------------------
var angular = require('angular');
var app = angular.module('hockeyApp');


// Setup and Require all Services/Factories
// -------------------------------

app.factory('auth', ['$http', '$window', require('./auth-factory')]);
app.factory('leagues', require('./leagues-factory'));
app.factory('players', require('./players-factory'));
app.factory('teams', require('./teams-factory'));
'use strict';

// require('../services');


// Require Angular and the App
// ------------------------------
var angular = require('angular');
var app = angular.module('hockeyApp');

// Setup and Require all Controllers
// -------------------------------

app.controller('MainCtrl', require('./main-controller'));
app.controller('AdminCtrl', require('./admin-controller'));
app.controller('AuthCtrl', require('./auth-controller'));
app.controller('NavCtrl', ['$scope', 'auth', require('./nav-controller')]);
app.controller('TeamsCtrl', require('./team-controller'));
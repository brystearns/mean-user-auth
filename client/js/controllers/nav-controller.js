'use strict';


// -------------------------
// 
// Controller for showing what the nav is
// 
// -------------------------

module.exports = function($scope, auth){
	var vm = this;

	vm.isLoggedIn = auth.isLoggedIn;
	vm.currentUser = auth.currentUser;
	vm.logOut = auth.logOut;
	vm.isAdmin = auth.isAdmin;

	return vm;
};
'use strict';


// -------------------------
// 
// Controller for authenticating and creating users
// 
// -------------------------

module.exports = function($scope, $state, auth){
	var vm = this;
	vm.user = {};
	vm.user.password = '';

	vm.register = function(){
		console.log(vm.user);
		if(vm.user.password.length < 8) {
			alert('Password must be at least 8 characters long');
		} else if(vm.score < 75){
			alert('Password Strength needs to be at least 75');
		} else {
			auth.register(vm.user).error(function(error){
			vm.error = error;
			}).success(function(data){
				$state.go('home');

				vm.user.password = '';
				vm.user.adminPassword = '';
			});
		}

		vm.score = 0;
		vm.num.Excess = 0;
		vm.num.Upper = 0;
		vm.num.Numbers = 0;
		vm.num.Symbols = 0;
		vm.bonus.Combo = 0;

	};


	vm.logIn = function(){
		auth.logIn(vm.user).error(function(error){
			vm.error = error;
		}).then(function(){
			$state.go('home');
		});
	};

	vm.forgot = function(){
		auth.forgotPassword(vm.forgotUser).error(function(err){
			vm.error = err;
		}).success(function(data){
			console.log(data);
			$state.go('home');
		});
	};

	vm.reset = function(){
		console.log(auth.resetToken);
		vm.user.token = auth.resetToken;

		if(vm.user.password.length < 8) {
			alert('Password must be at least 8 characters long');
		} else if(vm.score < 75){
			alert('Password Strength needs to be at least 75');
		} else {
			auth.reset(vm.user).error(function(error){
			vm.error = error;
			}).success(function(data){
				$state.go('home');

				console.log(data);

				vm.user.password = '';
				auth.resetToken = null;
			});
		}

		vm.score = 0;
		vm.num.Excess = 0;
		vm.num.Upper = 0;
		vm.num.Numbers = 0;
		vm.num.Symbols = 0;
		vm.bonus.Combo = 0;

	};


	// -------------------
	// 
	// Test for a strong password
	// 
	// -------------------

	vm.minPasswordLength = 8;
	vm.baseScore = 0;
	vm.score = 0;

	vm.num = {
		Excess: 0,
		Upper: 0,
		Numbers: 0,
		Symbols: 0
	};

	vm.bonus = {
		Excess: 3,
		Upper: 4,
		Numbers: 5,
		Symbols: 5,
		Combo: 0,
		FlatLower: 0,
		FlatNumber: 0
	};


	// Check to make sure the password is long enough
	// -------------------------
	vm.checkVal = function(){
		if(vm.user.password.length >= vm.minPasswordLength) {
			vm.baseScore = 50;
			vm.analyzeString();
		} else {
			vm.baseScore = 0;
		}

		vm.calcComplexity();
		vm.outputResult();
	}


	// check the strength of the password
	// --------------------------
	vm.analyzeString = function(){
		var pw = vm.user.password.split('');

		for(var i=0; i<pw.length;i++){
			if(pw[i].match(/[A-Z]/g)) {vm.num.Upper++;}
			if(pw[i].match(/[0-9]/g)) {vm.num.Numbers++;}
			if(pw[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)) {vm.num.Symbols++;}
		}

		// check how many extra characters the password is
		vm.num.Excess = pw.length - vm.minPasswordLength;


		// assign bonus points if uppercase, numbers and symbols are used
		if(vm.num.Upper && vm.num.Numbers && vm.num.Symbols){
			vm.bonus.Combo = 25;
		} else if ((vm.num.Upper && vm.num.Numbers) || (vm.num.Upper && vm.num.Symbols) || (vm.num.Numbers && vm.num.Symbols)){
			vm.bonus.Combo = 15;
		} else {
			vm.bonus.Combo = 0;
		}


		if(vm.user.password.match(/^[\sa-z]+$/)) {
			vm.bonus.FlatLower = -15;
		}

		if(vm.user.password.match(/^[\s0-9]+$/)) {
			vm.bonus.FlatNumber = -35;
		}

	}


	vm.calcComplexity = function(){
		vm.score = vm.baseScore + (vm.num.Excess*vm.bonus.Excess) + (vm.num.Upper*vm.bonus.Upper) + (vm.num.Numbers*vm.bonus.Numbers) + (vm.num.Symbols*vm.bonus.Symbols) + vm.bonus.Combo + vm.bonus.FlatNumber + vm.bonus.FlatLower;
	}


	vm.outputResult = function(){
		vm.num.Excess = 0;
		vm.num.Upper = 0;
		vm.num.Numbers = 0;
		vm.num.Symbols = 0;
		vm.bonus.Combo = 0;
	}

	return vm;

};
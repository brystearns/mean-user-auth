// -------------------------
// 
// Controller for CRUD on todos after login
// 
// -------------------------

todoApp.controller('TodoCtrl', ['$rootScope', '$scope', 'todosFactory', 'auth', function($rootScope, $scope, todosFactory, auth) {

	$scope.todos = [];
	$scope.isEditable = [];
	$scope.auth = auth;
	$scope.user = $scope.auth.user;


	// get all todos on load
	todosFactory.getTodos().then(function(data) {
		$scope.todos = data.data;
	});


	// check if todo is by logged in user
	$scope.isAuthor = function(todo) {
		if(auth.user._id !== todo.author){
			return false;
		}
		return true;
	};


	// save a todo to the server
	$scope.save = function($event) {
		if($event.which == 13 && $scope.todoInput) {
			todosFactory.saveTodo({
				'todo': $scope.todoInput,
				'isCompleted': false,
				'author': auth.user._id
			}).then(function(data) {
				$scope.todos.push(data.data);
			});
			$scope.todoInput = '';
		}
	};


	// update the status of the Todo
	$scope.updateStatus = function($event, _id, i) {
		var cbk = $event.target.checked;
		var _t = $scope.todos[i];
		todosFactory.updateTodo({
			_id: _id,
			isCompleted: cbk,
			todo: _t.todo
		}).then(function(data) {
			if(data.data.updated !== data.data.created) {
				_t.isCompleted = cbk;
			} else {
				alert('Oops something went wrong');
			}
		});
	};


	// Update the edited Todo
	$scope.edit = function($event, i) {
		if($event.which == 13 && $event.target.value.trim()) {
			var _t = $scope.todos[i];
			todosFactory.updateTodo({
				_id: _t._id,
				todo: $event.target.value.trim(),
				isCompleted: _t.isCompleted
			}).then(function(data) {
				if(data.data.updated !== data.data.created) {
					_t.todo = $event.target.value.trim();
					$scope.isEditable[i] = false;
				} else {
					alert('Oops something went wrong');
				}
			});
		}
	};


	// Delete a todo
	$scope.delete = function(i) {
		todosFactory.deleteTodo($scope.todos[i]._id).then(function(data) {
			if(data.data) {
				$scope.todos.splice(i, 1);
			}
		});
	};

}]);
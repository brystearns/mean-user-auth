(function() {

	'use strict';

	var config = require('../config/config');
	var express = require('express');
	var todoRoutes = express.Router();
	var mongoose = require('mongoose');
	var passport = require('passport');
	var jwt = require('express-jwt');

	var auth = jwt({secret: config.secret, userProperty: 'payload'});


	// Models for the DB
	var Todos = require('../models/todos.js');

	var db = mongoose.connection;





// TODO ROUTES
// ---------------------------------
	


	// Get the list of Todos
	// ----------------------------
	todoRoutes.get('/', function(req, res){
		Todos.find(function(err,data) {
			if(err) res.send(err);

			res.json(data);
		});
	});




	// Create a new Todo
	// ----------------------------
	todoRoutes.post('/', auth, function(req, res){
		var newTodo = new Todos(req.body);
		newTodo.save(function(err) {
			if (err) res.send(err);
		});

		res.json(newTodo);
	});




	// Update a Todo
	// ----------------------------
	todoRoutes.put('/', function(req, res){
		
		Todos.findById(req.body._id, function(err, todo) {
			todo.isCompleted = req.body.isCompleted;
			todo.todo = req.body.todo;
			todo.updated = Date.now();

			todo.save(function(err){
				if(err) res.send(err);

				res.json(todo);
			});
		});
	});




	// Delete a Todo
	// ----------------------------
	todoRoutes.delete('/:_id', auth, function(req, res) {
		Todos.remove({
			_id: req.params._id
		}, function(err, data) {
			if(err) res.send(err);

			res.json(data);
		});
	});




	module.exports = todoRoutes;


}());
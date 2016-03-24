var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({

	'isCompleted': {type: Boolean, default: false},
	'todo': String,
	'author': {type: mongoose.Schema.Types.ObjectId},
	'created': {type: Date, default: Date.now},
	'updated': {type: Date, default: Date.now}

});

module.exports = mongoose.model('Todo', TodoSchema);
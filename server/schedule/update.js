var config = require('../config/config');
var express = require('express');
var async = require('async');
var http = require('http');
var mongoose = require('mongoose');

var Teams = require('../models/teams');
var Players = require('../models/players');

var db = mongoose.connection;


// Update all the teams and their stats
// ----------------------------------------

var Update = {


	updateTeams: function(){
		Teams.find(function(err, teams){
			if(err) {res.json(err);}

			if(!teams.length){
				console.log('Getting teams from Score API');
				var options = {
					hostname: 'api.thescore.com',
					path: '/nhl/standings',
					headers: { 'Content-Type': 'application/json' }
				}

				http.get(options, function(response){
					var data = '';

					response.on('data', function(chunk){
						data += chunk;
					});
					response.on('end', function(){
						var jsonObject = JSON.parse(data);
						var savedTeams = [];

						jsonObject.forEach(function(team){
							var newTeam = new Teams();
							newTeam.setTeamStats(team);
							newTeam.save(function(err) {
								if(err){res.send(err);}
							});
							savedTeams.push(newTeam);
						});

						res.json(savedTeams);	
					});
				});
			}


			else {
				console.log('Teams already in database');

				var updatedTeams = [];
				var asyncTasks = [];

				teams.forEach(function(team){

					// add the function to an array so it can be called with async
					asyncTasks.push(function(callback){
						var options = {
							hostname: 'api.thescore.com',
							path: '/nhl/standings/' + team.standings_id,
							headers: { 'Content-Type': 'application/json' }
						}

						http.get(options, function(response){
							var data = '';

							response.on('data', function(chunk){
								data += chunk;
							});

							response.on('end', function(){
								var jsonObject = JSON.parse(data);

								team.setTeamStats(jsonObject);
								team.save(function(err) {
									if(err){res.send(err);}
									
									console.log(team.full_name + ' has been updated');
									callback();
								});
							});
						});
					});

					asyncTasks.push(function(callback){
						var options = {
							hostname: 'api.thescore.com',
							path: '/nhl/teams/' + team.id + '/players',
							headers: { 'Content-Type': 'application/json' }
						}

						http.get(options, function(response){
							var data = '';

							response.on('data', function(chunk){
								data += chunk;
							});

							response.on('end', function(){
								var jsonObject = JSON.parse(data);

								jsonObject.forEach(function(player){
									team.setTeamRoster(player);
								});

								team.save(function(err) {
									if(err){res.send(err);}

									updatedTeams.push(team);
									callback();
								});
							});
						});
					});

				});


				teams.forEach(function(team){
					team.roster.forEach(function(player){
						
						asyncTasks.push(function(callback){
							var options = {
								hostname: 'api.thescore.com',
								path: '/nhl/players/' + player.id + '/statistics',
								headers: { 'Content-Type': 'application/json' }
							}

							http.get(options, function(response){
								var data = '';

								response.on('data', function(chunk){
									data += chunk;
								});

								response.on('end', function(){
									var jsonObject = JSON.parse(data);

									var teamStats = {
										player: player,
										abbreviation: team.abbreviation,
										id: team.id,
										full_name: team.full_name
									}

									Players.findOne({id: player.id}, function(err, doc){

										if(!doc){
											var newPlayer = new Players();
										} else {
											var newPlayer = doc;
										}

										newPlayer.setPlayerStats(teamStats, jsonObject);

										newPlayer.save(function(err) {
											if(err){res.send(err);}

											callback();
										});

									});

								});
							});

						});

					});
				});

				// run all our functions asyncronously
				// then run our complete function
				async.parallel(asyncTasks, function(){
					console.log('Teams have been updated');
				});


			}
		});
	}

}

module.exports = Update;
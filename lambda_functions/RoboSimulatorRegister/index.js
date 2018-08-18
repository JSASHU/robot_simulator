'use strict';

/*
Lambda Function for executing commands given to robot and store final output in session
*/

var redisClient = require("./utility/redisUtil.js");
var config = require("./config/config.js");
var messageConfig = config.messages;
var atob = require("atob");

/**
* Lambda Function Handler 
* @param {object} event - Consist all input parameters like command and headers
* @param {object} context - Response Object
*/
exports.handler = function(event, context){
	var loginDetails = atob(event.body.hash);
	var userId = loginDetails.split(":")[0];
	var password = loginDetails.split(":")[1];

	redisClient.get(userId, function(err, data){
		data = JSON.parse(data);
		console.log("Session Data :: ",data);
		if(err){
			context.succeed({
				'success' : false, 
				'data' : err,
				'message' : messageConfig.InternalServerError
			})
		}else if(data!=null){
			context.succeed({
				'success' : false, 
				'message': messageConfig.UserAlRegistered
			})
		}else{
			var sessionData = {
				'userId' : userId,
				'password' : password,
				'isRobotOnline' : true,
				'queueCommands' : []
			}
			redisClient.set(userId, JSON.stringify(sessionData), function(err, data){
				if(err){
					context.succeed({
						'success' : false, 
						'data' : err,
						'message' : messageConfig.InternalServerError
					})
				}else{
					context.succeed({
						'success' : true, 
						'user_token' : userId
					})
				}
			})

		}
	})
};
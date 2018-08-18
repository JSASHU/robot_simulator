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
	
	console.log("userId :: ",userId);
	console.log("password :: ",password);
	
	redisClient.get(userId, function(err, data){
		console.log("Session Data :: ",data);
		console.log("Session Type Data :: ",typeof(data));
		data = JSON.parse(data);
		if(err){
			context.succeed({
				'success' : false, 
				'message': messageConfig.InternalServerError
			})
		}else if(data!=null){
			if(data.userId == userId && data.password == password){
				context.succeed({
					'success' : true, 
					'user_token' : userId
				});
			}else{
				context.succeed({
					'success' : false, 
					'message' : messageConfig.loginError
				});
			}
		}else{
			context.succeed({
				'success' : false, 
				'message': messageConfig.NotRegister
			})
		}
	})
};
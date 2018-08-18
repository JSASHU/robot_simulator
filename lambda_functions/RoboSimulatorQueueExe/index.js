'use strict';

/*
Lambda Function for executing commands given to robot and store final output in session
*/

var redisClient = require("./utility/redisUtil.js");
var isvalidCommand = require("./utility/util.js").isvalidCommand;
var executeCommand = require("./utility/util.js").executeCommand;
var config = require("./config/config.js");
var messageConfig = config.messages;
var atob = require("atob");
var robot = require("./controller/robotController.js");

/**
* Lambda Function Handler 
* @param {object} event - Consist all input parameters like command and headers
* @param {object} context - Response Object
*/
exports.handler = function(event, context){
	redisClient.get(event.headers.user_token, function(err, data){
		if(err || data==null){
			context.succeed({"message" : messageConfig.sessionUnavailable});
			return;
		}else{
			data = JSON.parse(data);
			data.userId = event.headers.user_token;
		}
		data.isRobotOnline = true ;
		var localSession = data;
		redisClient.set(data.userId, JSON.stringify(data), function(err, data){
			if(err){
				context.succeed({
					'success' : false, 
					'data' : err,
					'message' : messageConfig.InternalServerError
				});
			}else{
				robot.queueExecution(localSession, function(data){
					if(data==null){
						context.succeed({
							'success' : false, 
							'message' : messageConfig.nothingToexe
						});
					}else{
						context.succeed(data);
					}
				});
			}
		});
	});
};
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
		var session = {};
		if(err || data==null){
			context.succeed({"message" : messageConfig.sessionUnavailable});
			return;
		}else{
			session = JSON.parse(data) ;
			session.userId = event.headers.user_token;
		}
		var command = event.cmd.toUpperCase();			
		if(isvalidCommand(command)){
			executeCommand(event, session, command, function(message){
				context.succeed(message);
			});
		}else{
			context.succeed(messageConfig.unknownCommand);
		}
	});
};
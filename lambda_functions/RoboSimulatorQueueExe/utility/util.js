'use strict';

var config = require("../config/config.js");
var playgrndConfig = config.playground;
var robotConfig = config.robot;
var robot = require("../controller/robotController.js");
var redisClient = require("../utility/redisUtil.js");
var config = require("./config/config.js");
var messageConfig = config.messages;

/**
 * Check if the supplied position is valid
 * @param {number} value - The x or y coordinate for checking.
 * @return {boolean} Is valid position
 */
exports.isValidPosition = function(value, callback) {
    if (value <= playgrndConfig.maximumLength 
    	&& value >= playgrndConfig.minimumLength) {
        	return true;
    } else {
        	return false
    }
}

/**
 * Check if the supplied facing direction is valid
 * @param {string} str - The direction string for checking
 * @return {boolean} Is valid direction
 */
exports.isValidDirection = function(str) {
	var direction = Object.values(robotConfig.directions);
	if(direction.indexOf(str.toUpperCase())==-1){
		return false;
	}else{
		return true;
	}
}

/**
 * Execute Commands
 * @param {object} session - Contains all session details
 * @param {string} cmd - Contains all session details
 * @param {object} callback - callback function
 * @return {object} callback with messages
 */
exports.executeCommand = function(inputData, session, command, callback) {

	if(session.isRobotOnline){
		switch (command) {
		    case "PLACE":
		        robot.place(inputData.x, inputData.y, inputData.facing, session, 
		        	function(data){
		        		callback(data);
		        });
		        break;
		    case "MOVE":
		        robot.move(session, function(data){
		        	callback(data);
		        });
		        break;
		    case "LEFT":
		        robot.left(session, function(data){
		        	callback(data);
		        });
		        break;
		    case "RIGHT":
		        robot.right(session, function(data){
		        	callback(data);
		        });
		        break;
		    case "REPORT":
		        robot.report(session, function(data){
		        	callback(data);
		        });
		        break;
		    case "OFFLINE":
		        robot.makeRoboOffline(session, function(data){
		        	callback(data);
		        });
		        break;
		}
	}else{
		session.queueCommands.push(command);
		redisClient.set(session.userId, JSON.stringify(session), function(err, data){
			if(err){
				callback({
					'success' : false, 
					'data' : err,
					'message' : messageConfig.InternalServerError
				})
			}else{
				callback({
					'success' : true, 
					'message' : messageConfig.cmdAddedInqueue
				});
			}
		});
	};
}

/**
 * Check if the supplied command is valid
 * @param {string} str - The Command string for checking
 * @return {boolean} Is valid command
 */
exports.isvalidCommand = function(str) {
	if(robotConfig.commands.indexOf(str.toUpperCase())==-1){
		return false;
	}else{
		return true;
	}
}
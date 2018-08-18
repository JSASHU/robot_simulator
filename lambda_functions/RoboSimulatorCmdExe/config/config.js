'use strict';

var config = {};

config = {
    "playground": {
        "minimumLength": 0,
        "maximumLength": 5
    },
    "robot": {
        "commands": ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT', 'OFFLINE'],
        "directions": {
            "N" : "NORTH",
            "S": "SOUTH",
            "E": "EAST",
            "W": "WEST"
        }
    },
    "messages": {
        "noInitialCommand": 'Warning! You haven\'t placed the robot on the playground yet. Type "PLACE X, Y, F" to put a robot on the playground.',
        "placeRobotFirst": 'Nothing to report - the robot is not on the playground yet. Place it first to begin - PLACE X, Y, F.',
        "wrongPlace": 'Warning! You cannot place the robot in that square, it can fall. That square is out of the playground.',
        "wrondDirection": 'Error! No such a direction.',
        "unknownCommand": 'Error! Command is incorrect or unknown.',
        "robotPosition": 'Robot\'s position is: ',
        "wrongMove": 'Warning! You cannot move the robot that way, it can fall.',
        "InternalServerError" : "Internal server error. Please Try After sometime.",
        "NotRegister" : "User is not Register",
        "sessionUnavailable" : "Session not present",
        "UserAlRegistered" : "User Already Registered",
        "loginError" : "Invalid Username or Password",
        "roboOffline" : "Robot is Offline",
        "cmdAddedInqueue" : "Command added in Queue"
    },
    "redis" : {
        "host" : "your redis cluster host",
        "port" : 6379
    }
};

module.exports = config ;
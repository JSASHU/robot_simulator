'use strict';

var util = require("../utility/util.js");
var config = require("../config/config.js");
var messageConfig = config.messages;
var roboConfig = config.robot;
var redisClient = require("../utility/redisUtil.js");
var async = require("async");
var _ = require("lodash");

var Robot = {};

Robot.place = function(x, y, facing, session, placeCallback) {
    if (util.isValidPosition(x) && util.isValidPosition(y)){
        if(util.isValidDirection(facing)){
            session.x = parseInt(x);
            session.y = parseInt(y);
            session.facing = facing.toUpperCase();
            session.placed = true;
            this.setSessionValues(session.userId, session, function(message){
                placeCallback(message);
            });
        }else{
            placeCallback({message : messageConfig.wrondDirection, placement:false});
        }
    } else {
        placeCallback({message : messageConfig.wrongPlace, placement:false});
    }
};

Robot.move = function(session, moveCallback) {
    if (session.placed) {
        if (session.facing === roboConfig.directions.N) {
            if(util.isValidPosition(session.y + 1)) {
                session.y = session.y + 1;  
                this.setSessionValues(session.userId, session, function(message){
                    moveCallback(message);
                });
            }else{
                moveCallback({message : messageConfig.wrongMove, placement:false});
            }
        } else if (session.facing === roboConfig.directions.S) {
            if(util.isValidPosition(session.y - 1)) {
                session.y = session.y - 1; 
                this.setSessionValues(session.userId, session, function(message){
                    moveCallback(message);
                });
            }else{
                moveCallback({message : messageConfig.wrongMove, placement:false});
            }
        } else if (session.facing === roboConfig.directions.E) {
            if(util.isValidPosition(session.x + 1)) {
                session.x = session.x + 1;  
                this.setSessionValues(session.userId, session, function(message){
                    moveCallback(message);
                });
            }else{
                moveCallback({message : messageConfig.wrongMove, placement:false});
            }
        } else if (session.facing === roboConfig.directions.W) {
            if(util.isValidPosition(session.x - 1)) {
                session.x = session.x - 1; 
                this.setSessionValues(session.userId, session, function(message){
                    moveCallback(message);
                });
            }else{
                moveCallback({message : messageConfig.wrongMove, placement:false});
            }
        }
    } else {
        moveCallback({message : messageConfig.noInitialCommand, placement:false});
    }
};

Robot.left = function(session, leftCallback) {
    if (session.placed) {
        if (session.facing === roboConfig.directions.N) {
            session.facing = roboConfig.directions.W;
        } else if (session.facing === roboConfig.directions.W) {
            session.facing = roboConfig.directions.S;
        } else if (session.facing === roboConfig.directions.S) {
            session.facing = roboConfig.directions.E;
        } else if (session.facing === roboConfig.directions.E) {
            session.facing = roboConfig.directions.N;
        }
        this.setSessionValues(session.userId, session, function(message){
            leftCallback(message);
        });
    } else {
        leftCallback({message : messageConfig.noInitialCommand, placement:false});
    }
};

Robot.right = function(session, rightCallback) {
    if (session.placed) {
        if (session.facing === roboConfig.directions.N) {
            session.facing = roboConfig.directions.E;
        } else if (session.facing === roboConfig.directions.E) {
            session.facing = roboConfig.directions.S;
        } else if (session.facing === roboConfig.directions.S) {
            session.facing = roboConfig.directions.W;
        } else if (session.facing === roboConfig.directions.W) {
            session.facing = roboConfig.directions.N;
        }
        this.setSessionValues(session.userId, session, function(message){
            rightCallback(message);
        });
    } else {
        rightCallback({message : messageConfig.noInitialCommand, placement:false});
    }
};

Robot.report = function(session, reportCallback) {
    if (session.placed) {
        var data = {
            x : session.x,
            y : session.y,
            facing : session.facing,
            message : messageConfig.robotPosition,
            placement : true
        };
        reportCallback(data);
    } else {
        reportCallback({message : messageConfig.placeRobotFirst, placement:false});
    }
};

Robot.makeRoboOffline = function(session, offlineCallback) {
    session.isRobotOnline = false ;
    this.setSessionValues(session.userId, session, function(message){
        offlineCallback({message : messageConfig.roboOffline});
    });
};

Robot.setSessionValues = function(userId, session ,sessionCallback){
    var that = this ;
    redisClient.set(userId, JSON.stringify(session), (err, data) =>{
        if(err){
            sessionCallback({message : messageConfig.InternalServerError});
        }else{
            that.report(session, function(message){
                sessionCallback(message);
            });
        }
    });
};

Robot.queueExecution = function(session ,queryExeCallback){
    var commands = session.queueCommands ;
    var series_task = [];
    _.map(commands, function(command) {
        series_task.push(function(seriesCallback) {
            util.executeCommand(session, session, command, function(message){
                seriesCallback(message);
            });
        }); 
    });
    async.waterfall(series_task, (results) => {
        session.queueCommands = [];
        this.setSessionValues(session.userId, session, function(message){
            queryExeCallback(results);
        });
    });
};

module.exports = Robot ;
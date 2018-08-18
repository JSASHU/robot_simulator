'use strict';

var Redis = require('ioredis');
var config = require("../config/config.js");
var redisConfig = config.redis;
var redis = new Redis(redisConfig.port, redisConfig.host);
var redisClient  = {};

/**
 * get session values
 * @param {string} key - session string for getting current session values
 * @return {callback} callback function
 */
redisClient.get = function(key, callback) {
	redis.get(key, function(err, result){
		callback(err, result);
	})
}

/**
 * set session values
 * @param {string} key - session string for setting current session values
 * @param {object} params - session values
 * @return {callback} callback function
 */
redisClient.set = function(key, params, callback) {
	redis.set(key, params, function(err, result){
		callback(err, result);
	})
}

module.exports = redisClient;
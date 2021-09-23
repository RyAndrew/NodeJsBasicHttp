"use strict";

const http = require('http');
const net = require('net');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const configFile = 'config.json';

var config = {};
var defaultConfigs = {
	httpPort:80 //https://stackoverflow.com/a/23281401
};

showBanner();
init();

function log(logLine){
	console.log(logLine);
}

function showBanner(){
  log('Starting Server!');
}

function init(){
	configRead();
	initHttpServer();
}

function configRead(){
	let configFileData;
	if (!fs.existsSync(configFile)) {
		config=defaultConfigs;
		log(`configs file ${configFile} doesn't exist, defaults loaded`);
		return;
	}
	try{
		configFileData = fs.readFileSync(configFile, 'utf8');//, function (err, data) {
	}catch(e){
		config=defaultConfigs;
		log(`read configs from ${configFile} - Error! Unable to read file! Check permissions! Defaults loaded`);
		return;
	}
	try{
		config=JSON.parse(configFileData);
	}catch(e){
		config=defaultConfigs;
		log(`read configs from ${configFile} - Error! File contains invalid json! Defaults loaded`);
		console.log(`--------\r\nBad Config:${configFileData}\r\n--------`);
		return;
	}

	if(!config.hasOwnProperty('httpPort')){
		config=defaultConfigs;
		log(`read configs from ${configFile} - Error! Config missing httpPort, assuming bad! Defaults loaded`);
		console.log(`--------\r\nBad Config:${configFileData}\r\n--------`);
	}else{
		log(`read configs from ${configFile}`);
	}
}

function initHttpServer(){
	httpServer.listen(config.httpPort).on('error',function(){
		console.error(`Fatal Error! Failed to listen on port ${config.httpPort}. Is something else using it?`);
		process.exit(1);
	})
}

const httpServer = http.createServer(function(request, response) {

	let pathname = url.parse(request.url).pathname;
  switch(pathname){
		case '/create': dynamoCreate(request, response); 	break;
		case '/read': dynamoRead(request, response); break;
		case '/update': dynamoUpdate(request, response); break;
		case '/delete': dynamoDelete(request, response);	break;
  }
})

function dynamoCreate(request, response){

}
function dynamoRead(request, response){

}
function dynamoUpdate(request, response){

}
function dynamoDelete(request, response){

}
  
process.on("SIGINT", function () {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	process.exit(-1);
});

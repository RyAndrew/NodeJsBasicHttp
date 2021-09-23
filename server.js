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
	httpPort:80, //https://stackoverflow.com/a/23281401
	webRoot:'webroot/'
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

// maps file extention to MIME types
const mimeType = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
	'.doc': 'application/msword',
	'.eot': 'appliaction/vnd.ms-fontobject',
	'.ttf': 'aplication/font-sfnt'
};

const httpServer = http.createServer(function(request, response) {

	const parsedUrl = url.parse(request.url);
	
	switch(parsedUrl.pathname){
		case '/create': dynamoCreate(request, response); return;
		case '/read': dynamoRead(request, response); return;
		case '/update': dynamoUpdate(request, response); return;
		case '/delete': dynamoDelete(request, response); return;
	}

	const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
	let pathname = path.join(__dirname, config.webRoot, sanitizePath);

	fs.exists(pathname, function (exist) {
		if (!exist) {
			// if the file is not found, return 404
			log('404 not found!');
			response.statusCode = 404;
			response.end(`File ${pathname} not found!`);
			return;
		}

		// if is a directory, then look for index.html
		if (fs.statSync(pathname).isDirectory()) {
			pathname += '/index.html';
		}

		// read file from file system
		fs.readFile(pathname, function (err, data) {
			if (err) {
				log('500 file exists but cant read!');
				response.statusCode = 500;
				response.end(`Error getting the file: ${err}.`);
			} else {
				// based on the URL path, extract the file extention. e.g. .js, .doc, ...
				const ext = path.parse(pathname).ext;
				// if the file is found, set Content-type and send data
				response.setHeader('Content-type', mimeType[ext] || 'text/plain');
				response.end(data);
			}
		});
	});
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

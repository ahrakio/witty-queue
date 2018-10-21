// import yargs from "yargs";
// import {ProgramArgsManager} from "./configManager/ProgramArgsManager";
// import {PropertyManagerImpl} from "./configManager/PropertyManagerImpl";
// // .demandOption(['run', 'path'], 'Please provide both run and path arguments to work with this tool')
//
// const appVariables = yargs
// 	.option('port', {
// 		alias: 'p',
// 		describe: 'server running port',
// 		number: true
// 	})
// 	.option('appName', {
// 		alias: 'n',
// 		describe: 'app running name',
// 		string: true
// 	})
// 	.option('appInstances', {
// 		alias: 'i',
// 		describe: 'number of running instances',
// 		number: true
// 	})
// 	.option('stdOutputPath', {
// 		alias: 'o',
// 		describe: 'server standard output log',
// 		string: true
// 	})
// 	.option('errorOutputPath', {
// 		alias: 'e',
// 		describe: 'server error log',
// 		string: true
// 	})
// 	.help()
// 	.argv;
//
// ProgramArgsManager.getInstance().handleArguments(appVariables);
// const appName = PropertyManagerImpl.getInstance().get('appName');
// const instances = PropertyManagerImpl.getInstance().get('appInstances');
// const output = PropertyManagerImpl.getInstance().get('stdOutputPath');
// const error = PropertyManagerImpl.getInstance().get('errorOutputPath');
//
// const {execSync} = require('child_process');
// try {
// 	execSync(`pm2 start dist/server.js --name ${appName}
// 	  		--instances ${instances}
// 	  		--output ${output}
// 	  		 --error ${error}
// 	  		 --log-date-format "YYYY-MM-DD HH:mm Z"tsc
// 	  		 `);
// 	// execSync('pm2 set --log-type json --log-date-format DD-MM-YYYY');
// 	//todo release pm2 in server exit
// 	//todo pm2 set pm2-logrotate:<param>
// } catch (e) {
// 	console.log(e)
// }
//


import * as http from 'http';
import {StringDecoder} from "string_decoder";
import {PropertyManagerImpl} from "./configManager/PropertyManagerImpl";
import {ControllerService} from "./controllers/ControllerService";
import {ControllerPayload} from "./beans/ControllerPayload";
import {ServerUtils} from "./utils/ServerUtils";

const portNum = PropertyManagerImpl.getInstance().get('portNumber');

const server = http.createServer(function (req, res) {
	unifiedServer(req, res)
});

server.listen(portNum, function () {
	console.log(`server listening on port ${portNum}`)
});

let unifiedServer = function (req, res) {
	const controllerService = new ControllerService();
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	let response, body;
	let {path, headers, method, queryString, status, resBody} = ServerUtils.extractRequestInfo(req, res);

	if (status) {
		res.writeHead(status, resBody)
	}

	if (headers['content-type'] && headers['content-type'].startsWith('multipart/form-data')) {
		response = controllerService.handleRequest(path, new ControllerPayload(queryString, headers, buffer, method, path, req));
		if (ServerUtils.isPromise(response)) {
			response.then(data => {
				ServerUtils.sendResponse(data, res);
			}).catch(err => {
				console.error(err);
				ServerUtils.sendResponse(err, res);
			});
		} else {
			ServerUtils.handelResponse(response, res);
		}
	} else {
		req.on('data', function (data) {
			buffer += decoder.write(data);
			if (buffer.length > 1e6)
				req.connection.destroy();
		});
		req.on('end', function () {
			buffer += decoder.end();
			body = JSON.parse(buffer);

			response = controllerService.handleRequest(path, new ControllerPayload(queryString, headers, buffer, method, path, req));
			res.writeHead(response.status);
			res.end(JSON.stringify(response.payload || {}));
		});
	}
};

process.on('SIGINT', () => {
	console.info('SIGINT signal received.');
	// Stops the server from accepting new connections and finishes existing connections.
	server.close(function (err) {
		// if error, log and exit with error (1 code)
		if (err) {
			console.error(err);
			process.exit(1)
		}
	})
});

process.on('message', (msg) => {
	if (msg == 'shutdown') {
		console.log('Closing all connections...')
		setTimeout(() => {
			console.log('Finished closing connections')
			process.exit(0)
		}, 1500)
	}
});


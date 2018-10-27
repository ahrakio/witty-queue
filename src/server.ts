import * as http from 'http';
import {StringDecoder} from "string_decoder";
import {PropertyManagerImpl} from "./configManager/PropertyManagerImpl";
import {ControllersService} from "./controllers/ControllersService";
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
	const controllerService = new ControllersService();
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	let response, body;
	let {path, headers, method, queryString, status, resBody} = ServerUtils.extractRequestInfo(req, res);

	if (status) {
		res.writeHead(status);
		res.end(JSON.stringify(resBody));
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
	server.close(function (err) {
		if (err) {
			console.error(err);
			process.exit(1)
		}
	})
});

process.on('message', (msg) => {
	if (msg == 'shutdown') {
		console.log('Closing all connections...');
		setTimeout(() => {
			console.log('Finished closing connections')
			process.exit(0)
		}, 1500)
	}
});

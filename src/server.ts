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
	let {path, headers, method, queryString, status, resBody} = ServerUtils.extractInfo(req, res);

	if (status) {
		res.writeHead(status, resBody)
	}

	if (headers['content-type'] && headers['content-type'].startsWith('multipart/form-data')) {
		response = controllerService.handleRequest(path, new ControllerPayload(queryString, headers, buffer, method, path, req));
		ServerUtils.handelResponse(response, res);
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

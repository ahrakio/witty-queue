import {ControllerService} from "../controllers/ControllerService";
import {Types} from "./Types";
import * as url from "url";
import {controllerResponse} from "../controllers/controllerResponse";
import {sep} from "path";


export class ServerUtils {


	public static sendResponse = (response: controllerResponse, res: any) => {
		if (response.payload.sendRes) {
			res.writeHead(response.status);
			res.end(JSON.stringify(response.payload || {}));
		}
	};

	public static isPromise(response: Types.controllerRes): response is Promise<controllerResponse> {
		return (<Promise<controllerResponse>>response).then !== undefined;
	}

	public static handelResponse = (response: controllerResponse, res: any) => {
		// if (ServerUtils.isPromise(response)) {
		// 	response.then((data: controllerResponse) => {
		// 		console.log('haim');
		// 		ServerUtils.sendResponse(data, res);
		// 	}).catch((err: controllerResponse) => {
		// 		ServerUtils.sendResponse(err, res)
		// 	});
		// } else {
		ServerUtils.sendResponse(response, res);
		//}
	};

	public static extractRequestInfo(req, res) {
		let headers, queryString;
		const parsedUrl = url.parse(req.url as string, true);
		const method = req.method ? req.method.toLocaleLowerCase() : undefined;
		let path = parsedUrl.pathname;
		headers = req.headers;

		if (!path) {
			return {status: 404, resBody: {}};
		}

		path = path.replace(/^\/+|\/+$/g, '');
		queryString = parsedUrl.query;

		return {path: path, headers: headers, method: method, parsedUrl: parsedUrl, queryString: queryString};
	}

	public static extractTaskData(files, fields) {
		let file = files.task_zip_file;
		let fileName = fields.taskFileName;
		let taskName = fields.taskClassName;
		let sendingServerName = fields.serverName;
		let isTaskExist = fields.isTaskExist === 'true';
		let state = fields.taskState;
		let options = JSON.parse(fields.options);
		let temp = file ? file.path.split(sep) : undefined;
		let uploadZipName = temp ? temp[temp.length - 1] : undefined;
		return {file, fileName, taskName, sendingServerName, isTaskExist, state, uploadZipName, options};

	}
}

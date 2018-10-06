import { ControllerService} from "../controllers/ControllerService";
import {Types} from "./Types";
import * as url from "url";
import {controllerResponse} from "../controllers/controllerResponse";


export class ServerUtils {


	private static sendResponse = (response: controllerResponse, res: any) => {
		res.writeHead(response.status);
		res.end(JSON.stringify(response.payload || {}));
	};

	public static isPromise(response: Types.controllerRes): response is Promise<controllerResponse> {
		return (<Promise<controllerResponse>>response).then !== undefined;
	}

	public static handelResponse = (response: Types.controllerRes, res: any) => {
		if (ServerUtils.isPromise(response)) {
			(response).then((data: controllerResponse) => {
				ServerUtils.sendResponse(data, res);
			}).catch((err: controllerResponse) => {
				ServerUtils.sendResponse(err, res)
			});
		} else {
			ServerUtils.sendResponse(response, res);
		}
	};

	public static extractInfo(req, res) {
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


}

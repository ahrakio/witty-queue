export class ControllerPayload {

	private readonly _queryString;
	private readonly _headers;
	private readonly _body;
	private readonly _method;
	private readonly _path;
	private readonly _req;

	get req() {
		return this._req;
	}

	get queryString() {
		return this._queryString;
	}

	get headers() {
		return this._headers;
	}

	get body() {
		return this._body;
	}

	get method() {
		return this._method;
	}

	get path() {
		return this._path;
	}

	constructor(queryString, headers, body, method, path, req) {
		this._queryString = queryString;
		this._headers = headers;
		this._body = body;
		this._method = method;
		this._path = path;
		this._req = req;
	}


}

export class TaskBean {
	set taskPath(value) {
		this._taskPath = value;
	}

	get taskState() {
		return this._taskState;
	}

	get isExist() {
		return this._isExist;
	}

	get options() {
		return this._options;
	}

	private readonly _className;
	private readonly _fileName;
	private _taskPath;
	private readonly _isExist;
	private readonly _taskState;
	private readonly _options;

	constructor(className: string, fileName: string, taskPath: string, isExist: boolean, taskState: any, options = {}) {
		this._className = className;
		this._fileName = fileName;
		this._taskPath = taskPath;
		this._isExist = isExist;
		this._taskState = taskState;
		this._options = options;
	}

	get className() {
		return this._className;
	}

	get fileName() {
		return this._fileName;
	}

	get taskPath() {
		return this._taskPath;
	}

}

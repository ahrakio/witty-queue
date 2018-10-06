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

	private readonly _className;
	private readonly _fileName;
	private _taskPath;
	private readonly _isExist;
	private readonly _taskState;

	constructor(className: string, fileName: string, taskPath: string, isExist: boolean, taskState: any) {
		this._className = className;
		this._fileName = fileName;
		this._taskPath = taskPath;
		this._isExist = isExist;
		this._taskState = taskState;
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

export class NewTaskPayload {

	private readonly _tasksDirPath;
	private readonly _uploadedZipFileName;
	private readonly _taskClassName;
	private readonly _fileName;
	private readonly _isTaskExists;
	private readonly _sendingServerName;
	private readonly _taskState;

	get taskState() {
		return this._taskState;
	}

	get sendingServerName() {
		return this._sendingServerName;
	}

	get uploadedZipFileName() {
		return this._uploadedZipFileName;
	}

	get isTaskExists() {
		return this._isTaskExists;
	}

	get tasksDirPath() {
		return this._tasksDirPath;
	}

	get taskClassName() {
		return this._taskClassName;
	}

	get fileName() {
		return this._fileName;
	}

	constructor(tasksDirPath, uploadedZipFileName, taskClassName, fileName, isTaskExist, sendingServerName, state) {
		this._tasksDirPath = tasksDirPath;
		this._uploadedZipFileName = uploadedZipFileName;
		this._taskClassName = taskClassName;
		this._fileName = fileName;
		this._isTaskExists = isTaskExist;
		this._sendingServerName = sendingServerName;
		this._taskState = state;
	}

}

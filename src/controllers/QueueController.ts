import {Controller} from "./Controller";
import {ControllerPayload} from "../beans/ControllerPayload";
import {NotFoundController} from "./NotFoundController";
import {sep} from "path";
import {TaskManager} from "../models/TaskManager";
import {Consts} from "../utils/Consts";
import {NewTaskPayload} from "../beans/NewTaskPayload";
import {Types} from "../utils/Types";
import {controllerResponse} from "./controllerResponse";

const IncomingForm = require('formidable').IncomingForm;


// @ControllerImpl<Controller>()
export class QueueController implements Controller {

	private static instance: QueueController;
	private readonly dict: { [key: string]: (payload: ControllerPayload) => Types.controllerRes };
	private notFound: Controller;

	static getInstance() {
		if (!this.instance) {
			this.instance = new QueueController();
		}
		return this.instance;
	}

	private constructor() {
		this.dict =
			{
				'addTask': this.addTask,
			};
		this.notFound = NotFoundController.getInstance();
	}

	public handleReq(path: string, payload: ControllerPayload) {
		if (!this.dict[path]) {
			return {status: 404, payload: {}};
		}
		return this.dict[path](payload);
	}

	private addTask(payload: ControllerPayload): Types.controllerRes {
		let {req} = payload;
		let form = new IncomingForm();
		form.keepExtensions = true;
		form.uploadDir = Consts.tasksDirPath;
		let tempPromise: Promise<controllerResponse> = new Promise(function (resolve, reject) {
			form.parse(req, function (err, fields, files) {
				if (err) {
					console.log('some error', err);
					reject({status: 404, payload: {}})
				} else {
					let file = files.task_zip_file;
					let fileName = fields.taskFileName;
					let taskName = fields.taskClassName;
					let sendingServerName = fields.serverName;
					let isTaskExist = fields.isTaskExist === 'true';
					let state = fields.taskState;
					let temp = file ? file.path.split(sep) : undefined;
					let name = temp ? temp[temp.length - 1] : undefined;
					let response = TaskManager.handleNewTask(new NewTaskPayload(Consts.tasksDirPath, name, taskName, fileName, isTaskExist, sendingServerName, state));
					resolve(response);
				}
			});
		});
		return Promise.resolve(tempPromise);
	}

}

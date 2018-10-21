import {Controller} from "./Controller";
import {ControllerPayload} from "../beans/ControllerPayload";
import {NotFoundController} from "./NotFoundController";
import {sep} from "path";
import {TaskManager} from "../models/TaskManager";
import {Consts} from "../utils/Consts";
import {NewTaskPayload} from "../beans/NewTaskPayload";
import {Types} from "../utils/Types";
import {controllerResponse} from "./controllerResponse";
import {ServerUtils} from "../utils/ServerUtils";
import {Task} from "../models/Task";
import {TaskRunner} from "../models/TaskRunner";
import {TaskUtils} from "../utils/TaskUtils";
import {TaskBean} from "../beans/TaskBean";

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

	private addTask(payload: ControllerPayload): Promise<controllerResponse> {
		let {req} = payload;
		let form = new IncomingForm();
		form.keepExtensions = true;
		form.uploadDir = Consts.tasksDirPath;
		return new Promise((resolve, reject) => {
			form.parse(req, function (err, fields, files) {
				if (err) {
					console.log('some error', err);
				} else {
					let {file, fileName, taskName, sendingServerName, isTaskExist, state, uploadZipName, options} = ServerUtils.extractTaskData(files, fields);
					let taskPromise = TaskManager.createNewTask(new NewTaskPayload(Consts.tasksDirPath, uploadZipName, taskName, fileName, isTaskExist, sendingServerName, state, options));
					taskPromise.then((task: Types.taskCreationDataRes) => {
						TaskManager.runTask(resolve, reject, task, options, isTaskExist, uploadZipName);
					}).catch(err => {
						console.log('here test');
						reject({
							status: 500,
							payload: {
								sendResult: options.receiveFeedback,
								success: false,
								Attempts: 0,
								message: 'failed to create task' + err
							}
						});
						TaskUtils.cleanAfterNewTask(Consts.tasksDirPath + sep + uploadZipName);
					});
				}
			});
		})
	}
}

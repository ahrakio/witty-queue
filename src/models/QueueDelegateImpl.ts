import {ControllerPayload} from "../beans/ControllerPayload";
import {Consts} from "../utils/Consts";
import {ServerUtils} from "../utils/ServerUtils";
import {TaskManager} from "./TaskManager";
import {NewTaskPayload} from "../beans/NewTaskPayload";
import {Types} from "../utils/Types";
import {TaskUtils} from "../utils/TaskUtils";
import {sep} from "path";
import {IncomingForm} from "formidable";
import {QueueDelegate} from "./QueueDelegate";
import controllerResponse = Types.controllerResponse;


export class QueueDelegateImpl implements QueueDelegate {

	public addTask(payload: ControllerPayload): Promise<controllerResponse> {
		let {req} = payload;
		let form = new IncomingForm();
		form.keepExtensions = true;
		form.uploadDir = Consts.tasksDirPath;
		return new Promise((resolve, reject) => {
			form.parse(req, function (err, fields, files) {
				if (err) {
					console.error('error parsing form data: ', err);
				} else {
					let {file, fileName, taskName, sendingServerName, isTaskExist, state, uploadZipName, options} = ServerUtils.extractTaskData(files, fields);
					let taskPromise = TaskManager.createNewTask(new NewTaskPayload(Consts.tasksDirPath, uploadZipName, taskName, fileName, isTaskExist, sendingServerName, state, options));
					taskPromise.then((task: Types.taskCreationDataRes) => {
						TaskManager.runTask(resolve, reject, task, options, isTaskExist, uploadZipName);
					}).catch(err => {
						console.error('error creating task: ', err);
						reject({
							status: 500,
							payload: {
								sendFeedback: options.receiveFeedback,
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

import {TaskBean} from "../beans/TaskBean";
import {Task} from "./Task";
import {sep} from "path";
import * as fs from "fs";
import {TaskUtils} from "../utils/TaskUtils";
import {NewTaskPayload} from "../beans/NewTaskPayload";
import {Consts} from "../utils/Consts";
import {unlinkSync} from "fs";
import {Types} from "../utils/Types";
import {TaskDirManager} from "./TaskDirManager";
import {TaskRunner} from "./TaskRunner";

const rimraf = require('rimraf');

export class TaskManager {

	public static createNewTask(payload: NewTaskPayload): Types.taskCreationPromiseRes {

		let tasksDir = Consts.tasksDirPath;
		if (!fs.existsSync(tasksDir)) {
			fs.mkdirSync(tasksDir)
		}

		const extractedTaskDir = tasksDir + sep + `${payload.sendingServerName}_${payload.taskClassName}`;
		const bean = new TaskBean(payload.taskClassName, payload.fileName,
			extractedTaskDir + sep + payload.fileName, payload.isTaskExists, payload.taskState);

		if (!payload.isTaskExists) {
			this.handelNewTaskFolderCreation(bean, extractedTaskDir, payload);
			let resolveExtraction = Promise.resolve(TaskUtils.extractTaskZip(payload));
			return Promise.resolve<Task | null>((Promise.resolve(
				resolveExtraction.then(result => {
					if (result) {
						return Promise.resolve(TaskManager.createTask(bean));
					} else {
						return Promise.resolve(null);
					}
				})
			))).catch(err => {
				return new Promise((resolve, reject) => {
					reject(null)
				})
			});
		} else {
			if (TaskDirManager.getDirSuffix(extractedTaskDir)) {
				bean.taskPath = bean.taskPath + '_' + TaskDirManager.getDirSuffix(extractedTaskDir) + sep + payload.fileName;
			} else {
				let oldV = TaskUtils.olderVersionExist(`${payload.sendingServerName}_${payload.taskClassName}`);
				if (oldV) {
					bean.taskPath = oldV + sep + payload.fileName;
				}
			}
			return this.createTask(bean);
		}
	}

	private static async createTask(taskInfo: TaskBean): Types.taskCreationPromiseRes {
		let task = await import(taskInfo.taskPath);
		let instance: Task = new task[taskInfo.className]();
		if (taskInfo.isExist && instance) {
			this.setClassState(instance, taskInfo.taskState)
		}
		return instance;
	}

	private static setClassState(task: Task, state: any) {
		state = JSON.parse(state);
		for (let key in state) {
			if (state.hasOwnProperty(key)) {
				task[key] = state[key];
			}
		}
	}

	private static handelNewTaskFolderCreation(bean: TaskBean, extractedTaskDir: string, payload: NewTaskPayload) {
		let suffix = TaskDirManager.getDirSuffix(extractedTaskDir);
		if (suffix && fs.existsSync(extractedTaskDir + '_' + suffix)) {
			rimraf.sync(extractedTaskDir + '_' + suffix);
			TaskDirManager.removeSuffix(extractedTaskDir);
		} else {
			let oldVersionPath = TaskUtils.olderVersionExist(`${payload.sendingServerName}_${payload.taskClassName}`);
			if (oldVersionPath) {
				rimraf.sync(oldVersionPath)
			}
		}
		let fullPath = extractedTaskDir + '_' + TaskDirManager.addDirSuffix(extractedTaskDir);
		fs.mkdirSync(fullPath);
		bean.taskPath = fullPath + sep + payload.fileName;
	}

	public static runTask(resolve, reject, task, options, isTaskExist, uploadZipName) {
		let message, success, attempts, status, sendFeedback, reSendTask;
		if (task) {
			let runRes = TaskRunner.runTask(task, options);
			status = 200;
			message = runRes.success ? 'successfully executed the task' : 'failed to run tasks';
			attempts = runRes.Attempts;
			success = runRes.success;
		} else if (isTaskExist) {
			sendFeedback = true;
			reSendTask = true;
			success = false;
			status = 500;
			message = 'send task again';
			attempts = 0;
		}
		resolve({
			status: status,
			payload: {
				success: success,
				Attempts: attempts,
				reSendTask: reSendTask,
				sendFeedback: sendFeedback || options.receiveFeedback,
				message: message
			}
		});
		TaskUtils.cleanAfterNewTask(Consts.tasksDirPath + sep + uploadZipName);
	}
}

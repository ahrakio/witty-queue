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

const rimraf = require('rimraf');

export class TaskManager {

	public static handleNewTask(payload: NewTaskPayload): Types.controllerRes {

		let tasksDir = Consts.tasksDirPath;
		if (!fs.existsSync(tasksDir)) {
			fs.mkdirSync(tasksDir)
		}

		const extractedTaskDir = tasksDir + sep + `${payload.sendingServerName}_${payload.taskClassName}`;
		const bean = new TaskBean(payload.taskClassName, payload.fileName,
			extractedTaskDir + sep + payload.fileName, payload.isTaskExists, payload.taskState);

		if (!payload.isTaskExists) {
			this.handelNewTaskFolderCreation(bean, extractedTaskDir, payload);
			return new Promise(function (resolve, reject) {
				TaskUtils.extractTaskZip(payload)
					.then(success => {
						if (success) {
							TaskManager.createAndRunTask(bean);
							unlinkSync(payload.tasksDirPath + sep + payload.uploadedZipFileName);
							resolve({status: 200, payload: {}});
						}
					})
					.catch(err => {
						console.log('error extracting files');
						reject({status: 500, payload: {}});
					});
			})
		} else {
			if (TaskDirManager.getDirSuffix(extractedTaskDir)) {
				bean.taskPath = bean.taskPath + '_' + TaskDirManager.getDirSuffix(extractedTaskDir) + sep + payload.fileName;
			} else {
				let oldV = TaskUtils.olderVersionExist(`${payload.sendingServerName}_${payload.taskClassName}`);
				if (oldV) {
					bean.taskPath = oldV + sep + payload.fileName;
				}
			}
			this.createAndRunTask(bean);
			return {status: 200, payload: {}};
		}
	}

	private static createAndRunTask(taskInfo: TaskBean) {
		import(taskInfo.taskPath).then(task => {
			let instance: Task = new task[taskInfo.className]();
			if (taskInfo.isExist) {
				this.setClassState(instance, taskInfo.taskState)
			}
			instance.run();
		}).catch(err => {
			console.error('error creating task');
		});
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
}

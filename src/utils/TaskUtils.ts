import {NewTaskPayload} from "../beans/NewTaskPayload";
import {Consts} from "./Consts";
import {sep} from "path";
import {TaskDirManager} from "../models/TaskDirManager";
import * as fs from "fs";

const extract = require('extract-zip');


export class TaskUtils {

	public static extractTaskZip(payload: NewTaskPayload): Promise<boolean> {
		return new Promise(function (resolve, reject) {
			let extractPath = payload.tasksDirPath + sep + payload.sendingServerName + '_' + payload.taskClassName;
			extractPath = TaskDirManager.getDirSuffix(extractPath) ? extractPath + '_' + TaskDirManager.getDirSuffix(extractPath) : extractPath;
			extract(payload.tasksDirPath + sep + payload.uploadedZipFileName, {dir: extractPath}, function (err) {
				if (!err) {
					resolve(true);
				} else {
					reject(false);
					//todo handle err
				}
			});
		})
	}

	public static olderVersionExist(taskPrefix: string) {
		const basePath = Consts.tasksDirPath;
		const files = fs.readdirSync(basePath);
		for (let file of files) {
			if (fs.lstatSync(`${basePath}${sep}${file}`).isDirectory() && file.startsWith(taskPrefix)) {
				return `${basePath}${sep}${file}`;
			}
			console.log(file);
		}
		return null;
	}
}

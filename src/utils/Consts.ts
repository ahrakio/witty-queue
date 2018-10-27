import {sep} from "path";

export class Consts {
	static get tasksDirPath(): string {
		return this._tasksDirPath;
	}

	private static _tasksDirPath = process.cwd() + sep + 'src' + sep + 'tasks';
}

import {Task} from "./Task";

export class TaskRunner {

	public static runTask(task: Task, options: any): { success: boolean, Attempts: number } {
		let runnerCounter = 0;
		let success = false;
		let Attempts = options.numberOfTries | 1; //todo set in config num of max tries
		while (runnerCounter < Attempts && !success) {
			runnerCounter++;
			try {
				task.run();
				success = true;
			} catch (e) {
				console.error(e);
			}
		}
		return {success: success, Attempts: runnerCounter};
	}
}

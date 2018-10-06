import moment from 'moment';


//todo make singleton
export class TaskDirManager {

	private static map: Map<string, string> = new Map<string, string>();

	public static getDirSuffix(taskPrefix: string): string | undefined {
		return this.map.get(taskPrefix);
	}

	public static addDirSuffix(taskPrefix: string): string {
		const date: string = moment().format('MMMMDoYYYYhmmssa');
		this.map.set(taskPrefix, date);
		return date;
	}

	public static removeSuffix(taskPrefix: string) {
		this.map.delete(taskPrefix);
	}
}

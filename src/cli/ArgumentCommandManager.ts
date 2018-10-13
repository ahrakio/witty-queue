import {ArgumentCommand} from "./ArgumentCommand";

export class ArgumentCommandManager {

	private commandDictionary: { [key: string]: string };

	constructor() {
	}

	public addCommand(command: string, action: ArgumentCommand) {

	}

	public getCommand(command: string): ArgumentCommand | undefined {
		return undefined;
	}
}

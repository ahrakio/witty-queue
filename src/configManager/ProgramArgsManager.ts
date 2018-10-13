import {ArgumentCommandManager} from "../cli/ArgumentCommandManager";
import {PropertyManagerImpl} from "./PropertyManagerImpl";

export class ProgramArgsManager {

	private static instance: ProgramArgsManager;
	private commandManager: ArgumentCommandManager;

	private constructor() {
		this.commandManager = new ArgumentCommandManager();
	}

	public static getInstance(): ProgramArgsManager {
		if (!this.instance) {
			this.instance = new ProgramArgsManager();
		}
		return this.instance;
	}

	public handleArguments(args: any) {
		for (const val in args) {
			if (args.hasOwnProperty(val) && val !== '$0') {
				PropertyManagerImpl.getInstance().set(val, args[val]);
			}
		}
	}

}

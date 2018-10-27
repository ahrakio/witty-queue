import {ArgumentCommandManager} from "../cli/ArgumentCommandManager";
import {PropertyManagerImpl} from "./PropertyManagerImpl";
import yargs from "yargs";

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

	public getProgramArguments() {
		return yargs
			.option('port', {
				alias: 'p',
				describe: 'server running port',
				number: true
			})
			.option('appName', {
				alias: 'n',
				describe: 'app running name',
				string: true
			})
			.option('appInstances', {
				alias: 'i',
				describe: 'number of running instances',
				number: true
			})
			.option('stdOutputPath', {
				alias: 'o',
				describe: 'server standard output log',
				string: true
			})
			.option('errorOutputPath', {
				alias: 'e',
				describe: 'server error log',
				string: true
			})
			.help()
			.showHelpOnFail(true)
			.argv;
		// .demandOption(['run', 'path'], 'Please provide both run and path arguments to work with this tool')
	}
}

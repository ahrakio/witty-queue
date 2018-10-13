import yargs from "yargs";
import {ProgramArgsManager} from "./configManager/ProgramArgsManager";
import {PropertyManagerImpl} from "./configManager/PropertyManagerImpl";
// .demandOption(['run', 'path'], 'Please provide both run and path arguments to work with this tool')

const appVariables = yargs
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
	.argv;

ProgramArgsManager.getInstance().handleArguments(appVariables);
const appName = PropertyManagerImpl.getInstance().get('appName');
const instances = PropertyManagerImpl.getInstance().get('appInstances');
const output = PropertyManagerImpl.getInstance().get('stdOutputPath');
const error = PropertyManagerImpl.getInstance().get('errorOutputPath');

const {execSync} = require('child_process');
try {
	execSync(`pm2 start dist/server.js --name ${appName}
	  		--instances ${instances} 
	  		--output ${output}
	  		 --error ${error} 
	  		 --log-date-format "YYYY-MM-DD HH:mm Z"tsc
	  		 `);
	// execSync('pm2 set --log-type json --log-date-format DD-MM-YYYY');
	//todo release pm2 in server exit
	//todo pm2 set pm2-logrotate:<param>
} catch (e) {
	console.log(e)
}


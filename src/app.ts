import {ProgramArgsManager} from "./configManager/ProgramArgsManager";
import {PropertyManagerImpl} from "./configManager/PropertyManagerImpl";

const args = ProgramArgsManager.getInstance().getProgramArguments();
ProgramArgsManager.getInstance().handleArguments(args);
const appName = PropertyManagerImpl.getInstance().get('appName');
const instances = PropertyManagerImpl.getInstance().get('appInstances');
const output = PropertyManagerImpl.getInstance().get('stdOutputPath');
const error = PropertyManagerImpl.getInstance().get('errorOutputPath');

const {execSync} = require('child_process');
try {
	// execSync(`pm2 install pm2-logrotate`)
	// execSync(`pm2 set pm2-logrotate:max_size 1MB`)
	// execSync(`pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss`)
	execSync(`pm2 start dist/server.js  -name ${appName} -o ${output} -e ${error} --instances ${instances} --log-date-format YYYY-MM-DD_HH-mm-ss`)
	// execSync(`pm2 start dist/server.js logrotate --name ${appName}
	//   		--instances ${instances}
	//   		--output = ./out.log
	//   		 --error ${error}
	//   		 --log-date-format "YYYY-MM-DD HH:mm Z"tsc
	//   		 `);

	//todo release pm+2 in server exit

} catch (e) {
	console.log(e.message);
	execSync(`pm2 kill`);
}

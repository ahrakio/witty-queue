import PropertiesReader from 'properties-reader';
import {PropertyManager} from "./PropertyManager";


export class PropertyManagerImpl implements PropertyManager {

	private properties = PropertiesReader('config.ini');

	get(name: string): string | number | boolean | null {
		return this.properties.get(name);
	}

	set(key: string, value: any) {
	}

}


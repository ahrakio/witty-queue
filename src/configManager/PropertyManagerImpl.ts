import PropertiesReader from 'properties-reader';
import {PropertyManager} from "./PropertyManager";
import {sep} from "path";

const fs = require('fs');
const ini = require('ini');

export class PropertyManagerImpl implements PropertyManager {

	private static instance: PropertyManagerImpl;
	private properties = PropertiesReader(`${process.cwd()}${sep}config.ini`);
	private config;

	private constructor() {
		this.config = ini.parse(fs.readFileSync(`${process.cwd()}${sep}config.ini`, 'utf-8'))
	}

	public static getInstance(): PropertyManagerImpl {
		if (!this.instance) {
			this.instance = new PropertyManagerImpl();
		}
		return this.instance
	}

	get(name: string): string | number | boolean | null {
		return this.properties.get(name);
	}

	set(key: string, value: string | number | boolean) {
		if(this.config[key] === typeof Array){
			this.config.push(value);
		}else{
			this.config[key] = value;
		}
		fs.writeFileSync('./config.ini', ini.stringify(this.config));
	}
}


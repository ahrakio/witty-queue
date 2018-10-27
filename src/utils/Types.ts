import {Task} from "../models/Task";

export namespace Types {
	export type  controllerRes = controllerResponse | Promise<controllerResponse>;
	export type  taskCreationPromiseRes = Promise<Task | null> ;
	export type  taskCreationDataRes = Task | null ;
	export type  controllerResponse = { status: number, payload: any }
}



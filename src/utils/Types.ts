import {controllerResponse} from "../controllers/controllerResponse";

export namespace Types {
	export type  controllerRes = controllerResponse |  Promise<controllerResponse>;
}



import {ControllerPayload} from "../beans/ControllerPayload";
import {Types} from "../utils/Types";

export interface Controller {
	handleReq(path: string, payload: ControllerPayload): Types.controllerRes;
}

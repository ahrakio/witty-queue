import {ControllerPayload} from "../beans/ControllerPayload";
import {Types} from "../utils/Types";
import controllerResponse = Types.controllerResponse;


export interface QueueDelegate {
	addTask(payload: ControllerPayload): Promise<controllerResponse>;
}

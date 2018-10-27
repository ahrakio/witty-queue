import {ControllerPayload} from "../beans/ControllerPayload";
import {Controller} from "./Controller";
import {QueueController} from "./QueueController";
import {NotFoundController} from "./NotFoundController";
import {Types} from "../utils/Types";

export class ControllersService {

	private readonly dict: { [path: string]: Controller };
	private readonly notFound: Controller;

	constructor() {
		this.notFound = NotFoundController.getInstance();
		this.dict = {'queue': QueueController.getInstance()};
	}

	public handleRequest(path: string | undefined, payload: ControllerPayload): Types.controllerRes {
		if (path) {
			const controller = this.dict[path.split('/')[0]] || this.notFound;
			return controller.handleReq(path.split('/')[1], payload);
		} else {
			return this.notFound.handleReq('', payload);
		}
	}
}

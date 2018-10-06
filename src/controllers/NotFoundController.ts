import {Controller} from "./Controller";
import {ControllerPayload} from "../beans/ControllerPayload";


export class NotFoundController implements Controller {
	private static instance: NotFoundController;

	private constructor() {
	}

	public static getInstance() {
		if (!this.instance) {
			this.instance = new NotFoundController();
		}
		return this.instance;
	}

	public handleReq(path: string, payload: ControllerPayload) {
		return {status: 404, payload: 'not found'};
	}
}

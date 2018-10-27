import {Controller} from "./Controller";
import {ControllerPayload} from "../beans/ControllerPayload";
import {NotFoundController} from "./NotFoundController";
import {QueueRoutes} from "../routes/QueueRoutes";

// @ControllerImpl<Controller>()
export class QueueController implements Controller {

	private static instance: QueueController;
	private readonly dict: QueueRoutes;
	private notFound: Controller;

	static getInstance() {
		if (!this.instance) {
			this.instance = new QueueController();
		}
		return this.instance;
	}

	private constructor() {
		this.dict = new QueueRoutes();
		this.notFound = NotFoundController.getInstance();
	}

	public handleReq(path: string, payload: ControllerPayload) {
		if (!this.dict.getAction(path)) {
			return {status: 404, payload: {}};
		}
		return this.dict.getAction(path)(payload);
	}


}

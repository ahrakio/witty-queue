import {ControllerPayload} from "../beans/ControllerPayload";
import {Types} from "../utils/Types";
import {QueueDelegateImpl} from "../models/QueueDelegateImpl";
import {QueueDelegate} from "../models/QueueDelegate";

export class QueueRoutes {

	private readonly dict: { [key: string]: (payload: ControllerPayload) => Types.controllerRes };
	private delegate: QueueDelegate;

	constructor() {
		this.delegate = new QueueDelegateImpl()
		this.dict = {
			'addTask': this.delegate.addTask,
		};
	}

	public getAction(route: string) {
		return this.dict[route];
	}

	public addAction(route: string, action) {
		this.dict[route] = action;
	}
}

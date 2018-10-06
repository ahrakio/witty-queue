export interface Task {
	timeout?: number;
	numOfReTry?: number;

	run(): void | boolean | Promise<boolean>;

}


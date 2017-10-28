import * as cls from 'continuation-local-storage';

export default class LambdaContext {

	public static get segment (): any | undefined {

		const segment = cls.getNamespace('AWSXRay').get('segment');

		if (segment) {

			segment.resolveLambdaTraceData();

		}

		return segment;
	}

}

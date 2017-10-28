import LambdaContext from '../lambda/lambda-context';
import Segment from '../segment';
import logger from '../logger';

export default class LambdaSegment extends Segment {

	constructor () {

		super('facade');

		const segment = LambdaContext.segment;

		if (segment) {

			this._id = segment.id;
			this._traceId = segment.trace_id;
			this._startTime = segment.start_time;

		} else {

			logger.warn('XRAY segment not found in Lambda context');

		}

		this._isSampled = true;

	}

	public async flush (): Promise<void> {

		await this._flushSubSegments(true);

	}

	public async closeAsync () {

		this._closed = true;

		await this.flush();

	}

}

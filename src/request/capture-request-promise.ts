import Segment from '../segment';
import * as URL from 'url';
import RequestDataRequest from './request-data-request';
import { IncomingMessage } from 'http';
import { getCause } from '../http/util';

export default function captureRequestPromise (module: any, parent: Segment): any {

	const getFunc = (uri: string, options: any = {}, callback: any) => {

		const url = URL.parse(uri);
		const host = url.host || 'Unknown host';
		const subSegment = parent.addSubSegment(host);
		subSegment.namespace = 'remote';

		if (!options.headers) {

			options.headers = {};

		}

		options.headers['X-Amzn-Trace-Id'] = 'Root=' + parent.traceId + ';Parent=' + parent.id +
			';Sampled=' + (parent.isSampled ? '1' : '0');

		const result = module.__get(uri, options, callback);

		subSegment.addIncomingRequestData = new RequestDataRequest(result);

		result
			.on('error', (err) => {

				subSegment.error = true;
				subSegment.close(err);

			})
			.on('complete', (res: IncomingMessage) => {

				if (res.statusCode === 429) {

					subSegment.throttled = true;

				}

				const cause = getCause(Number(res.statusCode || ''));

				if (cause) {

					subSegment[cause] = true;

				}

				if (subSegment.incomingRequestData) {

					subSegment.incomingRequestData.close(res);

				}

				subSegment.close();

			});

		return result;

	};

	module.__get = module.get;
	module.get = getFunc;

	return module;

}

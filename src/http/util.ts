import * as _ from 'lodash';
import { Request } from 'express';

export function getCause (statusCode: number): string | undefined {

	const stat = statusCode.toString();

	if (!_.isNull(stat.match(/^[4][0-9]{2}$/))) {

		return 'error';

	} else if (!_.isNull(stat.match(/^[5][0-9]{2}$/))) {

		return 'fault';

	}

	return;

}

export function isSampled (req: Request) {

	if (req.headers['X-Amzn-Trace-Id']) {

		const val = req.headers['X-Amzn-Trace-Id'];
		const parts = val.split(';');
		const obj = _.reduce<string, any>(parts, (m, p) => {

			obj[p.split('=')[0]] = p.split('=')[1];
			return m;

		}, {});

		return obj.Sampled === '1';

	} else {

		return false;

	}

}

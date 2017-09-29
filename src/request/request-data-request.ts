import { RequestData } from '../request-data';
import * as ip from 'ip';

/**
 * Represents an outgoing HTTP / HTTPS call
 */
export default class RequestDataRequest extends RequestData {

	constructor (req: any) {

		super();

		this._request = {
			method: req.method || '',
			userAgent: 'request',
			clientIP: ip.address(),
			url: req.uri.href,
		};

	}

	public close (res: any): void {

		this._response = {

			status: res.statusCode || ''

		};

		const contentLength = res.headers['content-length'];

		if (contentLength) {

			this._response.contentLength = contentLength;

		}

	}

}

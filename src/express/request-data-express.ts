import { Request, Response } from 'express';
import { RequestData } from '../request-data';

/**
 * Represents an incoming HTTP / HTTPS call
 */
export default class RequestDataExpress extends RequestData {

	constructor (req: Request) {

		super();

		const forwarded = !!req.headers['x-forwarded-for'];
		let url;

		if (req.connection) {

			url = (req.secure
				? 'https://'
				: 'http://') + ((req.headers.host || '') + (req.url || ''));

		}

		this._request = {
			method: req.method || '',
			userAgent: req.headers['user-agent'] || '',
			clientIP: this._getClientIP(req) || '',
			url: url || '',
		};

		if (forwarded) {

			this._request.xForwardedFor = forwarded;

		}

	}

	public close (res: Response): void {

		this._response = {

			status: res.statusCode || ''

		};

		const contentLength = res.getHeader('content-length');

		if (contentLength) {

			this._response.contentLength = contentLength;

		}

	}

	private _getClientIP (req: Request): string {

		let clientIp;

		if (req.headers['x-forwarded-for']) {

			clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0];

		} else if (req.connection && req.connection.remoteAddress) {

			clientIp = req.connection.remoteAddress;

		} else if (req.socket && req.socket.remoteAddress) {

			clientIp = req.socket.remoteAddress;

		}

		return clientIp || '';

	}

}

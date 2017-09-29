import { Request } from 'express';
export interface IRequestData {
	method: string;
	userAgent: string;
	clientIP: string;
	url: string;
	xForwardedFor?: boolean;
}

export interface IResponseData {
	status: number | string;
	contentLength?: number | string;
}

/**
 * Represents an incoming HTTP / HTTPS call
 */
export abstract class RequestData {

	protected _request: IRequestData;

	protected _response?: IResponseData;

	public json (): any {

		const message: any = {
			request: {
				method: this._request.method,
				user_agent: this._request.userAgent,
				client_ip: this._request.clientIP,
				url: this._request.url
			}
		};

		if (this._request.xForwardedFor) {

			message.request.x_forwarded_for = this._request.xForwardedFor;

		}

		if (this._response) {

			message.response = {
				status: this._response.status,
				content_length: this._response.contentLength
			};

		}

		return message;

	}

	public abstract close (res: any): void;

}

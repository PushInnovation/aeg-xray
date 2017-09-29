import Segment from '../segment';
import { ErrorRequestHandler, NextFunction, RequestHandlerParams, Response } from 'express-serve-static-core';
import { Request } from 'express';
import logger from '../logger';
import { getCause } from '../http/util';
import RequestDataExpress from './request-data-express';

export interface IXRayExpressRequest extends Request {
	segment?: Segment;
}

/**
 *  Middleware to wrap express requests with an xray segment
 */
export default class Middleware {

	public openSegment (segmentName: string): RequestHandlerParams {

		return (req: Request, res: Response, next: NextFunction) => {

			this._openSegment(req, res, segmentName)
				.then(() => {

					next();

				})
				.catch((ex) => {

					logger.error('Middleware#openSegment: could not open xray segment', ex);

					next();

				});

		};

	}

	public errorHandler (): ErrorRequestHandler {

		return (err: any, req: Request, res: Response, next: NextFunction) => {

			this._errorHandler(req, res, err)
				.then(() => {

					next(err);

				})
				.catch((ex) => {

					logger.error('Middleware#errorHandler: could not close xray segment on express error handler', ex);

					next(err);

				});

		};

	}

	private async _openSegment (req: IXRayExpressRequest, res: Response, segmentName: string): Promise<void> {

		logger.debug('Middleware#_openSegment: segment opened', {name: segmentName});

		req.segment = new Segment(segmentName);
		req.segment.addIncomingRequestData = new RequestDataExpress(req);

		res.on('finish', () => {

			if (!req.segment) {

				return;

			}

			if (res.statusCode === 429) {

				req.segment.throttled = true;

			}

			const cause = getCause(res.statusCode);

			if (cause) {

				req.segment[cause] = true;

			}

			if (req.segment.incomingRequestData) {

				req.segment.incomingRequestData.close(res);

			}

			req.segment.close();

			logger.debug('Middleware#_openSegment: segment closed', {name: segmentName});

		});

	}

	private async _errorHandler (req: IXRayExpressRequest, res: Response, err: any): Promise<void> {

		if (req.segment) {

			if (req.segment.incomingRequestData) {

				req.segment.incomingRequestData.close(res);

			}

			if (err) {

				req.segment.close(err);

			} else {

				req.segment.close();

			}

			logger.debug('Middleware#_errorHandler closed on', {name: req.segment.name});

		}

	}

}

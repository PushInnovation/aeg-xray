import * as dgram from 'dgram';
import logger from './logger';
import SegmentBase from './segment-base';

const ADDRESS = '127.0.0.1';
const PORT = 2000;
const PROTOCOL_HEADER = '{"format": "json", "version": 1}';
const PROTOCOL_DELIMITER = '\n';

export class SegmentEmitter {

	public send (segment: SegmentBase) {

		return new Promise((resolve) => {

			const data = `${PROTOCOL_HEADER}${PROTOCOL_DELIMITER}${segment.format()}`;
			const message = new Buffer(data);
			const short = JSON.stringify({trace_id: segment.traceId, id: segment.id});
			const socket = dgram.createSocket('udp4');

			socket.send(message, 0, message.length, PORT, ADDRESS, (err: any) => {

				if (err) {

					if (err.code === 'EMSGSIZE')

						logger.error(`${segment.type} is too large to send: ${short} (${message.length} bytes).'`);

					else {

						logger.error('Error occurred sending segment: ', err);

					}

				} else {

					logger.debug(`${segment.type} sent: ${segment.format()}`);

				}

				socket.close();

				resolve();

			});

		});

	}

}

export default new SegmentEmitter();

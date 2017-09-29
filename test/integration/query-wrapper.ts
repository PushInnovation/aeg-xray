import { IConnection, IConnectionConfig } from 'mysql';
import Segment from '../../src/segment';
import SqlData from '../../src/segment-sql-data';
import SubSegment from '../../src/sub-segment';

export default async (
	connection: IConnection,
	query: string,
	segment: Segment,
	options: { emitProgress?: boolean } = {}): Promise<any> => {

	const sub = openSubSegment(connection.config, query, segment, options);

	return new Promise((resolve, reject) => {

		connection.query(query, (err, result) => {

			if (err) {

				sub.close(err);
				reject(err);

			} else {

				sub.close();
				resolve(result);

			}

		});

	});

};

function openSubSegment (
	config: IConnectionConfig, query: string,
	segment: Segment,
	options: { emitProgress?: boolean } = {}): SubSegment {

	const sub = segment.addSubSegment(config.database + '@' + config.host, options);
	sub.addSqlData = new SqlData(config.user, config.host + ':' + config.port + '/' + config.database, {query});
	return sub;

}

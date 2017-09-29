import * as express from 'express';
import Middleware from '../../src/express/middleware';
import * as BBPromise from 'bluebird';

let app: any | null = null;

export default async function server (): Promise<any> {

	if (!app) {

		return setup();

	}

	return app;

}

async function setup (): Promise<any> {

	app = express();

	const middleware = new Middleware();
	app.use(middleware.openSegment('test-middleware'));

	app.get('/', function (req, res) {

		res.json({message: 'success'});

	});

	app.get('/e', function (req, res) {

		throw new Error('test');

	});

	app.use(middleware.errorHandler());

	await app.listen(4000);

	await BBPromise.delay(5000);

	return app;

}
